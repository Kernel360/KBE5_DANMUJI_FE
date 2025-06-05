import styled from "styled-components";

export const PageContainer = styled.div``;

export const Header = styled.div`
  margin-bottom: 1.5rem; /* mb-6 */
`;

export const Title = styled.div`
  font-size: 1.875rem; /* text-3xl */
  font-weight: 800; /* font-extrabold */
  color: #1f2937; /* text-gray-800 */
  margin-bottom: 0.25rem; /* mb-1 */
`;

export const Description = styled.div`
  color: #6b7280; /* text-gray-500 */
  font-size: 1rem; /* text-base */
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem; /* mb-4 */
  gap: 0.5rem; /* gap-2 */
`;

export const SearchInput = styled.input`
  border: 1px solid #d1d5db; /* border */
  border-radius: 0.25rem; /* rounded */
  padding: 0.5rem 0.75rem; /* px-3 py-2 */
  width: 16rem; /* w-64 */
  font-size: 0.875rem; /* text-sm */

  &:focus {
    outline: none;
  }
`;

export const RegisterButton = styled.button`
  margin-left: auto; /* ml-auto */
  background-color: #3b82f6; /* bg-blue-500 */
  color: white; /* text-white */
  padding: 0.5rem 1rem; /* px-4 py-2 */
  border-radius: 0.25rem; /* rounded */
  font-size: 0.875rem; /* text-sm */
  font-weight: 600; /* font-semibold */
  cursor: pointer;

  &:hover {
    background-color: #2563eb; /* hover:bg-blue-600 */
  }
`;

export const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); /* shadow */
  background-color: white; /* bg-white */
`;

export const Table = styled.table`
  min-width: 100%;
  font-size: 0.875rem; /* text-sm */
  text-align: left;
`;

export const TableHead = styled.thead`
  background-color: #f9fafb; /* bg-gray-50 */
  border-bottom: 1px solid #e5e7eb; /* border-b */
`;

export const TableHeader = styled.th`
  padding: 0.5rem 1rem; /* px-4 py-2 */
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb; /* border-b */

  &:last-child {
    border-bottom: none; /* last:border-b-0 */
  }
`;

export const TableCell = styled.td`
  padding: 0.5rem 1rem; /* px-4 py-2 */
`;

export const StatusSpan = styled.span<{ $status: string }>`
  font-weight: 700; /* font-bold */
  ${(props) => {
    if (props.$status === "진행중")
      return "color: #10b981; /* text-green-600 */";
    if (props.$status === "대기")
      return "color: #f59e0b; /* text-yellow-600 */";
    return "color: #9ca3af; /* text-gray-400 */";
  }}
`;

export const ActionCell = styled(TableCell)`
  display: flex;
  gap: 0.5rem; /* gap-2 */
`;

export const ActionButton = styled.button<{ $variant?: "edit" | "delete" }>`
  padding: 0.25rem 0.5rem; /* px-2 py-1 */
  border-radius: 0.25rem; /* rounded */
  font-size: 0.75rem; /* text-xs */
  cursor: pointer;

  ${(props) =>
    props.$variant === "delete"
      ? `
    background-color: #fee2e2; /* bg-red-100 */
    color: #ef4444; /* text-red-500 */

    &:hover {
      background-color: #fecaca; /* hover:bg-red-200 */
    }
  `
      : `
    background-color: #e5e7eb; /* bg-gray-200 */
    color: #374151; /* text-gray-700 */

    &:hover {
      background-color: #d1d5db; /* hover:bg-gray-300 */
    }
  `}
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center; /* justify-center */
  margin-top: 1.5rem; /* mt-6 */
`;

export const PaginationNav = styled.nav`
  display: inline-flex;
  -space-x-px: 0;
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 0.25rem 0.75rem; /* px-3 py-1 */
  border: 1px solid #d1d5db; /* border */
  background-color: white; /* bg-white */
  color: #6b7280; /* text-gray-500 */
  cursor: pointer;

  &:hover {
    background-color: #f9fafb; /* hover:bg-gray-100 */
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:first-child {
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
  }

  &:last-child {
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }

  ${(props) =>
    props.$active &&
    `
    background-color: #eff6ff; /* bg-blue-50 */
    color: #2563eb; /* text-blue-600 */
    font-weight: 700; /* font-bold */
    border-color: #2563eb; /* border-blue-600 */
    z-index: 1; /* Ensure active button is on top of borders */
  `}
`;
