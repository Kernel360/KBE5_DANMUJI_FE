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

export type Author = {
  id: number;
  name: string;
};

export type Project = {
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
  steps: any[]; // TODO: ProjectStep 타입 정의 필요
};

export type Comment = {
  id: number;
  postId: number;
  parentCommentId: number | null;
  authorIp: string;
  author: Author;
  content: string;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[]; // 대댓글 목록
};

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
