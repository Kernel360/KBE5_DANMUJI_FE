import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ModalOverlay,
  ModalPanel,
  ModalHeader,
  HeaderLeft,
  StatusBadge,
  ModalTitle,
  HeaderRight,
  CloseButton,
  ModalHeaderActionButton,
  ModalBody,
  Section,
  SectionTitle,
  PostMeta,
  PostContent,
  CommentsSection,
  CommentsList,
  CommentItem,
  CommentMeta,
  CommentAuthor,
  CommentActions,
  CommentActionButton,
  CommentText,
  CommentInputContainer,
  CommentTextArea,
  CommentSubmitButton,
  LoadingSpinner,
  ErrorMessage,
} from "./ProjectPostDetailModal.styled.ts";
import {
  getPostDetail,
  getComments,
  createComment,
  deletePost,
} from "@/features/project/services/postService";
import type { Post, Comment } from "@/features/project/types/post";
import QuestionAnswerModal from "../QuestionAnswerModal/QuestionAnswerModal";
import { useAuth } from "@/contexts/AuthContexts";

interface PostDetailModalProps {
  open: boolean;
  onClose: () => void;
  postId: number | null;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({
  open,
  onClose,
  postId,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showQuestionAnswer, setShowQuestionAnswer] = useState(false);

  useEffect(() => {
    const loadPostData = async () => {
      if (open && postId !== null) {
        try {
          setLoading(true);
          setError(null);

          // 게시글 상세 정보 가져오기
          const postResponse = await getPostDetail(postId);
          if (postResponse.data) {
            setPost(postResponse.data);
          }

          // 댓글 목록 가져오기
          try {
            const commentsResponse = await getComments(postId);
            if (commentsResponse.data) {
              setComments(commentsResponse.data);
            }
          } catch (commentError) {
            console.log("댓글 로드 실패:", commentError);
            setComments([]);
          }
        } catch (err) {
          setError("게시글을 불러오는 중 오류가 발생했습니다.");
          console.error("게시글 로드 중 오류:", err);
        } finally {
          setLoading(false);
        }
      } else if (!open) {
        setPost(null);
        setComments([]);
        setLoading(false);
        setError(null);
      }
    };

    loadPostData();
  }, [open, postId]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !postId) return;

    try {
      setSubmittingComment(true);
      const response = await createComment(postId, commentText);

      if (response.data) {
        // 새 댓글을 목록에 추가
        setComments((prev) => [...prev, response.data!]);
        setCommentText("");
      }
    } catch (err) {
      console.error("댓글 작성 중 오류:", err);
      alert("댓글 작성 중 오류가 발생했습니다.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleEditPost = () => {
    if (!postId) return;
    console.log("게시글 수정 버튼 클릭 - postId:", postId);
    navigate(`/posts/${postId}/edit`);
    onClose();
  };

  const handleDeletePost = async () => {
    if (!postId) {
      alert("게시글 정보가 올바르지 않습니다.");
      return;
    }

    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      setLoading(true);
      console.log("게시글 삭제 시작 - postId:", postId);
      const response = await deletePost(postId);
      console.log("게시글 삭제 응답:", response);

      // 백엔드 응답 형식에 맞춰 성공 여부 확인
      if (response.status === "OK" || response.message?.includes("완료")) {
        alert("게시글이 성공적으로 삭제되었습니다.");
        onClose();
        // 페이지 새로고침을 위해 window.location.reload() 사용
        window.location.reload();
      } else {
        throw new Error(response.message || "게시글 삭제에 실패했습니다.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "게시글 삭제 중 오류가 발생했습니다.";
      console.error("게시글 삭제 중 오류:", err);
      alert(errorMessage);
      setError(errorMessage);
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
        return "거부";
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

  // 작성자 본인 여부 확인 함수
  const isAuthor = (authorId: number) => {
    console.log("현재 사용자:", user);
    console.log("게시글 작성자 ID:", authorId);
    console.log("사용자 ID 비교:", user?.id, authorId);

    const isAuthorResult = user?.id === authorId;

    console.log("작성자 본인 여부:", isAuthorResult);
    return isAuthorResult;
  };

  if (!open) return null;

  if (loading) {
    return (
      <ModalOverlay onClick={onClose}>
        <ModalPanel>
          <LoadingSpinner>로딩 중...</LoadingSpinner>
        </ModalPanel>
      </ModalOverlay>
    );
  }

  if (error) {
    return (
      <ModalOverlay onClick={onClose}>
        <ModalPanel>
          <ErrorMessage>{error}</ErrorMessage>
        </ModalPanel>
      </ModalOverlay>
    );
  }

  if (!post) {
    return (
      <ModalOverlay onClick={onClose}>
        <ModalPanel>
          <ErrorMessage>게시글을 찾을 수 없습니다.</ErrorMessage>
        </ModalPanel>
      </ModalOverlay>
    );
  }

  return (
    <>
      <ModalOverlay onClick={onClose}>
        <ModalPanel onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <ModalHeader>
            <HeaderLeft>
              <StatusBadge $status={getStatusText(post.status)}>
                {getStatusText(post.status)}
              </StatusBadge>
              <ModalTitle>{post.title}</ModalTitle>
            </HeaderLeft>
            <HeaderRight>
              {/* 작성자 본인일 때만 수정/삭제 버튼 표시 */}
              {isAuthor(post.author.id) && (
                <>
                  <ModalHeaderActionButton onClick={handleEditPost}>
                    수정
                  </ModalHeaderActionButton>
                  <ModalHeaderActionButton onClick={handleDeletePost}>
                    삭제
                  </ModalHeaderActionButton>
                </>
              )}
              <CloseButton onClick={onClose}>×</CloseButton>
            </HeaderRight>
          </ModalHeader>
          <ModalBody>
            <Section>
              <PostMeta>
                <div>작성자: {post.author.name}</div>
                <div>작성일: {formatDate(post.createdAt)}</div>
                <div>유형: {getTypeText(post.type)}</div>
                <div>우선순위: {post.priority}</div>
                {post.updatedAt !== post.createdAt && (
                  <div>수정일: {formatDate(post.updatedAt)}</div>
                )}
              </PostMeta>
              <PostContent>{post.content}</PostContent>
            </Section>

            <CommentsSection>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "0.5rem",
                }}
              >
                <ModalHeaderActionButton
                  onClick={() => setShowQuestionAnswer(true)}
                >
                  질문 & 답변
                </ModalHeaderActionButton>
              </div>
              <SectionTitle>댓글 ({comments.length})</SectionTitle>
              <CommentsList>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <CommentItem key={comment.id}>
                      <CommentMeta>
                        <CommentAuthor>{comment.author.name}</CommentAuthor>
                        <CommentActions>
                          <span>{formatDate(comment.createdAt)}</span>
                          {/* 댓글 작성자 본인일 때만 수정/삭제 버튼 표시 */}
                          {isAuthor(comment.author.id) && (
                            <>
                              <CommentActionButton>수정</CommentActionButton>
                              <CommentActionButton>삭제</CommentActionButton>
                            </>
                          )}
                        </CommentActions>
                      </CommentMeta>
                      <CommentText>{comment.content}</CommentText>
                    </CommentItem>
                  ))
                ) : (
                  <p>아직 댓글이 없습니다.</p>
                )}
              </CommentsList>
              <CommentInputContainer>
                <CommentTextArea
                  placeholder="댓글을 입력하세요"
                  value={commentText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setCommentText(e.target.value)
                  }
                  disabled={submittingComment}
                />
                <CommentSubmitButton
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim() || submittingComment}
                >
                  {submittingComment ? "등록 중..." : "등록"}
                </CommentSubmitButton>
              </CommentInputContainer>
            </CommentsSection>
          </ModalBody>
        </ModalPanel>
      </ModalOverlay>
      <QuestionAnswerModal
        open={showQuestionAnswer}
        onClose={() => setShowQuestionAnswer(false)}
        postId={postId}
      />
    </>
  );
};

export default PostDetailModal;
