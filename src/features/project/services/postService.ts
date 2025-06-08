import api from "../../../api/axios";
import type {
  PostCreateData,
  ApiResponse,
  PostCreateResponse,
  PostListResponse,
  Post,
  CommentListResponse,
  Comment,
  CommentResponse,
  PostStatus,
  PostType,
  PostPriority,
  PostUpdateRequest,
} from "../types/post";
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";

// API 에러 타입
export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

// API 응답 처리 헬퍼 함수
const handleApiResponse = async <T>(
  response: AxiosResponse<ApiResponse<T>>
): Promise<ApiResponse<T>> => {
  const { data } = response;

  // 성공 메시지 목록
  const successMessages = [
    "게시글 목록 조회 완료",
    "게시글 상세 조회 완료",
    "게시글 조회 완료",
    "게시글 생성 완료",
    "게시글 수정 완료",
    "게시글 삭제 완료",
    "댓글 목록 조회 완료",
    "댓글 작성 완료",
    "댓글 생성 완료",
    "댓글 수정 완료",
    "댓글 삭제 완료",
  ];

  // success가 false이고, 메시지가 성공 메시지가 아닌 경우에만 에러로 처리
  if (!data.success && !successMessages.includes(data.message || "")) {
    throw new ApiError(
      data.message || "요청 처리 중 오류가 발생했습니다.",
      response.status
    );
  }

  return data;
};

// 게시글 생성
export const createPost = async (
  postData: PostCreateData
): Promise<ApiResponse<PostCreateResponse>> => {
  try {
    const response = await api.post<ApiResponse<PostCreateResponse>>(
      "/api/posts",
      postData
    );
    return handleApiResponse<PostCreateResponse>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message || "게시글 생성 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("게시글 생성 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 게시글 상세 조회
export const getPostDetail = async (
  postId: number
): Promise<ApiResponse<Post>> => {
  try {
    const response = await api.get<ApiResponse<Post>>(`/api/posts/${postId}`);
    return handleApiResponse<Post>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message ||
          "게시글 상세 조회 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("게시글 상세 조회 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 게시글 목록 조회
export const getPosts = async (
  projectId: number,
  page: number = 0,
  size: number = 10,
  status?: PostStatus,
  type?: PostType,
  priority?: PostPriority,
  searchTerm?: string
): Promise<PostListResponse> => {
  try {
    const response = await api.get<PostListResponse>(
      `/api/posts/projects/${projectId}`,
      {
        params: {
          page,
          size,
          status,
          type,
          priority,
          searchTerm,
        },
      }
    );
    return handleApiResponse<PostListResponse["data"]>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message ||
          "게시글 목록 조회 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("게시글 목록 조회 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 게시글 수정
export const updatePost = async (
  postId: number,
  postData: PostUpdateRequest
): Promise<ApiResponse<Post>> => {
  try {
    const response = await api.put<ApiResponse<Post>>(
      `/api/posts/${postId}`,
      postData
    );
    return handleApiResponse<Post>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message || "게시글 수정 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("게시글 수정 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 게시글 삭제
export const deletePost = async (
  postId: number
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete<ApiResponse<void>>(
      `/api/posts/${postId}`
    );
    return handleApiResponse<void>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message || "게시글 삭제 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("게시글 삭제 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 게시글 상태 변경
export const updatePostStatus = async (
  postId: number,
  status: PostStatus
): Promise<ApiResponse<Post>> => {
  try {
    const response = await api.patch<ApiResponse<Post>>(
      `/api/posts/${postId}/status`,
      { status }
    );
    return handleApiResponse<Post>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message ||
          "게시글 상태 변경 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("게시글 상태 변경 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 댓글 목록 조회
export const getComments = async (
  postId: number
): Promise<CommentListResponse> => {
  try {
    const response = await api.get<CommentListResponse>(
      `/api/comments/${postId}`
    );
    return handleApiResponse<Comment[]>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      // 500 에러인 경우 빈 댓글 목록 반환
      if (error.response?.status === 500) {
        return {
          success: true,
          data: [],
          message: "댓글 목록이 비어있습니다.",
        };
      }
      throw new ApiError(
        error.response?.data?.message ||
          "댓글 목록 조회 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("댓글 목록 조회 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 댓글 작성
export const createComment = async (
  postId: number,
  content: string,
  parentId?: number | null
): Promise<CommentResponse> => {
  try {
    const response = await api.post<CommentResponse>(`/api/comments`, {
      postId,
      parentId,
      content,
    });
    return handleApiResponse<Comment>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message || "댓글 작성 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("댓글 작성 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 댓글 수정
export const updateComment = async (
  commentId: number,
  content: string
): Promise<CommentResponse> => {
  try {
    const response = await api.put<CommentResponse>(
      `/api/comments/${commentId}`,
      { content }
    );
    return handleApiResponse<Comment>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message || "댓글 수정 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("댓글 수정 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 댓글 삭제
export const deleteComment = async (
  commentId: number
): Promise<CommentResponse> => {
  try {
    const response = await api.delete<CommentResponse>(
      `/api/comments/${commentId}`
    );
    return handleApiResponse<Comment>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message || "댓글 삭제 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("댓글 삭제 중 알 수 없는 오류가 발생했습니다.");
  }
};
