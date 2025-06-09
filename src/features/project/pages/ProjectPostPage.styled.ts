import styled from "styled-components";
import { darken } from "polished";

export const PageContainer = styled.div`
  display: flex;
  /* height: 100vh; */ /* Set full viewport height */
  /* overflow: hidden; */ /* Prevent scrolling on the page container itself */
  background-color: #f0f2f5; /* Light grey background */
`;

export const MainContentWrapper = styled.div`
  flex: 1; /* Take up remaining space */
  display: flex;
  padding: 20px; /* Add padding here for the main content area */
  gap: 20px; /* Space between ProjectDetailSection and SidebarWrapper */
  /* overflow-y: auto; */ /* Enable scrolling for main content if needed */
  background-color: #ffffff; /* White background for content */
  border-radius: 8px;
  /* margin-right: 20px; */ /* Adjust margin to allow space for the new sidebar */
  flex-direction: column;
`;

export const SidebarWrapper = styled.div`
  width: 280px; /* Fixed width for the sidebar as per the image */
  background-color: #ffffff; /* White background */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow-y: auto; /* Enable scrolling for sidebar if content is long */
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky; /* Make sidebar sticky */
  top: 0; /* Stick to the top */
  height: fit-content; /* Adjust height to content */
`;

export const ProjectDetailSection = styled.div`
  flex: 1; /* Allows it to take up available space */
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 15px; /* Spacing between elements */
`;

export const ProjectTitle = styled.h1`
  font-size: 24px;
  color: #333333;
  margin-bottom: 5px;
  font-weight: bold;
`;

export const ProjectDescription = styled.p`
  font-size: 16px;
  color: #666666;
  margin-bottom: 10px;
`;

export const ProjectPeriod = styled.p`
  font-size: 14px;
  color: #999999;
  margin-bottom: 20px;
`;

export const ProjectInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

export const ProjectInfoItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 8px;
`;

export const InfoLabel = styled.span`
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 0;
  font-weight: 600;
  min-width: 60px;
`;

export const InfoValue = styled.span<{ $bold?: boolean }>`
  font-size: 14px;
  color: #374151;
  font-weight: ${(props) => (props.$bold ? "700" : "400")};
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 5px;
  height: 10px;
  overflow: hidden;
  margin-top: 10px;
`;

export const ProgressBar = styled.div`
  height: 100%;
  background-color: #4f46e5; /* Purple progress bar */
  width: 75%; /* Example width, adjust as needed */
  border-radius: 5px;
`;

export const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  background-color: #4f46e5; /* Purple progress bar */
  width: ${(props) => props.$progress}%;
  border-radius: 5px;
  transition: width 0.5s ease-in-out;
`;

export const ProgressLabel = styled.span`
  font-size: 14px;
  color: #333333;
  margin-top: 5px;
  text-align: right;
  display: block;
`;

export const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  position: relative;
  padding: 0;

  &::before {
    content: "";
    position: absolute;
    top: 9px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #e5e7eb;
    z-index: 0;
    transform: translateY(-50%);
  }
`;

export const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  flex: 1;
`;

export const StepCircle = styled.div<{ $active: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: ${(props) => (props.$active ? "#4f46e5" : "#e5e7eb")};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  margin-bottom: 8px;
  border: none;
  box-shadow: none;
`;

export const StepLabel = styled.span`
  font-size: 12px;
  color: #4b5563;
  text-align: center;
  white-space: nowrap;
`;

export const TabsContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 20px;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  border: none;
  background-color: transparent;
  font-size: 16px;
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
  color: ${(props) => (props.$active ? "#333333" : "#7f8c8d")};
  cursor: pointer;
  border-bottom: ${(props) => (props.$active ? "3px solid #4f46e5" : "none")};
  margin-bottom: -2px; /* Adjust to align with border */
  transition: all 0.3s ease;

  &:hover {
    color: #333333;
  }
`;

export const TabContent = styled.div`
  padding: 20px 0;
`;

export const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px; /* Space between left and right toolbar sections */
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
`;

export const LeftToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const RightToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #cccccc;
  border-radius: 5px;
  font-size: 14px;
  color: #333333;
  background-color: white;
  cursor: pointer;
  appearance: none; /* Remove default arrow */
  background-image: url('data:image/svg+xml;utf8,<svg fill="#333333" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 12px;

  &:focus {
    border-color: #66afe9;
    outline: none;
  }
`;

export const TotalCountText = styled.span`
  font-weight: bold;
  color: #333333;
  font-size: 14px;
`;

export const SearchContainer = styled.div`
  display: flex;
  border: 1px solid #cccccc;
  border-radius: 5px;
  overflow: hidden;
  background-color: white;
  width: 250px;
  position: relative; /* For positioning the icon */
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: none;
  font-size: 14px;
  color: #333333;
  padding-right: 35px; /* Make space for the icon */
  background-color: white;

  &:focus {
    outline: none;
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999999;
  font-size: 18px;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  width: fit-content;

  ${(props) => {
    if (props.$status === "승인")
      return `
        background-color: #d1fae5;
        color: #059669;
      `;
    if (props.$status === "대기")
      return `
        background-color: #fef9c3;
        color: #a16207;
      `;
    if (props.$status === "반려")
      return `
        background-color: #fee2e2;
        color: #dc2626;
      `;
    return `
      background-color: #e5e7eb;
      color: #4b5563;
    `;
  }}
`;

export const CreateButton = styled.button`
  background-color: #6b6b6b; /* 어두운 회색 */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap; /* 줄바꿈 방지 */

  &:hover {
    background-color: ${darken(0.05, "#6B6B6B")};
  }
`;

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background-color: #f2f2f2; /* Light grey background for header */
`;

export const TableHeader = styled.th`
  padding: 12px 15px;
  text-align: left;
  font-size: 13px;
  color: #999999;
  font-weight: 500; /* Make header text bold */
  border-bottom: 1px solid #e0e0e0;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9; /* Zebra striping */
  }
  &:hover {
    background-color: #f0f0f0; /* Highlight on hover */
  }
  border-bottom: 1px solid #e0e0e0; /* Add border bottom to rows */
`;

export const TableCell = styled.td`
  padding: 10px 15px;
  font-size: 14px;
  color: #333333;
  vertical-align: middle; /* Center content vertically */

  &.status-cell {
    text-align: center; /* Center status badge */
  }
`;

export const TableLink = styled.a`
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center; /* 페이지네이션을 가운데로 정렬 */
  align-items: center;
  gap: 8px;
  margin-top: 20px;
`;

export const PaginationNav = styled.nav``;

export const PaginationList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const PaginationItem = styled.li`
  margin: 0 5px;
`;

export const PaginationButton = styled.button<{
  $active?: boolean;
  $isArrow?: boolean;
}>`
  background-color: ${(props) => (props.$active ? "#2c3e50" : "#f5f5f5")};
  color: ${(props) => (props.$active ? "white" : "#333333")};
  border: 1px solid ${(props) => (props.$active ? "#2c3e50" : "#dddddd")};
  padding: 8px 12px;
  border-radius: 5px; /* Slightly rounded corners */
  cursor: pointer;
  font-size: 14px;
  min-width: 36px; /* Ensure consistent width for buttons */
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.$active ? darken(0.1, "#2c3e50") : "#e0e0e0"};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${(props) =>
    props.$isArrow &&
    `
    background-color: transparent;
    border: 1px solid #dddddd;
    color: #555555;
    &:hover {
      background-color: #f0f0f0;
    }
  `}
`;

export const ProjectPostPageWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
`;

/* New Styled Components for Detail Sidebar */
export const DetailSidebarContainer = styled.div`
  width: 320px; /* Adjust width as per image */
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  flex-shrink: 0;
  height: fit-content; /* Adjust height to content */
`;

export const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
`;

export const DetailTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #333333;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #999999;
  cursor: pointer;
  &:hover {
    color: #333333;
  }
`;

export const DetailSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const DetailSectionTitle = styled.h4`
  font-size: 15px;
  font-weight: bold;
  color: #555555;
  margin-bottom: 5px;
`;

export const DetailSectionContent = styled.p`
  font-size: 14px;
  color: #666666;
  line-height: 1.6;
`;

export const DetailInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two columns for label and value */
  gap: 10px 15px;
  margin-bottom: 15px;
`;

export const DetailInfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DetailInfoLabel = styled.span`
  font-size: 13px;
  color: #777777;
  margin-bottom: 2px;
`;

export const DetailInfoValue = styled.span<{ $status?: string }>`
  font-size: 14px;
  color: #333333;
  font-weight: ${(props) => (props.$status ? "bold" : "normal")};
  ${(props) => {
    if (props.$status === "승인") return "color: #28a745;";
    if (props.$status === "대기") return "color: #ffc107;";
    if (props.$status === "반려") return "color: #dc3545;";
    return "";
  }}
`;

export const AttachmentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const AttachmentItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

export const AttachmentLink = styled.a`
  color: #2c3e50;
  text-decoration: none;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
`;

export const AttachmentSize = styled.span`
  font-size: 12px;
  color: #999999;
`;

export const CommentWrapper = styled.div`
  margin-top: 20px;
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
`;

export const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

export const CommentCount = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #333333;
`;

export const CommentInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

export const CommentInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 10px;
  border: 1px solid #dddddd;
  border-radius: 5px;
  font-size: 14px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #2c3e50;
  }
`;

export const CommentButton = styled.button`
  align-self: flex-end;
  background-color: #2c3e50;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${darken(0.1, "#2c3e50")};
  }
`;

export const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const CommentItem = styled.div`
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #eee;
`;

export const CommentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const CommentAuthor = styled.span`
  font-weight: bold;
  color: #333333;
  font-size: 14px;
`;

export const CommentDate = styled.span`
  font-size: 12px;
  color: #999999;
`;

export const CommentText = styled.p`
  font-size: 14px;
  color: #555555;
  line-height: 1.5;
  margin-bottom: 10px;
`;

export const CommentActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

export const CommentActionButton = styled.button`
  background: none;
  border: none;
  color: #777777;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    color: #2c3e50;
    text-decoration: underline;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

export const EditButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #0056b3;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const DeleteButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #c82333;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
