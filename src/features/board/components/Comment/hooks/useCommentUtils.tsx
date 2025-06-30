import React from "react";
import styled from "styled-components";
import type { Comment } from "@/features/project-d/types/post";
import ClickableMentionedUsername from "@/components/ClickableMentionedUsername";

const MentionSpan = styled.span`
  color: #fdb924;
  font-weight: 500;
`;

// 날짜 포맷팅 함수
export const formatCommentDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("ko-KR", options);
};

// 댓글 내용에서 @태그와 "답글" 텍스트에 색상을 적용하는 함수
export const formatCommentContent = (
  content: string,
  allProjectUsers: string[] = [],
  completedMentions: string[] = [],
  onUsernameClick?: (
    event: React.MouseEvent,
    username: string,
    userId?: number
  ) => void
): React.ReactNode[] => {
  const parts = content.split(/(@\w+(?=\s|$|[^\w@])|답글)/);
  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      const username = part.substring(1); // @ 제거하여 사용자명만 추출

      // 실제 존재하는 유저이고 완료된 멘션인지 확인
      const isExistingUser = allProjectUsers.includes(username);
      const isCompletedMention = completedMentions.includes(username);

      if (isExistingUser && isCompletedMention) {
        if (onUsernameClick) {
          return (
            <ClickableMentionedUsername
              key={index}
              username={username}
              onClick={onUsernameClick}
            />
          );
        } else {
          return <MentionSpan key={index}>{part}</MentionSpan>;
        }
      } else {
        // 존재하지 않는 유저이거나 완료되지 않은 멘션은 일반 텍스트로 표시
        return <span key={index}>{part}</span>;
      }
    } else if (part === "답글") {
      return (
        <span key={index} style={{ color: "#9ca3af", fontSize: "0.75rem" }}>
          {part}
        </span>
      );
    }
    return part;
  });
};

// 댓글을 부모-자식 관계로 구성하는 함수
export const organizeComments = (comments: Comment[]): CommentWithReplies[] => {
  const commentMap = new Map<number, CommentWithReplies>();
  const rootComments: CommentWithReplies[] = [];

  // 모든 댓글을 Map에 추가
  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // 부모-자식 관계 구성
  comments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id);
    if (commentWithReplies) {
      if (comment.parentCommentId) {
        const parent = commentMap.get(comment.parentCommentId);
        if (parent) {
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    }
  });

  return rootComments;
};

// 댓글 작성자 확인 함수
export const isCommentAuthor = (
  commentAuthorId: number,
  currentUserId?: number
): boolean => {
  return currentUserId === commentAuthorId;
};

// 렌더링되는 댓글 개수 계산 함수
export const getRenderedCommentCount = (comments: Comment[]): number => {
  const visibleComments = comments.filter(
    (comment) => !comment.deletedAt && comment.status !== "DELETED"
  );

  const rootComments = visibleComments.filter(
    (comment) => !comment.parentCommentId
  );
  let totalCount = 0;

  rootComments.forEach((rootComment) => {
    totalCount++; // 루트 댓글 카운트

    // 이 댓글을 부모로 하는 모든 답글(1,2,3...depth) 카운트
    const replies = visibleComments.filter((c) => {
      let parent = c.parentCommentId;
      while (parent) {
        if (parent === rootComment.id) return true;
        const parentComment = visibleComments.find((cc) => cc.id === parent);
        parent = parentComment?.parentCommentId ?? null;
      }
      return false;
    });

    totalCount += replies.length; // 답글들 카운트
  });

  return totalCount;
};

// 댓글 타입 확장
export interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
}
