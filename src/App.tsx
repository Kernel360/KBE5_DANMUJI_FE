import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AppRoutes from "@/routes/AppRoutes";
import AppLayout from "@/layouts/AppLayout";
import { useNotification } from "@/hooks/useNotification";
import { useState } from "react";
import type { Notification } from "@/layouts/Topbar/Topbar.types";

function AppContent() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);

  useNotification(
    (data) => {
      const isDuplicate = notifications.some((n) => n.id === data.id);
      if (!isDuplicate) setNotifications((prev) => [data, ...prev]);
    },
    setError
  );

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    // 서버 알림 읽음 처리 (SSE or fetch)
  };

  return (
    <AppLayout notifications={notifications} markAsRead={markAsRead} error={error}>
      <AppRoutes />
    </AppLayout>
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
