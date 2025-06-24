import api from "@/api/axios";

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
  historyType: "CREATED" | "UPDATED" | "DELETED";
  domainType: "POST" | "USER" | "PROJECT" | "COMPANY" | "STEP";
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
  history: HistorySimpleResponse,
  userInfo?: { name: string; role: string }
): ActivityLog => {
  const getActionDisplayName = (historyType: string) => {
    switch (historyType) {
      case "CREATED":
        return "생성";
      case "UPDATED":
        return "수정";
      case "DELETED":
        return "삭제";
      default:
        return historyType;
    }
  };

  const getTargetTypeDisplayName = (domainType: string) => {
    switch (domainType) {
      case "USER":
        return "회원";
      case "COMPANY":
        return "회사";
      case "PROJECT":
        return "프로젝트";
      case "STEP":
        return "단계";
      case "POST":
        return "게시글";
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
