export interface SseNotification {
  id: number;
  message: string;
  type: string;
  time: string;
  isRead: boolean;
  projectId: number | null;
  postId: number | null;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
}
