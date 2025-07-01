// 시간 관련 유틸리티 함수들
// 모든 시간에 +9시간(KST)을 적용

/**
 * UTC 시간을 KST(한국 표준시)로 변환
 * @param dateString - UTC 시간 문자열
 * @returns KST Date 객체
 */
export const toKST = (dateString: string | Date): Date => {
  const date = new Date(dateString);
  return new Date(date.getTime() + 9 * 60 * 60 * 1000);
};

/**
 * 날짜만 포맷팅 (YYYY-MM-DD)
 * @param dateString - 시간 문자열
 * @returns 포맷된 날짜 문자열
 */
export const formatDateOnly = (dateString: string | Date): string => {
  const kstDate = toKST(dateString);
  return kstDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

/**
 * 시간만 포맷팅 (HH:MM)
 * @param dateString - 시간 문자열
 * @returns 포맷된 시간 문자열
 */
export const formatTimeOnly = (dateString: string | Date): string => {
  const kstDate = toKST(dateString);
  return kstDate.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * 날짜와 시간 포맷팅 (YYYY-MM-DD HH:MM)
 * @param dateString - 시간 문자열
 * @returns 포맷된 날짜시간 문자열
 */
export const formatDateTime = (dateString: string | Date): string => {
  const kstDate = toKST(dateString);
  return kstDate.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * 상세한 날짜시간 포맷팅 (YYYY년 MM월 DD일 HH:MM)
 * @param dateString - 시간 문자열
 * @returns 포맷된 날짜시간 문자열
 */
export const formatDetailedDateTime = (dateString: string | Date): string => {
  const kstDate = toKST(dateString);
  return kstDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * 초까지 포함한 상세한 날짜시간 포맷팅 (YYYY-MM-DD HH:MM:SS)
 * @param dateString - 시간 문자열
 * @returns 포맷된 날짜시간 문자열
 */
export const formatFullDateTime = (dateString: string | Date): string => {
  const kstDate = toKST(dateString);
  return kstDate.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

/**
 * 상대적 시간 포맷팅 (N분 전, N시간 전, N일 전)
 * @param dateString - 시간 문자열
 * @returns 상대적 시간 문자열
 */
export const formatRelativeTime = (dateString: string | Date): string => {
  const kstDate = toKST(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - kstDate.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}시간 전`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)}일 전`;
  }
};

/**
 * 날짜 선택기용 포맷팅 (YYYY-MM-DD)
 * @param dateString - 시간 문자열
 * @returns 날짜 선택기용 포맷
 */
export const formatDateForPicker = (dateString: string | Date): string => {
  const kstDate = toKST(dateString);
  return kstDate.toISOString().split("T")[0];
};

/**
 * 현재 시간을 KST로 반환
 * @returns 현재 KST 시간
 */
export const getCurrentKST = (): Date => {
  return new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
};
