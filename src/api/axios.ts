// src/api/axios.ts
import axios from "axios";

// 환경에 따른 baseURL 설정
const getBaseURL = () => {
  // 환경변수에서 API URL 가져오기
  const envApiUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envApiUrl || envApiUrl === "undefined") {
    throw new Error("API Base URL is not defined in environment variables.");
  }

  return envApiUrl;
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // 쿠키 포함
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰 가져오기
    const token = localStorage.getItem("accessToken");

    // 토큰이 있으면 Authorization 헤더에 추가
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 에러 메시지 추출
    let errorMessage = "알 수 없는 오류가 발생했습니다.";

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.statusText) {
      errorMessage = `${error.response.status}: ${error.response.statusText}`;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // 401 에러(인증 실패) 처리
    if (error.response?.status === 401) {
      // 토큰 제거
      localStorage.removeItem("accessToken");
      // 로그인 페이지로 리다이렉트
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // 네트워크 에러 처리
    if (error.code === "NETWORK_ERROR" || error.code === "ERR_NETWORK") {
      errorMessage = "네트워크 연결을 확인해주세요.";
    }

    // 타임아웃 에러 처리
    if (error.code === "ECONNABORTED") {
      errorMessage = "요청 시간이 초과되었습니다. 다시 시도해주세요.";
    }

    // 전역 에러 알림을 위한 이벤트 발생
    const errorEvent = new CustomEvent("api-error", {
      detail: { message: errorMessage, status: error.response?.status },
    });
    window.dispatchEvent(errorEvent);

    return Promise.reject(error);
  }
);

export default api;
