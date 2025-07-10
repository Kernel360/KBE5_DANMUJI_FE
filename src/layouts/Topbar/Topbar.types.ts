export interface SseNotification {
  id: number;
  message: string;
  type: string;
  time: string;
  isRead: boolean;
  projectId: number | null;
  referenceId: number | null;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
}
