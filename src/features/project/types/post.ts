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
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
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
};

// 댓글 타입
export type Comment = {
  id: number;
  postId: number;
  parentCommentId: number | null;
  authorIp: string;
  author: Author;
  content: string;
  createdAt: string;
  updatedAt: string;
  children?: Comment[];
};

// 게시글 생성 데이터 타입
export type PostCreateData = {
  title: string;
  content: string;
  type: PostType;
  status: PostStatus;
  priority: PostPriority;
  projectId: number;
  parentId?: number | null;
};

// 게시글 타입 (기존 Post와 PostDetail 통합)
export type Post = {
  postId: number;
  parentId: number | null;
  authorIp: string;
  author: Author;
  approver?: Author;
  project: Project;
  title: string;
  content: string;
  type: PostType;
  status: PostStatus;
  priority: PostPriority;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  completedAt: string | null;
  approvedAt: string | null;
  comments?: Comment[];
  questionCount?: number;
  isDeleted: boolean;
};

// API 응답 타입
export type ApiResponse<T> = {
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
  title?: string;
  content?: string;
  type?: PostType;
  status?: PostStatus;
  priority?: PostPriority;
};
