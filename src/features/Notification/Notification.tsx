import React from "react";
import styled, { keyframes } from "styled-components";

const fadeInOut = keyframes`
  0%, 100% { opacity: 0; transform: translateY(20px); }
  10%, 90% { opacity: 1; transform: translateY(0); }
`;

const NotificationBox = styled.div<{ success?: boolean }>`
  padding: 1rem 1.5rem;
  background-color: ${({ success }) => (success ? "#4caf50" : "#f44336")};
  color: white;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  animation: ${fadeInOut} 3s ease forwards;
  margin-bottom: 0.75rem;
`;

interface NotificationProps {
  message: string;
  success?: boolean;
}

export function Notification({ message, success }: NotificationProps) {
  return <NotificationBox success={success}>{message}</NotificationBox>;
}