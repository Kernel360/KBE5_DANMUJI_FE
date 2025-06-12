export interface Notification {
  id: string;
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
