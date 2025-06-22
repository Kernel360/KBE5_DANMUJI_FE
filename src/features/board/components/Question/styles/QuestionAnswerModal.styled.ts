import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalPanel = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${({ $status }) => {
    switch ($status) {
      case "승인":
        return "#10b981";
      case "대기":
        return "#f59e0b";
      case "거부":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  }};
  color: white;
`;

export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 0.25rem;

  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
`;

export const ModalBody = styled.div`
  padding: 2rem;
`;

export const Section = styled.div`
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #fdb924;
`;

export const PostMeta = styled.div`
  display: flex;
  gap: 2rem;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

export const PostContent = styled.div`
  line-height: 1.6;
  color: #374151;
  white-space: pre-wrap;
`;

export const QuestionSection = styled.div`
  margin-top: 2rem;
`;

export const QuestionList = styled.div`
  margin-top: 1.5rem;
`;

export const QuestionItem = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background-color: #fafafa;
  position: relative;
`;

export const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

export const QuestionAuthor = styled.span`
  font-weight: 600;
  color: #111827;
  margin-right: 0.5rem;
`;

export const QuestionDate = styled.span`
  color: #6b7280;
  font-size: 0.875rem;
  margin-right: 0.5rem;
`;

export const QuestionStatus = styled.span<{ $resolved: boolean }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${({ $resolved }) => ($resolved ? "#10b981" : "#f59e0b")};
  color: white;
`;

export const QuestionActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const QuestionText = styled.div`
  font-size: 1rem;
  line-height: 1.5;
  color: #374151;
  margin-bottom: 1rem;
`;

export const AnswerList = styled.div`
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 3px solid #fdb924;
`;

export const AnswerItem = styled.div<{ $isBestAnswer?: boolean }>`
  background-color: ${({ $isBestAnswer }) =>
    $isBestAnswer ? "#fef3c7" : "white"};
  border: 1px solid
    ${({ $isBestAnswer }) => ($isBestAnswer ? "#f59e0b" : "#e5e7eb")};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  position: relative;
`;

export const BestAnswerBadge = styled.div`
  position: absolute;
  top: -0.5rem;
  left: 1rem;
  background-color: #f59e0b;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`;

export const AnswerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

export const AnswerAuthor = styled.span`
  font-weight: 600;
  color: #111827;
  margin-right: 0.5rem;
`;

export const AnswerDate = styled.span`
  color: #6b7280;
  font-size: 0.875rem;
`;

export const AnswerActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const AnswerText = styled.div`
  font-size: 0.875rem;
  line-height: 1.5;
  color: #374151;
`;

export const QuestionForm = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

export const QuestionTextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  resize: none;
  margin-bottom: 1rem;
  background-color: #ffffff;
  color: #333333;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const QuestionSubmitButton = styled.button`
  background: #fdb924;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background: #f59e0b;
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
`;

export const AnswerForm = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
  border-left: 3px solid #fdb924;
  position: relative;
`;

export const AnswerTextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  resize: none;
  margin-bottom: 1rem;
  background-color: #ffffff;
  color: #333333;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const AnswerSubmitButton = styled.button`
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  padding: 0.375rem 0.75rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);

  &:hover:not(:disabled) {
    background-color: #059669;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
  }

  &:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

export const VoteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e5e7eb;
    border-color: #9ca3af;
  }
`;

export const QuestionStats = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

export const VoteCount = styled.span`
  font-weight: 600;
  color: #111827;
`;

export const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.125rem;
  color: #6b7280;
  gap: 1rem;

  &::before {
    content: "";
    width: 32px;
    height: 32px;
    background-image: url("/favicon.ico");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.125rem;
  color: #ef4444;
  text-align: center;
  padding: 2rem;
`;

export const ModalHeaderActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  color: #6366f1;
  border: none;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  height: 28px;
  min-width: 0;
  box-shadow: none;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: #f3f4f6;
  }

  &.delete {
    color: #ef4444;
  }
`;

export const ModalHeaderButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
