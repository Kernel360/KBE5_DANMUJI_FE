// src/App.tsx
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { useNotification } from "@/hooks/useNotification";
import AppRoutes from "@/AppRoutes";
import { Sidebar } from "@/layouts/Sidebar";
import { Topbar } from "@/layouts/Topbar";
import Footer from "@/layouts/Footer/Footer";
import { AppContainer, MainContent, PageContent } from "./App.styled";
import type { Notification } from "@/layouts/Topbar/Topbar.types";

const LayoutWrapper = ({
  children,
  notifications,
  markAsRead,
  error,
}: {
  children: React.ReactNode;
  notifications: Notification[];
  markAsRead: (id: string) => void;
  error: string | null;
}) => {
  const location = useLocation();
  const isAuthPage = ["/", "/login", "/forgot-password", "/reset-password"].includes(
    location.pathname
  );

  if (isAuthPage) return <>{children}</>;

  return (
    <AppContainer>
      <Sidebar />
      <MainContent>
        <Topbar 
          notifications={notifications} 
          markAsRead={markAsRead}
          error={error}
        />
        <PageContent>{children}</PageContent>
        <Footer />
      </MainContent>
    </AppContainer>
  );
};

function AppContent() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);

  useNotification(
    (data) => {
      const newNotification: Notification = {
        ...data,
        isRead: false,
      };
      setNotifications((prev) => {
        // 중복 알림 방지
        const isDuplicate = prev.some(n => n.id === newNotification.id);
        if (isDuplicate) return prev;
        return [newNotification, ...prev];
      });
    },
    (error) => {
      setError(error);
    }
  );

  const markAsRead = async (id: string) => {
    try {
      const notification = notifications.find(n => n.id === id);
      if (!notification) return;

      // 상태 먼저 업데이트
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );

      // SSE를 통해 서버에 읽음 상태 전달
      const eventSource = new EventSource(
        `${import.meta.env.VITE_API_BASE_URL}/api/notifications/${id}/read`,
        { withCredentials: true }
      );

      eventSource.onerror = () => {
        // 에러 발생 시 상태 롤백
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
        );
        setError('알림 상태를 업데이트하는 중 오류가 발생했습니다.');
        eventSource.close();
      };

      eventSource.onmessage = () => {
        // 성공적으로 처리됨
        eventSource.close();

        // 알림 클릭 시 해당 참조 페이지로 이동
        if (notification.referenceId) {
          // TODO: 알림 타입에 따른 라우팅 처리
          // window.location.href = `/reference/${notification.referenceId}`;
        }
      };
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      setError('알림 상태를 업데이트하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <LayoutWrapper 
      notifications={notifications} 
      markAsRead={markAsRead}
      error={error}
    >
      <AppRoutes />
    </LayoutWrapper>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
