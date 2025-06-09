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
  QuestionSection,
  QuestionList,
  QuestionItem,
  QuestionHeader,
  QuestionAuthor,
  QuestionDate,
  QuestionText,
  QuestionActions,
  AnswerList,
  AnswerItem,
  AnswerHeader,
  AnswerAuthor,
  AnswerDate,
  AnswerText,
  AnswerActions,
  QuestionForm,
  QuestionTextArea,
  QuestionSubmitButton,
  AnswerForm,
  AnswerTextArea,
  AnswerSubmitButton,
  QuestionStats,
  QuestionStatus,
  VoteButton,
  VoteCount,
  BestAnswerBadge,
  LoadingSpinner,
  ErrorMessage,
} from "./QuestionAnswerModal.styled";
import {
  getPostDetail,
  getComments,
  createComment,
} from "@/features/project/services/postService";
import type { Post, Comment } from "@/features/project/types/post";

interface QuestionAnswerModalProps {
  open: boolean;
  onClose: () => void;
  postId: number | null;
}

const QuestionAnswerModal: React.FC<QuestionAnswerModalProps> = ({
  open,
  onClose,
  postId,
}) => {
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

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

          // 댓글 목록 가져오기 (질문으로 사용)
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

  const handleQuestionSubmit = async () => {
    if (!questionText.trim() || !postId) return;

    try {
      setSubmittingQuestion(true);
      const response = await createComment(postId, questionText);

      if (response.data) {
        // 새 질문을 목록에 추가
        setComments((prev) => [...prev, response.data!]);
        setQuestionText("");
      }
    } catch (err) {
      console.error("질문 작성 중 오류:", err);
      alert("질문 작성 중 오류가 발생했습니다.");
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!answerText.trim() || !selectedQuestionId || !postId) return;

    try {
      setSubmittingAnswer(true);
      const response = await createComment(
        postId,
        answerText,
        selectedQuestionId
      );

      if (response.data) {
        // 새 답변을 해당 질문의 답글에 추가
        setComments((prev) =>
          prev.map((comment) => {
            if (comment.id === selectedQuestionId) {
              return {
                ...comment,
                children: [...(comment.children || []), response.data!],
              };
            }
            return comment;
          })
        );
        setAnswerText("");
        setSelectedQuestionId(null);
      }
    } catch (err) {
      console.error("답변 작성 중 오류:", err);
      alert("답변 작성 중 오류가 발생했습니다.");
    } finally {
      setSubmittingAnswer(false);
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
    <ModalOverlay onClick={onClose}>
      <ModalPanel onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderLeft>
            <StatusBadge $status={getStatusText(post.status)}>
              {getStatusText(post.status)}
            </StatusBadge>
            <ModalTitle>{post.title} - 질문 & 답변</ModalTitle>
          </HeaderLeft>
          <HeaderRight>
            <CloseButton onClick={onClose}>&times;</CloseButton>
          </HeaderRight>
        </ModalHeader>
        <ModalBody>
          <Section>
            <PostMeta>
              <div>작성자: {post.author.name}</div>
              <div>작성일: {formatDate(post.createdAt)}</div>
            </PostMeta>
            <PostContent>{post.content}</PostContent>
          </Section>

          <QuestionSection>
            <SectionTitle>질문 & 답변 ({comments.length})</SectionTitle>

            <QuestionForm>
              <QuestionTextArea
                placeholder="이 게시글에 대해 질문이 있으신가요?"
                value={questionText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setQuestionText(e.target.value)
                }
                disabled={submittingQuestion}
              />
              <QuestionSubmitButton
                onClick={handleQuestionSubmit}
                disabled={!questionText.trim() || submittingQuestion}
              >
                {submittingQuestion ? "질문 등록 중..." : "질문 등록"}
              </QuestionSubmitButton>
            </QuestionForm>

            <QuestionList>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <QuestionItem key={comment.id}>
                    <QuestionHeader>
                      <div>
                        <QuestionAuthor>{comment.author.name}</QuestionAuthor>
                        <QuestionDate>
                          {formatDate(comment.createdAt)}
                        </QuestionDate>
                        <QuestionStatus
                          $resolved={
                            comment.children && comment.children.length > 0
                          }
                        >
                          {comment.children && comment.children.length > 0
                            ? "답변 있음"
                            : "답변 대기"}
                        </QuestionStatus>
                      </div>
                      <QuestionActions>
                        <VoteButton>👍 0</VoteButton>
                      </QuestionActions>
                    </QuestionHeader>
                    <QuestionText>{comment.content}</QuestionText>

                    <AnswerList>
                      {comment.children && comment.children.length > 0 ? (
                        comment.children.map((child) => (
                          <AnswerItem key={child.id} $isBestAnswer={false}>
                            <AnswerHeader>
                              <div>
                                <AnswerAuthor>{child.author.name}</AnswerAuthor>
                                <AnswerDate>
                                  {formatDate(child.createdAt)}
                                </AnswerDate>
                              </div>
                              <AnswerActions>
                                <VoteButton>👍 0</VoteButton>
                              </AnswerActions>
                            </AnswerHeader>
                            <AnswerText>{child.content}</AnswerText>
                          </AnswerItem>
                        ))
                      ) : (
                        <p>아직 답변이 없습니다.</p>
                      )}
                    </AnswerList>

                    {selectedQuestionId === comment.id ? (
                      <AnswerForm>
                        <AnswerTextArea
                          placeholder="답변을 입력하세요"
                          value={answerText}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) => setAnswerText(e.target.value)}
                          disabled={submittingAnswer}
                        />
                        <AnswerSubmitButton
                          onClick={handleAnswerSubmit}
                          disabled={!answerText.trim() || submittingAnswer}
                        >
                          {submittingAnswer ? "답변 등록 중..." : "답변 등록"}
                        </AnswerSubmitButton>
                      </AnswerForm>
                    ) : (
                      <button onClick={() => setSelectedQuestionId(comment.id)}>
                        답변 작성
                      </button>
                    )}
                  </QuestionItem>
                ))
              ) : (
                <p>아직 질문이 없습니다.</p>
              )}
            </QuestionList>
          </QuestionSection>
        </ModalBody>
      </ModalPanel>
    </ModalOverlay>
  );
};

export default QuestionAnswerModal;
