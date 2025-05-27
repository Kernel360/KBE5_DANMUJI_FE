export interface Notification {
  id: string;
  message: string;
  time: string;
  isRead: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}
