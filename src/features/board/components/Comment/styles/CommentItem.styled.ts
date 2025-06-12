import styled from "styled-components";

interface CommentItemContainerProps {
  $depth: number;
}

export const CommentItemContainer = styled.div<CommentItemContainerProps>`
  margin-top: 0.25rem;
  border-radius: 0.375rem;
  padding: 0.5rem;
  background-color: ${(props) => (props.$depth > 0 ? "#f9fafb" : "#ffffff")};
  border: ${(props) => (props.$depth > 0 ? "1px solid #e5e7eb" : "none")};
  margin-left: ${(props) =>
    props.$depth > 0 ? `${props.$depth * 1.5}rem` : "0"};
`;

export const CommentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
`;

export const CommentAuthorName = styled.span`
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
`;

export const CommentAuthorIp = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  margin-left: 0.5rem;
  font-weight: 400;
`;

export const CommentDate = styled.span`
  color: #6b7280;
  font-size: 0.75rem;
`;

export const CommentContent = styled.div`
  color: #374151;
  line-height: 1.5;
  font-size: 0.875rem;
`;

export const CommentText = styled.div`
  color: #374151;
  line-height: 1.5;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

export const ReplyBadge = styled.span`
  display: inline-block;
  background: #f3f4f6;
  color: #888;
  font-size: 0.75em;
  border-radius: 4px;
  padding: 2px 6px;
  margin-left: 6px;
  vertical-align: middle;
`;
