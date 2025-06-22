import React, { useState } from "react";
import {
  CommentFormContainer,
  CommentFormTitle,
  CommentFormActions,
  CommentSubmitButton,
  CommentCancelButton,
} from "../styles/CommentForm.styled";
import MentionTextArea from "@/components/MentionTextArea";

interface CommentFormProps {
  placeholder?: string;
  initialValue?: string;
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitText?: string;
  cancelText?: string;
  title?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  placeholder = "댓글을 입력하세요...",
  initialValue = "",
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitText = "댓글 등록",
  cancelText = "취소",
  title = "댓글 작성",
}) => {
  const [content, setContent] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
    <CommentFormContainer>
      {title && <CommentFormTitle>{title}</CommentFormTitle>}
      <form onSubmit={handleSubmit}>
        <MentionTextArea
          value={content}
          onChange={handleContentChange}
          placeholder={placeholder}
          disabled={isSubmitting}
          rows={3}
        />
        <CommentFormActions>
          <CommentSubmitButton
            type="submit"
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? "등록 중..." : submitText}
          </CommentSubmitButton>
          {onCancel && (
            <CommentCancelButton
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {cancelText}
            </CommentCancelButton>
          )}
        </CommentFormActions>
      </form>
    </CommentFormContainer>
  );
};

export default CommentForm;
