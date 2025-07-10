import React, { useState } from "react";
import {
  AnswerFormContainer,
  AnswerFormTitle,
  AnswerFormActions,
  AnswerSubmitButton,
  AnswerCancelButton,
} from "../styles/AnswerForm.styled";
import MentionTextArea from "@/components/MentionTextArea";

interface AnswerFormProps {
  placeholder?: string;
  initialValue?: string;
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitText?: string;
  cancelText?: string;
  title?: string;
}

const AnswerForm: React.FC<AnswerFormProps> = ({
  placeholder = "답변을 입력하세요...",
  initialValue = "",
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitText = "답변 등록",
  cancelText = "취소",
  title = "답변 작성",
}) => {
  const [content, setContent] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isSubmitting) {
      onSubmit(content.trim());
      setContent("");
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleCancel = () => {
    setContent("");
    onCancel?.();
  };

  return (
    <AnswerFormContainer>
      {title && <AnswerFormTitle>{title}</AnswerFormTitle>}
      <form onSubmit={handleSubmit}>
        <MentionTextArea
          value={content}
          onChange={handleContentChange}
          placeholder={placeholder}
          disabled={isSubmitting}
          rows={3}
        />
        <AnswerFormActions>
          <AnswerSubmitButton
            type="submit"
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? "등록 중..." : submitText}
          </AnswerSubmitButton>
          {onCancel && (
            <AnswerCancelButton
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {cancelText}
            </AnswerCancelButton>
          )}
        </AnswerFormActions>
      </form>
    </AnswerFormContainer>
  );
};

export default AnswerForm;
