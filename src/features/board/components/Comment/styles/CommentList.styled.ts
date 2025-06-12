import styled from "styled-components";

export const CommentListContainer = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

export const CommentListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const CommentCount = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

export const CommentListContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const EmptyCommentMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
`;
