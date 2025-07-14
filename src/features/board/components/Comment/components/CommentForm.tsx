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
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 프론트 validation: 1~50자, 필수
    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    } else if (content.trim().length > 50) {
      setError("댓글 내용은 50자 이하로 입력해주세요.");
      return;
    }
    setError("");
    if (!isSubmitting) {
      // onSubmit에서 서버 validation 에러 메시지를 받을 수 있도록 콜백 패턴 확장
      onSubmit(content.trim(), (serverError?: string) => {
        if (serverError) setError(serverError);
        else setContent("");
      });
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setError("");
  };

  const handleCancel = () => {
    setContent("");
    setError("");
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
        {error && (
          <div style={{ color: "#ef4444", fontSize: "12px", marginTop: 4 }}>
            {error}
          </div>
        )}
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
