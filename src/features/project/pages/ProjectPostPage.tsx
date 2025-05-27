import React, { useState } from "react";
import ProjectPostDetailModal from "../components/ProjectPostDetailModal/ProjectPostDetailModal";
import {
  PageContainer,
  ProjectDetailSection,
  ProjectTitle,
  ProjectDescription,
  ProjectPeriod,
  ProjectInfoGrid,
  ProjectInfoItem,
  InfoLabel,
  InfoValue,
  ProgressBarContainer,
  ProgressLabel,
  ProgressBar,
  ProgressFill,
  StepsContainer,
  Step,
  StepCircle,
  StepLabel,
  TabsContainer,
  TabButton,
  TabContent,
  Toolbar,
  LeftToolbar,
  RightToolbar,
  FilterSelect,
  SearchContainer,
  SearchInput,
  CreateButton,
  TableContainer,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableLink,
  StatusBadge,
  PaginationContainer,
  PaginationNav,
  PaginationButton,
} from "./ProjectPostPage.styled";

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

export default function ProjectPostPage() {
  const [activeTab, setActiveTab] = useState("details");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [posts] = useState(initialPosts);

  const filteredPosts = posts.filter((post) => {
    const searchTermLower = searchTerm.toLowerCase();

    // Filter by status
    if (filter !== "all" && post.status !== filter) {
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

  const openModal = (postId: number) => {
    setSelectedPostId(postId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPostId(null);
  };

  return (
    <PageContainer>
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
          $active={activeTab === "details"}
          onClick={() => setActiveTab("details")}
        >
          작업 목록
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
        {activeTab === "details" && (
          <>
            {/* Toolbar */}
            <Toolbar>
              <LeftToolbar>
                <span>총 {filteredPosts.length}개</span>
                <FilterSelect
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">전체 상태</option>
                  <option value="승인">승인</option>
                  <option value="반려">반려</option>
                  <option value="대기">대기</option>
                </FilterSelect>
              </LeftToolbar>
              <RightToolbar>
                <SearchContainer>
                  <SearchInput
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </SearchContainer>
                <CreateButton onClick={() => openModal(0)}>
                  작업 추가
                </CreateButton>
              </RightToolbar>
            </Toolbar>

            {/* Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader $align="left">번호</TableHeader>
                    <TableHeader $align="left">제목</TableHeader>
                    <TableHeader $align="left">작성자</TableHeader>
                    <TableHeader $align="center">승인상태</TableHeader>
                    <TableHeader $align="left">결재자</TableHeader>
                    <TableHeader $align="center">결재일</TableHeader>
                    <TableHeader $align="center">작성일</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPosts.map((post, index) => (
                    <TableRow key={index}>
                      <TableCell $align="left">{post.id}</TableCell>
                      <TableCell $align="left">
                        <TableLink onClick={() => openModal(post.id)}>
                          {post.title}
                        </TableLink>
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

      <ProjectPostDetailModal
        open={isModalOpen}
        onClose={closeModal}
        postId={selectedPostId}
      />
    </PageContainer>
  );
}
