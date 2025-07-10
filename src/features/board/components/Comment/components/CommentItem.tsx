import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import type { Comment } from "@/features/project-d/types/post";
import {
  formatCommentDate,
  formatCommentContent,
  isCommentAuthor,
} from "../hooks/useCommentUtils";
import CommentActions from "./CommentActions";
import CommentForm from "./CommentForm";
import MentionTextArea from "@/components/MentionTextArea";
import {
  CommentItemContainer,
  CommentAuthor,
  CommentAuthorName,
  CommentAuthorIp,
  CommentDate,
  CommentText,
  CommentContent,
  CommentMeta,
  ReplyBadge,
} from "../styles/CommentItem.styled";

interface CommentItemProps {
  comment: Comment;
  currentUserId?: number;
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  onReply: (parentId: number, content: string) => void;
  isSubmitting?: boolean;
  depth?: number;
  allProjectUsers?: string[];
  completedMentions?: string[];
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  onReply,
  isSubmitting = false,
  depth = 0,
  allProjectUsers = [],
  completedMentions = [],
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isAuthor = isCommentAuthor(comment.author?.id || 0, currentUserId);
  const isDeleted = comment.deletedAt || comment.status === "DELETED";

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleSaveEdit = () => {
    onEdit(comment.id, editContent);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(comment.id);
  };

  const handleReply = () => {
    setIsReplying(true);
  };

  const handleReplySubmit = (content: string) => {
    onReply(comment.id, content);
    setIsReplying(false);
  };

  const handleReplyCancel = () => {
    setIsReplying(false);
  };

  const handleEditContentChange = (newContent: string) => {
    setEditContent(newContent);
  };

  if (isDeleted) {
    return (
      <CommentItemContainer $depth={depth}>
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
      </CommentItemContainer>
    );
  }

  return (
    <CommentItemContainer $depth={depth}>
      <CommentMeta>
        <CommentAuthor>
          <FaUser style={{ marginRight: "0.5rem" }} />
          <CommentAuthorName>
            {comment.authorName || "알 수 없는 사용자"}
          </CommentAuthorName>
          <CommentAuthorIp>{comment.authorIp}</CommentAuthorIp>
          {depth > 0 && <ReplyBadge>답글</ReplyBadge>}
        </CommentAuthor>
        <CommentDate>{formatCommentDate(comment.createdAt)}</CommentDate>
      </CommentMeta>

      <CommentContent>
        {isEditing ? (
          <div style={{ marginTop: "0.75rem" }}>
            <MentionTextArea
              value={editContent}
              onChange={handleEditContentChange}
              placeholder="댓글 내용을 수정하세요. @를 입력하여 사용자를 언급할 수 있습니다."
              rows={3}
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
            <CommentActions
              isAuthor={isAuthor}
              isEditing={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReply={handleReply}
              onCancelEdit={handleCancelEdit}
              onSaveEdit={handleSaveEdit}
              isSubmitting={isSubmitting}
            />
          </div>
        ) : (
          <>
            <CommentText>
              {formatCommentContent(
                comment.content,
                allProjectUsers,
                completedMentions
              )}
            </CommentText>
            <CommentActions
              isAuthor={isAuthor}
              isEditing={false}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReply={handleReply}
              isSubmitting={isSubmitting}
            />
          </>
        )}
      </CommentContent>

      {isReplying && (
        <CommentForm
          placeholder="답글을 입력하세요. @를 입력하여 사용자를 언급할 수 있습니다."
          initialValue={`@${comment.authorName || "알 수 없는 사용자"} `}
          onSubmit={handleReplySubmit}
          onCancel={handleReplyCancel}
          isSubmitting={isSubmitting}
          submitText="답글 등록"
          title="답글 작성"
        />
      )}
    </CommentItemContainer>
  );
};

export default CommentItem;
