import styled from "styled-components";

export const CommentActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  color: #6b7280;

  &:hover {
    background-color: #f3f4f6;
    color: #fdb924;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CommentActionButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;
