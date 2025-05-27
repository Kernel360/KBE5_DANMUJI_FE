import React, { useState } from "react";
import styled from "styled-components";
import { AiOutlineSearch, AiOutlinePlus } from "react-icons/ai";

const PageContainer = styled.div`
  padding: 32px; /* 이미지 기준 패딩 */
  background-color: #f9fafb;
  flex-grow: 1;
`;

const ProjectDetailSection = styled.div`
  background-color: white;
  padding: 24px; /* 이미지 기준 패딩 */
  border-radius: 8px;
  margin-bottom: 24px; /* 이미지 기준 하단 마진 */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

const ProjectTitle = styled.h2`
  font-size: 20px; /* 이미지 기준 폰트 크기 */
  font-weight: 700; /* 이미지 기준 폰트 두께 */
  color: #1f2937;
  margin-bottom: 4px;
`;

const ProjectDescription = styled.p`
  font-size: 14px; /* 이미지 기준 폰트 크기 */
  color: #6b7280;
  margin-bottom: 16px; /* 이미지 기준 하단 마진 */
`;

const ProjectPeriod = styled.p`
  font-size: 14px; /* 이미지 기준 폰트 크기 */
  color: #4b5563;
  margin-bottom: 16px; /* 이미지 기준 하단 마진 */
`;

const ProjectInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px 24px; /* 행 및 열 간격 조정 */
  margin-bottom: 24px; /* 이미지 기준 하단 마진 */
  font-size: 14px; /* 이미지 기준 폰트 크기 */
  /* Ensure left alignment */
  justify-items: start; /* Align grid items to the start of their cells */
  text-align: left; /* Ensure text within is left-aligned as a fallback */
`;

const ProjectInfoItem = styled.div`
  display: flex;
  gap: 8px;
  color: #374151;
  align-items: baseline; /* Align text baselines */
`;

const InfoLabel = styled.span`
  font-weight: 600; /* 이미지 기준 폰트 두께 */
  color: #4b5563;
  min-width: 60px; /* 라벨 최소 너비 설정 */
  text-align: left; /* Explicitly left align as requested by user */
  /* Adjust margin-right if needed for space between label and value */
`;

const InfoValue = styled.span<{ $bold?: boolean }>`
  color: #374151;
  flex-grow: 1;
  text-align: left; /* Explicitly left align */
  font-weight: ${(props) =>
    props.$bold ? "700" : "400"}; /* Apply bold based on prop and image */
`;

const ProgressBarContainer = styled.div`
  margin-top: 16px; /* 이미지 기준 상단 마진 */
  /* Ensure left alignment */
  width: 100%; /* Take full width to allow progress bar to span */
`;

const ProgressLabel = styled.p`
  font-size: 14px; /* 이미지 기준 폰트 크기 */
  color: #4b5563;
  margin-bottom: 8px; /* 이미지 기준 하단 마진 */
  text-align: left; /* Explicitly left align */
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${(props) => props.$percentage}%;
  background-color: #4f46e5; /* Indigo color */
  border-radius: 4px;
`;

// Styled components for the step indicators (Re-added and styled based on image)
const StepsContainer = styled.div`
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

const Step = styled.div`
  display: flex;
  flex-direction: column; /* Arrange items vertically */
  align-items: center; /* Center circle and text horizontally within the step */
  z-index: 1; /* Ensure steps are above the line */
  position: relative; /* Needed for positioning */
`;

const StepCircle = styled.div<{ $active: boolean }>`
  width: 18px; /* Adjust size to better match image */
  height: 18px; /* Adjust size to better match image */
  border-radius: 50%;
  background-color: ${(props) =>
    props.$active ? "#4f46e5" : "#e5e7eb"}; /* Indigo or Gray */
  margin-bottom: 8px; /* Space between circle and label */
`;

const StepLabel = styled.span`
  font-size: 12px; /* 이미지 기준 폰트 크기 */
  color: #4b5563;
  white-space: nowrap; /* Prevent wrapping */
  text-align: center; /* Center text label */
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px; /* 이미지 기준 하단 마진 */
`;

const TabButton = styled.button<{ $active?: boolean }>`
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

const TabContent = styled.div`
  /* Tab content padding if needed */
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px; /* 이미지 기준 하단 마진 */
  gap: 12px;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const LeftToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const RightToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FilterSelect = styled.select`
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

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 8px 12px;
  width: 256px; /* 이미지 기준 너비 */
  background-color: white; /* 이미지 기준 배경색 */
`;

const SearchInput = styled.input`
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

const SearchIcon = styled(AiOutlineSearch)`
  color: #9ca3af;
  font-size: 18px;
  margin-right: 8px; /* 이미지 기준 간격 */
`;

const CreateButton = styled.button`
  background-color: #4f46e5; /* Indigo */
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px; /* 이미지 기준 폰트 크기 */
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px; /* 이미지 기준 아이콘과 텍스트 사이 간격 */
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #4338ca; /* Darker Indigo */
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  background-color: white;
`;

const Table = styled.table`
  min-width: 100%;
  font-size: 14px; /* 이미지 기준 폰트 크기 */
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f9fafb; /* 이미지 기준 배경색 */
  border-bottom: 1px solid #e5e7eb;
`;

const TableHeader = styled.th<{ $align?: "left" | "center" | "right" }>`
  padding: 12px 16px; /* 이미지 기준 패딩 */
  text-align: ${(props) => props.$align || "left"};
  font-weight: 600; /* 이미지 기준 폰트 두께 */
  color: #4b5563; /* 이미지 기준 글자색 */
  white-space: nowrap;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f9fafb; /* Hover effect */
  }
`;

const TableCell = styled.td<{ $align?: "left" | "center" | "right" }>`
  padding: 12px 16px; /* 이미지 기준 패딩 */
  text-align: ${(props) => props.$align || "left"};
  color: #374151; /* 이미지 기준 글자색 */
  vertical-align: middle; /* 이미지 기준 세로 정렬 */
`;

const TableLink = styled.a`
  color: #4f46e5; /* Indigo */
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 4px 8px; /* 이미지 기준 패딩 */
  border-radius: 9999px;
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px; /* 이미지 기준 상단 마진 */
`;

const PaginationNav = styled.nav`
  display: inline-flex;
  border-radius: 4px;
  overflow: hidden;
`;

const PaginationButton = styled.button<{ $active?: boolean }>`
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

// Function to format date as YYYY.MM.DD
const formatDate = (dateString: string) => {
  try {
    if (!dateString) return "-"; // Handle empty date strings
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date string provided: ${dateString}`);
      return "Invalid Date";
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}.${month}.${day}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

// Dummy data based on the provided image
const initialPosts = [
  {
    id: 10,
    title: "데이터베이스 설계 완료 보고서",
    author: "이개발",
    status: "승인",
    approver: "박관리",
    approvedDate: "2023-09-15",
    createdDate: "2023-09-10",
  },
  {
    id: 9,
    title: "UI/UX 디자인 검토 요청",
    author: "최디자인",
    status: "대기",
    approver: "-",
    approvedDate: "",
    createdDate: "2023-09-05",
  },
  {
    id: 8,
    title: "API 개발 진행 상황 보고",
    author: "정백엔드",
    status: "승인",
    approver: "박관리",
    approvedDate: "2023-08-28",
    createdDate: "2023-08-25",
  },
  {
    id: 7,
    title: "프론트엔드 프레임워크 선정 보고서",
    author: "김프론트",
    status: "반려",
    approver: "이개발",
    approvedDate: "2023-08-20",
    createdDate: "2023-08-18",
  },
  {
    id: 6,
    title: "요구사항 정의서 v1.2",
    author: "이개발",
    status: "승인",
    approver: "김고객",
    approvedDate: "2023-08-10",
    createdDate: "2023-08-05",
  },
  {
    id: 6,
    title: "요구사항 정의서 v1.2",
    author: "이개발",
    status: "승인",
    approver: "김고객",
    approvedDate: "2023-08-10",
    createdDate: "2023-08-05",
  },
  {
    id: 6,
    title: "요구사항 정의서 v1.2",
    author: "이개발",
    status: "승인",
    approver: "김고객",
    approvedDate: "2023-08-10",
    createdDate: "2023-08-05",
  },
  {
    id: 6,
    title: "요구사항 정의서 v1.2",
    author: "이개발",
    status: "승인",
    approver: "김고객",
    approvedDate: "2023-08-10",
    createdDate: "2023-08-05",
  },
  {
    id: 6,
    title: "요구사항 정의서 v1.2",
    author: "이개발",
    status: "승인",
    approver: "김고객",
    approvedDate: "2023-08-10",
    createdDate: "2023-08-05",
  },
  {
    id: 6,
    title: "요구사항 정의서 v1.2",
    author: "이개발",
    status: "승인",
    approver: "김고객",
    approvedDate: "2023-08-10",
    createdDate: "2023-08-05",
  },
];

export default function ProjectManagementPage() {
  const [activeTab, setActiveTab] = useState("게시글 관리");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("title");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [posts] = useState(initialPosts);

  const filteredPosts = posts.filter((post) => {
    const searchTermLower = search.toLowerCase();

    // Filter by status
    if (statusFilter !== "전체" && post.status !== statusFilter) {
      return false;
    }

    // Filter by search term based on selected filter (제목, 작성자 등)
    let postValue = "";
    if (filter === "title") {
      postValue = post.title.toLowerCase();
    } else if (filter === "author") {
      postValue = post.author.toLowerCase();
    } // Add more filter options as needed

    return postValue.includes(searchTermLower);
  });

  return (
    <PageContainer>
      {/* Project Detail Section */}
      <ProjectDetailSection>
        <ProjectTitle>클라우드 기반 ERP 시스템 개발</ProjectTitle>
        <ProjectDescription>
          기업 자원 관리를 위한 클라우드 기반 ERP 시스템 구축 프로젝트
        </ProjectDescription>
        <ProjectPeriod>프로젝트 기간: 2023.06.01 ~ 2023.12.31</ProjectPeriod>

        {/* Step Indicators */}
        <StepsContainer>
          <Step>
            <StepCircle $active={true} />
            <StepLabel>요구사항 분석</StepLabel>
          </Step>
          <Step>
            <StepCircle $active={true} />
            <StepLabel>설계</StepLabel>
          </Step>
          <Step>
            <StepCircle $active={true} />
            <StepLabel>개발</StepLabel>
          </Step>
          <Step>
            <StepCircle $active={false} />
            <StepLabel>테스트</StepLabel>
          </Step>
        </StepsContainer>

        <ProjectInfoGrid>
          <ProjectInfoItem>
            <InfoLabel>고객사:</InfoLabel>
            <InfoValue $bold={true}>ABC 기업</InfoValue>
          </ProjectInfoItem>
          <ProjectInfoItem>
            <InfoLabel>개발사:</InfoLabel>
            <InfoValue $bold={true}>XYZ 소프트웨어</InfoValue>
          </ProjectInfoItem>
          <ProjectInfoItem>
            <InfoLabel>담당자:</InfoLabel>
            <InfoValue $bold={true}>김고객</InfoValue>
          </ProjectInfoItem>
          <ProjectInfoItem>
            <InfoLabel>담당자:</InfoLabel>
            <InfoValue $bold={true}>이개발</InfoValue>
          </ProjectInfoItem>
          <ProjectInfoItem>
            <InfoLabel>직급:</InfoLabel>
            <InfoValue $bold={true}>IT 팀장</InfoValue>
          </ProjectInfoItem>
          <ProjectInfoItem>
            <InfoLabel>직급:</InfoLabel>
            <InfoValue $bold={true}>수석 개발자</InfoValue>
          </ProjectInfoItem>
        </ProjectInfoGrid>

        {/* Simplified Progress Bar for layout */}
        <ProgressBarContainer>
          <ProgressLabel>프로젝트 진행률: 65%</ProgressLabel>
          <ProgressBar>
            <ProgressFill $percentage={65} />
          </ProgressBar>
        </ProgressBarContainer>
      </ProjectDetailSection>

      {/* Tabs */}
      <TabsContainer>
        <TabButton
          $active={activeTab === "게시글 관리"}
          onClick={() => setActiveTab("게시글 관리")}
        >
          게시글 관리
        </TabButton>
        <TabButton
          $active={activeTab === "질문 관리"}
          onClick={() => setActiveTab("질문 관리")}
        >
          질문 관리
        </TabButton>
        <TabButton
          $active={activeTab === "이력 관리"}
          onClick={() => setActiveTab("이력 관리")}
        >
          이력 관리
        </TabButton>
      </TabsContainer>

      <TabContent>
        {activeTab === "게시글 관리" && (
          <>
            {/* Toolbar */}
            <Toolbar>
              <LeftToolbar>
                <FilterSelect
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="title">제목</option>
                  <option value="author">작성자</option>
                  {/* Add more options based on image if needed */}
                </FilterSelect>
                <SearchContainer>
                  <SearchInput
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <SearchIcon />
                </SearchContainer>
                <FilterSelect
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="전체">승인상태: 전체</option>
                  <option value="승인">승인</option>
                  <option value="반려">반려</option>
                  <option value="대기">대기</option>
                </FilterSelect>
              </LeftToolbar>
              <RightToolbar>
                <CreateButton>
                  <AiOutlinePlus size={16} /> 게시글 작성
                </CreateButton>
              </RightToolbar>
            </Toolbar>

            {/* Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <tr>
                    <TableHeader $align="left">번호</TableHeader>
                    <TableHeader $align="left">제목</TableHeader>
                    <TableHeader $align="left">작성자</TableHeader>
                    <TableHeader $align="center">승인상태</TableHeader>
                    <TableHeader $align="left">결재자</TableHeader>
                    <TableHeader $align="center">결재일</TableHeader>
                    <TableHeader $align="center">작성일</TableHeader>
                  </tr>
                </TableHead>
                <TableBody>
                  {filteredPosts.map((post, index) => (
                    <TableRow key={index}>
                      <TableCell $align="left">{post.id}</TableCell>
                      <TableCell $align="left">
                        <TableLink href="#">{post.title}</TableLink>
                      </TableCell>
                      <TableCell $align="left">{post.author}</TableCell>
                      <TableCell $align="center">
                        <StatusBadge $status={post.status}>
                          {post.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell $align="left">{post.approver}</TableCell>
                      <TableCell $align="center">
                        {formatDate(post.approvedDate)}
                      </TableCell>
                      <TableCell $align="center">
                        {formatDate(post.createdDate)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <PaginationContainer>
              <PaginationNav>
                <PaginationButton disabled>{"<"}</PaginationButton>
                <PaginationButton $active={true}>1</PaginationButton>
                <PaginationButton $active={false}>2</PaginationButton>
                <PaginationButton disabled>{">"}</PaginationButton>
              </PaginationNav>
            </PaginationContainer>
          </>
        )}
        {/* Add content for other tabs here */}
        {activeTab === "질문 관리" && <div>질문 관리 내용</div>}
        {activeTab === "이력 관리" && <div>이력 관리 내용</div>}
      </TabContent>
    </PageContainer>
  );
}
