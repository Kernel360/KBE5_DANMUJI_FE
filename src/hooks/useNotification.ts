import { useEffect } from "react";
import type { Notification as RawNotification } from "@/layouts/Topbar/Topbar.types";

export const useNotification = (
  onMessage: (data: RawNotification) => void,
  onError?: (error: string) => void
) => {
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 5000; // 5초

    const connectEventSource = () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
        const eventSource = new EventSource(
          `${baseUrl}/api/notifications/subscribe`,
          { withCredentials: true }
        );

        eventSource.onopen = () => {
          console.log('SSE connection established');
          retryCount = 0; // 연결 성공 시 재시도 카운트 초기화
        };

        eventSource.onerror = (error) => {
          console.error('SSE connection error:', error);
          eventSource.close();
          
          // readyState를 확인하여 연결 상태 파악
          if (eventSource.readyState === EventSource.CLOSED) {
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`Retrying connection (${retryCount}/${maxRetries}) in ${retryDelay/1000}s...`);
              setTimeout(connectEventSource, retryDelay);
            } else {
              onError?.('실시간 알림 연결에 실패했습니다. 페이지를 새로고침 해주세요.');
            }
          }
        };

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
            onError?.('알림 데이터 처리 중 오류가 발생했습니다.');
          }
        });

        return () => {
          eventSource.close();
        };
      } catch (error) {
        console.error('Failed to create EventSource:', error);
        onError?.('알림 서비스 연결에 실패했습니다.');
        return () => {};
      }
    };

    return connectEventSource();
  }, [onMessage, onError]);
};
