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
