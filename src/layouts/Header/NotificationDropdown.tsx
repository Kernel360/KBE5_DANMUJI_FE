import React, { useState } from "react";
import styled from "styled-components";
import type { Notification } from "./Header.types";

const DropdownContainer = styled.div`
  position: relative;
`;

const NotificationButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  color: #6b7280;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background-color: #ef4444;
  border-radius: 4px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 50;
`;

const NotificationList = styled.div`
  padding: 8px 0;
`;

const NotificationItem = styled.div<{ isRead: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  background-color: ${({ isRead }) => (isRead ? "transparent" : "#f9fafb")};

  &:hover {
    background-color: #f3f4f6;
  }
`;

const NotificationMessage = styled.div`
  font-size: 14px;
  color: #111827;
  margin-bottom: 4px;
`;

const NotificationTime = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const EmptyState = styled.div`
  padding: 24px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
`;

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  return (
    <DropdownContainer>
      <NotificationButton onClick={toggleDropdown}>
        🔔
        {notifications.some((n) => !n.isRead) && <NotificationBadge />}
      </NotificationButton>
      {isOpen && (
        <DropdownMenu>
          <NotificationList>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  isRead={notification.isRead}
                  onClick={() => markAsRead(notification.id)}
                >
                  <NotificationMessage>
                    {notification.message}
                  </NotificationMessage>
                  <NotificationTime>{notification.time}</NotificationTime>
                </NotificationItem>
              ))
            ) : (
              <EmptyState>알림이 없습니다</EmptyState>
            )}
          </NotificationList>
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};
