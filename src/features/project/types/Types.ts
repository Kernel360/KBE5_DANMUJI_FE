// 사용자 타입 정의
export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  companyType?: "DEVELOPER" | "CLIENT";
  clientCompany?: string;
  developerCompany?: string;
}

export type PostPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type PostType = "GENERAL" | "QUESTION";

export const POST_PRIORITY_OPTIONS: PostPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];
export const POST_PRIORITY_LABELS: Record<PostPriority, string> = {
  LOW: "낮음",
  MEDIUM: "보통",
  HIGH: "높음",
  URGENT: "긴급",
};

// 파일 타입
export type PostFile = {
  id: number;
  postId: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
};

export interface Post {
  postId: number;
  parentId: number | null;
  projectId: number;
  projectStepId: number;
  authorIp: string;
  authorId: number;
  authorName: string;
  title: string;
  content: string;
  type: PostType;
  priority: PostPriority;
  createdAt: string;
  updatedAt: string;
  files: PostFile[];
  delete: boolean;
  // 기존 필드들 (호환성을 위해 유지)
  id?: number;
  step?: string;
  writer?: string;
}

export type Project = {
  id: number;
  name: string;
  clientCompanies: string;
  devCompanies: string;
  clientManager?: string;
  devManagers?: string;
  projectStatus: "IN_PROGRESS" | "COMPLETED" | "DELAYED" | "DUE_SOON";
  startDate: string;
  endDate: string;
  progress: number;
  // 백엔드 API 응답 필드들
  description?: string;
  clientCompany?: string;
  developerCompany?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isDeleted?: boolean;
  steps?: Array<{
    id: number;
    projectId: number;
    userId: number | null;
    user: User | null;
    name: string;
    stepOrder: number;
    projectStepStatus: string;
    deleteAt: string | null;
    deleted: boolean;
  }>;
  users?: Array<{
    companyType: "DEVELOPER" | "CLIENT";
    clientCompany: string;
    developerCompany: string;
  }>;
};

export interface ProjectStep {
  id: number;
  stepOrder: number;
  name: string;
  projectStepStatus: string;
  projectFeedbackStepStatus: string | null;
  isDeleted: boolean;
  user: User;
}

export type Step = string;
export type StepList = Step[];

export interface ProjectDetailResponse {
  status: string;
  code: string;
  message: string;
  data: {
    id: number;
    name: string;
    steps: ProjectStep[];
  };
}
