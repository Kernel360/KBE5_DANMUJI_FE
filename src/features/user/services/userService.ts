import api from "@/api/axios";
import type { AxiosResponse } from "axios";
import { AxiosError } from "axios";

// API 응답 타입
export interface ApiResponse<T> {
  status: string;
  code: string;
  message: string;
  data: T;
}

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
    "사용자 조회 완료",
    "사용자 목록 조회 완료",
    "사용자 생성 완료",
    "사용자 수정 완료",
    "사용자 삭제 완료",
  ];

  // status가 "OK"이거나 성공 메시지가 포함된 경우 성공으로 처리
  if (data.status === "OK" || successMessages.includes(data.message || "")) {
    return data;
  }

  throw new ApiError(
    data.message || "요청 처리 중 오류가 발생했습니다.",
    response.status
  );
};

// 사용자 정보 타입
export interface UserInfo {
  id: number;
  username: string;
  name: string;
  role: string;
}

// UserSummaryResponse 타입 (새로운 API 응답에 맞춤)
export interface UserSummaryResponse {
  id: number;
  username: string;
  name: string;
  role: string;
  companyId: number;
  companyName: string;
}

// 프로젝트의 모든 사용자 조회
export const getUsersByProject = async (
  projectId: number
): Promise<ApiResponse<UserSummaryResponse[]>> => {
  try {
    const response = await api.get<ApiResponse<UserSummaryResponse[]>>(
      `/api/users/project/${projectId}`
    );
    return handleApiResponse<UserSummaryResponse[]>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message ||
          "프로젝트 사용자 조회 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError(
      "프로젝트 사용자 조회 중 알 수 없는 오류가 발생했습니다."
    );
  }
};

// username으로 특정 사용자 검색
export const getUserByUsername = async (
  username: string
): Promise<ApiResponse<UserSummaryResponse>> => {
  try {
    const response = await api.get<ApiResponse<UserSummaryResponse>>(
      "/api/users/username",
      {
        params: { username },
      }
    );
    return handleApiResponse<UserSummaryResponse>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message || "사용자 검색 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("사용자 검색 중 알 수 없는 오류가 발생했습니다.");
  }
};
