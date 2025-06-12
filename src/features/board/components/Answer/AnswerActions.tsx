import React from "react";
import { FaEdit, FaTrash, FaReply } from "react-icons/fa";
import {
  AnswerActionButton,
  AnswerActionButtonGroup,
} from "./AnswerActions.styled";

interface AnswerActionsProps {
  answerId: number;
  isAuthor: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReply: () => void;
  onCancelEdit?: () => void;
  onSaveEdit?: () => void;
  isSubmitting?: boolean;
}

const AnswerActions: React.FC<AnswerActionsProps> = ({
  isAuthor,
  isEditing,
  onEdit,
  onDelete,
  onReply,
  onCancelEdit,
  onSaveEdit,
  isSubmitting = false,
}) => {
  if (isEditing) {
    return (
      <AnswerActionButtonGroup>
        <AnswerActionButton
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
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#f59e0b";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#fdb924";
          }}
        >
          {isSubmitting ? "수정 중..." : "수정 완료"}
        </AnswerActionButton>
        <AnswerActionButton
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
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#4b5563";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#6b7280";
          }}
        >
          취소
        </AnswerActionButton>
      </AnswerActionButtonGroup>
    );
  }

  return (
    <AnswerActionButtonGroup>
      {isAuthor && (
        <>
          <AnswerActionButton
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
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#f3f4f6";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "none";
            }}
          >
            <FaEdit style={{ marginRight: "0.25rem" }} />
            수정
          </AnswerActionButton>
          <AnswerActionButton
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
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#f3f4f6";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "none";
            }}
          >
            <FaTrash style={{ marginRight: "0.25rem" }} />
            삭제
          </AnswerActionButton>
        </>
      )}
      <AnswerActionButton
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
        onMouseOver={(e) => {
          e.currentTarget.style.background = "#f3f4f6";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "none";
        }}
      >
        <FaReply style={{ marginRight: "0.25rem" }} />
        답글
      </AnswerActionButton>
    </AnswerActionButtonGroup>
  );
};

export default AnswerActions;
