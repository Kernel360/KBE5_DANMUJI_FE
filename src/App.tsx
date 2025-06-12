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
}: {
  children: React.ReactNode;
  notifications: Notification[];
  markAsRead: (id: string) => void;
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
        <Topbar notifications={notifications} markAsRead={markAsRead} />
        <PageContent>{children}</PageContent>
        <Footer />
      </MainContent>
    </AppContainer>
  );
};

function AppContent() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useNotification((data) => {
    const newNotification: Notification = {
      ...data,
      isRead: false,
    };
    setNotifications((prev) => [...prev, newNotification]);
  });

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <LayoutWrapper notifications={notifications} markAsRead={markAsRead}>
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
