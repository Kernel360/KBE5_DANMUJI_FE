// 게시글 상태 enum
export enum PostStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// 게시글 유형 enum
export enum PostType {
  GENERAL = "GENERAL",
  NOTICE = "NOTICE",
  REPORT = "REPORT",
}

// 우선순위 enum
export enum PostPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

// 작성자 타입
export type Author = {
  id: number;
  name: string;
  email?: string;
  role?: string;
};

// 프로젝트 타입
export type Project = {
  projectId: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  clientCompany: string;
  developerCompany: string;
};

// 댓글 타입
export type Comment = {
  status: string;
  deletedAt: unknown;
  id: number;
  postId: number;
  parentId?: number | null;
  authorIp: string;
  authorId?: number;
  authorName?: string;
  author?: Author;
  content: string;
  createdAt: string;
  updatedAt: string;
  children?: Comment[];
};

// 게시글 생성 데이터 타입
export type PostCreateData = {
  projectId: number;
  title: string;
  content: string;
  type: PostType;
  status: PostStatus;
  priority: PostPriority;
  stepId: number;
  parentId?: number | null;
};

// 게시글 타입 (기존 Post와 PostDetail 통합)
export type Post = {
  attachments?: { name: string; size: string }[];
  postId: number;
  parentId: number | null;
  projectStepId: number;
  authorIp: string;
  authorId: number;
  author: Author;
  approver?: Author;
  project?: Project;
  title: string;
  content: string;
  type: PostType;
  status: PostStatus;
  priority: PostPriority;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  completedAt: string | null;
  approvedAt?: string | null;
  comments?: Comment[];
  questionCount?: number;
  isDeleted?: boolean;
  delete?: boolean;
  files?: PostFile[];
};

// API 응답 타입
export type ApiResponse<T> = {
  success: boolean;
  status: "OK" | "ERROR";
  code: string;
  message: string;
  data?: T;
};

// 게시글 생성 응답 타입
export type PostCreateResponse = {
  authorIp: string;
  authorId: number;
  title: string;
  content: string;
  type: PostType;
  status: PostStatus;
  priority: PostPriority;
};

// 페이지네이션 메타데이터 타입
export type PageMetadata = {
  number: number;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

// 게시글 목록 응답 타입
export type PostListResponse = ApiResponse<{
  content: Post[];
  page: PageMetadata;
}>;

// 댓글 목록 응답 타입
export type CommentListResponse = ApiResponse<Comment[]>;
export type CommentResponse = ApiResponse<Comment>;

// 게시글 수정 요청 데이터 타입
export type PostUpdateRequest = {
  projectId?: number;
  title?: string;
  content?: string;
  type?: PostType;
  status?: PostStatus;
  priority?: PostPriority;
  stepId: number;
  fileIdsToDelete?: number[];
};

// 게시글 검색 요청 데이터 타입
export type PostSearchRequest = {
  title?: string;
  content?: string;
  author?: string;
  status?: PostStatus;
  type?: PostType;
  priority?: PostPriority;
  assignee?: string;
  client?: string;
  startDate?: string;
  endDate?: string;
};

export interface PostFile {
  id: number;
  postId: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
}

export interface PostDetailReadResponse {
  postId: number;
  parentId: number | null;
  projectId: number;
  projectStepId: number;
  authorIp: string;
  authorId: number;
  authorName: string;
  title: string;
  content: string;
  type: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  files: PostFile[];
  delete: boolean;
}

export interface PostSummaryReadResponse {
  postId: number;
  parentId: number | null;
  projectId: number;
  projectStepId: number;
  authorId: number;
  authorName: string;
  title: string;
  type: string;
  priority: string;
  createdAt: string;
  comments?: Comment[];
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
