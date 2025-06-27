import React from "react";
import { LuUserRound } from "react-icons/lu";
import { RiUserSettingsLine } from "react-icons/ri";
import ClickableUsername from "@/components/ClickableUsername";
import MentionTextArea from "@/components/MentionTextArea";
import {
  CommentItem as StyledCommentItem,
  CommentMeta,
  CommentAuthor,
  CommentActions,
  CommentActionButton,
  CommentText,
} from "@/features/board/components/Post/styles/ProjectPostDetailModal.styled";
import type { Comment } from "@/features/project-d/types/post";

interface ReplyItemProps {
  reply: Comment;
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
  allUsernames: string[];
  completedMentions?: string[];
}

// 역할에 따른 아이콘 컴포넌트
const RoleIcon: React.FC<{ role?: string }> = ({ role }) => {
  switch (role) {
    case "ROLE_ADMIN":
      return (
        <RiUserSettingsLine
          style={{
            marginRight: "4px",
            color: "#8b5cf6",
            fontSize: "14px",
          }}
        />
      );
    case "ROLE_CLIENT":
      return (
        <LuUserRound
          style={{
            marginRight: "4px",
            color: "#10b981",
            fontSize: "14px",
          }}
        />
      );
    case "ROLE_DEV":
    default:
      return (
        <LuUserRound
          style={{
            marginRight: "4px",
            color: "#3b82f6",
            fontSize: "14px",
          }}
        />
      );
  }
};

const ReplyItem: React.FC<ReplyItemProps> = ({
  reply,
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
  const isDeleted = reply.deletedAt || reply.status === "DELETED";

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
          <RoleIcon role={reply.role} />
          <ClickableUsername
            username={reply.authorName || reply.author?.name || "undefined"}
            userId={reply.author?.id || reply.authorId}
            onClick={onUserProfileClick}
            style={{ color: "#111827" }}
          />
          {reply.authorUsername && (
            <span
              style={{
                fontSize: 11,
                color: "#6b7280",
                marginLeft: -3,
                fontWeight: 400,
              }}
            >
              ({reply.authorUsername})
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
            {reply.authorIp}
          </span>
        </CommentAuthor>
        <CommentActions>
          <span>{formatDate(reply.createdAt)}</span>
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
        <span
          style={{
            display: "inline-block",
            background: "#f3f4f6",
            color: "#888",
            fontSize: "0.75em",
            borderRadius: 4,
            padding: "2px 6px",
            marginRight: 6,
            verticalAlign: "middle",
          }}
        >
          답글
        </span>
        {isEditing ? (
          <div style={{ marginTop: 8 }}>
            <MentionTextArea
              value={editText}
              onChange={onEditTextChange}
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
          </div>
        ) : (
          reply.content
            .split(/(@[a-zA-Z0-9._]+)(?=\s|$|[^a-zA-Z0-9._@])/g)
            .map((part, idx) => {
              if (part.startsWith("@")) {
                const username = part.substring(1);
                return (
                  <span
                    key={idx}
                    style={{
                      color: "#fdb924",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                    onClick={(e) => onUserProfileClick(e, username)}
                  >
                    {part}
                  </span>
                );
              } else {
                return <span key={idx}>{part}</span>;
              }
            })
        )}
      </CommentText>
    </StyledCommentItem>
  );
};

export default ReplyItem;
