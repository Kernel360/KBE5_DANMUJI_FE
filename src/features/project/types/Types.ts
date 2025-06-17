export type PostStatus = '승인' | '대기' | '반려';

export interface Post {
  id: number;
  title: string;
  writer: string;
  status: PostStatus;
  approver: string;
  approvedAt: string;
  createdAt: string;
}