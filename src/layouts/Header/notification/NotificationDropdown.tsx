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
import api from "@/api/axios";

interface Props {
  notifications: SseNotification[];
  markAsRead: (id: number) => void;
  error: string | null;
  onDelete?: (id: number) => void;
}

const NotificationDropdown: React.FC<Props> = ({ notifications, markAsRead, error, onDelete }) => {
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

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/api/notifications/mark-all-read');
      notifications.forEach(n => {
        if (!n.isRead) {
          markAsRead(n.id);
        }
      });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (id: number) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      if (onDelete) onDelete(id);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

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
        isRead={n.isRead} 
        onClick={() => handleNotificationClick(n)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div>
          <NotificationMessage>{n.message}</NotificationMessage>
          <NotificationTime>{n.time}</NotificationTime>
        </div>
        <button
          onClick={e => {
            e.stopPropagation();
            handleDeleteNotification(n.id);
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
            {unreadCount > 0 && (
              <MarkAllAsReadButton onClick={handleMarkAllAsRead}>
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
