import React, { useState } from "react";
import {
  QuestionForm as StyledQuestionForm,
  QuestionTextArea,
  QuestionSubmitButton,
} from "@/features/board/components/Question/styles/QuestionAnswerModal.styled";
import {
  createQuestion,
  getQuestionsByPost,
} from "@/features/project-d/services/questionService";
import type { Question } from "@/features/project-d/types/question";

interface QuestionFormProps {
  postId: number;
  onQuestionCreated: (questions: Question[]) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  postId,
  onQuestionCreated,
}) => {
  const [questionText, setQuestionText] = useState("");
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

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
          onQuestionCreated(questionsResponse.data.content);
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

  return (
    <StyledQuestionForm>
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
    </StyledQuestionForm>
  );
};

export default QuestionForm;
