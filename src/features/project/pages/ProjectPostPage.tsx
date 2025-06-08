import { useState } from "react";
import {
  MainContentWrapper,
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
  DetailSidebarContainer,
  DetailHeader,
  DetailTitle,
  CloseButton,
  DetailSectionWrapper,
  DetailSectionTitle,
  DetailSectionContent,
  DetailInfoGrid,
  DetailInfoItem,
  DetailInfoLabel,
  DetailInfoValue,
  AttachmentList,
  AttachmentItem,
  AttachmentLink,
  AttachmentSize,
  CommentWrapper,
  CommentHeader,
  CommentCount,
  CommentInputContainer,
  CommentInput,
  CommentButton,
  CommentList,
  CommentItem,
  CommentMeta,
  CommentAuthor,
  CommentDate,
  CommentText,
  CommentActions,
  CommentActionButton,
  PaginationList,
  PaginationItem,
  ProjectPostPageWrapper,
  TotalCountText,
  SearchIcon,
} from "./ProjectPostPage.styled";
import ProjectPostCreateModal from "../components/ProjectPostCreateModal/ProjectPostCreateModal";
import { createPost } from "../services/postService";

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
    title: "데이터베이스 설계 및 구축 작업",
    author: "이지원",
    status: "승인",
    approver: "박민수",
    approvedDate: "2023.08.20",
    createdDate: "2023.08.15",
  },
  {
    id: 9,
    title: "UI/UX 디자인 검토 요청",
    author: "최지수",
    status: "대기",
    approver: "최지수",
    approvedDate: "-",
    createdDate: "2023.08.18",
  },
  {
    id: 8,
    title: "API 개발 진행률 보고",
    author: "김현우",
    status: "승인",
    approver: "박민수",
    approvedDate: "2023.08.25",
    createdDate: "2023.08.20",
  },
  {
    id: 7,
    title: "프로젝트 요구사항 분석 보고서",
    author: "김현우",
    status: "반려",
    approver: "이지원",
    approvedDate: "2023.08.15",
    createdDate: "2023.08.10",
  },
  {
    id: 6,
    title: "고객사 회의 일정 조율",
    author: "이지원",
    status: "승인",
    approver: "김지수",
    approvedDate: "2023.08.05",
    createdDate: "2023.08.12",
  },
  {
    id: 5,
    title: "요구사항 정의서 v1.2",
    author: "이지원",
    status: "승인",
    approver: "김지수",
    approvedDate: "2023.08.05",
    createdDate: "2023.08.10",
  },
  {
    id: 4,
    title: "요구사항 정의서 v1.2",
    author: "이지원",
    status: "승인",
    approver: "김지수",
    approvedDate: "2023.08.05",
    createdDate: "2023.08.10",
  },
  {
    id: 3,
    title: "요구사항 정의서 v1.2",
    author: "이지원",
    status: "승인",
    approver: "김지수",
    approvedDate: "2023.08.05",
    createdDate: "2023.08.10",
  },
  {
    id: 2,
    title: "요구사항 정의서 v1.2",
    author: "이지원",
    status: "승인",
    approver: "김지수",
    approvedDate: "2023.08.05",
    createdDate: "2023.08.10",
  },
  {
    id: 1,
    title: "요구사항 정의서 v1.2",
    author: "이지원",
    status: "승인",
    approver: "김지수",
    approvedDate: "2023.08.05",
    createdDate: "2023.08.10",
  },
];

export default function ProjectPostPage() {
  const [activeTab, setActiveTab] = useState("작업내역");
  const [filter, setFilter] = useState("전체 상태");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [posts] = useState(initialPosts);

  const filteredPosts = posts.filter((post) => {
    const searchTermLower = searchTerm.toLowerCase();

    // Filter by status
    if (filter !== "전체 상태" && post.status !== filter) {
      return false;
    }

    // Filter by search term based on selected filter (제목, 작성자 등)
    if (searchTermLower) {
      if (post.title.toLowerCase().includes(searchTermLower)) {
        return true;
      }
      if (post.author.toLowerCase().includes(searchTermLower)) {
        return true;
      }
      // Add more fields to search if necessary
      return false;
    }

    return true; // If no search term and no status filter, include all posts
  });

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const openDetailSidebar = (postId: number) => {
    const post = posts.find((p) => p.id === postId);
    setSelectedPost(post);
  };

  const closeDetailSidebar = () => {
    setSelectedPost(null);
  };

  const handleCreatePost = async (data: PostCreateData) => {
    try {
      await createPost(data);
      // TODO: 게시글 목록 새로고침
      // 현재는 더미 데이터를 사용하고 있으므로, 실제 API 연동 시 목록을 새로고침하는 로직 추가 필요
    } catch (error) {
      console.error("게시글 생성 실패:", error);
      // TODO: 에러 처리 (예: 토스트 메시지 표시)
    }
  };

  return (
    <ProjectPostPageWrapper>
      <MainContentWrapper>
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
              <InfoLabel>담당자:</InfoLabel>
              <InfoValue $bold={true}>XYZ 소프트웨어</InfoValue>
            </ProjectInfoItem>
            <ProjectInfoItem>
              <InfoLabel>예산:</InfoLabel>
              <InfoValue $bold={true}>1억원</InfoValue>
            </ProjectInfoItem>
            <ProjectInfoItem>
              <InfoLabel>진행률:</InfoLabel>
              <InfoValue $bold={true}>75%</InfoValue>
            </ProjectInfoItem>
            <ProjectInfoItem>
              <InfoLabel>상태:</InfoLabel>
              <InfoValue $bold={true}>진행중</InfoValue>
            </ProjectInfoItem>
            <ProjectInfoItem>
              <InfoLabel>담당자:</InfoLabel>
              <InfoValue $bold={true}>이지원</InfoValue>
            </ProjectInfoItem>
          </ProjectInfoGrid>

          <ProgressBarContainer>
            <ProgressFill $progress={75} />
          </ProgressBarContainer>
          <ProgressLabel>프로젝트 진행률 65%</ProgressLabel>
        </ProjectDetailSection>

        <TabsContainer>
          <TabButton
            $active={activeTab === "작업내역"}
            onClick={() => setActiveTab("작업내역")}
          >
            작업내역
          </TabButton>
          <TabButton
            $active={activeTab === "결재내역"}
            onClick={() => setActiveTab("결재내역")}
          >
            결재내역
          </TabButton>
          <TabButton
            $active={activeTab === "산출내역"}
            onClick={() => setActiveTab("산출내역")}
          >
            산출내역
          </TabButton>
        </TabsContainer>

        <TabContent>
          {activeTab === "작업내역" && (
            <>
              <Toolbar>
                <LeftToolbar>
                  <TotalCountText>총 {filteredPosts.length}개</TotalCountText>
                  <FilterSelect
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="전체 상태">전체 상태</option>
                    <option value="승인">승인</option>
                    <option value="대기">대기</option>
                    <option value="반려">반려</option>
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
                    <SearchIcon />
                  </SearchContainer>
                  <CreateButton onClick={() => setIsCreateModalOpen(true)}>
                    게시글 작성
                  </CreateButton>
                </RightToolbar>
              </Toolbar>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>순번</TableHeader>
                      <TableHeader>작업</TableHeader>
                      <TableHeader>담당자</TableHeader>
                      <TableHeader>승인상태</TableHeader>
                      <TableHeader>결재자</TableHeader>
                      <TableHeader>작업일</TableHeader>
                      <TableHeader>완료일</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentPosts.map((post) => (
                      <TableRow
                        key={post.id}
                        onClick={() => openDetailSidebar(post.id)}
                      >
                        <TableCell>{post.id}</TableCell>
                        <TableCell>
                          <TableLink>{post.title}</TableLink>
                        </TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell className="status-cell">
                          <StatusBadge status={post.status}>
                            {post.status}
                          </StatusBadge>
                        </TableCell>
                        <TableCell>{post.approver}</TableCell>
                        <TableCell>{formatDate(post.createdDate)}</TableCell>
                        <TableCell>{formatDate(post.approvedDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <PaginationContainer>
                <PaginationNav>
                  <PaginationList>
                    <PaginationItem>
                      <PaginationButton
                        $isArrow={true}
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        &lt;
                      </PaginationButton>
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationButton
                          $active={currentPage === i + 1}
                          onClick={() => paginate(i + 1)}
                        >
                          {i + 1}
                        </PaginationButton>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationButton
                        $isArrow={true}
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        &gt;
                      </PaginationButton>
                    </PaginationItem>
                  </PaginationList>
                </PaginationNav>
              </PaginationContainer>
            </>
          )}
        </TabContent>
      </MainContentWrapper>

      {selectedPost && (
        <DetailSidebarContainer>
          <DetailHeader>
            <DetailTitle>{selectedPost.title}</DetailTitle>
            <CloseButton onClick={closeDetailSidebar}>&times;</CloseButton>
          </DetailHeader>

          <DetailInfoGrid>
            <DetailInfoItem>
              <DetailInfoLabel>승인상태:</DetailInfoLabel>
              <DetailInfoValue $status={selectedPost.status}>
                {selectedPost.status}
              </DetailInfoValue>
            </DetailInfoItem>
            <DetailInfoItem>
              <DetailInfoLabel>승인일자:</DetailInfoLabel>
              <DetailInfoValue>
                {formatDate(selectedPost.approvedDate)}
              </DetailInfoValue>
            </DetailInfoItem>
            <DetailInfoItem>
              <DetailInfoLabel>담당자:</DetailInfoLabel>
              <DetailInfoValue>{selectedPost.author}</DetailInfoValue>
            </DetailInfoItem>
            <DetailInfoItem>
              <DetailInfoLabel>결재자:</DetailInfoLabel>
              <DetailInfoValue>{selectedPost.approver}</DetailInfoValue>
            </DetailInfoItem>
            <DetailInfoItem>
              <DetailInfoLabel>고객사:</DetailInfoLabel>
              <DetailInfoValue>ABC 기업</DetailInfoValue>
            </DetailInfoItem>
            <DetailInfoItem>
              <DetailInfoLabel>완료예정일:</DetailInfoLabel>
              <DetailInfoValue>2023.08.25</DetailInfoValue>
            </DetailInfoItem>
          </DetailInfoGrid>

          <DetailSectionWrapper>
            <DetailSectionTitle>작업 설명</DetailSectionTitle>
            <DetailSectionContent>
              프로젝트의 데이터베이스 설계가 완료되었습니다. 주요 테이블 구조와
              관계 설정이 모두 마무리되었으며, 성능 최적화를 위한 인덱스 설계도
              포함되어 있습니다.
            </DetailSectionContent>
          </DetailSectionWrapper>

          <DetailSectionWrapper>
            <DetailSectionTitle>첨부 파일</DetailSectionTitle>
            <AttachmentList>
              <AttachmentItem>
                <AttachmentLink href="#">ERP_DB_ERD_v1.2.pdf</AttachmentLink>
                <AttachmentSize>2.4MB</AttachmentSize>
              </AttachmentItem>
              <AttachmentItem>
                <AttachmentLink href="#">ERP_DB_SQL_Scripts.zip</AttachmentLink>
                <AttachmentSize>1.8MB</AttachmentSize>
              </AttachmentItem>
            </AttachmentList>
          </DetailSectionWrapper>

          <CommentWrapper>
            <CommentHeader>
              <CommentCount>댓글 (3)</CommentCount>
              <span
                onClick={() => {
                  /* Add comment functionality */
                }}
              >
                질문 (1)
              </span>
            </CommentHeader>
            <CommentInputContainer>
              <CommentInput placeholder="댓글을 입력하세요..." />
              <CommentButton>등록</CommentButton>
            </CommentInputContainer>
            <CommentList>
              <CommentItem>
                <CommentMeta>
                  <CommentAuthor>박민수</CommentAuthor>
                  <CommentDate>2023.08.19</CommentDate>
                </CommentMeta>
                <CommentText>
                  ERD 검토 완료했습니다. 전체적 설계가 잘 되어 있으나, 성능
                  최적화 부분에서 추가 검토가 필요할 것 같습니다. 스키마에
                  인덱스 수정이 필요합니다.
                </CommentText>
                <CommentActions>
                  <CommentActionButton>답글</CommentActionButton>
                  <CommentActionButton>수정</CommentActionButton>
                  <CommentActionButton>삭제</CommentActionButton>
                </CommentActions>
              </CommentItem>
              <CommentItem>
                <CommentMeta>
                  <CommentAuthor>김현우</CommentAuthor>
                  <CommentDate>2023.08.12</CommentDate>
                </CommentMeta>
                <CommentText>
                  인덱스 설정에서 성능 관련 검토가 필요할 것 같습니다. 특히 복합
                  인덱스 부분은 다시 한번 확인해주세요.
                </CommentText>
                <CommentActions>
                  <CommentActionButton>답글</CommentActionButton>
                  <CommentActionButton>수정</CommentActionButton>
                  <CommentActionButton>삭제</CommentActionButton>
                </CommentActions>
              </CommentItem>
              <CommentItem>
                <CommentMeta>
                  <CommentAuthor>이지원</CommentAuthor>
                  <CommentDate>2023.08.12</CommentDate>
                </CommentMeta>
                <CommentText>
                  좋은 작업 감사합니다. 다음 단계 진행하겠습니다.
                </CommentText>
                <CommentActions>
                  <CommentActionButton>답글</CommentActionButton>
                  <CommentActionButton>수정</CommentActionButton>
                  <CommentActionButton>삭제</CommentActionButton>
                </CommentActions>
              </CommentItem>
            </CommentList>
          </CommentWrapper>
        </DetailSidebarContainer>
      )}

      <ProjectPostCreateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </ProjectPostPageWrapper>
  );
}
