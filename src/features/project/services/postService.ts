import api from "../../../api/axios";
import type {
  PostCreateData,
  ApiResponse,
  PostCreateResponse,
  PostListResponse,
  Post,
  CommentListResponse,
} from "../types/post";

export const createPost = async (
  postData: PostCreateData
): Promise<ApiResponse<PostCreateResponse>> => {
  try {
    const response = await api.post("/api/posts", postData);
    const result = response.data;

    if (result.success === false) {
      throw new Error(result.message || "게시글 생성에 실패했습니다.");
    }

    return result;
  } catch (error) {
    console.error("게시글 생성 중 오류 발생:", error);
    throw error;
  }
};

export const getPostDetail = async (postId: number) => {
  try {
    const response = await api.get<{
      status: string;
      code: string;
      message: string;
      data: Post;
    }>(`/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("게시글 상세 조회 중 오류 발생:", error);
    throw error;
  }
};

export const getPosts = async (
  projectId: number,
  page: number = 0,
  size: number = 10
): Promise<PostListResponse> => {
  try {
    const response = await api.get<PostListResponse>(
      `/api/posts/projects/${projectId}`,
      {
        params: {
          page,
          size,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("게시글 목록 조회 중 오류 발생:", error);
    throw error;
  }
};

export const getComments = async (
  postId: number
): Promise<CommentListResponse> => {
  try {
    const response = await api.get<CommentListResponse>(
      `/api/comments/${postId}`
    );
    return response.data;
  } catch (error) {
    console.error("댓글 목록 조회 중 오류:", error);
    throw error;
  }
};
