import api from "@/api/axios";
import type { AxiosResponse } from "axios";
import { AxiosError } from "axios";

// API 에러 타입
export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

// 페이지네이션 메타데이터 타입
export type PageMetadata = {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
};

// 프로젝트 스텝 타입
export type ProjectStep = {
  id: number;
  projectId: number;
  userId: number | null;
  user: any | null;
  name: string;
  stepOrder: number;
  projectStepStatus: string;
  deleteAt: string | null;
  deleted: boolean;
};

// 프로젝트 사용자 타입
export type ProjectUser = {
  companyType: "DEVELOPER" | "CLIENT";
  clientCompany: string;
  developerCompany: string;
};

// 프로젝트 응답 타입
export type ProjectResponse = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isDeleted: boolean;
  status: string;
  steps: ProjectStep[];
  clientCompany: string;
  developerCompany: string;
  users: ProjectUser[];
};

// API 응답 타입
export type ApiResponse<T> = {
  status: string;
  code: string;
  message: string;
  data?: T;
};

// 프로젝트 목록 응답 타입
export type ProjectListResponse = ApiResponse<{
  content: ProjectResponse[];
  page: PageMetadata;
}>;

// API 응답 처리 헬퍼 함수
const handleApiResponse = async <T>(
  response: AxiosResponse<ApiResponse<T>>
): Promise<ApiResponse<T>> => {
  const { data } = response;

  // 성공 메시지 목록
  const successMessages = [
    "프로젝트 목록 조회 완료",
    "프로젝트 조회 완료",
    "프로젝트 생성 완료",
    "프로젝트 수정 완료",
    "프로젝트 삭제 완료",
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

// 프로젝트 목록 조회
export const getProjects = async (
  page: number = 0,
  size: number = 10
): Promise<ProjectListResponse> => {
  try {
    const response = await api.get<ProjectListResponse>("/api/projects", {
      params: {
        page,
        size,
      },
    });
    return handleApiResponse<ProjectListResponse["data"]>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message ||
          "프로젝트 목록 조회 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("프로젝트 목록 조회 중 알 수 없는 오류가 발생했습니다.");
  }
};
