import React, { useState } from "react";
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import {
  QuestionItem as StyledQuestionItem,
  QuestionHeader,
  QuestionAuthor,
  QuestionDate,
  QuestionText,
  QuestionActions,
  AnswerForm,
  AnswerTextArea,
  AnswerSubmitButton,
  ModalHeaderActionButton,
  ModalHeaderButtonGroup,
} from "@/features/board/components/Question/styles/QuestionAnswerModal.styled";
import {
  createAnswer,
  updateQuestion,
  deleteQuestion,
  resolveQuestion,
} from "@/features/project-d/services/questionService";
import type { Question } from "@/features/project-d/types/question";
import { useAuth } from "@/hooks/useAuth";
import ClickableUsername from "@/components/ClickableUsername";

interface QuestionItemProps {
  question: Question;
  onQuestionUpdated: () => void;
  onOpenAnswerModal: (question: Question) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  onQuestionUpdated,
  onOpenAnswerModal,
}) => {
  const { user } = useAuth();
  const [answerText, setAnswerText] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null
  );
  const [editQuestionText, setEditQuestionText] = useState("");
  const [updatingQuestion, setUpdatingQuestion] = useState(false);
  const [deletingQuestion, setDeletingQuestion] = useState(false);
  const [resolvingQuestion, setResolvingQuestion] = useState(false);

  const handleAnswerSubmit = async () => {
    if (!answerText.trim() || !selectedQuestionId) return;

    try {
      setSubmittingAnswer(true);
      const response = await createAnswer({
        questionId: selectedQuestionId,
        content: answerText.trim(),
      });

      if (response.data) {
        setAnswerText("");
        setSelectedQuestionId(null);
        alert("답변이 성공적으로 등록되었습니다! 답변 보기에서 확인하세요.");
      }
    } catch (err) {
      console.error("답변 작성 중 오류:", err);
      alert("답변 작성 중 오류가 발생했습니다.");
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestionId(question.id);
    setEditQuestionText(question.content);
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setEditQuestionText("");
  };

  const handleUpdateQuestion = async () => {
    if (!editQuestionText.trim() || !editingQuestionId) return;

    try {
      setUpdatingQuestion(true);
      const response = await updateQuestion(editingQuestionId, {
        content: editQuestionText.trim(),
      });

      if (response.data) {
        setEditingQuestionId(null);
        setEditQuestionText("");
        onQuestionUpdated();
      }
    } catch (err) {
      console.error("질문 수정 중 오류:", err);
      alert("질문 수정 중 오류가 발생했습니다.");
    } finally {
      setUpdatingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!window.confirm("정말로 이 질문을 삭제하시겠습니까?")) {
      return;
    }

    try {
      setDeletingQuestion(true);
      const response = await deleteQuestion(questionId);

      if (response.data) {
        onQuestionUpdated();
      }
    } catch (err) {
      console.error("질문 삭제 중 오류:", err);
      alert("질문 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeletingQuestion(false);
    }
  };

  const handleResolveQuestion = async (questionId: number) => {
    try {
      setResolvingQuestion(true);
      const response = await resolveQuestion(questionId);

      if (response.data) {
        onQuestionUpdated();
      }
    } catch (err) {
      console.error("질문 해결 처리 중 오류:", err);
      alert("질문 해결 처리 중 오류가 발생했습니다.");
    } finally {
      setResolvingQuestion(false);
    }
  };

  const isQuestionAuthor = (authorId: number) => {
    return user?.id === authorId;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "대기";
      case "RESOLVED":
        return "해결";
      case "CLOSED":
        return "종료";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "#10b981";
      case "PENDING":
        return "#f59e0b";
      case "CLOSED":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return kstDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <StyledQuestionItem>
      <QuestionHeader>
        <div>
          <QuestionAuthor>
            <ClickableUsername
              username={
                question.authorName || question.author?.name || "undefined"
              }
              userId={question.author?.id || question.authorId}
              onClick={() => {}} // 질문에서는 프로필 클릭 기능 없음
              style={{ color: "#111827" }}
            />
            {question.authorUsername && (
              <span
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                  marginLeft: 1,
                  fontWeight: 400,
                }}
              >
                ({question.authorUsername})
              </span>
            )}
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
          <QuestionDate>{formatDate(question.createdAt)}</QuestionDate>
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
          {question.author?.id && isQuestionAuthor(question.author.id) && (
            <ModalHeaderButtonGroup>
              {editingQuestionId === question.id ? (
                <>
                  <ModalHeaderActionButton
                    onClick={handleUpdateQuestion}
                    disabled={updatingQuestion || !editQuestionText.trim()}
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
                    onClick={() => handleEditQuestion(question)}
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
                      transition: "background 0.15s, color 0.15s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#f3f4f6";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "none";
                    }}
                  >
                    <FaEdit style={{ marginRight: "0.25rem" }} />
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
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
                      transition: "background 0.15s, color 0.15s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#f3f4f6";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "none";
                    }}
                  >
                    <FaTrash style={{ marginRight: "0.25rem" }} />
                    삭제
                  </button>
                </>
              )}
            </ModalHeaderButtonGroup>
          )}
          {question.status === "PENDING" && (
            <button
              onClick={() => handleResolveQuestion(question.id)}
              disabled={resolvingQuestion}
              style={{
                background: "none",
                color: "#10b981",
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
                transition: "background 0.15s, color 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#f3f4f6";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "none";
              }}
            >
              <FaCheck style={{ marginRight: "0.25rem" }} />
              해결
            </button>
          )}
          <button
            onClick={() => onOpenAnswerModal(question)}
            style={{
              background: "none",
              color: "#f59e0b",
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
              transition: "background 0.15s, color 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#f3f4f6";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "none";
            }}
          >
            답변 보기
          </button>
        </QuestionActions>
      </QuestionHeader>
      <QuestionText>
        {editingQuestionId === question.id ? (
          <div style={{ marginTop: 8 }}>
            <textarea
              value={editQuestionText}
              onChange={(e) => setEditQuestionText(e.target.value)}
              autoFocus
              rows={3}
              style={{
                width: "100%",
                border: "1.5px solid #fdb924",
                borderRadius: "0.375rem",
                background: "#fffdfa",
                color: "#222",
                fontSize: "0.95em",
                padding: "0.75rem",
                resize: "vertical",
              }}
            />
          </div>
        ) : (
          question.content
        )}
      </QuestionText>
      {selectedQuestionId === question.id && (
        <AnswerForm>
          <AnswerTextArea
            placeholder="답변을 입력하세요"
            value={answerText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setAnswerText(e.target.value)
            }
            disabled={submittingAnswer}
          />
          <AnswerSubmitButton
            onClick={handleAnswerSubmit}
            disabled={!answerText.trim() || submittingAnswer}
          >
            {submittingAnswer ? "답변 등록 중..." : "답변 등록"}
          </AnswerSubmitButton>
        </AnswerForm>
      )}
    </StyledQuestionItem>
  );
};

export default QuestionItem;
