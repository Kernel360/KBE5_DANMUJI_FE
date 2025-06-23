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
  margin-bottom: 8px;
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
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 18px;
`;

export const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  align-items: flex-end;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FilterLabel = styled.label`
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
`;

export const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  min-width: 250px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f9fafb;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fdb924;
    border-color: #fdb924;
    color: #ffffff;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.2);
  }
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
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px 24px;
`;

export const PaginationInfo = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

export const PaginationNav = styled.div`
  display: flex;
  gap: 4px;
`;

export const PaginationButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 40px;

  &:hover:not(:disabled) {
    background: #fdb924;
    border-color: #fdb924;
    color: #ffffff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.2);
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #6b7280;
`;

export const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #ef4444;
`;
