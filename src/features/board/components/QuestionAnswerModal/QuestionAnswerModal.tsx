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
  VoteButton,
  BestAnswerBadge,
  LoadingSpinner,
  ErrorMessage,
} from "./QuestionAnswerModal.styled";
import { getPostDetail } from "@/features/project/services/postService";
import {
  createQuestion,
  getQuestionsByPost,
  createAnswer,
  updateQuestion,
  deleteQuestion,
  resolveQuestion,
} from "@/features/project/services/questionService";
import type { Post } from "@/features/project/types/post";
import type { Question } from "@/features/project/types/question";
import { useAuth } from "@/contexts/AuthContexts";

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
  const { user } = useAuth();
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );
  const [post, setPost] = useState<Post | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  // 질문 수정 관련 상태
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null
  );
  const [editQuestionText, setEditQuestionText] = useState("");
  const [updatingQuestion, setUpdatingQuestion] = useState(false);
  const [deletingQuestion, setDeletingQuestion] = useState(false);
  const [resolvingQuestion, setResolvingQuestion] = useState(false);

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

          // 질문 목록 가져오기
          try {
            const questionsResponse = await getQuestionsByPost(postId);
            if (questionsResponse.data) {
              console.log("=== 질문 목록 로드 ===");
              console.log("질문 목록:", questionsResponse.data.content);
              questionsResponse.data.content.forEach((question, index) => {
                console.log(`질문 ${index + 1}:`, {
                  id: question.id,
                  author: question.author,
                  content: question.content.substring(0, 50) + "...",
                });
              });
              console.log("======================");
              setQuestions(questionsResponse.data.content);
            }
          } catch (questionError) {
            console.log("질문 로드 실패:", questionError);
            setQuestions([]);
          }
        } catch (err) {
          setError("게시글을 불러오는 중 오류가 발생했습니다.");
          console.error("게시글 로드 중 오류:", err);
        } finally {
          setLoading(false);
        }
      } else if (!open) {
        setPost(null);
        setQuestions([]);
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
      const response = await createQuestion({
        postId,
        content: questionText.trim(),
      });

      if (response.data) {
        // 질문 목록을 다시 불러오기
        const questionsResponse = await getQuestionsByPost(postId);
        if (questionsResponse.data) {
          setQuestions(questionsResponse.data.content);
        }
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
    if (!answerText.trim() || !selectedQuestionId) return;

    try {
      setSubmittingAnswer(true);
      const response = await createAnswer({
        questionId: selectedQuestionId,
        content: answerText.trim(),
      });

      if (response.data) {
        // 질문 목록을 다시 불러와서 답변 정보 업데이트
        const questionsResponse = await getQuestionsByPost(postId!);
        if (questionsResponse.data) {
          setQuestions(questionsResponse.data.content);
        }
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

  // 질문 수정 시작
  const handleEditQuestion = (question: Question) => {
    setEditingQuestionId(question.id);
    setEditQuestionText(question.content);
  };

  // 질문 수정 취소
  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setEditQuestionText("");
  };

  // 질문 수정 저장
  const handleUpdateQuestion = async () => {
    if (!editQuestionText.trim() || editingQuestionId === null) return;

    try {
      setUpdatingQuestion(true);
      const response = await updateQuestion(
        editingQuestionId,
        editQuestionText.trim()
      );

      if (response.status === "CREATED" || response.message?.includes("성공")) {
        // 질문 목록을 다시 불러오기
        const questionsResponse = await getQuestionsByPost(postId!);
        if (questionsResponse.data) {
          setQuestions(questionsResponse.data.content);
        }
        setEditingQuestionId(null);
        setEditQuestionText("");
      }
    } catch (err) {
      console.error("질문 수정 중 오류:", err);
      alert("질문 수정 중 오류가 발생했습니다.");
    } finally {
      setUpdatingQuestion(false);
    }
  };

  // 질문 삭제
  const handleDeleteQuestion = async (questionId: number) => {
    if (!window.confirm("정말로 이 질문을 삭제하시겠습니까?")) {
      return;
    }

    try {
      setDeletingQuestion(true);
      const response = await deleteQuestion(questionId);

      if (response.status === "CREATED" || response.message?.includes("성공")) {
        // 질문 목록을 다시 불러오기
        const questionsResponse = await getQuestionsByPost(postId!);
        if (questionsResponse.data) {
          setQuestions(questionsResponse.data.content);
        }
      }
    } catch (err) {
      console.error("질문 삭제 중 오류:", err);
      alert("질문 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeletingQuestion(false);
    }
  };

  // 질문 해결됨으로 변경
  const handleResolveQuestion = async (questionId: number) => {
    if (
      !window.confirm("이 질문이 해결되었습니까? 해결됨으로 표시하시겠습니까?")
    ) {
      return;
    }

    try {
      setResolvingQuestion(true);
      const response = await resolveQuestion(questionId);

      if (response.status === "CREATED" || response.message?.includes("성공")) {
        // 질문 목록을 다시 불러오기
        const questionsResponse = await getQuestionsByPost(postId!);
        if (questionsResponse.data) {
          setQuestions(questionsResponse.data.content);
        }
      }
    } catch (err) {
      console.error("질문 상태 변경 중 오류:", err);
      alert("질문 상태 변경 중 오류가 발생했습니다.");
    } finally {
      setResolvingQuestion(false);
    }
  };

  // 작성자 본인 여부 확인
  const isQuestionAuthor = (authorId: number) => {
    console.log("=== 질문 작성자 확인 ===");
    console.log("현재 사용자:", user);
    console.log("질문 작성자 ID:", authorId);
    console.log("사용자 ID:", user?.id);
    console.log("작성자 본인 여부:", user?.id === authorId);
    console.log("========================");

    // 사용자 정보가 없거나 질문 작성자 ID가 없으면 false
    if (!user || !user.id || !authorId) {
      console.log("사용자 정보 또는 작성자 ID가 없음");
      return false;
    }

    return user.id === authorId;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "WAITING":
        return "답변 대기";
      case "ANSWERED":
        return "답변 완료";
      case "RESOLVED":
        return "해결됨";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "WAITING":
        return "#f59e0b"; // 주황색
      case "ANSWERED":
        return "#10b981"; // 초록색
      case "RESOLVED":
        return "#3b82f6"; // 파란색
      default:
        return "#6b7280"; // 회색
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
            <SectionTitle>질문 & 답변 ({questions.length})</SectionTitle>

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
              {questions.length > 0 ? (
                questions.map((question) => (
                  <QuestionItem key={question.id}>
                    <QuestionHeader>
                      <div>
                        <QuestionAuthor>
                          {question.author?.name || "알 수 없는 사용자"}
                        </QuestionAuthor>
                        <QuestionDate>
                          {formatDate(question.createdAt)}
                        </QuestionDate>
                        <div
                          style={{
                            display: "inline-block",
                            background: getStatusColor(question.status),
                            color: "white",
                            borderRadius: "4px",
                            fontSize: "0.75em",
                            padding: "2px 8px",
                            marginLeft: "8px",
                            fontWeight: "500",
                          }}
                        >
                          {getStatusText(question.status)}
                        </div>
                      </div>
                      <QuestionActions>
                        {question.author?.id &&
                          isQuestionAuthor(question.author.id) && (
                            <div style={{ display: "flex", gap: "8px" }}>
                              {editingQuestionId === question.id ? (
                                <>
                                  <button
                                    onClick={handleUpdateQuestion}
                                    disabled={
                                      updatingQuestion ||
                                      !editQuestionText.trim()
                                    }
                                    style={{
                                      background: "#10b981",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "4px",
                                      padding: "4px 8px",
                                      cursor: "pointer",
                                      fontSize: "0.75rem",
                                      fontWeight: "500",
                                    }}
                                  >
                                    {updatingQuestion ? "저장 중..." : "저장"}
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    disabled={updatingQuestion}
                                    style={{
                                      background: "#6b7280",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "4px",
                                      padding: "4px 8px",
                                      cursor: "pointer",
                                      fontSize: "0.75rem",
                                      fontWeight: "500",
                                    }}
                                  >
                                    취소
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleEditQuestion(question)}
                                    style={{
                                      background: "#3b82f6",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "4px",
                                      padding: "4px 8px",
                                      cursor: "pointer",
                                      fontSize: "0.75rem",
                                      fontWeight: "500",
                                    }}
                                  >
                                    수정
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteQuestion(question.id)
                                    }
                                    disabled={deletingQuestion}
                                    style={{
                                      background: "#ef4444",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "4px",
                                      padding: "4px 8px",
                                      cursor: "pointer",
                                      fontSize: "0.75rem",
                                      fontWeight: "500",
                                    }}
                                  >
                                    {deletingQuestion ? "삭제 중..." : "삭제"}
                                  </button>
                                  {/* 질문 작성자만 해결됨 버튼 표시 */}
                                  {question.author?.id &&
                                  isQuestionAuthor(question.author.id) ? (
                                    <button
                                      onClick={() =>
                                        handleResolveQuestion(question.id)
                                      }
                                      disabled={resolvingQuestion}
                                      style={{
                                        background:
                                          question.status === "RESOLVED"
                                            ? "#10b981"
                                            : "#8b5cf6",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        padding: "4px 8px",
                                        cursor: "pointer",
                                        fontSize: "0.75rem",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {resolvingQuestion
                                        ? "처리 중..."
                                        : question.status === "RESOLVED"
                                        ? "해결됨"
                                        : "해결됨으로 표시"}
                                    </button>
                                  ) : (
                                    <VoteButton>👍 0</VoteButton>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                      </QuestionActions>
                    </QuestionHeader>
                    {editingQuestionId === question.id ? (
                      <div style={{ marginTop: "1rem" }}>
                        <textarea
                          value={editQuestionText}
                          onChange={(e) => setEditQuestionText(e.target.value)}
                          style={{
                            width: "100%",
                            minHeight: "80px",
                            padding: "12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            fontSize: "0.875rem",
                            resize: "vertical",
                          }}
                          placeholder="질문 내용을 수정하세요"
                        />
                      </div>
                    ) : (
                      <QuestionText>{question.content}</QuestionText>
                    )}

                    <AnswerList>
                      {question.answers && question.answers.length > 0 ? (
                        question.answers.map((answer) => (
                          <AnswerItem
                            key={answer.id}
                            $isBestAnswer={answer.isBestAnswer}
                          >
                            <AnswerHeader>
                              <div>
                                <AnswerAuthor>
                                  {answer.author?.name || "알 수 없는 사용자"}
                                </AnswerAuthor>
                                <AnswerDate>
                                  {formatDate(answer.createdAt)}
                                </AnswerDate>
                                {answer.isBestAnswer && (
                                  <BestAnswerBadge>베스트 답변</BestAnswerBadge>
                                )}
                              </div>
                              <AnswerActions>
                                <VoteButton>👍 0</VoteButton>
                              </AnswerActions>
                            </AnswerHeader>
                            <AnswerText>{answer.content}</AnswerText>
                          </AnswerItem>
                        ))
                      ) : (
                        <p
                          style={{
                            color: "#6b7280",
                            fontStyle: "italic",
                            margin: "1rem 0",
                          }}
                        >
                          아직 답변이 없습니다.
                        </p>
                      )}
                    </AnswerList>

                    {selectedQuestionId === question.id ? (
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
                      <button
                        onClick={() => setSelectedQuestionId(question.id)}
                        style={{
                          background: "#fdb924",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          padding: "8px 16px",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          marginTop: "1rem",
                        }}
                      >
                        답변 작성
                      </button>
                    )}
                  </QuestionItem>
                ))
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    color: "#6b7280",
                    padding: "2rem",
                  }}
                >
                  아직 질문이 없습니다. 첫 번째 질문을 작성해보세요!
                </p>
              )}
            </QuestionList>
          </QuestionSection>
        </ModalBody>
      </ModalPanel>
    </ModalOverlay>
  );
};

export default QuestionAnswerModal;
