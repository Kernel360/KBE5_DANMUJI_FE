// 질문 상태 enum
export enum QuestionStatus {
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
}

// 답변 상태 enum
export enum AnswerStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
}

// 작성자 타입
export type Author = {
  userId: number;
  name: string;
  email: string;
  role: string;
};

// 질문 타입
export type Question = {
  id: number;
  postId: number;
  author: Author;
  content: string;
  status: QuestionStatus;
  createdAt: string;
  updatedAt: string;
  answers?: Answer[];
};

// 답변 타입
export type Answer = {
  id: number;
  questionId: number;
  author: Author;
  content: string;
  status: AnswerStatus;
  isBestAnswer: boolean;
  createdAt: string;
  updatedAt: string;
};

// 질문 생성 요청 데이터 타입
export type QuestionCreateData = {
  postId: number;
  content: string;
};

// 답변 생성 요청 데이터 타입
export type AnswerCreateData = {
  questionId: number;
  content: string;
};

// API 응답 타입
export type ApiResponse<T> = {
  status: string;
  code: string;
  message: string;
  data?: T;
};

// 질문 생성 응답 타입
export type QuestionCreateResponse = {
  id: number;
};

// 답변 생성 응답 타입
export type AnswerCreateResponse = {
  id: number;
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

// 질문 목록 응답 타입
export type QuestionListResponse = ApiResponse<{
  content: Question[];
  page: PageMetadata;
}>;

// 질문 상세 응답 타입
export type QuestionDetailResponse = ApiResponse<Question>;

// 답변 목록 응답 타입
export type AnswerListResponse = ApiResponse<Answer[]>;
