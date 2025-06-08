export type PostCreateData = {
  title: string;
  content: string;
  type: "GENERAL" | "QUESTION" | "REPORT";
  status: "PENDING" | "APPROVED" | "REJECTED";
  priority: number;
  projectId: number;
};
