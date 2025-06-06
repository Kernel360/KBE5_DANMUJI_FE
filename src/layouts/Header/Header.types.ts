interface UserProfileProps {
  name: string;
  company: string;
  role: string;
}

interface Notification {
  id: number;
  message: string;
  time: string;
  isRead: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  role: string;
}

export type { UserProfileProps, Notification, UserProfile };
