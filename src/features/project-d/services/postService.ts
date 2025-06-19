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
  PostDetailReadResponse,
  PostSummaryReadResponse,
  PageResponse,
  PostFile,
} from "../types/post";
import { getQuestionsByPost } from "./questionService";
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
    "POST_CREATE_SUCCESS",
    "POST_UPDATE_SUCCESS",
    "POST_DELETE_SUCCESS",
    "COMMENT_CREATE_SUCCESS",
    "COMMENT_UPDATE_SUCCESS",
    "COMMENT_DELETE_SUCCESS",
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
  postData: PostCreateData,
  files?: File[]
): Promise<ApiResponse<PostCreateResponse>> => {
  try {
    // FormData 객체 생성
    const formData = new FormData();

    // JSON 데이터를 "data" 파트로 추가
    const jsonData = {
      projectId: postData.projectId,
      stepId: postData.stepId,
      title: postData.title,
      content: postData.content,
      type: postData.type,
      status: postData.status,
      priority: postData.priority,
      ...(postData.parentId && { parentId: postData.parentId }),
    };

    formData.append(
      "data",
      new Blob([JSON.stringify(jsonData)], {
        type: "application/json",
      })
    );

    // 파일이 있는 경우 "files" 파트로 추가
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }

    console.log("=== createPost API 호출 ===");
    console.log("요청 데이터:", jsonData);
    console.log("파일 개수:", files?.length || 0);

    const response = await api.post<ApiResponse<PostCreateResponse>>(
      "/api/posts",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("API 응답:", response);
    console.log("응답 데이터:", response.data);
    console.log("======================");

    return handleApiResponse<PostCreateResponse>(response);
  } catch (error) {
    console.error("=== createPost 에러 ===");
    console.error("에러:", error);

    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      console.error(
        "AxiosError:",
        error.response?.data,
        error.response?.status
      );
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
  stepId: number,
  page: number = 0,
  size: number = 10,
  status?: PostStatus,
  type?: PostType,
  priority?: PostPriority,
  searchTerm?: string
): Promise<PostListResponse> => {
  try {
    const response = await api.get<PostListResponse>(
      `/api/posts/all/${stepId}`,
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

// 게시글 목록 조회 (댓글 포함)
export const getPostsWithComments = async (
  stepId: number,
  page: number = 0,
  size: number = 10,
  status?: PostStatus,
  type?: PostType,
  priority?: PostPriority,
  searchTerm?: string
): Promise<PostListResponse> => {
  try {
    // 먼저 게시글 목록을 가져옴
    const postsResponse = await getPosts(
      stepId,
      page,
      size,
      status,
      type,
      priority,
      searchTerm
    );

    if (postsResponse.data) {
      // 각 게시글의 댓글과 질문을 병렬로 가져옴
      const postsWithComments = await Promise.all(
        postsResponse.data.content.map(async (post) => {
          try {
            const [commentsResponse, questionsResponse] = await Promise.all([
              getComments(post.postId),
              getQuestionsByPost(post.postId, 0, 1000), // 질문 개수만 필요하므로 큰 사이즈로 가져옴
            ]);
            return {
              ...post,
              comments: commentsResponse.data || [],
              questionCount: questionsResponse.data?.content?.length || 0,
            };
          } catch (error) {
            console.error(`게시글 ${post.postId} 댓글/질문 로드 실패:`, error);
            return {
              ...post,
              comments: [],
              questionCount: 0,
            };
          }
        })
      );

      return {
        ...postsResponse,
        data: {
          ...postsResponse.data,
          content: postsWithComments,
        },
      };
    }

    return postsResponse;
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
  postData: PostUpdateRequest,
  files?: File[]
): Promise<ApiResponse<Post>> => {
  try {
    // FormData 객체 생성
    const formData = new FormData();

    // JSON 데이터를 "data" 파트로 추가
    const jsonData = {
      projectId: postData.projectId,
      title: postData.title,
      content: postData.content,
      type: postData.type,
      status: postData.status,
      priority: postData.priority,
      stepId: postData.stepId,
      ...(postData.fileIdsToDelete &&
        postData.fileIdsToDelete.length > 0 && {
          fileIdsToDelete: postData.fileIdsToDelete,
        }),
    };

    formData.append(
      "data",
      new Blob([JSON.stringify(jsonData)], {
        type: "application/json",
      })
    );

    // 새로 추가된 파일들을 "files" 파트로 추가
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }

    console.log("=== updatePost API 호출 ===");
    console.log("요청 데이터:", jsonData);
    console.log("새로 추가된 파일 개수:", files?.length || 0);
    console.log("삭제할 파일 ID:", postData.fileIdsToDelete);

    const response = await api.put<ApiResponse<Post>>(
      `/api/posts/${postId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("API 응답:", response);
    console.log("응답 데이터:", response.data);
    console.log("======================");

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

// 게시글 검색
export const searchPosts = async (
  stepId: number,
  searchParams: {
    title?: string;
    author?: string;
    clientCompany?: string;
    developerCompany?: string;
    priority?: number;
    status?: PostStatus;
    type?: PostType;
  },
  page: number = 0,
  size: number = 10
): Promise<PostListResponse> => {
  try {
    console.log("=== searchPosts 함수 호출 ===");
    console.log("stepId:", stepId);
    console.log("검색 파라미터:", searchParams);
    console.log("페이지:", page, "크기:", size);

    const response = await api.get<PostListResponse>(`/api/posts/all/search`, {
      params: {
        stepId,
        ...searchParams,
        page,
        size,
      },
    });

    console.log("API 응답:", response);
    console.log("응답 데이터:", response.data);
    console.log("======================");

    return handleApiResponse<PostListResponse["data"]>(response);
  } catch (error) {
    console.error("=== searchPosts 에러 ===");
    console.error("에러:", error);

    if (error instanceof ApiError) throw error;
    if (error instanceof AxiosError) {
      console.error(
        "AxiosError:",
        error.response?.data,
        error.response?.status
      );
      throw new ApiError(
        error.response?.data?.message || "게시글 검색 중 오류가 발생했습니다.",
        error.response?.status
      );
    }
    throw new ApiError("게시글 검색 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 단계별 게시글 목록 조회 (댓글 포함)
export const getPostsByProjectStep = async (
  projectId: number,
  stepId: number,
  page: number = 0,
  size: number = 10
): Promise<PageResponse<PostSummaryReadResponse>> => {
  try {
    const response = await api.get<
      ApiResponse<PageResponse<PostSummaryReadResponse>>
    >(
      `/api/posts/projects/${projectId}/steps/${stepId}?page=${page}&size=${size}`
    );

    // 각 게시글의 댓글 정보를 가져오기
    const postsWithComments = await Promise.all(
      response.data.data.content.map(async (post) => {
        try {
          const commentsResponse = await getComments(post.postId);
          return {
            ...post,
            comments: commentsResponse.data || [],
          };
        } catch (error) {
          console.error(`게시글 ${post.postId} 댓글 로드 실패:`, error);
          return {
            ...post,
            comments: [],
          };
        }
      })
    );

    return {
      ...response.data.data,
      content: postsWithComments,
    };
  } catch (error) {
    console.error("단계별 게시글 조회 실패:", error);
    throw error;
  }
};
