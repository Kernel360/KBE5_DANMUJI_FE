export type PostCreateData = {
  title: string;
  content: string;
  type: "GENERAL" | "QUESTION" | "REPORT";
  status: "PENDING" | "APPROVED" | "REJECTED";
  priority: number;
  projectId: number;
};

export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

export type PostCreateResponse = {
  id: number;
  title: string;
};

export interface Author {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  status: string;
  steps: any[];
  deleted: boolean;
}

export interface CommentAuthor {
  id: number;
  name: string;
}

export interface Comment {
  id: number;
  postId: number;
  parentCommentId: number | null;
  authorIp: string;
  author: CommentAuthor;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  postId: number;
  parentId: number | null;
  authorIp: string | null;
  author: Author;
  title: string;
  content: string;
  type: "NOTICE" | "QUESTION" | "REPORT" | "GENERAL";
  status: "PENDING" | "APPROVED" | "REJECTED";
  priority: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  completedAt: string | null;
  project: Project;
  delete: boolean;
  approver?: Author;
  approvedAt?: string;
}

export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface PostListResponse {
  status: string;
  code: string;
  message: string;
  data: {
    content: Post[];
    page: PageInfo;
  };
}

export type PostDetail = {
  postId: number;
  parentId: number | null;
  authorIp: string;
  author: Author;
  project: Project;
  title: string;
  content: string;
  type: "GENERAL" | "QUESTION" | "REPORT" | "NOTICE";
  status: "PENDING" | "APPROVED" | "REJECTED";
  priority: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  completedAt: string | null;
  comments: Comment[];
  delete: boolean;
};

export interface CommentListResponse {
  status: string;
  code: string;
  message: string;
  data: Comment[];
}
