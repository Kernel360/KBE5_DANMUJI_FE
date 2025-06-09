import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

export const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 16px;
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #f8f9fa;
    color: #495057;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  max-height: calc(90vh - 80px);
`;

export const QuestionSection = styled.div`
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e9ecef;
`;

export const QuestionTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 16px 0;
  line-height: 1.4;
`;

export const QuestionAuthor = styled.span`
  font-size: 14px;
  color: #6c757d;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 12px;
`;

export const QuestionDate = styled.span`
  font-size: 14px;
  color: #adb5bd;
`;

export const QuestionContent = styled.div`
  font-size: 16px;
  color: #495057;
  line-height: 1.7;
  margin: 20px 0;
  white-space: pre-wrap;
`;

export const QuestionStats = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;

  span {
    font-size: 14px;
    color: #6c757d;
    display: flex;
    align-items: center;
    gap: 4px;

    &::before {
      content: "";
      width: 4px;
      height: 4px;
      background: #6c757d;
      border-radius: 50%;
    }

    &:first-child::before {
      display: none;
    }
  }
`;

export const AnswerSection = styled.div`
  margin-top: 24px;
`;

export const AnswerSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
  }
`;

export const CreateAnswerButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #218838;
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;

  &::after {
    content: "";
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
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
  text-align: center;
  padding: 40px 20px;
  color: #721c24;

  p {
    font-size: 16px;
    margin-bottom: 16px;
  }

  button {
    background: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: #0056b3;
    }
  }
`;
