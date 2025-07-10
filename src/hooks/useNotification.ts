import { useEffect, useRef } from "react";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import type { SseNotification as RawNotification } from "@/layouts/Topbar/Topbar.types";

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
      return;
    }

    const maxRetries = 3;
    const retryDelay = 5000; // 5초

    const cleanup = () => {
      if (eventSourceRef.current) {
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
        const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
        const url = `${baseUrl}/api/notifications/subscribe`;

        eventSourceRef.current = new EventSource(url, {
          withCredentials: true,
        });

        eventSourceRef.current.onopen = () => {
          retryCountRef.current = 0;
        };

        eventSourceRef.current.onerror = (error: Event) => {
          const eventSource = eventSourceRef.current;
          // console.error("SSE connection error details:", {
          //   readyState: eventSource?.readyState,
          //   // @ts-ignore - Adding additional error properties for debugging
          //   status: (error.target as any)?.status,
          //   // @ts-ignore
          //   statusText: (error.target as any)?.statusText,
          //   error,
          // });

          if (eventSource?.readyState === EventSource.CLOSED) {
            cleanup();

            if (retryCountRef.current < maxRetries) {
              retryCountRef.current++;
              retryTimeoutRef.current = setTimeout(
                connectEventSource,
                retryDelay
              );
            } else {
              onError?.(
                "실시간 알림 연결에 실패했습니다. \n페이지를 새로고침 해주세요."
              );
            }
          }
        };

        eventSourceRef.current.addEventListener("ALERT", (e) => {
          try {
            const raw = JSON.parse(e.data);
            const formatted: RawNotification = {
              id: raw.id,
              message: raw.message,
              type: raw.type,
              isRead: raw.isRead,
              projectId: raw.projectId,
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
            onError?.("알림 데이터 처리 중 오류가 발생했습니다.");
          }
        });
      } catch (error) {
        console.error("Failed to create EventSource:", error);
        onError?.("알림 서비스 연결에 실패했습니다.");
      }
    };

    connectEventSource();

    return cleanup;
  }, [onMessage, onError, user]);
};

// API 에러 처리를 위한 전역 훅
export const useApiErrorHandler = () => {
  useEffect(() => {
    const handleApiError = (event: CustomEvent) => {
      const { message, status } = event.detail;

      // 토스트 알림을 위한 이벤트 발생
      const toastEvent = new CustomEvent("show-toast", {
        detail: { message, success: false },
      });
      window.dispatchEvent(toastEvent);

    };

    window.addEventListener("api-error", handleApiError as EventListener);

    return () => {
      window.removeEventListener("api-error", handleApiError as EventListener);
    };
  }, []);
};
