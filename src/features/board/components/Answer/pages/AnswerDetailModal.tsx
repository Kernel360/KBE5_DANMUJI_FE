import React, { useState, useEffect, useCallback } from "react";
import { FaUser, FaEdit, FaTrash } from "react-icons/fa";
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
} from "../styles/AnswerDetailModal.styled";
import {
  getAnswersByQuestion,
  createAnswer,
  markQuestionAsAnswered,
  updateAnswer,
  deleteAnswer,
} from "@/features/project-d/services/questionService";
import type { Answer } from "@/features/project-d/types/question";
import { useAuth } from "@/hooks/useAuth";
import MentionTextArea from "@/components/MentionTextArea";
import ClickableMentionedUsername from "@/components/ClickableMentionedUsername";
import ClickableUsername from "@/components/ClickableUsername";
import { formatDetailedDateTime } from "@/utils/dateUtils";

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
  const fetchAnswers = useCallback(async () => {
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
  }, [questionId]);

  useEffect(() => {
    if (open && questionId) {
      fetchAnswers();
    } else if (!open) {
      setAnswers([]);
      setError(null);
      setAnswerText("");
    }
  }, [open, questionId, fetchAnswers]);

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
        // 답변 입력 초기화
        setAnswerText("");
        await fetchAnswers();
        await markQuestionAsAnswered(questionId);
        if (onAnswerCreated) onAnswerCreated();
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
      const parentAnswer = answers.find(
        (answer) => answer.id === parentAnswerId
      );
      const parentAuthorName =
        parentAnswer?.author?.name || "알 수 없는 사용자";
      const isReplyToReply = parentAnswer?.parentId;
      const contentWithTag = isReplyToReply
        ? `답글 @${parentAuthorName} ${replyText.trim()}`
        : `@${parentAuthorName} ${replyText.trim()}`;
      const response = await createAnswer({
        questionId,
        parentId: parentAnswerId,
        content: contentWithTag,
      });
      if (response.status === "CREATED" || response.message?.includes("성공")) {
        setReplyText("");
        setReplyingToAnswerId(null);
        await fetchAnswers();
        if (onAnswerCreated) onAnswerCreated();
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
    if (!window.confirm("정말로 이 답변을 삭제하시겠습니까?")) return;
    try {
      setDeletingAnswer(true);
      const response = await deleteAnswer(answerId);
      if (response.status === "OK" || response.message?.includes("완료")) {
        await fetchAnswers();
        if (onAnswerCreated) onAnswerCreated();
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return formatDetailedDateTime(dateString);
  };

  // 댓글 내용에서 @태그와 "답글" 텍스트에 색상을 적용하는 함수
  const formatAnswerContent = (content: string) => {
    // @태그와 답글 텍스트를 파싱하여 색상을 적용
    const parts = content.split(/(@\w+(?=\s|$|[^\w@])|답글)/);
    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        const username = part.substring(1); // @ 제거하여 사용자명만 추출
        return (
          <ClickableMentionedUsername
            key={index}
            username={username}
            onClick={(event, username) => {
              // 사용자 프로필 클릭 핸들러
              console.log("사용자 프로필 클릭:", username);
            }}
          />
        );
      } else if (part === "답글") {
        return (
          <span key={index} style={{ color: "#9ca3af", fontSize: "0.75rem" }}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // soft delete 제외한 답변만 필터링
  const visibleAnswers = answers.filter(
    (a) => !a.deletedAt && a.status !== "DELETED"
  );

  // 삭제된 루트 답변 중 댓글이 있는 것들만 필터링
  const deletedRootAnswersWithComments = answers.filter(
    (a) =>
      a.deletedAt &&
      !a.parentId &&
      answers.some(
        (comment) =>
          comment.parentId === a.id &&
          !comment.deletedAt &&
          comment.status !== "DELETED"
      )
  );

  // 루트 답변(답변) - 삭제되지 않은 것들
  const visibleRootAnswers = visibleAnswers.filter((a) => !a.parentId);
  // 답변에 대한 댓글(1depth)
  const visibleComments = visibleAnswers.filter((a) => !!a.parentId);

  // 답변+댓글 flat하게 한 줄로 (삭제된 루트 답변 포함)
  const flatAnswers = [
    ...visibleRootAnswers,
    ...visibleComments,
    ...deletedRootAnswersWithComments,
  ];

  // 답변/댓글 개수 (삭제된 것 제외)
  const visibleRootCount = visibleRootAnswers.length;
  const visibleCommentCount = visibleComments.length;

  // flat하게 렌더링
  const renderFlatAnswers = () =>
    flatAnswers.map((answer) => {
      const isDeleted = answer.deletedAt || answer.status === "DELETED";

      return (
        <AnswerItem
          key={answer.id}
          $isBestAnswer={answer.isBestAnswer}
          style={{
            marginTop: "0.25rem",
            borderRadius: "0.375rem",
            padding: "0.5rem",
            opacity: isDeleted ? 0.6 : 1, // 삭제된 답변은 투명도 적용
          }}
        >
          {isDeleted ? (
            // 삭제된 답변 표시
            <div
              style={{
                textAlign: "center",
                color: "#9ca3af",
                fontStyle: "italic",
                padding: "1rem",
              }}
            >
              삭제된 답변입니다.
            </div>
          ) : (
            // 정상 답변 표시
            <>
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
                    <ClickableUsername
                      username={
                        answer.authorName || answer.author?.name || "undefined"
                      }
                      userId={answer.author?.id || answer.authorId}
                      onClick={onUserProfileClick}
                      style={{ color: "#111827" }}
                    />
                    {answer.authorUsername && (
                      <span
                        style={{
                          fontSize: 11,
                          color: "#6b7280",
                          marginLeft: 1,
                          fontWeight: 400,
                        }}
                      >
                        ({answer.authorUsername})
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
                      {answer.authorIp}
                    </span>
                    {answer.parentId && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#9ca3af",
                          marginLeft: "0.5rem",
                          fontWeight: "400",
                        }}
                      >
                        답글
                      </span>
                    )}
                  </AnswerAuthor>
                  <AnswerDate style={{ color: "#6b7280" }}>
                    {formatDate(answer.createdAt)}
                  </AnswerDate>
                  {answer.isBestAnswer && (
                    <BestAnswerBadge>베스트 답변</BestAnswerBadge>
                  )}
                </div>
                {/* 답변 작성자만 수정/삭제 버튼 표시 */}
                {isAnswerAuthor(answer.author?.id || 0) && (
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleEditAnswer(answer)}
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
                      onClick={() => handleDeleteAnswer(answer.id)}
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
                    <button
                      onClick={() =>
                        setReplyingToAnswerId(
                          replyingToAnswerId === answer.id ? null : answer.id
                        )
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
                      {replyingToAnswerId === answer.id ? "취소" : "답글"}
                    </button>
                  </div>
                )}
                {/* 댓글 버튼 - 작성자가 아닌 경우 */}
                {!isAnswerAuthor(answer.author?.id || 0) && (
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() =>
                        setReplyingToAnswerId(
                          replyingToAnswerId === answer.id ? null : answer.id
                        )
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
                      {replyingToAnswerId === answer.id ? "취소" : "답글"}
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
                {editingAnswerId === answer.id ? (
                  <div style={{ marginTop: "0.75rem" }}>
                    <textarea
                      value={editAnswerText}
                      onChange={(e) => setEditAnswerText(e.target.value)}
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
                        onClick={() => handleUpdateAnswer(answer.id)}
                        disabled={!editAnswerText.trim() || updatingAnswer}
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
                          padding: "0.375rem 0.75rem",
                          fontSize: "0.75rem",
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
                  formatAnswerContent(answer.content)
                )}
              </AnswerText>

              {/* 댓글 작성 폼 */}
              {replyingToAnswerId === answer.id && (
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
                    <MentionTextArea
                      placeholder="댓글을 입력하세요. @를 입력하여 사용자를 언급할 수 있습니다."
                      value={replyText}
                      onChange={(newContent: string) =>
                        setReplyText(newContent)
                      }
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
                        onClick={() => handleReplySubmit(answer.id)}
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
                        {submittingReply ? "댓글 등록 중..." : "댓글 등록"}
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
            </>
          )}
        </AnswerItem>
      );
    });

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
          ) : flatAnswers.length > 0 ? (
            <>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  margin: "0 0 1rem 0",
                }}
              >
                총 {visibleRootCount}개의 답변 / 총 {visibleCommentCount}개의
                댓글
              </p>
              <AnswerList>{renderFlatAnswers()}</AnswerList>
            </>
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
              <MentionTextArea
                placeholder="답변을 입력하세요. @를 입력하여 사용자를 언급할 수 있습니다."
                value={answerText}
                onChange={(newContent: string) => setAnswerText(newContent)}
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
