import React from "react";
import {
  QuestionList as StyledQuestionList,
} from "@/features/board/components/Question/styles/QuestionAnswerModal.styled";
import QuestionItem from "./QuestionItem";
import type { Question } from "@/features/project-d/types/question";

interface QuestionListProps {
  questions: Question[];
  onQuestionUpdated: () => void;
  onOpenAnswerModal: (question: Question) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onQuestionUpdated,
  onOpenAnswerModal,
}) => {
  if (questions.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          color: "#9ca3af",
          fontStyle: "italic",
          padding: "2rem",
        }}
      >
        아직 질문이 없습니다.
      </div>
    );
  }

  return (
    <StyledQuestionList>
      {questions.map((question) => (
        <QuestionItem
          key={question.id}
          question={question}
          onQuestionUpdated={onQuestionUpdated}
          onOpenAnswerModal={onOpenAnswerModal}
        />
      ))}
    </StyledQuestionList>
  );
};

export default QuestionList; 