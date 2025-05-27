export interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string; // 수정 시에만 사용
  mode: "create" | "edit";
}

export interface ProjectFormData {
  title: string;
  description: string;
  customer: string;
  developer: string;
  stage: string;
  startDate: string;
  endDate: string;
}
