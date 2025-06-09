import React, { useState, useEffect } from "react";
import {
  ModalOverlay,
  ModalPanel,
  ModalHeader,
  HeaderLeft,
  StatusBadge,
  ModalTitle,
  HeaderRight,
  CloseButton,
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
  CommentText,
  CommentInputContainer,
  CommentTextArea,
  CommentSubmitButton,
  QuestionAnswerButton,
  LoadingSpinner,
  ErrorMessage,
} from "./ProjectPostDetailModal.styled.ts";
import QuestionAnswerModal from "../QuestionAnswerModal/QuestionAnswerModal";
import {
  getPostDetail,
  getComments,
  createComment,
} from "@/features/project/services/postService";
import type { Post, Comment } from "@/features/project/types/post";

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
  const [commentText, setCommentText] = useState("");
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuestionAnswer, setShowQuestionAnswer] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

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

  const handleQuestionAnswerClick = () => {
    setShowQuestionAnswer(true);
  };

  const handleQuestionAnswerClose = () => {
    setShowQuestionAnswer(false);
  };

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
              <QuestionAnswerButton onClick={handleQuestionAnswerClick}>
                질문 & 답변
              </QuestionAnswerButton>
              <CloseButton onClick={onClose}>&times;</CloseButton>
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
              <SectionTitle>댓글 ({comments.length})</SectionTitle>
              <CommentsList>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <CommentItem key={comment.id}>
                      <CommentMeta>
                        <CommentAuthor>{comment.author.name}</CommentAuthor>
                        <CommentActions>
                          <span>{formatDate(comment.createdAt)}</span>
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
        onClose={handleQuestionAnswerClose}
        postId={postId}
      />
    </>
  );
};

export default PostDetailModal;
