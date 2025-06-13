import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import type { Answer } from "@/features/project/types/question";
import { formatAnswerContent } from "../hooks/useAnswerUtils";
import AnswerActions from "./AnswerActions";
import AnswerForm from "./AnswerForm";
import {
  AnswerItemContainer,
  AnswerMeta,
  AnswerAuthor,
  AnswerAuthorName,
  AnswerAuthorIp,
  AnswerDate,
  AnswerContent,
  AnswerText,
  ReplyBadge,
  BestAnswerBadge,
} from "../styles/AnswerItem.styled";

interface AnswerItemProps {
  answer: Answer;
  currentUserId?: number;
  onEdit: (answerId: number, content: string) => void;
  onDelete: (answerId: number) => void;
  onReply: (parentId: number, content: string) => void;
  isSubmitting?: boolean;
  depth?: number;
}

const AnswerItem: React.FC<AnswerItemProps> = ({
  answer,
  currentUserId,
  onEdit,
  onDelete,
  onReply,
  isSubmitting = false,
  depth = 0,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editContent, setEditContent] = useState(answer.content);

  const isAuthor = currentUserId === answer.author?.id;
  const isDeleted = answer.deletedAt || answer.status === "DELETED";

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(answer.content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(answer.content);
  };

  const handleSaveEdit = () => {
    onEdit(answer.id, editContent);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(answer.id);
  };

  const handleReply = () => {
    setIsReplying(true);
  };

  const handleReplySubmit = (content: string) => {
    onReply(answer.id, content);
    setIsReplying(false);
  };

  const handleReplyCancel = () => {
    setIsReplying(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return kstDate.toLocaleDateString("ko-KR", options);
  };

  if (isDeleted) {
    return (
      <AnswerItemContainer $depth={depth}>
        <div
          style={{
            textAlign: "center",
            color: "#9ca3af",
            fontStyle: "italic",
            padding: "1rem",
            opacity: 0.6,
          }}
        >
          삭제된 답변입니다.
        </div>
      </AnswerItemContainer>
    );
  }

  return (
    <AnswerItemContainer $depth={depth}>
      <AnswerMeta>
        <AnswerAuthor>
          <FaUser style={{ marginRight: "0.5rem" }} />
          <AnswerAuthorName>
            {answer.author?.name || "알 수 없는 사용자"}
          </AnswerAuthorName>
          <AnswerAuthorIp>{answer.authorIp}</AnswerAuthorIp>
          {depth > 0 && <ReplyBadge>답글</ReplyBadge>}
          {answer.isBestAnswer && (
            <BestAnswerBadge>베스트 답변</BestAnswerBadge>
          )}
        </AnswerAuthor>
        <AnswerDate>{formatDate(answer.createdAt)}</AnswerDate>
      </AnswerMeta>

      <AnswerContent>
        {isEditing ? (
          <div style={{ marginTop: "0.75rem" }}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              style={{
                width: "100%",
                minHeight: "60px",
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                resize: "vertical",
                backgroundColor: "#ffffff",
                color: "#374151",
              }}
              placeholder="답변 내용을 수정하세요"
            />
            <AnswerActions
              answerId={answer.id}
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
            <AnswerText>{formatAnswerContent(answer.content)}</AnswerText>
            <AnswerActions
              answerId={answer.id}
              isAuthor={isAuthor}
              isEditing={false}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReply={handleReply}
              isSubmitting={isSubmitting}
            />
          </>
        )}
      </AnswerContent>

      {isReplying && (
        <AnswerForm
          placeholder="답글을 입력하세요..."
          initialValue={`@${answer.author?.name || "알 수 없는 사용자"} `}
          onSubmit={handleReplySubmit}
          onCancel={handleReplyCancel}
          isSubmitting={isSubmitting}
          submitText="답글 등록"
          title="답글 작성"
        />
      )}
    </AnswerItemContainer>
  );
};

export default AnswerItem;
