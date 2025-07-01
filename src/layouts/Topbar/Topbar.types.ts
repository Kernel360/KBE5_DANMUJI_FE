export interface SseNotification {
  id: number;
  message: string;
  time: string;
  isRead: boolean;
  referenceId: number;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
}
