import React, { useState } from "react";
import type { Comment as CommentType } from "../../types/post";
import {
  CommentContainer,
  CommentHeader,
  AuthorName,
  CommentDate,
  CommentContent,
  ReplyButton,
  ReplyForm,
  ReplyInput,
  SubmitButton,
  ReplyAuthorName,
  ReplyContent,
  ReplyDate,
  ReplyFormContainer,
  NestedReplyList,
  CommentActions,
} from "./Comment.styled";

interface CommentProps {
  comment: CommentType;
  onReply: (parentId: number, content: string) => void;
  level?: number;
}

const Comment: React.FC<CommentProps> = ({ comment, onReply, level = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent("");
      setIsReplying(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <CommentContainer $level={level}>
      <CommentHeader>
        <AuthorName>{comment.author.name}</AuthorName>
        <CommentDate>{formatDate(comment.createdAt)}</CommentDate>
      </CommentHeader>
      <CommentContent>{comment.content}</CommentContent>

      <CommentActions>
        {level === 0 && (
          <ReplyButton onClick={() => setIsReplying(!isReplying)}>
            답글
          </ReplyButton>
        )}
        <a href="#" onClick={() => console.log("수정 클릭", comment.id)}>
          수정
        </a>
        <a href="#" onClick={() => console.log("삭제 클릭", comment.id)}>
          삭제
        </a>
      </CommentActions>

      {isReplying && level === 0 && (
        <ReplyFormContainer>
          <ReplyForm onSubmit={handleReplySubmit}>
            <ReplyInput
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="답글을 입력하세요..."
              required
            />
            <SubmitButton type="submit">등록</SubmitButton>
          </ReplyForm>
        </ReplyFormContainer>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <NestedReplyList>
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              level={level + 1}
            />
          ))}
        </NestedReplyList>
      )}
    </CommentContainer>
  );
};

export default Comment;
