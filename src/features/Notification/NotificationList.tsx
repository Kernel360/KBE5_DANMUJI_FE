import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Notification } from "./Notification";

const Container = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  pointer-events: none;
`;

interface NotificationItem {
  id: number;
  message: string;
  success?: boolean;
  isVisible?: boolean;
}

interface NotificationListProps {
  notifications: NotificationItem[];
  onRemove: (id: number) => void;
}

export function NotificationList({
  notifications,
  onRemove,
}: NotificationListProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<
    NotificationItem[]
  >([]);

  useEffect(() => {
    // 새로운 알림 추가
    setVisibleNotifications((prev) => {
      const newNotifications = notifications.filter(
        (notification) =>
          !prev.find((prevNotif) => prevNotif.id === notification.id)
      );

      if (newNotifications.length > 0) {
        return [
          ...prev,
          ...newNotifications.map((notif) => ({ ...notif, isVisible: true })),
        ];
      }

      return prev;
    });
  }, [notifications]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    visibleNotifications.forEach(({ id }) => {
      // 2.5초 후에 사라지는 애니메이션 시작
      const fadeOutTimer = setTimeout(() => {
        setVisibleNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, isVisible: false } : notif
          )
        );
      }, 2500);

      // 2.8초 후에 완전히 제거
      const removeTimer = setTimeout(() => {
        onRemove(id);
        setVisibleNotifications((prev) =>
          prev.filter((notif) => notif.id !== id)
        );
      }, 2800);

      timers.push(fadeOutTimer, removeTimer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [visibleNotifications, onRemove]);

  return (
    <Container>
      {visibleNotifications.map(({ id, message, success, isVisible }) => (
        <Notification
          key={id}
          message={message}
          success={success}
          isVisible={isVisible}
        />
      ))}
    </Container>
  );
}
