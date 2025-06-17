import styled from "styled-components";
import type { PostPriority } from "../../types/Types";

export const Wrapper = styled.div`
  padding: 24px;
  background-color: #ffffff;
`;

export const Filters = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

export const Select = styled.select`
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 100px;
  padding: 6px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
`;

export const NewButton = styled.button`
  padding: 8px 16px;
  background-color: #4f46e5;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

/* Table styles */
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

export const Thead = styled.thead`
  background-color: #f9fafb;
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f9fafb;
  }

  &:hover {
    background-color: #fdf6e3;
  }
`;

export const Th = styled.th`
  text-align: left;
  padding: 12px;
  color: #6b7280;
  font-weight: 500;
  font-size: 13px;
  border-bottom: 1px solid #e5e7eb;
`;

export const Td = styled.td`
  padding: 12px;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
`;

export const StatusBadge = styled.span<{ priority: PostPriority }>`
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ priority }) =>
    priority === "LOW"
      ? "#065f46"
      : priority === "MEDIUM"
      ? "#92400e"
      : priority === "HIGH"
      ? "#b45309"
      : "#991b1b"};
  background-color: ${({ priority }) =>
    priority === "LOW"
      ? "#d1fae5"
      : priority === "MEDIUM"
      ? "#fef3c7"
      : priority === "HIGH"
      ? "#fde68a"
      : "#fee2e2"};
`;

export const TitleText = styled.span`
  color: #111;
  font-weight: 600;
`;

export const CommentInfo = styled.span`
  color: #9ca3af;
  font-size: 0.78rem;
  margin-left: 8px;
`;
