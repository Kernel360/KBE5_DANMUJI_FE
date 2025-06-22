import React from "react";
import styled, { keyframes } from "styled-components";
import { FiCheck, FiX, FiAlertCircle } from "react-icons/fi";

const slideIn = keyframes`
  0% { 
    opacity: 0; 
    transform: translateX(100%) translateY(0);
  }
  100% { 
    opacity: 1; 
    transform: translateX(0) translateY(0);
  }
`;

const slideOut = keyframes`
  0% { 
    opacity: 1; 
    transform: translateX(0) translateY(0);
  }
  100% { 
    opacity: 0; 
    transform: translateX(100%) translateY(0);
  }
`;

const ToastContainer = styled.div<{ success?: boolean; isVisible: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: ${({ success }) =>
    success
      ? "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
      : "linear-gradient(135deg, #FF6B6B 0%, #ee5a52 100%)"};
  color: white;
  border-radius: 16px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);
  border: 1px solid
    ${({ success }) =>
      success ? "rgba(76, 175, 80, 0.2)" : "rgba(255, 107, 107, 0.2)"};
  animation: ${({ isVisible }) => (isVisible ? slideIn : slideOut)} 0.3s
    cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  margin-bottom: 12px;
  min-width: 280px;
  max-width: 400px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${({ success }) =>
      success ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.3)"};
  }
`;

const IconWrapper = styled.div<{ success?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
`;

const Message = styled.div`
  flex: 1;
  line-height: 1.4;
  word-break: keep-all;
`;

interface NotificationProps {
  message: string;
  success?: boolean;
  isVisible?: boolean;
}

export function Notification({
  message,
  success,
  isVisible = true,
}: NotificationProps) {
  const getIcon = () => {
    if (success) {
      return <FiCheck size={16} />;
    }
    return <FiAlertCircle size={16} />;
  };

  return (
    <ToastContainer success={success} isVisible={isVisible}>
      <IconWrapper success={success}>{getIcon()}</IconWrapper>
      <Message>{message}</Message>
    </ToastContainer>
  );
}
