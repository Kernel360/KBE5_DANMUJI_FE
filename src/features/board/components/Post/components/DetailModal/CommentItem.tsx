import React from "react";
import ClickableUsername from "@/components/ClickableUsername";
import ClickableMentionedUsername from "@/components/ClickableMentionedUsername";
import MentionTextArea from "@/components/MentionTextArea";
import {
  CommentItem as StyledCommentItem,
  CommentMeta,
  CommentAuthor,
  CommentActions,
  CommentActionButton,
  CommentText,
  CommentSubmitButton,
  ReplyInputContainer,
} from "@/features/board/components/Post/styles/ProjectPostDetailModal.styled";
import type { Comment } from "@/features/project-d/types/post";

interface CommentItemProps {
  comment: Comment;
  isEditing: boolean;
  editText: string;
  onEditTextChange: (text: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onReply: () => void;
  isAuthor: boolean;
  formatDate: (dateString: string) => string;
  onUserProfileClick: (
    event: React.MouseEvent,
    username: string,
    userId?: number
  ) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  isEditing,
  editText,
  onEditTextChange,
  onEdit,
  onDelete,
  onSaveEdit,
  onCancelEdit,
  onReply,
  isAuthor,
  formatDate,
  onUserProfileClick,
}) => {
  const isDeleted = comment.deletedAt || comment.status === "DELETED";

  if (isDeleted) {
    return (
      <StyledCommentItem>
        <div
          style={{
            textAlign: "center",
            color: "#9ca3af",
            fontStyle: "italic",
            padding: "1rem",
            opacity: 0.6,
          }}
        >
          삭제된 댓글입니다.
        </div>
      </StyledCommentItem>
    );
  }

  return (
    <StyledCommentItem>
      <CommentMeta>
        <CommentAuthor>
          <ClickableUsername
            username={comment.authorName || comment.author?.name || "undefined"}
            userId={comment.author?.id || comment.authorId}
            onClick={onUserProfileClick}
            style={{ color: "#111827" }}
          />
          {comment.authorUsername && (
            <span
              style={{
                fontSize: 11,
                color: "#6b7280",
                marginLeft: -3,
                fontWeight: 400,
              }}
            >
              ({comment.authorUsername})
            </span>
          )}
          <span
            style={{
              fontSize: 11,
              color: "#b0b0b0",
              marginLeft: 6,
              fontWeight: 400,
            }}
          >
            {comment.authorIp}
          </span>
        </CommentAuthor>
        <CommentActions>
          <span>{formatDate(comment.createdAt)}</span>
          {isAuthor && (
            <>
              {isEditing ? (
                <>
                  <CommentActionButton onClick={onSaveEdit}>
                    저장
                  </CommentActionButton>
                  <CommentActionButton onClick={onCancelEdit}>
                    취소
                  </CommentActionButton>
                </>
              ) : (
                <>
                  <CommentActionButton onClick={onEdit}>
                    수정
                  </CommentActionButton>
                  <CommentActionButton onClick={onDelete}>
                    삭제
                  </CommentActionButton>
                </>
              )}
            </>
          )}
          <CommentActionButton onClick={onReply}>답글</CommentActionButton>
        </CommentActions>
      </CommentMeta>
      <CommentText>
        {isEditing ? (
          <div style={{ marginTop: 8 }}>
            <MentionTextArea
              value={editText}
              onChange={onEditTextChange}
              autoFocus
              rows={3}
              placeholder="댓글 내용을 수정하세요. @를 입력하여 사용자를 언급할 수 있습니다."
              style={{
                width: "100%",
                border: "1.5px solid #fdb924",
                borderRadius: "0.375rem",
                background: "#fffdfa",
                color: "#222",
                fontSize: "0.95em",
                padding: "0.75rem",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                marginTop: 6,
              }}
            >
              <CommentSubmitButton onClick={onSaveEdit}>
                저장
              </CommentSubmitButton>
              <CommentActionButton onClick={onCancelEdit}>
                취소
              </CommentActionButton>
            </div>
          </div>
        ) : (
          comment.content.split(/(@\S+)/g).map((part, idx) =>
            part.startsWith("@") ? (
              <span
                key={idx}
                style={{
                  color: "#fdb924",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
                onClick={(e) => onUserProfileClick(e, part.substring(1))}
              >
                {part}
              </span>
            ) : (
              <span key={idx}>{part}</span>
            )
          )
        )}
      </CommentText>
    </StyledCommentItem>
  );
};

export default CommentItem;
