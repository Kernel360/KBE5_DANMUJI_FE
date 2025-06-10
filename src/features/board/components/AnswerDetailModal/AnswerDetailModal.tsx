import React, { useState, useEffect } from "react";
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
  AnswerActions,
  VoteButton,
  BestAnswerBadge,
  AnswerForm,
  AnswerTextArea,
  AnswerSubmitButton,
} from "./AnswerDetailModal.styled";
import {
  getAnswersByQuestion,
  createAnswer,
  markQuestionAsAnswered,
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

        if (onAnswerCreated) {
          onAnswerCreated();
        }

        // 질문 상태를 "답변 완료"로 변경
        await markQuestionAsAnswered(questionId);
      }
    } catch (err) {
      console.error("답변 작성 중 오류:", err);
      alert("답변 작성 중 오류가 발생했습니다.");
    } finally {
      setSubmittingAnswer(false);
    }
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
              {answers.map((answer) => (
                <AnswerItem key={answer.id} $isBestAnswer={answer.isBestAnswer}>
                  <AnswerHeader>
                    <div>
                      <AnswerAuthor>
                        {answer.author?.name || "알 수 없는 사용자"}
                      </AnswerAuthor>
                      <AnswerDate>{formatDate(answer.createdAt)}</AnswerDate>
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
              />
              <AnswerSubmitButton
                onClick={handleAnswerSubmit}
                disabled={!answerText.trim() || submittingAnswer}
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
