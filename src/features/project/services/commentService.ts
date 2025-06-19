import axios from "@/api/axios";

export async function createComment({
  postId,
  parentId = null,
  content,
}: {
  postId: number;
  parentId?: number | null;
  content: string;
}) {
  return axios.post("/api/comments", {
    postId,
    parentId,
    content,
  });
}
