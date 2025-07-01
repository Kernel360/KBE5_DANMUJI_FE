// src/App.tsx
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { useNotification, useApiErrorHandler } from "@/hooks/useNotification";
import AppRoutes from "@/routes/AppRoutes";
import { Sidebar } from "@/layouts/Sidebar";
import { Topbar } from "@/layouts/Topbar";
import Footer from "@/layouts/Footer/Footer";
import { AppContainer, MainContent, PageContent } from "./App.styled";
import { NotificationList } from "@/features/Notification/NotificationList";
import { useNotification as useToastNotification } from "@/features/Notification/NotificationContext";
import type { SseNotification } from "@/layouts/Topbar/Topbar.types";
import { setupGlobalErrorHandler } from "@/utils/errorHandler";

const LayoutWrapper = ({
  children,
  sseNotifications,
  markSseAsRead,
  sseError,
  onDeleteSse,
}: {
  children: React.ReactNode;
  sseNotifications: SseNotification[];
  markSseAsRead: (id: number) => void;
  sseError: string | null;
  onDeleteSse: (id: number) => void;
}) => {
  const location = useLocation();
  const isAuthPage = [
    "/",
    "/login",
    "/forgot-password",
    "/reset-password",
  ].includes(location.pathname);

  if (isAuthPage) return <>{children}</>;

  return (
    <AppContainer>
      <Sidebar />
      <MainContent>
        <Topbar
          notifications={sseNotifications}
          markAsRead={markSseAsRead}
          error={sseError}
          onDelete={onDeleteSse}
        />
        <PageContent>{children}</PageContent>
        <Footer />
      </MainContent>
    </AppContainer>
  );
};

function AppContent() {
  const [sseNotifications, setSseNotifications] = useState<SseNotification[]>([]);
  const [sseError, setSseError] = useState<string | null>(null);

  const {
    notifications: toastNotifications,
    removeNotification: removeToastNotification,
    notify: notifyToast,
  } = useToastNotification();

  // API 에러 핸들러 연결
  useApiErrorHandler();

  // 전역 에러 핸들러 설정
  useEffect(() => {
    setupGlobalErrorHandler();
  }, []);

  // 토스트 이벤트 리스너
  useEffect(() => {
    const handleShowToast = (event: CustomEvent) => {
      const { message, success } = event.detail;
      notifyToast(message, success);
    };

    window.addEventListener("show-toast", handleShowToast as EventListener);

    return () => {
      window.removeEventListener(
        "show-toast",
        handleShowToast as EventListener
      );
    };
  }, [notifyToast]);

  useNotification(
    (data: any) => {
      const newSseNotification: SseNotification = {
        ...data,
        isRead: false,
      };
      setSseNotifications((prev) => {
        // 중복 알림 방지
        const isDuplicate = prev.some((n) => n.id === newSseNotification.id);
        if (isDuplicate) return prev;
        return [newSseNotification, ...prev];
      });
    },
    (error: string) => {
      setSseError(error);
    }
  );

  const markSseAsRead = async (id: number) => {
    try {
      const notification = sseNotifications.find((n) => n.id === id);
      if (!notification) return;

      // 상태 먼저 업데이트
      setSseNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );

      // SSE를 통해 서버에 읽음 상태 전달
      const eventSource = new EventSource(
        `${import.meta.env.VITE_API_BASE_URL}/api/notifications/${id}/read`,
        { withCredentials: true }
      );

      eventSource.onerror = () => {
        // 에러 발생 시 상태 롤백
        setSseNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
        );
        setSseError("알림 상태를 업데이트하는 중 오류가 발생했습니다.");
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
      console.error("Failed to mark notification as read:", error);
      setSseError("알림 상태를 업데이트하는 중 오류가 발생했습니다.");
    }
  };

  // 알림 삭제 핸들러
  const handleDeleteSseNotification = (id: number) => {
    setSseNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      <NotificationList
        notifications={toastNotifications}
        onRemove={removeToastNotification}
      />
      <LayoutWrapper
        sseNotifications={sseNotifications}
        markSseAsRead={markSseAsRead}
        sseError={sseError}
        onDeleteSse={handleDeleteSseNotification}
      >
        <AppRoutes />
      </LayoutWrapper>
    </>
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
