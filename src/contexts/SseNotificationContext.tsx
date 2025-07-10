import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { SseNotification } from '@/layouts/Topbar/Topbar.types';
import { useNotification } from '@/hooks/useNotification';
import api from '@/api/axios';

interface SseNotificationContextType {
  sseNotifications: SseNotification[];
  sseError: string | null;
  markAsRead: (id: number) => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: SseNotification) => void;
  setError: (error: string | null) => void;
}

const SseNotificationContext = createContext<SseNotificationContextType | undefined>(undefined);

export const useSseNotification = () => {
  const context = useContext(SseNotificationContext);
  if (context === undefined) {
    throw new Error('useSseNotification must be used within a SseNotificationProvider');
  }
  return context;
};

interface SseNotificationProviderProps {
  children: React.ReactNode;
}

export const SseNotificationProvider: React.FC<SseNotificationProviderProps> = ({ children }) => {
  const [sseNotifications, setSseNotifications] = useState<SseNotification[]>([]);
  const [sseError, setSseError] = useState<string | null>(null);

  const addNotification = useCallback((notification: SseNotification) => {
    setSseNotifications((prev) => {
      // 중복 알림 방지
      const isDuplicate = prev.some((n) => n.id === notification.id);
      if (isDuplicate) return prev;
      return [notification, ...prev];
    });
  }, []);

  // SSE 알림 연결
  useNotification(
    (data: any) => {
      const newSseNotification: SseNotification = {
        ...data,
        isRead: false,
      };
      addNotification(newSseNotification);
    },
    (error: string) => {
      setSseError(error);
    }
  );

  const markAsRead = useCallback(async (id: number) => {
    try {
      const notification = sseNotifications.find((n) => n.id === id);
      if (!notification) return;

      // 상태 먼저 업데이트
      setSseNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      await api.put(`/api/notifications/read/${id}`);
    } catch (error) {
      setSseError("알림 상태를 업데이트하는 중 오류가 발생했습니다.");
    }
  }, [sseNotifications]);

  const deleteNotification = useCallback(async (id: number) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      setSseNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      setSseError('알림 삭제 중 오류가 발생했습니다.');
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.put('/api/notifications/read/all');
      setSseNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (error) {
      setSseError('모든 알림을 읽음 처리하는 중 오류가 발생했습니다.');
    }
  }, []);

  const value: SseNotificationContextType = {
    sseNotifications,
    sseError,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    addNotification,
    setError: setSseError,
  };

  return (
    <SseNotificationContext.Provider value={value}>
      {children}
    </SseNotificationContext.Provider>
  );
}; 