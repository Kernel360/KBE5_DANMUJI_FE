import React from "react";
import styled from "styled-components";
import { Notification } from "./Notification";

const Container = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

interface NotificationItem {
  id: number;
  message: string;
  success?: boolean;
}

interface NotificationListProps {
  notifications: NotificationItem[];
  onRemove: (id: number) => void;
}

export function NotificationList({ notifications, onRemove }: NotificationListProps) {
  React.useEffect(() => {
    const timers = notifications.map(({ id }) =>
      setTimeout(() => onRemove(id), 3000)
    );

    // 컴포넌트 언마운트 또는 알림 리스트 변경 시 모든 타이머 클리어
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [notifications, onRemove]);

  return (
    <Container>
      {notifications.map(({ id, message, success }) => (
        <Notification key={id} message={message} success={success} />
      ))}
    </Container>
  );
}