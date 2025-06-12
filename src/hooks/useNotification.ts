import { useEffect } from "react";
import type { Notification as RawNotification } from "@/layouts/Topbar/Topbar.types";

export const useNotification = (
  onMessage: (data: RawNotification) => void
) => {
  useEffect(() => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}api/notifications/subscribe`,
      { withCredentials: true }
    );

    eventSource.addEventListener("ALERT", (e) => {
      try {
        const raw = JSON.parse(e.data);
        const formatted: RawNotification = {
          id: raw.id,
          message: raw.message,
          isRead: raw.isRead,
          referenceId: raw.referenceId,
          time: new Date(raw.createdAt).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        };
        onMessage(formatted);
      } catch (err) {
        console.error("알림 파싱 오류:", err);
      }
    });

    return () => eventSource.close();
  }, [onMessage]);
};
