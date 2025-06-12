import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import {
  ModalOverlay,
  ModalPanel,
  ModalHeader,
  HeaderLeft,
  ModalTitle,
  HeaderRight,
  CloseButton,
  ModalBody,
  Section,
  SectionTitle,
  QuestionSection,
  QuestionList,
  QuestionItem,
  QuestionHeader,
  QuestionAuthor,
  QuestionDate,
  QuestionText,
  QuestionActions,
  QuestionForm,
  QuestionTextArea,
  QuestionSubmitButton,
  AnswerForm,
  AnswerTextArea,
  AnswerSubmitButton,
  LoadingSpinner,
  ErrorMessage,
  ModalHeaderActionButton,
  ModalHeaderButtonGroup,
} from "@/features/board/components/Question/styles/QuestionAnswerModal.styled";
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

import { AnswerDetailModal } from "@/features/board/components/Answer";
import { useAuth } from "@/hooks/useAuth";

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

  // 답변 보기 모달 관련 상태
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [selectedQuestionForAnswer, setSelectedQuestionForAnswer] =
    useState<Question | null>(null);

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
        // 답변 등록 성공 시 현재 질문에는 표시하지 않고 답변 보기 모달에서만 확인
        setAnswerText("");
        setSelectedQuestionId(null);

        // 답변 등록 성공 메시지
        alert("답변이 성공적으로 등록되었습니다! 답변 보기에서 확인하세요.");
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

  // 질문 해결됨으로 변경 (토글 방식)
  const handleResolveQuestion = async (questionId: number) => {
    // 현재 질문의 상태를 확인
    const currentQuestion = questions.find((q) => q.id === questionId);
    if (!currentQuestion) return;

    const isCurrentlyResolved = currentQuestion.status === "RESOLVED";
    const actionText = isCurrentlyResolved
      ? "해결됨 상태를 해제"
      : "해결됨으로 표시";

    if (!window.confirm(`이 질문을 ${actionText}하시겠습니까?`)) {
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

  // 게시글 상태 한글 변환 및 색상 함수 추가
  const getPostStatusText = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "승인";
      case "PENDING":
        return "대기";
      case "REJECTED":
        return "반려";
      default:
        return status;
    }
  };
  const getPostStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "#10b981"; // 초록
      case "PENDING":
        return "#f59e0b"; // 주황
      case "REJECTED":
        return "#ef4444"; // 빨강
      default:
        return "#6b7280"; // 회색
    }
  };

  // 답변 보기 모달 열기
  const handleOpenAnswerModal = (question: Question) => {
    setSelectedQuestionForAnswer(question);
    setShowAnswerModal(true);
  };

  // 답변 보기 모달 닫기
  const handleCloseAnswerModal = () => {
    setShowAnswerModal(false);
    setSelectedQuestionForAnswer(null);
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
              <ModalTitle>질문 & 답변</ModalTitle>
            </HeaderLeft>
            <HeaderRight>
              <CloseButton onClick={onClose}>&times;</CloseButton>
            </HeaderRight>
          </ModalHeader>
          <ModalBody>
            {/* 게시글 정보 */}
            <Section style={{ marginBottom: 24 }}>
              <span
                style={{ fontWeight: 600, color: "#6b7280", marginBottom: 4 }}
              >
                제목
              </span>
              <span
                style={{
                  fontSize: 16,
                  color: "#222",
                  marginBottom: 8,
                  marginLeft: 14,
                }}
              >
                {post.title}
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <span style={{ fontWeight: 600, color: "#6b7280" }}>상태</span>
                <span
                  style={{
                    background: getPostStatusColor(post.status),
                    color: "white",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 13,
                    padding: "2px 12px",
                    marginLeft: 0,
                  }}
                >
                  {getPostStatusText(post.status)}
                </span>
                <span
                  style={{ color: "#b0b0b0", fontSize: 13, marginLeft: 10 }}
                >
                  {formatDate(post.createdAt)}
                </span>
              </div>
              <div
                style={{ fontWeight: 600, color: "#6b7280", marginBottom: 4 }}
              >
                내용
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: "#444",
                  lineHeight: 1.7,
                  background: "#f8f9fa",
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                {post.content}
              </div>
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
                            {question.author?.name}
                            <span
                              style={{
                                fontSize: 11,
                                color: "#b0b0b0",
                                marginLeft: 6,
                                fontWeight: 400,
                              }}
                            >
                              {question.authorIp}
                            </span>
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
                              <ModalHeaderButtonGroup>
                                {editingQuestionId === question.id ? (
                                  <>
                                    <ModalHeaderActionButton
                                      onClick={handleUpdateQuestion}
                                      disabled={
                                        updatingQuestion ||
                                        !editQuestionText.trim()
                                      }
                                    >
                                      {updatingQuestion ? "저장 중..." : "저장"}
                                    </ModalHeaderActionButton>
                                    <ModalHeaderActionButton
                                      onClick={handleCancelEdit}
                                      disabled={updatingQuestion}
                                    >
                                      취소
                                    </ModalHeaderActionButton>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleEditQuestion(question)
                                      }
                                      style={{
                                        background: "none",
                                        color: "#6366f1",
                                        border: "none",
                                        borderRadius: "5px",
                                        padding: "0 10px",
                                        fontSize: "0.95rem",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        height: "28px",
                                        minWidth: "0",
                                        boxShadow: "none",
                                        whiteSpace: "nowrap",
                                        transition:
                                          "background 0.15s, color 0.15s",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                      onMouseOver={(e) => {
                                        e.currentTarget.style.background =
                                          "#f3f4f6";
                                      }}
                                      onMouseOut={(e) => {
                                        e.currentTarget.style.background =
                                          "none";
                                      }}
                                    >
                                      <FaEdit
                                        style={{ marginRight: "0.25rem" }}
                                      />
                                      수정
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleResolveQuestion(question.id)
                                      }
                                      disabled={resolvingQuestion}
                                      style={{
                                        background: "none",
                                        color:
                                          question.status === "RESOLVED"
                                            ? "#6366f1"
                                            : "#6366f1",
                                        border: "none",
                                        borderRadius: "5px",
                                        padding: "0 10px",
                                        fontSize: "0.95rem",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        height: "28px",
                                        minWidth: "0",
                                        boxShadow: "none",
                                        whiteSpace: "nowrap",
                                        transition:
                                          "background 0.15s, color 0.15s",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                      onMouseOver={(e) => {
                                        e.currentTarget.style.background =
                                          "#f3f4f6";
                                      }}
                                      onMouseOut={(e) => {
                                        e.currentTarget.style.background =
                                          "none";
                                      }}
                                    >
                                      {resolvingQuestion ? (
                                        "처리 중..."
                                      ) : question.status === "RESOLVED" ? (
                                        <>
                                          <FaTimes
                                            style={{ marginRight: "0.25rem" }}
                                          />
                                          해결
                                        </>
                                      ) : (
                                        <>
                                          <FaCheck
                                            style={{ marginRight: "0.25rem" }}
                                          />
                                          해결
                                        </>
                                      )}
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteQuestion(question.id)
                                      }
                                      disabled={deletingQuestion}
                                      style={{
                                        background: "none",
                                        color: "#ef4444",
                                        border: "none",
                                        borderRadius: "5px",
                                        padding: "0 10px",
                                        fontSize: "0.95rem",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        height: "28px",
                                        minWidth: "0",
                                        boxShadow: "none",
                                        whiteSpace: "nowrap",
                                        transition:
                                          "background 0.15s, color 0.15s",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                      onMouseOver={(e) => {
                                        e.currentTarget.style.background =
                                          "#f3f4f6";
                                      }}
                                      onMouseOut={(e) => {
                                        e.currentTarget.style.background =
                                          "none";
                                      }}
                                    >
                                      <FaTrash
                                        style={{ marginRight: "0.25rem" }}
                                      />
                                      {deletingQuestion ? "삭제 중..." : "삭제"}
                                    </button>
                                  </>
                                )}
                              </ModalHeaderButtonGroup>
                            )}
                        </QuestionActions>
                      </QuestionHeader>
                      {editingQuestionId === question.id ? (
                        <div style={{ marginTop: "1rem" }}>
                          <textarea
                            value={editQuestionText}
                            onChange={(e) =>
                              setEditQuestionText(e.target.value)
                            }
                            style={{
                              width: "100%",
                              minHeight: "80px",
                              padding: "12px",
                              border: "1px solid #d1d5db",
                              borderRadius: "4px",
                              fontSize: "0.875rem",
                              resize: "vertical",
                              backgroundColor: "#ffffff",
                              color: "#333333",
                            }}
                            placeholder="질문 내용을 수정하세요"
                          />
                        </div>
                      ) : (
                        <QuestionText>{question.content}</QuestionText>
                      )}

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
                          <button
                            onClick={() => {
                              setSelectedQuestionId(null);
                              setAnswerText("");
                            }}
                            style={{
                              position: "absolute",
                              bottom: "0.75rem",
                              right: "5.5rem",
                              background: "#6b7280",
                              color: "white",
                              border: "none",
                              borderRadius: "0.375rem",
                              padding: "0.375rem 0.75rem",
                              fontSize: "0.75rem",
                              fontWeight: "500",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = "#4b5563";
                              e.currentTarget.style.transform =
                                "translateY(-1px)";
                              e.currentTarget.style.boxShadow =
                                "0 2px 6px rgba(0, 0, 0, 0.15)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = "#6b7280";
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow =
                                "0 1px 3px rgba(0, 0, 0, 0.1)";
                            }}
                            disabled={submittingAnswer}
                          >
                            취소
                          </button>
                        </AnswerForm>
                      ) : editingQuestionId !== question.id ? (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "1rem",
                            right: "1rem",
                          }}
                        >
                          <button
                            onClick={() => handleOpenAnswerModal(question)}
                            style={{
                              background: "#fdb924",
                              color: "white",
                              border: "none",
                              borderRadius: "0.5rem",
                              padding: "0.5rem 1rem",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              fontWeight: "500",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              transition: "all 0.2s ease",
                              boxShadow: "0 2px 4px rgba(253, 185, 36, 0.2)",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = "#f59e0b";
                              e.currentTarget.style.transform =
                                "translateY(-1px)";
                              e.currentTarget.style.boxShadow =
                                "0 4px 8px rgba(253, 185, 36, 0.3)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = "#fdb924";
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow =
                                "0 2px 4px rgba(253, 185, 36, 0.2)";
                            }}
                          >
                            답변 보기
                          </button>
                        </div>
                      ) : null}
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

      {/* 답변 보기 모달 */}
      {showAnswerModal && selectedQuestionForAnswer && (
        <AnswerDetailModal
          open={showAnswerModal}
          onClose={handleCloseAnswerModal}
          questionId={selectedQuestionForAnswer.id}
          questionTitle={selectedQuestionForAnswer.content}
          onAnswerCreated={async () => {
            // 답변 생성 후 질문 목록을 새로고침하여 상태와 답변 수 업데이트
            if (postId) {
              try {
                const questionsResponse = await getQuestionsByPost(postId);
                if (questionsResponse.data) {
                  setQuestions(questionsResponse.data.content);
                }
              } catch (err) {
                console.error("질문 목록 새로고침 중 오류:", err);
              }
            }
          }}
        />
      )}
    </>
  );
};

export default QuestionAnswerModal;
