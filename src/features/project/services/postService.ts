import type {
  PostCreateData,
  ApiResponse,
  PostCreateResponse,
  PostDetail,
  Comment,
} from "../types/post";

const API_BASE_URL = "http://localhost:8080/api";

export const createPost = async (
  postData: PostCreateData
): Promise<ApiResponse<PostCreateResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "게시글 생성에 실패했습니다.");
    }

    return result;
  } catch (error) {
    console.error("게시글 생성 중 오류 발생:", error);
    throw error;
  }
};

export const getPostDetail = async (
  postId: number
): Promise<ApiResponse<PostDetail>> => {
  try {
    // 게시글 상세 정보와 댓글을 병렬로 요청
    const [postResponse, commentsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/posts/${postId}`),
      fetch(`${API_BASE_URL}/comments/${postId}`),
    ]);

    const [postResult, commentsResult] = await Promise.all([
      postResponse.json(),
      commentsResponse.json(),
    ]);

    if (!postResult.success) {
      throw new Error(postResult.message || "게시글 조회에 실패했습니다.");
    }

    if (!commentsResult.success) {
      throw new Error(commentsResult.message || "댓글 조회에 실패했습니다.");
    }

    // 게시글 상세 정보에 댓글 목록을 추가
    return {
      ...postResult,
      data: {
        ...postResult.data,
        comments: commentsResult.data,
      },
    };
  } catch (error) {
    console.error("게시글 상세 조회 중 오류 발생:", error);
    throw error;
  }
};

export const getPosts = async (projectId: number) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/posts?projectId=${projectId}`
    );

    if (!response.ok) {
      throw new Error("게시글 목록 조회에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("게시글 목록 조회 중 오류 발생:", error);
    throw error;
  }
};
