// src/utils/errorHandler.ts

// 에러 타입 정의
interface ApiError {
  response?: {
    data?: {
      message?: string;
      code?: string;
    };
    status?: number;
    statusText?: string;
  };
  message?: string;
  code?: string;
}

interface ErrorWithMessage {
  message: string;
  type?: string;
}

type ErrorType = ApiError | ErrorWithMessage | string | Error | unknown;

// 에러 메시지 추출 함수
export const extractErrorMessage = (error: ErrorType): string => {
  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as ApiError;
    if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    }

    if (apiError.response?.statusText) {
      return `${apiError.response.status}: ${apiError.response.statusText}`;
    }
  }

  if (error && typeof error === "object" && "message" in error) {
    return (error as { message: string }).message;
  }

  return "알 수 없는 오류가 발생했습니다.";
};

// 에러 타입별 메시지 매핑
export const getErrorMessage = (error: ErrorType): string => {
  const message = extractErrorMessage(error);

  if (error && typeof error === "object" && "code" in error) {
    const errorWithCode = error as { code?: string };

    // 네트워크 에러
    if (
      errorWithCode.code === "NETWORK_ERROR" ||
      errorWithCode.code === "ERR_NETWORK"
    ) {
      return "네트워크 연결을 확인해주세요.";
    }

    // 타임아웃 에러
    if (errorWithCode.code === "ECONNABORTED") {
      return "요청 시간이 초과되었습니다. 다시 시도해주세요.";
    }
  }

  // 서버 에러 코드별 메시지
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as ApiError;
    if (apiError.response?.data?.code) {
      const code = apiError.response.data.code;
      switch (code) {
        case "U001":
          return "입력하신 아이디로 등록된 사용자를 찾을 수 없습니다.";
        case "U004":
          return "인증에 실패했습니다.";
        case "C005":
          return "비밀번호가 일치하지 않습니다.";
        default:
          break;
      }
    }

    // HTTP 상태 코드별 메시지
    if (apiError.response?.status) {
      const status = apiError.response.status;
      switch (status) {
        case 400:
          return "잘못된 요청입니다. 입력 정보를 확인해주세요.";
        case 401:
          return "로그인이 필요합니다.";
        case 403:
          return "접근 권한이 없습니다.";
        case 404:
          return "요청한 리소스를 찾을 수 없습니다.";
        case 409:
          return "이미 존재하는 데이터입니다.";
        case 422:
          return "입력 데이터가 올바르지 않습니다.";
        case 500:
          return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        case 502:
        case 503:
        case 504:
          return "서버가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.";
        default:
          return message;
      }
    }
  }

  return message;
};

// 토스트 알림 표시 함수
export const showErrorToast = (error: ErrorType) => {
  const message = getErrorMessage(error);
  const toastEvent = new CustomEvent("show-toast", {
    detail: { message, success: false },
  });
  window.dispatchEvent(toastEvent);

  // 개발 환경에서만 콘솔에 상세 에러 정보 출력
  if (import.meta.env.DEV) {
    console.error("Error details:", error);
  }
};

// 성공 토스트 알림 표시 함수
export const showSuccessToast = (message: string) => {
  const toastEvent = new CustomEvent("show-toast", {
    detail: { message, success: true },
  });
  window.dispatchEvent(toastEvent);
};

// try-catch 래퍼 함수
export const withErrorHandling = async <T>(
  asyncFn: () => Promise<T>,
  errorMessage?: string
): Promise<T | null> => {
  try {
    return await asyncFn();
  } catch (error) {
    const message = errorMessage || getErrorMessage(error);
    showErrorToast({ message });

    // 개발 환경에서만 콘솔에 상세 에러 정보 출력
    if (import.meta.env.DEV) {
      console.error("Operation failed:", error);
    }

    return null;
  }
};

// 전역 에러 핸들러 (window.onerror 대체)
export const setupGlobalErrorHandler = () => {
  window.addEventListener("error", (event) => {
    console.error("Global error:", event.error);
    showErrorToast({
      message: "예상치 못한 오류가 발생했습니다. 페이지를 새로고침해주세요.",
      type: "global",
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
    showErrorToast({
      message: "비동기 작업 중 오류가 발생했습니다.",
      type: "promise",
    });
  });
};
