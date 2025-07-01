// src/components/NotificationDropdown.tsx
import React, { useRef, useEffect } from "react";
import { FaBell, FaTrash } from "react-icons/fa";
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
  NotificationHeader,
  NotificationTitle,
  MarkAllAsReadButton,
  ErrorState,
} from "./NotificationDropdown.styled";
import type { SseNotification } from "@/layouts/Topbar/Topbar.types";

interface Props {
  notifications: SseNotification[];
  markAsRead: (id: number) => void;
  error: string | null;
  onDelete?: (id: number) => void;
  onMarkAllAsRead?: () => void;
}

const NotificationDropdown: React.FC<Props> = ({
  notifications,
  markAsRead,
  error,
  onDelete,
  onMarkAllAsRead
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (notification: SseNotification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const renderContent = () => {
    if (error) {
      return <ErrorState>{error}</ErrorState>;
    }

    if (notifications.length === 0) {
      return <EmptyState>알림이 없습니다</EmptyState>;
    }

    return notifications.map((n) => (
      <NotificationItem
        key={n.id}
        $isRead={n.isRead}
        onClick={() => handleNotificationClick(n)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <NotificationMessage>{n.message}</NotificationMessage>
        <NotificationTime>{n.time}</NotificationTime>
        {onDelete && (
          <button
            onClick={e => {
              e.stopPropagation();
              if (window.confirm('정말 삭제할까요?')) {
                onDelete(n.id);
              }
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              marginLeft: "8px",
              color: "#888"
            }}
            title="알림 삭제"
          >
            <FaTrash />
          </button>
        )}
      </NotificationItem>
    ));
  };

  return (
    <DropdownContainer ref={dropdownRef}>
      <NotificationButton onClick={toggleDropdown}>
        <FaBell />
        {!error && unreadCount > 0 && (
          <NotificationBadge>{unreadCount}</NotificationBadge>
        )}
      </NotificationButton>
      {isOpen && (
        <DropdownMenu>
          <NotificationHeader>
            <NotificationTitle>알림</NotificationTitle>
            {unreadCount > 0 && onMarkAllAsRead && (
              <MarkAllAsReadButton onClick={onMarkAllAsRead}>
                모두 읽음 처리
              </MarkAllAsReadButton>
            )}
          </NotificationHeader>
          <NotificationList>
            {renderContent()}
          </NotificationList>
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};

export default NotificationDropdown;