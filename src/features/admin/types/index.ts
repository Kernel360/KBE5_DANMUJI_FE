export interface ActivityLog {
  id: number;
  userId: number;
  userName: string;
  userRole: string;
  action: string;
  targetType: string;
  targetName: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
  role: string;
}

export interface FilterOptions {
  actionFilter: string;
  logTypeFilter: string;
  userFilter: number | null;
  searchTerm: string;
}
