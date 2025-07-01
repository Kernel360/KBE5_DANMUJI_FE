// src/App.tsx
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { SseNotificationProvider } from "@/contexts/SseNotificationContext";
import { useApiErrorHandler } from "@/hooks/useNotification";
import AppRoutes from "@/routes/AppRoutes";
import { Sidebar } from "@/layouts/Sidebar";
import { Topbar } from "@/layouts/Topbar";
import Footer from "@/layouts/Footer/Footer";
import { AppContainer, MainContent, PageContent } from "./App.styled";
import { NotificationList } from "@/features/Notification/NotificationList";
import { useNotification as useToastNotification } from "@/features/Notification/NotificationContext";
import { setupGlobalErrorHandler } from "@/utils/errorHandler";

const LayoutWrapper = ({
  children,
}: {
  children: React.ReactNode;
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
        <Topbar />
        <PageContent>{children}</PageContent>
        <Footer />
      </MainContent>
    </AppContainer>
  );
};

function AppContent() {
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

  return (
    <>
      <NotificationList
        notifications={toastNotifications}
        onRemove={removeToastNotification}
      />
      <LayoutWrapper>
        <AppRoutes />
      </LayoutWrapper>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SseNotificationProvider>
        <Router>
          <AppContent />
        </Router>
      </SseNotificationProvider>
    </AuthProvider>
  );
}
