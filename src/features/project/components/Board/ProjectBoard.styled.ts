import styled from "styled-components";
import type { PostPriority } from "../../types/Types";

export const Wrapper = styled.div`
  padding: 24px;
  background-color: #ffffff;
`;

export const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
  align-items: flex-end;
  position: relative;
  overflow: visible;
  justify-content: space-between;
`;

export const FilterLeft = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
  flex-wrap: wrap;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 160px;
  position: relative;
`;

export const FilterLabel = styled.label`
  font-size: 0.92rem;
  color: #374151;
  font-weight: 500;
`;

export const FilterSearchRight = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
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
  min-width: 200px;
  padding: 10px 16px;
  font-size: 14px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background-color: #ffffff;
  color: #374151;
  transition: all 0.2s ease;
  outline: none;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  &:hover {
    border-color: #d1d5db;
  }
`;

export const NewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(107, 114, 128, 0.2);

  &:hover {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    border-color: #fef3c7;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(251, 191, 36, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(251, 191, 36, 0.2);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.2);
  }
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
  &:hover {
    background-color: #fefdf4;
    transition: background-color 0.2s ease;
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
      ? "#a21caf"
      : "#991b1b"};
  background-color: ${({ priority }) =>
    priority === "LOW"
      ? "#d1fae5"
      : priority === "MEDIUM"
      ? "#fef3c7"
      : priority === "HIGH"
      ? "#fce7f3"
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

export const TypeBadge = styled.span<{ type: "GENERAL" | "QUESTION" }>`
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ type }) => (type === "GENERAL" ? "#1e40af" : "#92400e")};
  background-color: ${({ type }) =>
    type === "GENERAL" ? "#dbeafe" : "#fef3c7"};
`;

export const StatusButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const StatusButton = styled.button<{ $active: boolean; $color: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${({ $active, $color }) => ($active ? `${$color}15` : "#ffffff")};
  color: ${({ $active, $color }) => ($active ? $color : "#374151")};
  border: 2px solid ${({ $active, $color }) => ($active ? $color : "#e5e7eb")};
  padding: 8px 12px;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: fit-content;
  white-space: nowrap;

  svg {
    flex-shrink: 0;
    transition: transform 0.3s ease;
  }

  span {
    font-weight: 500;
  }

  &:hover {
    background: ${({ $active, $color }) =>
      $active ? `${$color}25` : "#f9fafb"};
    border-color: ${({ $active, $color }) => ($active ? $color : "#d1d5db")};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ $color }) => `${$color}20`};
  }
`;

export const DropdownButton = styled.button<{
  $active: boolean;
  $color: string;
  $isOpen: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${({ $active, $color }) => ($active ? `${$color}15` : "#ffffff")};
  color: ${({ $active, $color }) => ($active ? $color : "#374151")};
  border: 2px solid ${({ $active, $color }) => ($active ? $color : "#e5e7eb")};
  padding: 8px 12px;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: fit-content;
  white-space: nowrap;

  svg {
    flex-shrink: 0;
    transition: transform 0.3s ease;
    transform: ${({ $isOpen }) =>
      $isOpen ? "rotate(180deg)" : "rotate(0deg)"};
  }

  span {
    font-weight: 500;
  }

  &:hover {
    background: ${({ $active, $color }) =>
      $active ? `${$color}25` : "#f9fafb"};
    border-color: ${({ $active, $color }) => ($active ? $color : "#d1d5db")};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ $color }) => `${$color}20`};
  }
`;

export const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transform: ${({ $isOpen }) =>
    $isOpen ? "translateY(0)" : "translateY(-10px)"};
  transition: all 0.2s ease;
  margin-top: 4px;
`;

export const DropdownItem = styled.button<{ $active: boolean; $color: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 8px 12px;
  background: ${({ $active, $color }) =>
    $active ? `${$color}15` : "transparent"};
  color: ${({ $active, $color }) => ($active ? $color : "#374151")};
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: ${({ $active, $color }) =>
      $active ? `${$color}25` : "#f9fafb"};
  }

  &:first-child {
    border-radius: 6px 6px 0 0;
  }

  &:last-child {
    border-radius: 0 0 6px 6px;
  }
`;

export const DropdownContainer = styled.div`
  position: relative;
`;

export const CreatePostButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
  white-space: nowrap;

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;
