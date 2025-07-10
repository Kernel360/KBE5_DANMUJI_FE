import api from "@/api/axios";
import type { AxiosResponse } from "axios";
import { AxiosError } from "axios";
import type { User } from "../types/Types";

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
  user: User | null;
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

// 프로젝트 상세 조회용 사용자 타입
export type AssignUser = {
  id: number;
  name: string;
  positon: string;
  userType: string;
};

// 프로젝트 상세 조회용 회사 타입
export type ProjectCompany = {
  id: number;
  companyName: string;
  assignUsers: AssignUser[];
};

// 프로젝트 상세 조회용 스텝 타입
export type ProjectDetailStep = {
  id: number;
  stepOrder: number;
  name: string;
  projectStepStatus: string;
  projectFeedbackStepStatus: string | null;
  isDeleted: boolean;
  user: User | null;
};

// 프로젝트 상세 응답 타입
export type ProjectDetailResponse = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  projectCost: string;
  projectStatus: string;
  progress: number;
  clients: ProjectCompany[];
  developers: ProjectCompany[];
  steps: ProjectDetailStep[];
  myUserType: string;
  myCompanyType: string;
  devManagerId?: string;
  clientManagerId?: string;
  devUserId?: string;
  clientUserId?: string;
};

// 프로젝트 클라이언트 사용자 응답 타입
export type ProjectClientUserResponse = {
  id: number;
  name: string;
  username: string;
  companyId: number;
  companyName: string;
};

export type ProjectStatusResponse = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: string;
};

// 프로젝트 상세 조회 응답 타입
export type ProjectDetailApiResponse = ApiResponse<ProjectDetailResponse>;

// 프로젝트 응답 타입
export type ApiResponse<T> = {
  status: string;
  code: string;
  message: string;
  data?: T;
};

// 회사 요약 응답 타입
export type CompanySummaryResponse = {
  companyId: number;
  companyName: string;
};

// 프로젝트 응답 타입
export type ProjectResponse = {
  projectId: number;
  name: string;
  startDate: string;
  endDate: string;
  projectStatus: string;
  progress: number;
  assignClientCompanies: CompanySummaryResponse[];
  assignDevCompanies: CompanySummaryResponse[];
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
  size: number = 10,
  params: {
    projectStatus?: string;
    client?: string;
    startDate?: string;
    endDate?: string;
    keyword?: string;
    sort?: string;
  } = {}
): Promise<ApiResponse<{ content: ProjectResponse[]; page: PageMetadata }>> => {
  try {
    const response = await api.get<
      ApiResponse<{ content: ProjectResponse[]; page: PageMetadata }>
    >("/api/projects", {
      params: {
        page,
        size,
        ...params,
      },
    });
    return handleApiResponse<{
      content: ProjectResponse[];
      page: PageMetadata;
    }>(response);
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

// 프로젝트 상세 조회
export const getProjectDetail = async (
  projectId: number
): Promise<ProjectDetailApiResponse> => {
  try {
    const response = await api.get<ProjectDetailApiResponse>(
      `/api/projects/${projectId}`
    );
    return handleApiResponse<ProjectDetailResponse>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message ||
          "프로젝트 상세 조회 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("프로젝트 상세 조회 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 프로젝트 검색
export const searchProjects = async (
  params: {
    keyword?: string;
    category?: string;
    projectStatus?: string;
    startDate?: string;
    endDate?: string;
    sort?: string;
    page?: number;
    size?: number;
  }
): Promise<ApiResponse<{ content: ProjectResponse[]; page: PageMetadata }>> => {
  try {
    const response = await api.get<
      ApiResponse<{ content: ProjectResponse[]; page: PageMetadata }>
    >("/api/projects/search", {
      params: {
        ...params,
      },
    });
    return handleApiResponse<{
      content: ProjectResponse[];
      page: PageMetadata;
    }>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message ||
          "프로젝트 검색 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("프로젝트 검색 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 프로젝트 상태별 현황 조회
export const getProjectStatusByStatus = async (
  status: string
): Promise<ApiResponse<ProjectStatusResponse[]>> => {
  try {
    const response = await api.get<ApiResponse<ProjectStatusResponse[]>>(
      `/api/projects/status`,
      {
        params: { status },
      }
    );
    return handleApiResponse<ProjectStatusResponse[]>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message ||
          "프로젝트 상태별 현황 조회 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError(
      "프로젝트 상태별 현황 조회 중 알 수 없는 오류가 발생했습니다."
    );
  }
};

// 프로젝트 복구 응답 타입
export type ProjectRestoreResponse = {
  id: number;
  name: string;
  projectStatus: string;
  message: string;
};

// 프로젝트 복구
export const restoreProject = async (
  projectId: number
): Promise<ApiResponse<ProjectRestoreResponse>> => {
  try {
    const response = await api.put<ApiResponse<ProjectRestoreResponse>>(
      `/api/projects/${projectId}/restore`
    );
    return handleApiResponse<ProjectRestoreResponse>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message ||
          "프로젝트 복구 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("프로젝트 복구 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 프로젝트 클라이언트 사용자 조회 (체크리스트 승인자용)
export const getProjectClientUsers = async (
  projectId: number
): Promise<ApiResponse<ProjectClientUserResponse[]>> => {
  try {
    const response = await api.get<ApiResponse<ProjectClientUserResponse[]>>(
      `/api/projects/${projectId}/client-user`
    );
    return handleApiResponse<ProjectClientUserResponse[]>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message ||
          "프로젝트 클라이언트 사용자 조회 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError(
      "프로젝트 클라이언트 사용자 조회 중 알 수 없는 오류가 발생했습니다."
    );
  }
};
