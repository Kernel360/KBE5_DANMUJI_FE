import styled from "styled-components";

export const AnswerFormContainer = styled.div`
  margin-top: 0.75rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`;

export const AnswerFormTitle = styled.div`
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`;

export const AnswerTextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  resize: vertical;
  background-color: #ffffff;
  color: #374151;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.1);
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

export const AnswerFormActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  justify-content: flex-end;
`;

export const AnswerSubmitButton = styled.button`
  background: #fdb924;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background: #f59e0b;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const AnswerCancelButton = styled.button`
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background: #4b5563;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
