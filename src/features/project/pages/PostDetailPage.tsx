import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Post, Comment } from "../types/post";
import {
  getPostDetail,
  getComments,
  deletePost,
} from "../services/postService";
import CommentList from "../components/CommentList/CommentList";
import {
  PageContainer,
  MainContentWrapper,
  PostDetailSection,
  PostTitle,
  PostMeta,
  PostContent,
  PostInfoGrid,
  PostInfoItem,
  InfoLabel,
  InfoValue,
  StatusBadge,
  BackButton,
  PostHeader,
  PostActions,
  ActionButton,
  CommentSection,
  CommentInputContainer,
  CommentTextArea,
  CommentSubmitButton,
} from "./PostDetailPage.styled";

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!postId) return;

      try {
        setLoading(true);
        setError(null);
        const [postResponse, commentsResponse] = await Promise.all([
          getPostDetail(parseInt(postId)),
          getComments(parseInt(postId)),
        ]);
        setPost(postResponse.data);
        setComments(commentsResponse.data);
      } catch (err) {
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
        console.error("게시글 상세 조회 중 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
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

  const handleDelete = async () => {
    if (!postId || !window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      setLoading(true);
      console.log("게시글 삭제 시작 - postId:", postId);
      const response = await deletePost(parseInt(postId));
      console.log("게시글 삭제 응답:", response);

      // 백엔드 응답 형식에 맞춰 성공 여부 확인
      if (response.status === "OK" || response.message?.includes("완료")) {
        alert("게시글이 성공적으로 삭제되었습니다.");
        // 프로젝트 게시글 목록 페이지로 이동
        navigate(`/projects/${post?.project.projectId}/posts`);
      } else {
        throw new Error(response.message || "게시글 삭제에 실패했습니다.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "게시글 삭제 중 오류가 발생했습니다.";
      alert(errorMessage);
      setError(errorMessage);
      console.error("게시글 삭제 중 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "대기";
      case "APPROVED":
        return "승인";
      case "REJECTED":
        return "반려";
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "NOTICE":
        return "공지";
      case "QUESTION":
        return "질문";
      case "REPORT":
        return "보고";
      case "GENERAL":
        return "일반";
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <PageContainer>
      <MainContentWrapper>
        <PostDetailSection>
          <PostHeader>
            <BackButton onClick={() => navigate(-1)}>← 목록으로</BackButton>
            <PostActions>
              <ActionButton onClick={() => navigate(`/posts/${postId}/edit`)}>
                수정
              </ActionButton>
              <ActionButton onClick={handleDelete}>삭제</ActionButton>
            </PostActions>
          </PostHeader>

          <PostTitle>{post.title}</PostTitle>

          <PostMeta>
            <span>작성자: {post.author.name}</span>
            <span>작성일: {formatDate(post.createdAt)}</span>
            {post.updatedAt !== post.createdAt && (
              <span>수정일: {formatDate(post.updatedAt)}</span>
            )}
          </PostMeta>

          <PostInfoGrid>
            <PostInfoItem>
              <InfoLabel>상태</InfoLabel>
              <StatusBadge status={getStatusText(post.status)}>
                {getStatusText(post.status)}
              </StatusBadge>
            </PostInfoItem>
            <PostInfoItem>
              <InfoLabel>유형</InfoLabel>
              <InfoValue>{getTypeText(post.type)}</InfoValue>
            </PostInfoItem>
            <PostInfoItem>
              <InfoLabel>우선순위</InfoLabel>
              <InfoValue>{post.priority}</InfoValue>
            </PostInfoItem>
            <PostInfoItem>
              <InfoLabel>프로젝트</InfoLabel>
              <InfoValue>{post.project.name}</InfoValue>
            </PostInfoItem>
          </PostInfoGrid>

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
        </PostDetailSection>
      </MainContentWrapper>
    </PageContainer>
  );
}
