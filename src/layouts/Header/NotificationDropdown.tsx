// src/components/NotificationDropdown.tsx
import React from "react";
import { FaBell } from "react-icons/fa";
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
import type { Notification } from "@/layouts/Topbar/Topbar.types";

interface Props {
  notifications: Notification[];
  markAsRead: (id: string) => void;
}

const NotificationDropdown: React.FC<Props> = ({ notifications, markAsRead }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <DropdownContainer>
      <NotificationButton onClick={toggleDropdown}>
        <FaBell />
        {unreadCount > 0 && <NotificationBadge>{unreadCount}</NotificationBadge>}
      </NotificationButton>
      {isOpen && (
        <DropdownMenu>
          <NotificationList>
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <NotificationItem key={n.id} isRead={n.isRead} onClick={() => markAsRead(n.id)}>
                  <NotificationMessage>{n.message}</NotificationMessage>
                  <NotificationTime>{n.time}</NotificationTime>
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

export default NotificationDropdown;
