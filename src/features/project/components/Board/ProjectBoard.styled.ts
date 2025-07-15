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
  gap: 6px;
  align-items: flex-end;
  flex-wrap: wrap;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
`;

export const FilterLabel = styled.label`
  font-size: 0.92rem;
  color: #374151;
  font-weight: 500;
`;

export const FilterSearchRight = styled.div`
  display: flex;
  gap: 3px;
  align-items: center;
  margin: 0;
  padding: 0;
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
  transition: all 0.1s ease;
  outline: none;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #fdb924;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.1);
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
  background: #f9fafb;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    border 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(107, 114, 128, 0.2);

  &:hover {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    border-color: #fef3c7;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(251, 191, 36, 0.3);
    color: #fff;
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

  tr {
    &:hover {
      background-color: #f9fafb !important;
    }
  }
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  cursor: pointer;

  &:hover {
    background-color: #fefdf4;
    transition: background-color 0.2s ease;
  }
`;

export const Th = styled.th`
  text-align: left;
  padding: 8px 6px;
  color: #6b7280;
  font-weight: 500;
  font-size: 13px;
  border-bottom: 1px solid #e5e7eb;

  &:nth-child(1) {
    /* 제목 */
    width: 200px;
    text-align: left;
  }
  &:nth-child(2) {
    /* 댓글 */
    width: 12px;
    text-align: center;
  }
  &:nth-child(3) {
    /* 작성자 */
    width: 5px;
    text-align: center;
  }
  &:nth-child(4) {
    /* 유형 */
    width: 5px;
    text-align: center;
  }
  &:nth-child(5) {
    /* 우선순위 */
    width: 5px;
    text-align: center;
  }
  &:nth-child(6) {
    /* 작성일 */
    width: 120px;
    text-align: center;
  }
`;

export const Td = styled.td`
  padding: 10px 6px;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;

  &:nth-child(1) {
    /* 제목 */
    width: 100px;
    max-width: 100px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &:nth-child(2) {
    /* 댓글 */
    width: 12px;
    text-align: center;
  }
  &:nth-child(3) {
    /* 작성자 */
    width: 5px;
    text-align: center;
  }
  &:nth-child(4) {
    /* 유형 */
    width: 5px;
    text-align: center;
  }
  &:nth-child(5) {
    /* 우선순위 */
    width: 5px;
    text-align: center;
  }
  &:nth-child(6) {
    /* 작성일 */
    width: 120px;
    text-align: center;
  }
`;

export const StatusBadge = styled.span<{ $priority: PostPriority }>`
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ $priority }) =>
    $priority === "LOW"
      ? "#065f46"
      : $priority === "MEDIUM"
      ? "#92400e"
      : $priority === "HIGH"
      ? "#a21caf"
      : "#991b1b"};
  background-color: ${({ $priority }) =>
    $priority === "LOW"
      ? "#d1fae5"
      : $priority === "MEDIUM"
      ? "#fef3c7"
      : $priority === "HIGH"
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
  margin-right: 0;
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
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
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
    color: ${({ $active, $color }) => ($active ? $color : "#2563eb")};
    transform: translateY(-1px) scale(1.04);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1), 0 2px 8px #f3f4f633;
  }

  &:active {
    transform: translateY(0) scale(1);
    box-shadow: 0 2px 4px rgba(251, 191, 36, 0.12);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.13);
  }
`;

export const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const DropdownButton = styled.button<{
  $active: boolean;
  $color: string;
  $isOpen: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: ${({ $active, $color }) => ($active ? `${$color}15` : "#ffffff")};
  color: ${({ $active, $color }) => ($active ? $color : "#374151")};
  border: 2px solid ${({ $active, $color }) => ($active ? $color : "#e5e7eb")};
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 140px;
  justify-content: space-between;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    text-align: left;
  }

  svg {
    transition: transform 0.2s;
    transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "none")};
    flex-shrink: 0;
  }

  &:hover {
    background: ${({ $active, $color }) =>
      $active ? `${$color}25` : "#f9fafb"};
    border-color: ${({ $active, $color }) => ($active ? $color : "#d1d5db")};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.1);
  }
`;

export const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 140px;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transform: ${({ $isOpen }) =>
    $isOpen ? "translateY(0)" : "translateY(-10px)"};
  transition: all 0.2s ease;
  margin-top: 4px;

  /* 화면 아래쪽에 가까울 때 위쪽으로 나타나도록 조정 */
  @media (max-height: 600px) {
    top: auto;
    bottom: 100%;
    margin-top: 0;
    margin-bottom: 4px;
  }
`;

export const DropdownItem = styled.div<{
  $active: boolean;
  $color: string;
}>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${({ $active, $color }) => ($active ? `${$color}15` : "#ffffff")};
  color: ${({ $active, $color }) => ($active ? $color : "#374151")};
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }

  svg {
    flex-shrink: 0;
  }

  &:hover {
    background: ${({ $active, $color }) =>
      $active ? `${$color}25` : "#f9fafb"};
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

export const CreatePostButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.15);
  margin: 0;

  &:hover {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border-color: #bfdbfe;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.15);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`;

export const BoardContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
`;

export const BoardTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

export const PostButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);

  &:hover {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const PostList = styled.div`
  padding: 0;
`;

export const PostItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const PostContent = styled.div`
  flex: 1;
`;

export const PostTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
`;

export const PostMeta = styled.div`
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #6b7280;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

export const PostIcon = styled.div`
  color: #9ca3af;
  transition: color 0.2s ease;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  gap: 12px;
  color: #6b7280;
  font-size: 14px;
`;

export const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  color: #ef4444;
  font-size: 14px;
`;

export const EmptyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  color: #9ca3af;
  font-size: 14px;
`;

export const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;
  gap: 0.7rem;
`;

export const PaginationInfo = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 0.825rem;
  margin-top: 0.75rem;
  margin-bottom: 0.1rem;
`;

export const PaginationNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 0.32rem 0.6rem;
  border: none;
  background: transparent;
  color: ${({ $active }) => ($active ? "#fff" : "#111827")};
  border-radius: 1.2rem;
  font-size: 0.75rem;
  font-weight: 500;
  box-shadow: none;
  cursor: pointer;
  outline: none;
  min-width: 28px;
  min-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  ${({ $active }) =>
    $active &&
    `
      background: #fdb924;
      color: #fff;
    `}

  &:hover {
    background-color: ${({ $active }) => ($active ? "#fdb924" : "#e5e7eb")};
  }
`;
