import React from "react";
import MentionTextArea from "@/components/MentionTextArea";
import {
  RelativeTextareaWrapper,
  CommentSubmitButton,
} from "@/features/board/components/Post/styles/ProjectPostDetailModal.styled";

interface CommentFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  buttonText?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "댓글을 입력하세요. @를 입력하여 사용자를 언급할 수 있습니다. (우측 하단 마우스 드래그를 통해 크기 조절 가능)",
  buttonText = "댓글",
}) => {
  return (
    <RelativeTextareaWrapper style={{ marginBottom: "1.5rem" }}>
      <MentionTextArea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{
          width: "100%",
          border: "1px solid #e2e8f0",
          borderRadius: "0.5rem",
          padding: "0.75rem",
          fontSize: "0.875rem",
          minHeight: "60px",
          background: "white",
          color: "#374151",
          transition: "border-color 0.2s ease",
        }}
      />
      <CommentSubmitButton
        onClick={onSubmit}
        disabled={!value.trim() || disabled}
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          height: 38,
          borderRadius: 8,
          background: "#fdb924",
          color: "white",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          fontWeight: 700,
          padding: "0 18px",
          cursor: "pointer",
          transition: "background 0.18s, color 0.18s",
          boxShadow: "0 2px 8px 0 rgba(253,185,36,0.10)",
          zIndex: 2,
        }}
      >
        {disabled ? "..." : buttonText}
      </CommentSubmitButton>
    </RelativeTextareaWrapper>
  );
};

export default CommentForm;
