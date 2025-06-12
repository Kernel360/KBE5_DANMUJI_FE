import { useEffect, useRef } from "react";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import type { Notification as RawNotification } from "@/layouts/Topbar/Topbar.types";

export const useNotification = (
  onMessage: (data: RawNotification) => void,
  onError?: (error: string) => void
) => {
  const { user } = useContext(AuthContext);
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 로그인된 상태가 아니면 SSE 연결하지 않음
    if (!user) {
      console.log('User not logged in, skipping SSE connection');
      return;
    }

    const maxRetries = 3;
    const retryDelay = 5000; // 5초

    const cleanup = () => {
      if (eventSourceRef.current) {
        console.log('Closing existing SSE connection --');
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };

    const connectEventSource = () => {
      cleanup();

      try {
        //const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
        const url = `http://localhost:8080/api/notifications/subscribe`;
        console.log('Attempting to connect to SSE at:', url);
        
        eventSourceRef.current = new EventSource(url, { withCredentials: true });

        eventSourceRef.current.onopen = () => {
          console.log('SSE connection established successfully');
          retryCountRef.current = 0;
        };

        eventSourceRef.current.onerror = (error: Event) => {
          const eventSource = eventSourceRef.current;
          console.error('SSE connection error details:', {
            readyState: eventSource?.readyState,
            // @ts-ignore - Adding additional error properties for debugging
            status: (error.target as any)?.status,
            // @ts-ignore
            statusText: (error.target as any)?.statusText,
            error
          });
          
          if (eventSource?.readyState === EventSource.CLOSED) {
            cleanup();
            
            if (retryCountRef.current < maxRetries) {
              retryCountRef.current++;
              console.log(`Retrying connection (${retryCountRef.current}/${maxRetries}) in ${retryDelay/1000}s...`);
              retryTimeoutRef.current = setTimeout(connectEventSource, retryDelay);
            } else {
              console.error('Max retries reached, giving up SSE connection');
              onError?.('실시간 알림 연결에 실패했습니다. 페이지를 새로고침 해주세요.');
            }
          }
        };

        eventSourceRef.current.addEventListener("ALERT", (e) => {
          try {
            console.log('Received SSE alert:', e.data);
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
      } catch (error) {
        console.error('Failed to create EventSource:', error);
        onError?.('알림 서비스 연결에 실패했습니다.');
      }
    };

    console.log('Initializing SSE connection for user:', user.id);
    connectEventSource();

    return cleanup;
  }, [onMessage, onError, user]);
};
