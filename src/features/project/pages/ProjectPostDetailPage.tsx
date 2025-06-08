import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { PostDetail, Comment } from "../types/post";
import { getPostDetail, getComments } from "../services/postService";
import CommentList from "../components/CommentList/CommentList";
import {
  PageContainer,
  PostContainer,
  PostHeader,
  PostTitle,
  PostMeta,
  PostContent,
  BackButton,
  PostInfo,
  PostInfoItem,
  PostInfoLabel,
  PostInfoValue,
  CommentSection,
  CommentInputContainer,
  CommentTextArea,
  CommentSubmitButton,
} from "./ProjectPostDetailPage.styled";

export default function ProjectPostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        if (!postId) return;
        setLoading(true);
        setError(null);

        const [postResponse, commentsResponse] = await Promise.all([
          getPostDetail(parseInt(postId)),
          getComments(parseInt(postId)),
        ]);

        console.log("게시글 상세 정보:", postResponse.data);
        console.log("댓글 목록:", commentsResponse.data);

        setPost(postResponse.data);
        setComments(commentsResponse.data);
      } catch (err) {
        console.error("게시글 상세 조회 중 오류:", err);
        setError("게시글을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [postId]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !postId) return;

    try {
      // TODO: 댓글 작성 API 구현 후 추가
      console.log("댓글 작성:", commentText);
      setCommentText("");
    } catch (err) {
      console.error("댓글 작성 중 오류:", err);
      alert("댓글 작성 중 오류가 발생했습니다.");
    }
  };

  const handleReply = async (parentId: number, content: string) => {
    if (!content.trim() || !postId) return;

    try {
      // TODO: 답글 작성 API 구현 후 추가
      console.log("답글 작성:", { parentId, content });
    } catch (err) {
      console.error("답글 작성 중 오류:", err);
      alert("답글 작성 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <PageContainer>
      <PostContainer>
        <BackButton onClick={() => navigate("/projects/posts")}>
          ← 목록으로 돌아가기
        </BackButton>

        <PostHeader>
          <PostTitle>{post.title}</PostTitle>
          <PostMeta>
            <span>작성자: {post.author.name}</span>
            <span>작성일: {new Date(post.createdAt).toLocaleDateString()}</span>
          </PostMeta>
        </PostHeader>

        <PostInfo>
          <PostInfoItem>
            <PostInfoLabel>프로젝트</PostInfoLabel>
            <PostInfoValue>{post.project.name}</PostInfoValue>
          </PostInfoItem>
          <PostInfoItem>
            <PostInfoLabel>상태</PostInfoLabel>
            <PostInfoValue>{post.status}</PostInfoValue>
          </PostInfoItem>
          <PostInfoItem>
            <PostInfoLabel>유형</PostInfoLabel>
            <PostInfoValue>{post.type}</PostInfoValue>
          </PostInfoItem>
          <PostInfoItem>
            <PostInfoLabel>우선순위</PostInfoLabel>
            <PostInfoValue>{post.priority}</PostInfoValue>
          </PostInfoItem>
        </PostInfo>

        <PostContent>{post.content}</PostContent>

        <CommentSection>
          <CommentInputContainer>
            <CommentTextArea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="댓글을 입력하세요..."
              rows={3}
            />
            <CommentSubmitButton onClick={handleCommentSubmit}>
              댓글 작성
            </CommentSubmitButton>
          </CommentInputContainer>

          <CommentList comments={comments} onReply={handleReply} />
        </CommentSection>
      </PostContainer>
    </PageContainer>
  );
}
