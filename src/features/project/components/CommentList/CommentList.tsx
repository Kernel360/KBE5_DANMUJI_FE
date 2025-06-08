import React, { useState, useMemo } from "react";
import type { Comment } from "../../types/post";
import { updateComment, deleteComment } from "../../services/postService";
import {
  CommentContainer,
  CommentItem,
  CommentMeta,
  CommentAuthor,
  CommentAuthorName,
  CommentAuthorIp,
  CommentDate,
  CommentText,
  CommentActions,
  EditButton,
  DeleteButton,
  ReplyButton,
  EditForm,
  EditTextArea,
  EditButtonGroup,
  SaveButton,
  CancelButton,
} from "./CommentList.styled";

interface CommentListProps {
  comments: Comment[];
  onReply?: (commentId: number) => void;
  onCommentUpdate?: () => void; // 댓글 수정/삭제 후 목록 새로고침을 위한 콜백
}

interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  onReply,
  onCommentUpdate,
}) => {
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // 댓글을 부모-자식 관계로 구성
  const organizedComments = useMemo(() => {
    const commentMap = new Map<number, CommentWithReplies>();
    const rootComments: CommentWithReplies[] = [];

    // 모든 댓글을 Map에 추가
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // 부모-자식 관계 구성
    comments.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id)!;
      if (comment.parentCommentId) {
        const parent = commentMap.get(comment.parentCommentId);
        if (parent) {
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  }, [comments]);

  const handleEditClick = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText("");
  };

  const handleSaveEdit = async (commentId: number) => {
    try {
      await updateComment(commentId, editText);
      setEditingCommentId(null);
      setEditText("");
      if (onCommentUpdate) {
        onCommentUpdate();
      }
    } catch (error) {
      console.error("댓글 수정 중 오류:", error);
      alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteClick = async (commentId: number) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      await deleteComment(commentId);
      if (onCommentUpdate) {
        onCommentUpdate();
      }
    } catch (error) {
      console.error("댓글 삭제 중 오류:", error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  const renderComment = (comment: CommentWithReplies, depth: number = 0) => (
    <div key={comment.id}>
      <CommentItem $depth={depth}>
        <CommentMeta>
          <CommentAuthor>
            <CommentAuthorName>{comment.author.name}</CommentAuthorName>
            <CommentAuthorIp>({comment.authorIp})</CommentAuthorIp>
          </CommentAuthor>
          <CommentDate>
            <span>{new Date(comment.createdAt).toLocaleString()}</span>
            {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
              <>
                <span>•</span>
                <span>
                  수정됨 {new Date(comment.updatedAt).toLocaleString()}
                </span>
              </>
            )}
          </CommentDate>
        </CommentMeta>
        {editingCommentId === comment.id ? (
          <EditForm>
            <EditTextArea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
            />
            <EditButtonGroup>
              <SaveButton onClick={() => handleSaveEdit(comment.id)}>
                저장
              </SaveButton>
              <CancelButton onClick={handleCancelEdit}>취소</CancelButton>
            </EditButtonGroup>
          </EditForm>
        ) : (
          <>
            <CommentText>{comment.content}</CommentText>
            <CommentActions>
              {onReply && (
                <ReplyButton onClick={() => onReply(comment.id)}>
                  답글
                </ReplyButton>
              )}
              <EditButton onClick={() => handleEditClick(comment)}>
                수정
              </EditButton>
              <DeleteButton onClick={() => handleDeleteClick(comment.id)}>
                삭제
              </DeleteButton>
            </CommentActions>
          </>
        )}
      </CommentItem>
      {comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => renderComment(reply, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <CommentContainer>
      {organizedComments.map((comment) => renderComment(comment))}
    </CommentContainer>
  );
};

export default CommentList;
