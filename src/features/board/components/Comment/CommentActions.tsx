import React from "react";
import { FaEdit, FaTrash, FaReply } from "react-icons/fa";
import {
  CommentActionButton,
  CommentActionButtonGroup,
} from "./CommentActions.styled";

interface CommentActionsProps {
  isAuthor: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReply: () => void;
  onCancelEdit?: () => void;
  onSaveEdit?: () => void;
  isSubmitting?: boolean;
}

const CommentActions: React.FC<CommentActionsProps> = ({
  isAuthor,
  isEditing,
  onEdit,
  onDelete,
  onReply,
  onCancelEdit,
  onSaveEdit,
  isSubmitting = false,
}) => {
  const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    if (target.style.background === "#fdb924") {
      target.style.background = "#f59e0b";
    } else if (target.style.background === "#6b7280") {
      target.style.background = "#4b5563";
    } else {
      target.style.background = "#f3f4f6";
    }
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    if (target.style.background === "#f59e0b") {
      target.style.background = "#fdb924";
    } else if (target.style.background === "#4b5563") {
      target.style.background = "#6b7280";
    } else {
      target.style.background = "none";
    }
  };

  if (isEditing) {
    return (
      <CommentActionButtonGroup>
        <CommentActionButton
          onClick={onSaveEdit}
          disabled={isSubmitting}
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
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          {isSubmitting ? "수정 중..." : "수정 완료"}
        </CommentActionButton>
        <CommentActionButton
          onClick={onCancelEdit}
          disabled={isSubmitting}
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
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          취소
        </CommentActionButton>
      </CommentActionButtonGroup>
    );
  }

  return (
    <CommentActionButtonGroup>
      {isAuthor && (
        <>
          <CommentActionButton
            onClick={onEdit}
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
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <FaEdit style={{ marginRight: "0.25rem" }} />
            수정
          </CommentActionButton>
          <CommentActionButton
            onClick={onDelete}
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
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <FaTrash style={{ marginRight: "0.25rem" }} />
            삭제
          </CommentActionButton>
        </>
      )}
      <CommentActionButton
        onClick={onReply}
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
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <FaReply style={{ marginRight: "0.25rem" }} />
        답글
      </CommentActionButton>
    </CommentActionButtonGroup>
  );
};

export default CommentActions;
