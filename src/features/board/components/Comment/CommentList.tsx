import React, { useState, useMemo } from "react";
import type { Comment } from "@/features/project/types/post";
import {
  organizeComments,
  getRenderedCommentCount,
  type CommentWithReplies,
} from "./CommentUtils.tsx";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import {
  CommentListContainer,
  CommentListHeader,
  CommentCount,
  CommentListContent,
  EmptyCommentMessage,
} from "./CommentList.styled";

interface CommentListProps {
  comments: Comment[];
  currentUserId?: number;
  onCommentSubmit: (content: string, parentId?: number) => void;
  onCommentEdit: (commentId: number, content: string) => void;
  onCommentDelete: (commentId: number) => void;
  isSubmitting?: boolean;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  currentUserId,
  onCommentSubmit,
  onCommentEdit,
  onCommentDelete,
  isSubmitting = false,
}) => {
  const [showCommentForm, setShowCommentForm] = useState(false);

  // 댓글을 부모-자식 관계로 구성
  const organizedComments = useMemo(() => {
    return organizeComments(comments);
  }, [comments]);

  // 렌더링되는 댓글 개수 계산
  const renderedCommentCount = useMemo(() => {
    return getRenderedCommentCount(comments);
  }, [comments]);

  // 댓글 렌더링 함수 (재귀적)
  const renderComment = (
    comment: CommentWithReplies,
    depth: number = 0
  ): React.ReactNode => {
    return (
      <div key={comment.id}>
        <CommentItem
          comment={comment}
          currentUserId={currentUserId}
          onEdit={onCommentEdit}
          onDelete={onCommentDelete}
          onReply={(parentId, content) => onCommentSubmit(content, parentId)}
          isSubmitting={isSubmitting}
          depth={depth}
        />
        {comment.replies && comment.replies.length > 0 && (
          <div>
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const handleCommentSubmit = (content: string) => {
    onCommentSubmit(content);
    setShowCommentForm(false);
  };

  const handleCommentFormCancel = () => {
    setShowCommentForm(false);
  };

  return (
    <CommentListContainer>
      <CommentListHeader>
        <CommentCount>총 {renderedCommentCount}개의 댓글</CommentCount>
        <button
          onClick={() => setShowCommentForm(!showCommentForm)}
          style={{
            background: "#fdb924",
            color: "white",
            border: "none",
            borderRadius: "0.375rem",
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
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
          {showCommentForm ? "댓글 작성 취소" : "댓글 작성"}
        </button>
      </CommentListHeader>

      {showCommentForm && (
        <CommentForm
          placeholder="댓글을 입력하세요..."
          onSubmit={handleCommentSubmit}
          onCancel={handleCommentFormCancel}
          isSubmitting={isSubmitting}
          submitText="댓글 등록"
          title="댓글 작성"
        />
      )}

      <CommentListContent>
        {organizedComments.length > 0 ? (
          organizedComments.map((comment) => renderComment(comment))
        ) : (
          <EmptyCommentMessage>아직 댓글이 없습니다.</EmptyCommentMessage>
        )}
      </CommentListContent>
    </CommentListContainer>
  );
};

export default CommentList;
