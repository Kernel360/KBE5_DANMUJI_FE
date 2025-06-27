import React from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import ReplyItem from "./ReplyItem";
import {
  CommentsSection,
  CommentsList,
  ReplyInputContainer,
  CommentActionButton,
  CommentSubmitButton,
} from "@/features/board/components/Post/styles/ProjectPostDetailModal.styled";
import MentionTextArea from "@/components/MentionTextArea";
import type { Comment } from "@/features/project-d/types/post";

interface CommentSectionProps {
  comments: Comment[];
  commentText: string;
  onCommentTextChange: (text: string) => void;
  onCommentSubmit: () => void;
  submittingComment: boolean;
  replyingTo: number | null;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  onReplySubmit: () => void;
  onReplyCancel: () => void;
  submittingReply: boolean;
  editingCommentId: number | null;
  editText: string;
  onEditTextChange: (text: string) => void;
  onEdit: (commentId: number) => void;
  onDelete: (commentId: number) => void;
  onSaveEdit: (commentId: number) => void;
  onCancelEdit: () => void;
  onReply: (comment: Comment) => void;
  isAuthor: (authorId: number) => boolean;
  formatDate: (dateString: string) => string;
  onUserProfileClick: (
    event: React.MouseEvent,
    username: string,
    userId?: number
  ) => void;
  allUsernames: string[];
  completedMentions?: string[];
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  commentText,
  onCommentTextChange,
  onCommentSubmit,
  submittingComment,
  replyingTo,
  replyText,
  onReplyTextChange,
  onReplySubmit,
  onReplyCancel,
  submittingReply,
  editingCommentId,
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
  allUsernames,
  completedMentions = [],
}) => {
  // soft delete 제외한 댓글만 필터링
  const visibleComments = comments.filter(
    (comment) => !comment.deletedAt && comment.status !== "DELETED"
  );

  // 삭제된 댓글 중 대댓글이 있는 것들만 필터링
  const deletedCommentsWithReplies = comments.filter((comment) => {
    const isDeleted = comment.deletedAt || comment.status === "DELETED";
    if (!isDeleted) return false;

    // 이 댓글을 부모로 하는 대댓글이 있는지 확인
    return comments.some((reply) => {
      let parent = reply.parentId;
      while (parent) {
        if (parent === comment.id) return true;
        const parentComment = comments.find((cc) => cc.id === parent);
        parent = parentComment?.parentId ?? null;
        if (!parent) return false;
      }
      return false;
    });
  });

  // 렌더링할 댓글 목록 (정상 댓글 + 대댓글이 있는 삭제된 댓글)
  const commentsToRender = [...visibleComments, ...deletedCommentsWithReplies];

  // 렌더링되는 댓글 개수 계산
  const getRenderedCommentCount = () => {
    let count = 0;
    const countComments = (comments: Comment[]) => {
      comments.forEach((comment) => {
        count++;
        if (comment.children && comment.children.length > 0) {
          countComments(comment.children);
        }
      });
    };
    countComments(commentsToRender);
    return count;
  };

  const renderedCommentCount = getRenderedCommentCount();

  return (
    <div style={{ margin: "0 16px" }}>
      <CommentsSection>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
          댓글 ({renderedCommentCount})
        </div>

        <CommentForm
          value={commentText}
          onChange={onCommentTextChange}
          onSubmit={onCommentSubmit}
          disabled={submittingComment}
        />

        <CommentsList>
          {commentsToRender.length > 0 ? (
            commentsToRender
              .filter((comment) => !comment.parentId)
              .map((rootComment) => {
                // 이 댓글을 부모로 하는 모든 답글(1,2,3...depth) 평면적으로 시간순 정렬
                const replies = commentsToRender.filter((c) => {
                  let parent = c.parentId;
                  while (parent) {
                    if (parent === rootComment.id) return true;
                    const parentComment = commentsToRender.find(
                      (cc) => cc.id === parent
                    );
                    parent = parentComment?.parentId ?? null;
                  }
                  return false;
                });
                // 시간순 정렬
                replies.sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                );

                return [
                  <CommentItem
                    key={rootComment.id}
                    comment={rootComment}
                    isEditing={editingCommentId === rootComment.id}
                    editText={editText}
                    onEditTextChange={onEditTextChange}
                    onEdit={() => onEdit(rootComment.id)}
                    onDelete={() => onDelete(rootComment.id)}
                    onSaveEdit={() => onSaveEdit(rootComment.id)}
                    onCancelEdit={onCancelEdit}
                    onReply={() => onReply(rootComment)}
                    isAuthor={isAuthor(
                      rootComment.author?.id || rootComment.authorId
                    )}
                    formatDate={formatDate}
                    onUserProfileClick={onUserProfileClick}
                    allUsernames={allUsernames}
                    completedMentions={completedMentions}
                  />,
                  ...replies.map((reply) => {
                    const isDeleted =
                      reply.deletedAt || reply.status === "DELETED";

                    // 삭제된 답글 중 대댓글이 있는 것만 표시
                    if (isDeleted) {
                      const hasReplies = commentsToRender.some((comment) => {
                        let parent = comment.parentId;
                        while (parent) {
                          if (parent === reply.id) return true;
                          const parentComment = commentsToRender.find(
                            (cc) => cc.id === parent
                          );
                          parent = parentComment?.parentId ?? null;
                        }
                        return false;
                      });

                      if (!hasReplies) {
                        return null; // 대댓글이 없는 삭제된 답글은 숨김
                      }

                      // 대댓글이 있는 삭제된 답글 표시
                      return (
                        <div key={reply.id}>
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
                        </div>
                      );
                    }

                    // 정상 답글 표시
                    return (
                      <ReplyItem
                        key={reply.id}
                        reply={reply}
                        isEditing={editingCommentId === reply.id}
                        editText={editText}
                        onEditTextChange={onEditTextChange}
                        onEdit={() => onEdit(reply.id)}
                        onDelete={() => onDelete(reply.id)}
                        onSaveEdit={() => onSaveEdit(reply.id)}
                        onCancelEdit={onCancelEdit}
                        onReply={() => onReply(reply)}
                        isAuthor={isAuthor(reply.author?.id || reply.authorId)}
                        formatDate={formatDate}
                        onUserProfileClick={onUserProfileClick}
                        allUsernames={allUsernames}
                        completedMentions={completedMentions}
                      />
                    );
                  }),
                ];
              })
              .flat()
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "#9ca3af",
                padding: "2rem",
                fontStyle: "italic",
              }}
            >
              아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
            </div>
          )}
        </CommentsList>

        {/* 답글 입력창 */}
        {replyingTo !== null && (
          <ReplyInputContainer>
            <MentionTextArea
              value={replyText}
              onChange={onReplyTextChange}
              placeholder={`@${
                comments.find((c) => c.id === replyingTo)?.authorName ||
                comments.find((c) => c.id === replyingTo)?.author?.name ||
                "알 수 없는 사용자"
              } 님에게 답글을 입력하세요. @를 입력하여 사용자를 언급할 수 있습니다.`}
              disabled={submittingReply}
              rows={3}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <CommentActionButton
                type="button"
                onClick={onReplyCancel}
                disabled={submittingReply}
              >
                취소
              </CommentActionButton>
              <CommentSubmitButton
                onClick={onReplySubmit}
                disabled={!replyText.trim() || submittingReply}
              >
                {submittingReply ? "등록 중..." : "등록"}
              </CommentSubmitButton>
            </div>
          </ReplyInputContainer>
        )}
      </CommentsSection>
    </div>
  );
};

export default CommentSection;
