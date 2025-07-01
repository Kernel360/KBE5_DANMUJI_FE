export interface SseNotification {
  id: number;
  message: string;
  type: string;
  time: string;
  isRead: boolean;
  referenceId: number;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
}
