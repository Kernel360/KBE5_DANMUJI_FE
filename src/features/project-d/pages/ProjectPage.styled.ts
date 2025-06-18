import styled from "styled-components";

export const PageContainer = styled.div`
  padding: 32px 48px;
  background-color: #f9fafb;
`;

export const Header = styled.div`
  margin-bottom: 32px;
`;

export const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 8px;
  padding-left: 16px;
  position: relative;
  color: #1f2937;

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
  color: #6b7280;
  font-size: 14px;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;

export const SearchInput = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  width: 16rem;
  font-size: 0.875rem;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.1);
  }
`;

export const RegisterButton = styled.button`
  margin-left: auto;
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }
`;

export const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  background-color: white;
`;

export const Table = styled.table`
  min-width: 100%;
  font-size: 14px;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

export const TableHeader = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #4b5563;
  white-space: nowrap;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  padding: 12px 16px;
  text-align: left;
  color: #374151;
  vertical-align: middle;
`;

export const StatusSpan = styled.span<{ $status: string }>`
  font-weight: 700;
  ${(props) => {
    if (props.$status === "진행중") return "color: #10b981;";
    if (props.$status === "대기") return "color: #f59e0b;";
    return "color: #9ca3af;";
  }}
`;

export const ActionCell = styled(TableCell)`
  display: flex;
  gap: 0.5rem;
`;

export const ActionButton = styled.button<{ $variant?: "edit" | "delete" }>`
  padding: 6px 12px;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  border: none;

  ${(props) =>
    props.$variant === "delete"
      ? `
    background-color: #fee2e2;
    color: #ef4444;

    &:hover {
      background-color: #fecaca;
    }
  `
      : `
    background-color: #e5e7eb;
    color: #374151;

    &:hover {
      background-color: #d1d5db;
    }
  `}
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
`;

export const PaginationNav = styled.nav``;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  background-color: white;
  color: #374151;
  cursor: pointer;

  &:hover {
    background-color: #f3f4f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:first-child {
    border-top-left-radius: 0.375rem;
    border-bottom-left-radius: 0.375rem;
  }

  &:last-child {
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
  }

  ${(props) =>
    props.$active &&
    `
    background-color: #3b82f6;
    color: #fff;
    font-weight: 600;
    border: none;
    cursor: not-allowed;
    z-index: 10;
    &:hover {
      background: #3b82f6;
    }
  `}
`;
