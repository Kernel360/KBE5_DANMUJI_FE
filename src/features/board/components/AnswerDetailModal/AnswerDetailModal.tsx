import React, { useState, useEffect } from "react";
import { FaUser, FaComment, FaEdit, FaTrash, FaReply } from "react-icons/fa";
import {
  ModalOverlay,
  ModalPanel,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  AnswerList,
  AnswerItem,
  AnswerHeader,
  AnswerAuthor,
  AnswerDate,
  AnswerText,
  BestAnswerBadge,
  AnswerForm,
  AnswerTextArea,
  AnswerSubmitButton,
} from "./AnswerDetailModal.styled";
import {
  getAnswersByQuestion,
  createAnswer,
  markQuestionAsAnswered,
  updateAnswer,
  deleteAnswer,
} from "@/features/project/services/questionService";
import type { Answer } from "@/features/project/types/question";
import { useAuth } from "@/contexts/AuthContexts";

interface AnswerDetailModalProps {
  open: boolean;
  onClose: () => void;
  questionId: number;
  questionTitle: string;
  onAnswerCreated?: () => void;
}

const AnswerDetailModal: React.FC<AnswerDetailModalProps> = ({
  open,
  onClose,
  questionId,
  questionTitle,
  onAnswerCreated,
}) => {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [replyingToAnswerId, setReplyingToAnswerId] = useState<number | null>(
    null
  );
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);
  const [editAnswerText, setEditAnswerText] = useState("");
  const [updatingAnswer, setUpdatingAnswer] = useState(false);
  const [deletingAnswer, setDeletingAnswer] = useState(false);

  // 답변 목록 조회
  const fetchAnswers = async () => {
    if (!questionId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await getAnswersByQuestion(questionId);
      if (response.data) {
        setAnswers(response.data);
      }
    } catch (err) {
      console.error(`질문 ${questionId} 답변 조회 중 오류:`, err);
      setError("답변 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && questionId) {
      fetchAnswers();
    } else if (!open) {
      setAnswers([]);
      setError(null);
      setAnswerText("");
    }
  }, [open, questionId]);

  // 답변 작성 핸들러
  const handleAnswerSubmit = async () => {
    if (!answerText.trim() || !questionId) return;

    try {
      setSubmittingAnswer(true);
      const response = await createAnswer({
        questionId,
        parentId: null,
        content: answerText.trim(),
      });

      if (response.status === "CREATED" || response.message?.includes("성공")) {
        // 답변 생성 성공
        console.log("답변 생성 성공:", response);

        // 답변 입력 초기화
        setAnswerText("");

        // 답변 목록 새로고침
        await fetchAnswers();

        // 질문 상태를 "답변 완료"로 변경
        await markQuestionAsAnswered(questionId);

        // 부모 컴포넌트에 답변 생성 알림
        if (onAnswerCreated) {
          onAnswerCreated();
        }
      }
    } catch (err) {
      console.error("답변 작성 중 오류:", err);
      alert("답변 작성 중 오류가 발생했습니다.");
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // 답변에 대한 답변 작성 핸들러
  const handleReplySubmit = async (parentAnswerId: number) => {
    if (!replyText.trim() || !questionId) return;

    try {
      setSubmittingReply(true);
      const response = await createAnswer({
        questionId,
        parentId: parentAnswerId,
        content: replyText.trim(),
      });

      if (response.status === "CREATED" || response.message?.includes("성공")) {
        // 답변 생성 성공
        console.log("답변에 대한 답변 생성 성공:", response);

        // 답변 입력 초기화
        setReplyText("");
        setReplyingToAnswerId(null);

        // 답변 목록 새로고침
        await fetchAnswers();

        // 부모 컴포넌트에 답변 생성 알림
        if (onAnswerCreated) {
          onAnswerCreated();
        }
      }
    } catch (err) {
      console.error("답변에 대한 답변 작성 중 오류:", err);
      alert("답변에 대한 답변 작성 중 오류가 발생했습니다.");
    } finally {
      setSubmittingReply(false);
    }
  };

  // 답변 수정 시작
  const handleEditAnswer = (answer: Answer) => {
    setEditingAnswerId(answer.id);
    setEditAnswerText(answer.content);
  };

  // 답변 수정 취소
  const handleCancelEditAnswer = () => {
    setEditingAnswerId(null);
    setEditAnswerText("");
  };

  // 답변 수정 제출
  const handleUpdateAnswer = async (answerId: number) => {
    if (!editAnswerText.trim()) return;

    try {
      setUpdatingAnswer(true);
      const response = await updateAnswer(answerId, editAnswerText.trim());

      if (response.status === "OK" || response.message?.includes("완료")) {
        // 답변 목록 새로고침
        await fetchAnswers();

        // 수정 모드 종료
        setEditingAnswerId(null);
        setEditAnswerText("");
      }
    } catch (err) {
      console.error("답변 수정 중 오류:", err);
      alert("답변 수정 중 오류가 발생했습니다.");
    } finally {
      setUpdatingAnswer(false);
    }
  };

  // 답변 삭제
  const handleDeleteAnswer = async (answerId: number) => {
    if (!confirm("정말로 이 답변을 삭제하시겠습니까?")) return;

    try {
      setDeletingAnswer(true);
      const response = await deleteAnswer(answerId);

      if (response.status === "OK" || response.message?.includes("완료")) {
        // 답변 목록 새로고침
        await fetchAnswers();

        // 부모 컴포넌트에 답변 삭제 알림
        if (onAnswerCreated) {
          onAnswerCreated();
        }
      }
    } catch (err) {
      console.error("답변 삭제 중 오류:", err);
      alert("답변 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeletingAnswer(false);
    }
  };

  // 답변 작성자 확인
  const isAnswerAuthor = (authorId: number) => {
    return user?.id === authorId;
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("ko-KR", options);
  };

  if (!open) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalPanel onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>답변 목록</ModalTitle>
          <ModalCloseButton onClick={onClose}>&times;</ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <div style={{ marginBottom: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              질문: {questionTitle}
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                margin: 0,
              }}
            >
              총 {answers.length}개의 답변
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              답변을 불러오는 중...
            </div>
          ) : error ? (
            <div
              style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}
            >
              {error}
            </div>
          ) : answers.length > 0 ? (
            <AnswerList>
              {answers
                .filter((answer) => !answer.parentId) // 부모 답변만 필터링
                .map((parentAnswer) => (
                  <div key={parentAnswer.id}>
                    <AnswerItem
                      $isBestAnswer={parentAnswer.isBestAnswer}
                      style={{
                        background: "#ffffff",
                        borderRadius: "0.5rem",
                        padding: "1rem",
                        border: "1px solid #e5e7eb",
                        marginBottom: "1rem",
                      }}
                    >
                      <AnswerHeader>
                        <div>
                          <AnswerAuthor
                            style={{
                              color: "#374151",
                              fontWeight: "600",
                              fontSize: "0.875rem",
                            }}
                          >
                            <FaUser style={{ marginRight: "0.5rem" }} />
                            {parentAnswer.author?.name || "알 수 없는 사용자"}
                          </AnswerAuthor>
                          <AnswerDate style={{ color: "#6b7280" }}>
                            {formatDate(parentAnswer.createdAt)}
                          </AnswerDate>
                          {parentAnswer.isBestAnswer && (
                            <BestAnswerBadge>베스트 답변</BestAnswerBadge>
                          )}
                        </div>
                        {/* 답변 작성자만 수정/삭제 버튼 표시 */}
                        {isAnswerAuthor(parentAnswer.author?.id || 0) && (
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              onClick={() => handleEditAnswer(parentAnswer)}
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
                              onClick={() =>
                                handleDeleteAnswer(parentAnswer.id)
                              }
                              disabled={deletingAnswer}
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
                              {deletingAnswer ? "삭제 중..." : "삭제"}
                            </button>
                          </div>
                        )}
                      </AnswerHeader>
                      <AnswerText
                        style={{
                          color: "#374151",
                          lineHeight: "1.6",
                          fontSize: "0.875rem",
                          marginTop: "0.75rem",
                        }}
                      >
                        {editingAnswerId === parentAnswer.id ? (
                          <div style={{ marginTop: "0.75rem" }}>
                            <textarea
                              value={editAnswerText}
                              onChange={(e) =>
                                setEditAnswerText(e.target.value)
                              }
                              style={{
                                width: "100%",
                                minHeight: "80px",
                                padding: "0.75rem",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.375rem",
                                fontSize: "0.875rem",
                                resize: "vertical",
                                backgroundColor: "#ffffff",
                                color: "#374151",
                              }}
                              placeholder="답변 내용을 수정하세요"
                            />
                            <div
                              style={{
                                display: "flex",
                                gap: "0.5rem",
                                marginTop: "0.75rem",
                              }}
                            >
                              <button
                                onClick={() =>
                                  handleUpdateAnswer(parentAnswer.id)
                                }
                                disabled={
                                  !editAnswerText.trim() || updatingAnswer
                                }
                                style={{
                                  background: "#fdb924",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "0.375rem",
                                  padding: "0.5rem 1rem",
                                  fontSize: "0.875rem",
                                  fontWeight: "500",
                                  cursor: "pointer",
                                  transition: "background-color 0.2s ease",
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.background = "#f59e0b";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.background = "#fdb924";
                                }}
                              >
                                {updatingAnswer ? "수정 중..." : "수정 완료"}
                              </button>
                              <button
                                onClick={handleCancelEditAnswer}
                                disabled={updatingAnswer}
                                style={{
                                  background: "#6b7280",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "0.375rem",
                                  padding: "0.5rem 1rem",
                                  fontSize: "0.875rem",
                                  fontWeight: "500",
                                  cursor: "pointer",
                                  transition: "background-color 0.2s ease",
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.background = "#4b5563";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.background = "#6b7280";
                                }}
                              >
                                취소
                              </button>
                            </div>
                          </div>
                        ) : (
                          parentAnswer.content
                        )}
                      </AnswerText>

                      {/* 답변에 대한 답변 작성 버튼 */}
                      <div
                        style={{
                          marginTop: "0.75rem",
                          display: "flex",
                          gap: "0.5rem",
                        }}
                      >
                        <button
                          onClick={() =>
                            setReplyingToAnswerId(
                              replyingToAnswerId === parentAnswer.id
                                ? null
                                : parentAnswer.id
                            )
                          }
                          style={{
                            background:
                              replyingToAnswerId === parentAnswer.id
                                ? "#f3f4f6"
                                : "none",
                            color: "#6366f1",
                            border: "1px solid #d1d5db",
                            borderRadius: "0.375rem",
                            padding: "0.5rem 1rem",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = "#f3f4f6";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background =
                              replyingToAnswerId === parentAnswer.id
                                ? "#f3f4f6"
                                : "none";
                          }}
                        >
                          <FaReply style={{ marginRight: "0.5rem" }} />
                          {replyingToAnswerId === parentAnswer.id
                            ? "취소"
                            : "댓글"}
                        </button>
                      </div>

                      {/* 답변에 대한 답변 작성 폼 */}
                      {replyingToAnswerId === parentAnswer.id && (
                        <div
                          style={{
                            marginTop: "0.75rem",
                            padding: "1rem",
                            background: "#f9fafb",
                            borderRadius: "0.5rem",
                            border: "1px solid #e5e7eb",
                          }}
                        >
                          <div
                            style={{
                              marginBottom: "0.75rem",
                              fontSize: "0.875rem",
                              fontWeight: "600",
                              color: "#374151",
                            }}
                          >
                            댓글 작성
                          </div>
                          <AnswerForm>
                            <AnswerTextArea
                              placeholder="댓글을 입력하세요..."
                              value={replyText}
                              onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                              ) => setReplyText(e.target.value)}
                              disabled={submittingReply}
                              style={{
                                minHeight: "80px",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.375rem",
                                backgroundColor: "#ffffff",
                              }}
                            />
                            <div
                              style={{
                                display: "flex",
                                gap: "0.5rem",
                                marginTop: "0.75rem",
                              }}
                            >
                              <AnswerSubmitButton
                                onClick={() =>
                                  handleReplySubmit(parentAnswer.id)
                                }
                                disabled={!replyText.trim() || submittingReply}
                                style={{
                                  flex: 1,
                                  background: "#fdb924",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "0.375rem",
                                  padding: "0.75rem 1rem",
                                  fontSize: "0.875rem",
                                  fontWeight: "500",
                                  cursor: "pointer",
                                  transition: "background-color 0.2s ease",
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.background = "#f59e0b";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.background = "#fdb924";
                                }}
                              >
                                {submittingReply
                                  ? "댓글 등록 중..."
                                  : "댓글 등록"}
                              </AnswerSubmitButton>
                              <button
                                onClick={() => {
                                  setReplyingToAnswerId(null);
                                  setReplyText("");
                                }}
                                style={{
                                  background: "#6b7280",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "0.375rem",
                                  padding: "0.75rem 1rem",
                                  fontSize: "0.875rem",
                                  fontWeight: "500",
                                  cursor: "pointer",
                                  transition: "background-color 0.2s ease",
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.background = "#4b5563";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.background = "#6b7280";
                                }}
                                disabled={submittingReply}
                              >
                                취소
                              </button>
                            </div>
                          </AnswerForm>
                        </div>
                      )}
                    </AnswerItem>

                    {/* 자식 답변들 표시 */}
                    {answers
                      .filter(
                        (childAnswer) =>
                          childAnswer.parentId === parentAnswer.id
                      )
                      .map((childAnswer) => (
                        <AnswerItem
                          key={childAnswer.id}
                          $isBestAnswer={childAnswer.isBestAnswer}
                          style={{
                            marginLeft: "2rem",
                            marginTop: "0.75rem",
                            borderLeft: "3px solid #e5e7eb",
                            paddingLeft: "1rem",
                            background: "#f9fafb",
                            borderRadius: "0.375rem",
                            padding: "0.75rem",
                          }}
                        >
                          <AnswerHeader>
                            <div>
                              <AnswerAuthor
                                style={{
                                  color: "#374151",
                                  fontWeight: "600",
                                  fontSize: "0.875rem",
                                }}
                              >
                                <FaComment style={{ marginRight: "0.5rem" }} />
                                {childAnswer.author?.name ||
                                  "알 수 없는 사용자"}
                              </AnswerAuthor>
                              <AnswerDate style={{ color: "#6b7280" }}>
                                {formatDate(childAnswer.createdAt)}
                              </AnswerDate>
                              {childAnswer.isBestAnswer && (
                                <BestAnswerBadge>베스트 답변</BestAnswerBadge>
                              )}
                            </div>
                            {/* 댓글 작성자만 수정/삭제 버튼 표시 */}
                            {isAnswerAuthor(childAnswer.author?.id || 0) && (
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button
                                  onClick={() => handleEditAnswer(childAnswer)}
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
                                    e.currentTarget.style.background =
                                      "#f3f4f6";
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.background = "none";
                                  }}
                                >
                                  <FaEdit style={{ marginRight: "0.25rem" }} />
                                  수정
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteAnswer(childAnswer.id)
                                  }
                                  disabled={deletingAnswer}
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
                                    e.currentTarget.style.background =
                                      "#f3f4f6";
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.background = "none";
                                  }}
                                >
                                  <FaTrash style={{ marginRight: "0.25rem" }} />
                                  {deletingAnswer ? "삭제 중..." : "삭제"}
                                </button>
                              </div>
                            )}
                          </AnswerHeader>
                          <AnswerText
                            style={{
                              color: "#374151",
                              lineHeight: "1.5",
                              fontSize: "0.875rem",
                            }}
                          >
                            {editingAnswerId === childAnswer.id ? (
                              <div style={{ marginTop: "0.75rem" }}>
                                <textarea
                                  value={editAnswerText}
                                  onChange={(e) =>
                                    setEditAnswerText(e.target.value)
                                  }
                                  style={{
                                    width: "100%",
                                    minHeight: "60px",
                                    padding: "0.5rem",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "0.375rem",
                                    fontSize: "0.875rem",
                                    resize: "vertical",
                                    backgroundColor: "#ffffff",
                                    color: "#374151",
                                  }}
                                  placeholder="댓글 내용을 수정하세요"
                                />
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "0.5rem",
                                    marginTop: "0.5rem",
                                  }}
                                >
                                  <button
                                    onClick={() =>
                                      handleUpdateAnswer(childAnswer.id)
                                    }
                                    disabled={
                                      !editAnswerText.trim() || updatingAnswer
                                    }
                                    style={{
                                      background: "#fdb924",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "0.375rem",
                                      padding: "0.375rem 0.75rem",
                                      fontSize: "0.75rem",
                                      fontWeight: "500",
                                      cursor: "pointer",
                                      transition: "background-color 0.2s ease",
                                    }}
                                    onMouseOver={(e) => {
                                      e.currentTarget.style.background =
                                        "#f59e0b";
                                    }}
                                    onMouseOut={(e) => {
                                      e.currentTarget.style.background =
                                        "#fdb924";
                                    }}
                                  >
                                    {updatingAnswer
                                      ? "수정 중..."
                                      : "수정 완료"}
                                  </button>
                                  <button
                                    onClick={handleCancelEditAnswer}
                                    disabled={updatingAnswer}
                                    style={{
                                      background: "#6b7280",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "0.375rem",
                                      padding: "0.375rem 0.75rem",
                                      fontSize: "0.75rem",
                                      fontWeight: "500",
                                      cursor: "pointer",
                                      transition: "background-color 0.2s ease",
                                    }}
                                    onMouseOver={(e) => {
                                      e.currentTarget.style.background =
                                        "#4b5563";
                                    }}
                                    onMouseOut={(e) => {
                                      e.currentTarget.style.background =
                                        "#6b7280";
                                    }}
                                  >
                                    취소
                                  </button>
                                </div>
                              </div>
                            ) : (
                              childAnswer.content
                            )}
                          </AnswerText>
                        </AnswerItem>
                      ))}
                  </div>
                ))}
            </AnswerList>
          ) : (
            <div
              style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}
            >
              아직 답변이 없습니다.
            </div>
          )}

          {/* 답변 작성 폼 */}
          <div
            style={{
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid #e5e7eb",
              background: "#f9fafb",
              borderRadius: "0.5rem",
              padding: "1.5rem",
            }}
          >
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                marginBottom: "1rem",
                color: "#374151",
              }}
            >
              답변 작성
            </h4>
            <AnswerForm>
              <AnswerTextArea
                placeholder="답변을 입력하세요..."
                value={answerText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setAnswerText(e.target.value)
                }
                disabled={submittingAnswer}
                style={{
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  backgroundColor: "#ffffff",
                }}
              />
              <AnswerSubmitButton
                onClick={handleAnswerSubmit}
                disabled={!answerText.trim() || submittingAnswer}
                style={{
                  background: "#fdb924",
                  color: "white",
                  border: "none",
                  borderRadius: "0.375rem",
                  padding: "0.75rem 1.25rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  height: "fit-content",
                  whiteSpace: "nowrap",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#f59e0b";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#fdb924";
                }}
              >
                {submittingAnswer ? "답변 등록 중..." : "답변 등록"}
              </AnswerSubmitButton>
            </AnswerForm>
          </div>
        </ModalBody>
      </ModalPanel>
    </ModalOverlay>
  );
};

export default AnswerDetailModal;
