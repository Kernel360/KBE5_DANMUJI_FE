import React, { useMemo } from "react";
import type { Comment } from "../../types/post";
import Comment from "../Comment/Comment";
import { CommentListContainer } from "./CommentList.styled";

interface CommentListProps {
  comments?: Comment[];
  onReply: (parentId: number, content: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  comments = [],
  onReply,
}) => {
  // 댓글을 부모-자식 관계로 구조화
  const structuredComments = useMemo(() => {
    if (!comments || comments.length === 0) return [];

    const commentMap = new Map<number, Comment>();
    const rootComments: Comment[] = [];

    // 모든 댓글을 Map에 추가
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // 부모-자식 관계 구성
    comments.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id)!;
      if (comment.parentCommentId === null) {
        rootComments.push(commentWithReplies);
      } else {
        const parentComment = commentMap.get(comment.parentCommentId);
        if (parentComment) {
          parentComment.replies = parentComment.replies || [];
          parentComment.replies.push(commentWithReplies);
        }
      }
    });

    return rootComments;
  }, [comments]);

  return (
    <CommentListContainer>
      {structuredComments.length > 0 ? (
        structuredComments.map((comment) => (
          <Comment key={comment.id} comment={comment} onReply={onReply} />
        ))
      ) : (
        <p>댓글이 없습니다.</p>
      )}
    </CommentListContainer>
  );
};

export default CommentList;
