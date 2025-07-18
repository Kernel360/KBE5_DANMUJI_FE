import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";

export const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Header = styled.div`
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

export const Description = styled.p`
  color: #6b7280;
  font-size: 1rem;
`;

export const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

export const FilterSelect = styled.select`
  padding: 0.375rem 0.5rem;
  border: 1px solid #d1d5db !important;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.75rem;
  cursor: pointer;
  min-width: 100px;
  font-weight: 500;
  color: #374151;
  transition: all 0.1s ease;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  height: 32px;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1em;
  padding-right: 2rem;

  &:hover {
    border-color: #9ca3af !important;
    background-color: #f9fafb;
  }

  &:focus {
    outline: none !important;
    border-color: #fdb924 !important;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.1) !important;
    background-color: white;
  }

  option {
    padding: 0.25rem;
    font-weight: 500;
    font-size: 0.75rem;
  }
`;

export const SearchInput = styled.input`
  min-width: 120px;
  max-width: 180px;
  height: 32px;
  padding: 0 20px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  font-size: 1.08rem;
  color: #444;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: border 0.1s;
  appearance: none;
  position: relative;
  margin-right: 18px;
  &:focus {
    border: 1.5px solid #fdb924;
    outline: none;
  }
  &::placeholder {
    color: #9ca3af;
    font-size: 0.8rem;
  }
`;

export const SearchIcon = styled(AiOutlineSearch)`
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    color: #fdb924;
    transform: scale(1.1) translateY(-50%);
  }
`;

export const TableContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
  margin-bottom: 2rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background-color: #f9fafb;
`;

export const TableHeader = styled.th<{ $align?: "left" | "center" | "right" }>`
  padding: 1rem;
  text-align: ${({ $align }) => $align || "left"};
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  border-bottom: 1px solid #e5e7eb;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td<{ $align?: "left" | "center" | "right" }>`
  padding: 1rem;
  text-align: ${({ $align }) => $align || "left"};
  font-size: 0.875rem;
  color: #374151;
`;

export const PostTitle = styled.span`
  color: #000000;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const StatusBadge = styled.span<{ $status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${({ $status }) => {
    switch ($status) {
      case "승인":
        return "#d1fae5";
      case "대기":
        return "#fef3c7";
      case "거부":
        return "#fee2e2";
      default:
        return "#e5e7eb";
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case "승인":
        return "#059669";
      case "대기":
        return "#a16207";
      case "거부":
        return "#dc2626";
      default:
        return "#6b7280";
    }
  }};
`;

export const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.5rem;
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
  gap: 0.75rem;
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
  ${({ $active }) =>
    $active &&
    `
      background: #fdb924;
      color: #fff;
    `}
`;

export const VoteCount = styled.span`
  font-weight: 600;
  color: #111827;
`;

export const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.125rem;
  color: #6b7280;
  gap: 1rem;

  &::before {
    content: "";
    width: 32px;
    height: 32px;
    background-image: url("/favicon.ico");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.125rem;
  color: #ef4444;
  text-align: center;
  padding: 2rem;
`;

export const CreateButton = styled.button`
  background: #fdb924;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.92rem;
  font-weight: 600;
  padding: 0.38rem 0.9rem;
  min-width: 90px;
  margin-top: 0;
  margin-left: 12px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.07);
  transition: background 0.2s, box-shadow 0.2s;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  &:hover {
    background: #fbbf24;
    box-shadow: 0 2px 8px 0 rgba(253, 185, 36, 0.12);
  }
`;

export const ToolbarLeft = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
`;

export const ToolbarRight = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

export const EditButton = styled.button`
  padding: 0.375rem 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

export const DeleteButton = styled.button`
  padding: 0.375rem 0.75rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #dc2626;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
  }
`;

// 필터 영역 스타일 컴포넌트들
export const FilterSection = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

export const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

export const FilterTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

export const FilterToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
  }

  svg {
    transition: transform 0.2s ease;
  }

  &.expanded svg {
    transform: rotate(180deg);
  }
`;

export const FilterGrid = styled.div<{ $isExpanded: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
  max-height: ${({ $isExpanded }) => ($isExpanded ? "300px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease;
  opacity: ${({ $isExpanded }) => ($isExpanded ? "1" : "0")};
  transition: opacity 0.3s ease, max-height 0.3s ease;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const FilterLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.125rem;
`;

export const FilterInput = styled.input`
  padding: 0.375rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  background-color: white;
  color: #374151;
  transition: all 0.1s ease;
  height: 32px;

  &:hover {
    border-color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.1);
  }
`;

export const FilterButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
`;

export const SearchButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: #fdb924;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 32px;

  &:hover {
    background: #f59e0b;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ResetButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 32px;

  &:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
  }
`;

export const DateRangeGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: end;
`;

export const DateRangeLabel = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

// DatePicker 스타일
export const StyledDatePicker = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container input {
    padding: 0.375rem 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    background-color: white;
    color: #374151;
    transition: all 0.2s ease;
    width: 100%;
    cursor: pointer;
    height: 32px;

    &:hover {
      border-color: #9ca3af;
    }

    &:focus {
      outline: none;
      border-color: #fdb924;
      box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.1);
    }

    &::placeholder {
      color: #9ca3af;
      font-size: 0.75rem;
    }
  }
`;
