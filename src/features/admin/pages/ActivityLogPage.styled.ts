import styled from "styled-components";

export const PageContainer = styled.div`
  flex: 1;
  padding: 32px;
  background-color: #f9fafb;
  min-height: 100vh;
`;

export const Header = styled.div`
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: -7px;
  padding-left: 16px;
  position: relative;
  color: #111827;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 1.4rem;
    background: #fdb924;
    border-radius: 2px;
  }
`;

export const Description = styled.p`
  color: #bdbdbd;
  font-size: 0.9rem;
  margin-bottom: 10px;
`;

export const FilterSection = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
  align-items: flex-end;
  position: relative;
  overflow: visible;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 90px;
  position: relative;
`;

export const FilterLabel = styled.label`
  font-size: 0.92rem;
  color: #374151;
  font-weight: 500;
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 150px;
  max-width: 250px;
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

export const Select = styled.select`
  padding: 10px 14px;
  font-size: 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
  min-width: 140px;

  &:hover {
    border-color: #d1d5db;
    background-color: #f9fafb;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background-color: #ffffff;
  }

  &:active {
    transform: translateY(0);
  }

  option {
    padding: 8px 12px;
    font-size: 0.875rem;
    background: #ffffff;
    color: #374151;
  }
`;

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 40px;
  height: 40px;
  padding: 0;
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

export const SearchRight = styled.div`
  display: flex;
  gap: 10px;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
`;

export const TableContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

export const TableHead = styled.thead`
  background-color: #f9fafb;
`;

export const TableHeader = styled.th`
  text-align: left;
  padding: 12px 16px;
  color: #374151;
  font-weight: 600;
  font-size: 13px;
  border-bottom: 1px solid #e5e7eb;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  &:hover {
    background-color: #fefdf4;
    transition: background-color 0.2s ease;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

export const TableCell = styled.td`
  padding: 12px 16px;
  color: #374151;
  vertical-align: middle;
  text-align: left;
`;

export const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
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

export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;
`;

export const EmptyStateText = styled.p`
  font-size: 16px;
  margin-bottom: 8px;
`;

export const EmptyStateSubtext = styled.p`
  font-size: 14px;
  color: #9ca3af;
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px;
  color: #6b7280;
  font-size: 14px;
`;

export const ErrorMessage = styled.div`
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
`;

export const SelectButton = styled.button<{
  $hasValue: boolean;
  $color?: string;
  className?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 140px;
  padding: 8px 12px;
  background: ${({ $hasValue, $color }) =>
    $hasValue ? `${$color}15` : "#ffffff"};
  border: 2px solid
    ${({ $hasValue, $color }) => ($hasValue ? $color : "#e5e7eb")};
  border-radius: 8px;
  color: ${({ $hasValue, $color }) => ($hasValue ? $color : "#374151")};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  svg {
    flex-shrink: 0;
    color: ${({ $hasValue, $color }) => ($hasValue ? $color : "#6b7280")};
    transition: transform 0.2s ease;
  }

  &.open svg:first-child {
    transform: rotate(180deg);
  }

  .select-value {
    flex: 1;
    font-weight: ${({ $hasValue }) => ($hasValue ? "600" : "500")};
  }

  &:hover {
    background: ${({ $hasValue, $color }) =>
      $hasValue ? `${$color}25` : "#f9fafb"};
    border-color: ${({ $hasValue, $color }) =>
      $hasValue ? $color : "#d1d5db"};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const SelectDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 1000;
  margin-top: 4px;
  opacity: ${({ $isOpen }) => ($isOpen ? "1" : "0")};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transform: ${({ $isOpen }) =>
    $isOpen ? "translateY(0)" : "translateY(-8px)"};
  transition: all 0.2s ease;
  max-height: 200px;
  overflow-y: auto;

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

export const SelectOption = styled.div<{ $isSelected: boolean }>`
  padding: 10px 14px;
  font-size: 0.875rem;
  color: ${({ $isSelected }) => ($isSelected ? "#2563eb" : "#374151")};
  background: ${({ $isSelected }) => ($isSelected ? "#f0f9ff" : "#fff")};
  font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;
