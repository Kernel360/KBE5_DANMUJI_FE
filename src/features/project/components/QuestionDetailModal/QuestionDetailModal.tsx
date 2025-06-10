import React, { useState, useEffect } from "react";
import { Question, Answer } from "../../types/question";
import {
  getQuestionById,
  getAnswersByQuestion,
} from "../../services/questionService";
import AnswerList from "../AnswerList/AnswerList";
import AnswerCreateModal from "../AnswerCreateModal/AnswerCreateModal";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  QuestionSection,
  QuestionTitle,
  QuestionAuthor,
  QuestionDate,
  QuestionContent,
  QuestionStats,
  AnswerSection,
  AnswerSectionHeader,
  CreateAnswerButton,
  LoadingSpinner,
  ErrorMessage,
} from "./QuestionDetailModal.styled";

interface QuestionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: string;
}

const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({
  isOpen,
  onClose,
  questionId,
}) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnswerModal, setShowAnswerModal] = useState(false);

  const fetchQuestionDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const questionResponse = await getQuestionById(questionId);
      setQuestion(questionResponse.data);

      const answersResponse = await getAnswersByQuestion(questionId);
      setAnswers(answersResponse.data);
    } catch (err) {
      setError("질문을 불러오는데 실패했습니다.");
      console.error("Error fetching question detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && questionId) {
      fetchQuestionDetail();
    }
  }, [isOpen, questionId]);

  const handleAnswerCreated = () => {
    fetchQuestionDetail();
    setShowAnswerModal(false);
  };

  const handleClose = () => {
    if (!loading) {
      setQuestion(null);
      setAnswers([]);
      setError(null);
      setShowAnswerModal(false);
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <ModalOverlay onClick={handleClose}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>질문 상세</ModalTitle>
            <CloseButton onClick={handleClose} disabled={loading}>
              ×
            </CloseButton>
          </ModalHeader>

          <ModalBody>
            {loading && !question ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorMessage>
                <p>{error}</p>
                <button onClick={fetchQuestionDetail}>다시 시도</button>
              </ErrorMessage>
            ) : question ? (
              <>
                <QuestionSection>
                  <QuestionTitle>{question.title}</QuestionTitle>

                  <QuestionStats>
                    <QuestionAuthor>{question.authorName}</QuestionAuthor>
                    <QuestionDate>
                      {formatDate(question.createdAt)}
                    </QuestionDate>
                  </QuestionStats>

                  <QuestionContent>{question.content}</QuestionContent>

                  <QuestionStats>
                    <span>답변 {question.answerCount}개</span>
                    <span>조회 {question.viewCount}회</span>
                  </QuestionStats>
                </QuestionSection>

                <AnswerSection>
                  <AnswerSectionHeader>
                    <h3>답변 ({answers.length}개)</h3>
                    <CreateAnswerButton
                      onClick={() => setShowAnswerModal(true)}
                    >
                      답변 작성
                    </CreateAnswerButton>
                  </AnswerSectionHeader>

                  <AnswerList
                    answers={answers}
                    questionId={questionId}
                    onAnswerUpdated={fetchQuestionDetail}
                  />
                </AnswerSection>
              </>
            ) : null}
          </ModalBody>
        </ModalContainer>
      </ModalOverlay>

      <AnswerCreateModal
        isOpen={showAnswerModal}
        onClose={() => setShowAnswerModal(false)}
        questionId={questionId}
        onAnswerCreated={handleAnswerCreated}
      />
    </>
  );
};

export default QuestionDetailModal;
