import React, { createContext, useContext, useState, useCallback } from "react";

interface NotificationItem {
  id: number;
  message: string;
  success?: boolean;
}

interface NotificationContextProps {
  notifications: NotificationItem[];
  notify: (message: string, success?: boolean) => void;
  removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const notify = useCallback((message: string, success = true) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, success }]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, notify, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within NotificationProvider");
  return context;
};