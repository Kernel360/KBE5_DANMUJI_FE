interface UserProfileProps {
  name: string;
  company: string;
  role: string;
  initial: string;
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
  avatar?: string;
}

export type { UserProfileProps, Notification, UserProfile };
