import api from "../../../api/axios";
import type {
  QuestionCreateData,
  QuestionCreateResponse,
  QuestionListResponse,
  QuestionDetailResponse,
  AnswerCreateData,
  AnswerCreateResponse,
  AnswerListResponse,
  ApiResponse,
  Question,
  Answer,
} from "../types/question";
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";

// API 에러 타입
export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

// API 응답 처리 헬퍼 함수
const handleApiResponse = async <T>(
  response: AxiosResponse<ApiResponse<T>>
): Promise<ApiResponse<T>> => {
  const { data } = response;

  // 성공 메시지 목록
  const successMessages = [
    "질문 생성 성공",
    "질문 목록 조회 완료",
    "질문 상세 조회 완료",
    "질문 수정 완료",
    "질문 삭제 완료",
    "답변 생성 성공",
    "답변 목록 조회 완료",
    "답변 조회 완료",
    "답변 수정 완료",
    "답변 삭제 완료",
  ];

  // status가 "CREATED"이거나 "OK"이거나 성공 메시지가 포함된 경우 성공으로 처리
  if (
    data.status === "CREATED" ||
    data.status === "OK" ||
    successMessages.includes(data.message || "")
  ) {
    return data;
  }

  throw new ApiError(
    data.message || "요청 처리 중 오류가 발생했습니다.",
    response.status
  );
};

// 질문 생성
export const createQuestion = async (
  questionData: QuestionCreateData
): Promise<ApiResponse<QuestionCreateResponse>> => {
  try {
    const response = await api.post<ApiResponse<QuestionCreateResponse>>(
      "/api/questions",
      questionData
    );
    return handleApiResponse<QuestionCreateResponse>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message || "질문 생성 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("질문 생성 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 게시글별 질문 목록 조회
export const getQuestionsByPost = async (
  postId: number,
  page: number = 0,
  size: number = 10
): Promise<QuestionListResponse> => {
  try {
    const response = await api.get<QuestionListResponse>(
      `/api/questions/post/${postId}`,
      {
        params: {
          page,
          size,
        },
      }
    );
    return handleApiResponse<QuestionListResponse["data"]>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message ||
          "질문 목록 조회 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("질문 목록 조회 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 질문 상세 조회
export const getQuestionDetail = async (
  questionId: number
): Promise<QuestionDetailResponse> => {
  try {
    const response = await api.get<QuestionDetailResponse>(
      `/api/questions/${questionId}`
    );
    return handleApiResponse<Question>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message ||
          "질문 상세 조회 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("질문 상세 조회 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 질문 수정
export const updateQuestion = async (
  questionId: number,
  content: string
): Promise<ApiResponse<Question>> => {
  try {
    const response = await api.put<ApiResponse<Question>>(
      `/api/questions/${questionId}`,
      { content }
    );
    return handleApiResponse<Question>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message || "질문 수정 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("질문 수정 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 질문 삭제
export const deleteQuestion = async (
  questionId: number
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete<ApiResponse<void>>(
      `/api/questions/${questionId}`
    );
    return handleApiResponse<void>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message || "질문 삭제 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("질문 삭제 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 답변 생성
export const createAnswer = async (
  answerData: AnswerCreateData
): Promise<ApiResponse<AnswerCreateResponse>> => {
  try {
    const response = await api.post<ApiResponse<AnswerCreateResponse>>(
      "/api/answers",
      answerData
    );
    return handleApiResponse<AnswerCreateResponse>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message || "답변 생성 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("답변 생성 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 질문별 답변 목록 조회
export const getAnswersByQuestion = async (
  questionId: number
): Promise<AnswerListResponse> => {
  try {
    const response = await api.get<AnswerListResponse>(
      `/api/answers/${questionId}`
    );
    return handleApiResponse<Answer[]>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message ||
          "답변 목록 조회 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("답변 목록 조회 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 답변 수정
export const updateAnswer = async (
  answerId: number,
  content: string
): Promise<ApiResponse<Answer>> => {
  try {
    const response = await api.put<ApiResponse<Answer>>(
      `/api/answers/${answerId}`,
      { content }
    );
    return handleApiResponse<Answer>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message || "답변 수정 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("답변 수정 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 답변 삭제
export const deleteAnswer = async (
  answerId: number
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete<ApiResponse<void>>(
      `/api/answers/${answerId}`
    );
    return handleApiResponse<void>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message || "답변 삭제 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("답변 삭제 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 답변을 베스트 답변으로 설정
export const setBestAnswer = async (
  answerId: number
): Promise<ApiResponse<Answer>> => {
  try {
    const response = await api.patch<ApiResponse<Answer>>(
      `/api/answers/${answerId}/best`
    );
    return handleApiResponse<Answer>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message ||
          "베스트 답변 설정 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("베스트 답변 설정 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 질문 상태를 해결됨으로 변경
export const resolveQuestion = async (
  questionId: number
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.put<ApiResponse<void>>(
      `/api/questions/${questionId}/resolved`
    );
    return handleApiResponse<void>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message ||
          "질문 상태 변경 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("질문 상태 변경 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 질문 상태를 해결안됨으로 변경
export const unresolveQuestion = async (
  questionId: number
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.put<ApiResponse<void>>(
      `/api/questions/${questionId}/unresolved`
    );
    return handleApiResponse<void>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message ||
          "질문 상태 변경 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("질문 상태 변경 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 질문 상태를 답변 완료로 변경
export const markQuestionAsAnswered = async (
  questionId: number
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.put<ApiResponse<void>>(
      `/api/questions/${questionId}/answered`
    );
    return handleApiResponse<void>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message ||
          "질문 상태 변경 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("질문 상태 변경 중 알 수 없는 오류가 발생했습니다.");
  }
};
