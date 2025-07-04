import api from "@/api/axios";
import type {
  HistoryDetailResponse,
  ActivityLogDetail,
  PostDashboardReadResponse,
  MyMentionListResponse,
} from "../types/activityLog";

// 임시 타입 정의 (모듈 import 문제 해결을 위해)
interface ApiResponse<T> {
  status: string;
  code: string;
  message: string;
  data: T;
}

interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

interface PageResponse<T> {
  content: T[];
  page: PageInfo;
}

interface HistorySimpleResponse {
  id: string;
  historyType: "CREATED" | "UPDATED" | "DELETED" | "RESTORED";
  domainType:
    | "POST"
    | "USER"
    | "PROJECT"
    | "COMPANY"
    | "STEP"
    | "INQUIRY"
    | "CHECK_LIST";
  domainId: number;
  changedAt: string;
  changerId: string;
  changerName: string;
  changerRole: string;
  changerUsername: string;
  message: string;
}

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  targetType: string;
  targetName: string;
  details: string;
  ipAddress: string;
  createdAt: string;
  changerUsername: string;
}

// 이력 목록 조회
export const getActivityLogs = async (
  page: number = 0,
  size: number = 10,
  filters?: {
    historyType?: string;
    domainType?: string;
    changedBy?: string;
    changedFrom?: string;
    changedTo?: string;
    changerRole?: string;
  }
): Promise<PageResponse<HistorySimpleResponse>> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    // 필터 파라미터 추가
    if (filters) {
      if (filters.historyType && filters.historyType !== "ALL") {
        params.append("historyType", filters.historyType);
      }
      if (filters.domainType && filters.domainType !== "ALL") {
        params.append("domainType", filters.domainType);
      }
      if (filters.changedBy) {
        params.append("changedBy", filters.changedBy);
      }
      if (filters.changerRole && filters.changerRole !== "ALL") {
        params.append("changerRole", filters.changerRole);
      }
      if (filters.changedFrom) {
        // 날짜 형식을 LocalDateTime 형식으로 변환 (YYYY-MM-DDTHH:mm:ss)
        const fromDate = new Date(filters.changedFrom);
        const formattedFromDate = fromDate.toISOString().slice(0, 19); // YYYY-MM-DDTHH:mm:ss
        params.append("changedFrom", formattedFromDate);
      }
      if (filters.changedTo) {
        // 날짜 형식을 LocalDateTime 형식으로 변환 (YYYY-MM-DDTHH:mm:ss)
        const toDate = new Date(filters.changedTo);
        const formattedToDate = toDate.toISOString().slice(0, 19); // YYYY-MM-DDTHH:mm:ss
        params.append("changedTo", formattedToDate);
      }
    }

    const response = await api.get<
      ApiResponse<PageResponse<HistorySimpleResponse>>
    >(`/api/histories/search?${params.toString()}`);

    return response.data.data;
  } catch (error) {
    console.error("이력 목록 조회 실패:", error);
    throw error;
  }
};

// 이력 타입을 프론트엔드 형식으로 변환
export const transformHistoryToActivityLog = (
  history: HistorySimpleResponse
): ActivityLog => {
  const getActionDisplayName = (historyType: string) => {
    switch (historyType) {
      case "CREATED":
        return "생성";
      case "UPDATED":
        return "수정";
      case "DELETED":
        return "삭제";
      case "RESTORED":
        return "복구";
      default:
        return historyType;
    }
  };

  const getTargetTypeDisplayName = (domainType: string) => {
    switch (domainType) {
      case "USER":
        return "회원";
      case "COMPANY":
        return "업체";
      case "PROJECT":
        return "프로젝트";
      case "STEP":
        return "프로젝트 단계";
      case "POST":
        return "게시글";
      case "INQUIRY":
        return "문의";
      case "CHECK_LIST":
        return "체크리스트";
      default:
        return domainType;
    }
  };

  return {
    id: history.id,
    userId: history.changerId,
    userName:
      history.changerName !== "null"
        ? history.changerName
        : "알 수 없는 사용자",
    userRole: history.changerRole,
    action: history.historyType,
    targetType: history.domainType,
    targetName: getTargetTypeDisplayName(history.domainType),
    details:
      history.message ||
      `${getTargetTypeDisplayName(history.domainType)} ${getActionDisplayName(
        history.historyType
      )} 작업`,
    ipAddress: history.changerUsername,
    createdAt: history.changedAt,
    changerUsername: history.changerUsername,
  };
};

// 이력 전체 목록 조회 (최신순 정렬)
export const getAllActivityLogs = async (
  page: number = 0,
  size: number = 10
): Promise<PageResponse<HistorySimpleResponse>> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const response = await api.get<
      ApiResponse<PageResponse<HistorySimpleResponse>>
    >(`/api/histories?${params.toString()}`);

    return response.data.data;
  } catch (error) {
    console.error("이력 전체 목록 조회 실패:", error);
    throw error;
  }
};

// 이력 상세 조회
export const getActivityLogDetail = async (
  historyId: string
): Promise<ActivityLogDetail> => {
  try {
    const response = await api.get<ApiResponse<HistoryDetailResponse>>(
      `/api/histories/${historyId}`
    );

    const historyDetail = response.data.data;

    return {
      id: historyDetail.id,
      historyType: historyDetail.historyType,
      domainType: historyDetail.domainType,
      domainId: historyDetail.domainId,
      changedAt: historyDetail.changedAt,
      changerId: historyDetail.changerId,
      changerName: historyDetail.changerName,
      changerUsername: historyDetail.changerUsername,
      changerRole: historyDetail.changerRole,
      before: historyDetail.before as unknown as string,
      after: historyDetail.after as unknown as string,
      createdAt: historyDetail.createdAt,
      message: historyDetail.message,
    };
  } catch (error) {
    console.error("이력 상세 조회 실패:", error);
    throw error;
  }
};

// 우선순위 높은 게시글 조회
export const getHighPriorityPosts = async (): Promise<
  PostDashboardReadResponse[]
> => {
  try {
    const response = await api.get<ApiResponse<PostDashboardReadResponse[]>>(
      `/api/posts/priority/high`
    );
    // data가 없거나 배열이 아니면 빈 배열 반환
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error("우선순위 높은 게시글 조회 실패:", error);
    return [];
  }
};

// 진행중인 프로젝트의 최신 게시글 조회
export const getPostsDueSoon = async (): Promise<
  PostDashboardReadResponse[]
> => {
  try {
    const response = await api.get<ApiResponse<PostDashboardReadResponse[]>>(
      "/api/posts/projects/due-soon"
    );

    // 백엔드 응답 구조 확인 - status가 "OK"인 경우 성공
    if (response.data.status === "OK" || response.data.status === "SUCCESS") {
      // data 필드가 없으면 빈 배열 반환
      return response.data.data || [];
    } else {
      throw new Error(response.data.message || "게시글 조회에 실패했습니다.");
    }
  } catch (error) {
    console.error("진행중인 프로젝트 최신 게시글 조회 실패:", error);
    throw error;
  }
};

// 나를 멘션한 게시글 조회
export const getMyMentions = async (): Promise<MyMentionListResponse[]> => {
  try {
    const response = await api.get<ApiResponse<MyMentionListResponse[]>>(
      "/api/mentions/my"
    );

    // 백엔드 응답 구조 확인 - status가 "OK"인 경우 성공
    if (response.data.status === "OK" || response.data.status === "SUCCESS") {
      // data 필드가 없으면 빈 배열 반환
      return response.data.data || [];
    } else {
      throw new Error(response.data.message || "멘션 조회에 실패했습니다.");
    }
  } catch (error) {
    console.error("나를 멘션한 게시글 조회 실패:", error);
    throw error;
  }
};

// 알림 읽음 처리
export const markNotificationAsRead = async (
  notificationId: number
): Promise<void> => {
  try {
    await api.put(`/api/notifications/read/${notificationId}`);
  } catch (error) {
    console.error("알림 읽음 처리 실패:", error);
    throw error;
  }
};

// 회사 복구 API
export const restoreCompany = async (
  companyId: number
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.put<ApiResponse<void>>(
      `/api/companies/${companyId}/restore`
    );
    return response.data;
  } catch (error: any) {
    console.error("회사 복구 실패:", error);
    // 에러를 그대로 throw하여 상위에서 처리하도록 함
    throw error;
  }
};
