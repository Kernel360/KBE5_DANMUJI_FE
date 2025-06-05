import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";

export const PageContainer = styled.div`
  padding: 32px; /* 이미지 기준 패딩 */
  background-color: #f9fafb;
  flex-grow: 1;
`;

export const ProjectDetailSection = styled.div`
  background-color: white;
  padding: 24px; /* 이미지 기준 패딩 */
  border-radius: 8px;
  margin-bottom: 24px; /* 이미지 기준 하단 마진 */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

export const ProjectTitle = styled.h2`
  font-size: 20px; /* 이미지 기준 폰트 크기 */
  font-weight: 700; /* 이미지 기준 폰트 두께 */
  color: #1f2937;
  margin-bottom: 4px;
`;

export const ProjectDescription = styled.p`
  font-size: 14px; /* 이미지 기준 폰트 크기 */
  color: #6b7280;
  margin-bottom: 16px; /* 이미지 기준 하단 마진 */
`;

export const ProjectPeriod = styled.p`
  font-size: 14px; /* 이미지 기준 폰트 크기 */
  color: #4b5563;
  margin-bottom: 16px; /* 이미지 기준 하단 마진 */
`;

export const ProjectInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px 24px; /* 행 및 열 간격 조정 */
  margin-bottom: 24px; /* 이미지 기준 하단 마진 */
  font-size: 14px; /* 이미지 기준 폰트 크기 */
  /* Ensure left alignment */
  justify-items: start; /* Align grid items to the start of their cells */
  text-align: left; /* Ensure text within is left-aligned as a fallback */
`;

export const ProjectInfoItem = styled.div`
  display: flex;
  gap: 8px;
  color: #374151;
  align-items: baseline; /* Align text baselines */
`;

export const InfoLabel = styled.span`
  font-weight: 600; /* 이미지 기준 폰트 두께 */
  color: #4b5563;
  min-width: 60px; /* 라벨 최소 너비 설정 */
  text-align: left; /* Explicitly left align as requested by user */
  /* Adjust margin-right if needed for space between label and value */
`;

export const InfoValue = styled.span<{ $bold?: boolean }>`
  color: #374151;
  flex-grow: 1;
  text-align: left; /* Explicitly left align */
  font-weight: ${(props) =>
    props.$bold ? "700" : "400"}; /* Apply bold based on prop and image */
`;

export const ProgressBarContainer = styled.div`
  margin-top: 16px; /* 이미지 기준 상단 마진 */
  /* Ensure left alignment */
  width: 100%; /* Take full width to allow progress bar to span */
`;

export const ProgressLabel = styled.p`
  font-size: 14px; /* 이미지 기준 폰트 크기 */
  color: #4b5563;
  margin-bottom: 8px; /* 이미지 기준 하단 마진 */
  text-align: left; /* Explicitly left align */
`;

export const ProgressBar = styled.div`
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${(props) => props.$percentage}%;
  background-color: #4f46e5; /* Indigo color */
  border-radius: 4px;
`;

// Styled components for the step indicators (Re-added and styled based on image)
export const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between; /* Distribute steps evenly */
  align-items: flex-start; /* Align items to the start */
  margin: 24px 0; /* Adjust margin for left alignment */
  position: relative;
  width: 100%; /* Allow container to take full width */
  max-width: 600px; /* Max width for larger screens */

  &::before {
    content: "";
    position: absolute;
    top: 9px; /* Adjust to align with circle center */
    left: 0;
    right: 0;
    height: 2px;
    background-color: #e5e7eb; /* Line color */
    z-index: 0;
  }
`;

export const Step = styled.div`
  display: flex;
  flex-direction: column; /* Arrange items vertically */
  align-items: center; /* Center circle and text horizontally within the step */
  z-index: 1; /* Ensure steps are above the line */
  position: relative; /* Needed for positioning */
`;

export const StepCircle = styled.div<{ $active: boolean }>`
  width: 18px; /* Adjust size to better match image */
  height: 18px; /* Adjust size to better match image */
  border-radius: 50%;
  background-color: ${(props) =>
    props.$active ? "#4f46e5" : "#e5e7eb"}; /* Indigo or Gray */
  margin-bottom: 8px; /* Space between circle and label */
`;

export const StepLabel = styled.span`
  font-size: 12px; /* 이미지 기준 폰트 크기 */
  color: #4b5563;
  white-space: nowrap; /* Prevent wrapping */
  text-align: center; /* Center text label */
`;

export const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px; /* 이미지 기준 하단 마진 */
`;

export const TabButton = styled.button<{ $active?: boolean }>`
  padding: 12px 24px;
  font-size: 16px; /* 이미지 기준 폰트 크기 */
  font-weight: 600; /* 이미지 기준 폰트 두께 */
  background-color: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  color: ${(props) => (props.$active ? "#4f46e5" : "#6b7280")};
  border-color: ${(props) => (props.$active ? "#4f46e5" : "transparent")};
  transition: color 0.2s ease-in-out, border-color 0.2s ease-in-out;

  &:hover {
    color: #4f46e5;
    border-color: #4f46e5;
  }
`;

export const TabContent = styled.div`
  /* Tab content padding if needed */
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px; /* 이미지 기준 하단 마진 */
  gap: 12px;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const LeftToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const RightToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const FilterSelect = styled.select`
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px; /* 이미지 기준 폰트 크기 */
  background-color: white;
  color: #374151;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 24px;
  cursor: pointer;

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
  width: 256px; /* 이미지 기준 너비 */
  background-color: white; /* 이미지 기준 배경색 */
`;

export const SearchInput = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 14px; /* 이미지 기준 폰트 크기 */
  color: #374151;
  background-color: transparent;
  padding: 0;

  &::placeholder {
    color: #9ca3af; /* 이미지 기준 플레이스홀더 색상 */
  }
`;

export const SearchIcon = styled(AiOutlineSearch)`
  color: #9ca3af;
  font-size: 18px;
  margin-right: 8px; /* 이미지 기준 간격 */
`;

export const CreateButton = styled.button`
  background-color: #4f46e5; /* Indigo */
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px; /* 이미지 기준 폰트 크기 */
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #4338ca; /* Darker Indigo */
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
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

export const TableHeader = styled.th.withConfig({
  shouldForwardProp: (prop) => !["$align"].includes(prop),
})<{ $align?: "left" | "center" | "right" }>`
  padding: 12px 16px;
  text-align: left;
  font-size: 12px; /* 이미지 기준 폰트 크기 */
  font-weight: 600; /* 이미지 기준 폰트 두께 */
  color: #4b5563;
  text-transform: uppercase; /* 이미지 기준 대문자 */
  letter-spacing: 0.05em; /* 이미지 기준 자간 */
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td.withConfig({
  shouldForwardProp: (prop) => !["$align"].includes(prop),
})<{ $align?: "left" | "center" | "right" }>`
  padding: 12px 16px;
  font-size: 14px; /* 이미지 기준 폰트 크기 */
  color: #374151;
  vertical-align: middle; /* 이미지 기준 세로 정렬 */
`;

export const TableLink = styled.button`
  color: #4f46e5;
  cursor: pointer;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  font: inherit;

  &:hover {
    text-decoration: underline;
  }
`;

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 4px 8px; /* 이미지 기준 패딩 */
  border-radius: 9999px; /* 이미지 기준 완전 둥근 모서리 */
  font-size: 12px; /* 이미지 기준 폰트 크기 */
  font-weight: 600; /* 이미지 기준 폰트 두께 */
  text-align: center;
  ${(props) => {
    switch (props.$status) {
      case "승인":
        return "background-color: #dcfce7; color: #14532d;"; // Green
      case "반려":
        return "background-color: #fee2e2; color: #991b1b;"; // Red
      case "대기":
        return "background-color: #fef9c3; color: #854d0e;"; // Yellow
      default:
        return "background-color: #e5e7eb; color: #374151;"; // Gray
    }
  }}
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center; /* 이미지 기준 중앙 정렬 */
  margin-top: 24px; /* 이미지 기준 상단 마진 */
`;

export const PaginationNav = styled.nav`
  display: inline-flex;
  border-radius: 4px; /* 이미지 기준 모서리 둥글게 */
  overflow: hidden;
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 8px 12px; /* 이미지 기준 패딩 */
  border: 1px solid #d1d5db;
  border-right: none; /* 버튼 사이 border 제거 */
  background-color: white;
  color: ${(props) => (props.$active ? "#ffffff" : "#6b7280")};
  background-color: ${(props) => (props.$active ? "#4f46e5" : "white")};
  border-color: ${(props) => (props.$active ? "#4f46e5" : "#d1d5db")};
  font-weight: ${(props) => (props.$active ? "600" : "400")};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out,
    color 0.2s ease-in-out;

  &:last-child {
    border-right: 1px solid #d1d5db; /* 마지막 버튼 border 유지 */
  }

  &:not(:disabled):hover {
    background-color: ${(props) => (props.$active ? "#4338ca" : "#f9fafb")};
    border-color: ${(props) => (props.$active ? "#4338ca" : "#d1d5db")};
    color: ${(props) => (props.$active ? "#ffffff" : "#374151")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
