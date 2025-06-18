import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";

export const PageContainer = styled.div`
  padding: 32px;
  background-color: #f9fafb;
`;

export const Header = styled.div`
  margin-bottom: 36px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
  padding-left: 16px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 24px;
    background: #fdb924;
    border-radius: 2px;
  }
`;

export const Description = styled.p`
  color: #6b7280;
  font-size: 14px;
`;

export const TopFilters = styled.div`
  margin-bottom: 20px;
  font-size: 14px;
  color: #4b5563;
`;

export const TopFilterOption = styled.span<{ $active?: boolean }>`
  cursor: pointer;
  color: ${(props) => (props.$active ? "#4f46e5" : "#6b7280")};
  font-weight: ${(props) => (props.$active ? "600" : "400")};

  &:hover {
    text-decoration: ${(props) => (props.$active ? "none" : "underline")};
  }

  & + &::before {
    content: " · ";
    margin: 0 8px;
    color: #d1d5db;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 12px;
`;

export const FilterSelect = styled.select`
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  background-color: white;
  color: #374151;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 24px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 8px 12px;
  width: 256px;
  background-color: white;
`;

export const SearchInput = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #374151;
  background-color: transparent;
  padding: 0;

  &::placeholder {
    color: #9ca3af;
  }
`;

export const SearchIcon = styled(AiOutlineSearch)`
  color: #9ca3af;
  font-size: 18px;
  margin-left: 8px;
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

export const TableHeader = styled.th<{ $align?: "left" | "center" | "right" }>`
  padding: 12px 16px;
  text-align: ${(props) => props.$align || "left"};
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

export const TableCell = styled.td<{ $align?: "left" | "center" | "right" }>`
  padding: 12px 16px;
  text-align: ${(props) => props.$align || "left"};
  color: #374151;
  vertical-align: top;

  & > span:first-child {
    font-weight: 600;
    color: #1f2937;
    line-height: 1.4;
  }
  & > span:last-child {
    font-size: 12px;
    color: #6b7280;
    line-height: 1.4;
  }
`;

export const StageBadge = styled.span<{ $stage: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  ${(props) => {
    switch (props.$stage) {
      case "진행":
        return "background-color: #fef3c7; color: #92400e;";
      case "완료":
        return "background-color: #dcfce7; color: #14532d;";
      case "요구분석":
        return "background-color: #e5e7eb; color: #374151;";
      case "설계":
        return "background-color: #ccfbf1; color: #0f766e;";
      default:
        return "background-color: #e5e7eb; color: #374151;";
    }
  }}
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

export const PaginationNav = styled.nav`
  display: inline-flex;
  border-radius: 4px;
  overflow: hidden;
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-right: none;
  background-color: white;
  color: ${(props) => (props.$active ? "#ffffff" : "#6b7280")};
  background-color: ${(props) => (props.$active ? "#4f46e5" : "white")};
  border-color: ${(props) => (props.$active ? "#4f46e5" : "#d1d5db")};
  font-weight: ${(props) => (props.$active ? "600" : "400")};
  cursor: pointer;

  &:last-child {
    border-right: 1px solid #d1d5db;
  }

  &:hover {
    background-color: ${(props) => (props.$active ? "#4338ca" : "#f9fafb")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
