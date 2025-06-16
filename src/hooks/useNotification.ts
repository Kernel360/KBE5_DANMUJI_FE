import { useEffect, useRef, useCallback, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import type { Notification as RawNotification } from "@/layouts/Topbar/Topbar.types";

export const useNotification = (
  onMessage: (data: RawNotification) => void,
  onError?: (error: string) => void
) => {
  const { user } = useContext(AuthContext);
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      console.log("SSE 연결 종료");
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  const connectEventSource = useCallback(() => {
    cleanup();

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
      const url = `${baseUrl}/api/notifications/subscribe`;
      console.log("SSE 연결 시도:", url);

      const eventSource = new EventSource(url, { withCredentials: true });
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log("SSE 연결 성공");
        retryCountRef.current = 0;
      };

      eventSource.onerror = (errorEvent) => {
        const source = eventSourceRef.current;

        console.error("SSE 오류:", {
          readyState: source?.readyState,
          error: errorEvent,
        });

        if (source?.readyState === EventSource.CLOSED) {
          cleanup();
          if (retryCountRef.current < 3) {
            retryCountRef.current += 1;
            console.log(`SSE 재시도 중... (${retryCountRef.current}/3)`);
            retryTimeoutRef.current = setTimeout(connectEventSource, 5000);
          } else {
            console.error("SSE 최대 재시도 횟수 도달");
            onError?.("실시간 알림 연결 실패\n페이지를 새로고침 해주세요.");
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
          onError?.("알림 데이터 처리 중 오류가 발생했습니다.");
        }
      });
    } catch (err) {
      console.error("SSE 생성 실패:", err);
      onError?.("알림 서비스 연결 실패");
    }
  }, [cleanup, onError, onMessage]);

  useEffect(() => {
    if (!user?.id) {
      console.log("로그인 정보 없음, SSE 연결 생략");
      return;
    }

    console.log("SSE 초기화, 유저 ID:", user.id);
    connectEventSource();

    return cleanup;
  }, [user?.id, connectEventSource, cleanup]);
};
