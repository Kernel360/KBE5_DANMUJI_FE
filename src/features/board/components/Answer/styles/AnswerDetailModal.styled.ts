import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalPanel = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
`;

export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

export const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`;

export const AnswerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const AnswerItem = styled.div<{ $isBestAnswer?: boolean }>`
  border: 1px solid ${(props) => (props.$isBestAnswer ? "#fdb924" : "#e5e7eb")};
  border-radius: 8px;
  padding: 1rem;
  background-color: ${(props) => (props.$isBestAnswer ? "#fefce8" : "white")};
  box-shadow: ${(props) =>
    props.$isBestAnswer
      ? "0 4px 6px -1px rgba(253, 185, 36, 0.1)"
      : "0 1px 3px 0 rgba(0, 0, 0, 0.1)"};
`;

export const AnswerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

export const AnswerAuthor = styled.span`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

export const AnswerDate = styled.span`
  color: #6b7280;
  font-size: 0.75rem;
  margin-left: 0.5rem;
`;

export const AnswerText = styled.div`
  color: #374151;
  line-height: 1.6;
  font-size: 0.875rem;
  white-space: pre-wrap;
`;

export const AnswerActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const VoteButton = styled.button`
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 0.75rem;
  color: #6b7280;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
  }
`;

export const BestAnswerBadge = styled.span`
  background: #fdb924;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  margin-left: 0.5rem;
`;

export const AnswerForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const AnswerTextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
  background-color: #ffffff;
  color: #333333;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const AnswerSubmitButton = styled.button`
  background: #fdb924;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-end;

  &:hover:not(:disabled) {
    background: #f59e0b;
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
`;
