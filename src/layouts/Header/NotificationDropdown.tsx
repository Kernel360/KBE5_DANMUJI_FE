import React, { useState } from "react";
import {
  DropdownContainer,
  NotificationButton,
  NotificationBadge,
  DropdownMenu,
  NotificationList,
  NotificationItem,
  NotificationMessage,
  NotificationTime,
  EmptyState,
} from "./NotificationDropdown.styled";
import type { Notification } from "./Header.types";
import { FaBell } from "react-icons/fa";
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
        <FaBell />
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
