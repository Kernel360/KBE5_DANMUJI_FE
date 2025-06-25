// 백엔드 API 응답 타입
export interface ApiResponse<T> {
  status: string;
  code: string;
  message: string;
  data: T;
}

export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface PageResponse<T> {
  content: T[];
  page: PageInfo;
}

// 백엔드 이력 응답 타입
export interface HistorySimpleResponse {
  id: string;
  historyType: "CREATED" | "UPDATED" | "DELETED";
  domainType:
    | "USER"
    | "COMPANY"
    | "PROJECT"
    | "PROJECT_STEP"
    | "POST"
    | "QUESTION"
    | "CHAT";
  domainId: number;
  changedAt: string;
  changedBy: string;
  changerId: string;
  changerName: string;
  changerRole: string;
  changerUsername: string;
  message: string;
}

// 백엔드 이력 상세 응답 타입
export interface HistoryDetailResponse {
  id: string;
  historyType: "CREATED" | "UPDATED" | "DELETED";
  domainType:
    | "USER"
    | "COMPANY"
    | "PROJECT"
    | "PROJECT_STEP"
    | "POST"
    | "QUESTION"
    | "CHAT";
  domainId: number;
  changedAt: string;
  changerId: string;
  changerName: string;
  changerRole: string;
  before: Record<string, any>;
  after: Record<string, any>;
  createdAt: string;
  message: string;
}

// 프론트엔드에서 사용할 이력 타입 (사용자 정보 포함)
export interface ActivityLog {
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

// 프론트엔드에서 사용할 이력 상세 타입
export interface ActivityLogDetail {
  id: string;
  historyType: "CREATED" | "UPDATED" | "DELETED";
  domainType: string;
  domainId: number;
  changedAt: string;
  changerId: string;
  changerName: string;
  changerRole: string;
  before: Record<string, any>;
  after: Record<string, any>;
  createdAt: string;
  message: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
  role: string;
}

export interface FilterOptions {
  actionFilter: string;
  logTypeFilter: string;
  userFilter: number | null;
  searchTerm: string;
  startDate: string;
  endDate: string;
}
