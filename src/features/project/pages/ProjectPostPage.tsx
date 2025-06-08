import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPosts, createPost } from "../services/postService";
import { PostStatus } from "../types/post";
import type { Post, PostCreateData } from "../types/post";
import ProjectPostDetailModal from "../components/ProjectPostDetailModal/ProjectPostDetailModal";
import ProjectPostCreateModal from "../components/ProjectPostCreateModal/ProjectPostCreateModal";
import {
  PageContainer,
  MainContentWrapper,
  ProjectDetailSection,
  ProjectTitle,
  ProjectDescription,
  ProjectPeriod,
  ProjectInfoGrid,
  ProjectInfoItem,
  InfoLabel,
  InfoValue,
  Toolbar,
  LeftToolbar,
  RightToolbar,
  FilterSelect,
  SearchContainer,
  SearchInput,
  SearchIcon,
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
  PaginationButton,
  TabsContainer,
  TabButton,
  CreateButton,
  ProgressBarContainer,
  ProgressFill,
  ProgressLabel,
} from "./ProjectPostPage.styled";

export default function ProjectPostPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState<PostStatus | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projectInfo, setProjectInfo] = useState<Post["project"] | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const currentProjectId = parseInt(projectId || "1");
      if (isNaN(currentProjectId)) return;

      try {
        setLoading(true);
        setError(null);
        const response = await getPosts(
          currentProjectId,
          currentPage,
          10,
          statusFilter === "ALL" ? undefined : statusFilter
        );
        console.log(
          "게시글 목록 authorIp:",
          response.data.content.map((post) => ({
            postId: post.postId,
            authorIp: post.authorIp,
          }))
        );
        setPosts(response.data.content);
        setTotalPages(response.data.page.totalPages);
        if (response.data.content.length > 0) {
          setProjectInfo(response.data.content[0].project);
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes("완료")) {
          console.log(err.message);
        } else {
          setError("게시글을 불러오는 중 오류가 발생했습니다.");
          console.error("게시글 목록 조회 중 오류:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [projectId, currentPage, statusFilter]);

  const handlePostClick = (postId: number) => {
    setSelectedPostId(postId);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedPostId(null);
  };

  const handleCreateModalOpen = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreatePost = async (data: PostCreateData) => {
    try {
      setLoading(true);
      setError(null);

      // 현재 프로젝트 ID 설정
      const currentProjectId = parseInt(projectId || "1");
      if (isNaN(currentProjectId)) {
        throw new Error("유효하지 않은 프로젝트 ID입니다.");
      }

      // 게시글 생성 API 호출
      const response = await createPost({
        ...data,
        projectId: currentProjectId,
      });

      // 성공 메시지가 포함된 경우도 성공으로 처리
      if (response.success || response.message?.includes("완료")) {
        // 게시글 목록 새로고침
        const updatedPosts = await getPosts(
          currentProjectId,
          currentPage,
          10,
          statusFilter === "ALL" ? undefined : statusFilter
        );
        setPosts(updatedPosts.data.content);
        setTotalPages(updatedPosts.data.page.totalPages);

        // 모달 닫기
        handleCreateModalClose();
      } else {
        throw new Error(response.message || "게시글 생성에 실패했습니다.");
      }
    } catch (err) {
      // 성공 메시지가 포함된 경우 에러로 처리하지 않음
      if (err instanceof Error && err.message.includes("완료")) {
        console.log(err.message);
        // 게시글 목록 새로고침
        const currentProjectId = parseInt(projectId || "1");
        if (!isNaN(currentProjectId)) {
          const updatedPosts = await getPosts(
            currentProjectId,
            currentPage,
            10,
            statusFilter === "ALL" ? undefined : statusFilter
          );
          setPosts(updatedPosts.data.content);
          setTotalPages(updatedPosts.data.page.totalPages);
        }
        // 모달 닫기
        handleCreateModalClose();
      } else {
        console.error("게시글 생성 중 오류:", err);
        setError(
          err instanceof Error
            ? err.message
            : "게시글 생성 중 오류가 발생했습니다."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesStatus =
      statusFilter === "ALL" || post.status === statusFilter;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusText = (status: PostStatus) => {
    switch (status) {
      case PostStatus.PENDING:
        return "대기";
      case PostStatus.APPROVED:
        return "승인";
      case PostStatus.REJECTED:
        return "반려";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PageContainer>
      <MainContentWrapper>
        {projectInfo && (
          <ProjectDetailSection>
            <ProjectTitle>{projectInfo.name}</ProjectTitle>
            <ProjectDescription>{projectInfo.description}</ProjectDescription>
            <ProjectPeriod>
              {formatDate(projectInfo.startDate)} ~{" "}
              {formatDate(projectInfo.endDate)}
            </ProjectPeriod>
            <ProjectInfoGrid>
              <ProjectInfoItem>
                <InfoLabel>고객사</InfoLabel>
                <InfoValue>ABC기업</InfoValue>
              </ProjectInfoItem>
              <ProjectInfoItem>
                <InfoLabel>담당자</InfoLabel>
                <InfoValue>XYZ 소프트웨어</InfoValue>
              </ProjectInfoItem>
              <ProjectInfoItem>
                <InfoLabel>예산</InfoLabel>
                <InfoValue>1억원</InfoValue>
              </ProjectInfoItem>
              <ProjectInfoItem>
                <InfoLabel>진행률</InfoLabel>
                <ProgressBarContainer>
                  <ProgressFill $progress={75} />
                </ProgressBarContainer>
                <ProgressLabel>75%</ProgressLabel>
              </ProjectInfoItem>
              <ProjectInfoItem>
                <InfoLabel>유형</InfoLabel>
                <InfoValue>IT 개발</InfoValue>
              </ProjectInfoItem>
              <ProjectInfoItem>
                <InfoLabel>상태</InfoLabel>
                <InfoValue $bold>{projectInfo.status}</InfoValue>
              </ProjectInfoItem>
            </ProjectInfoGrid>
          </ProjectDetailSection>
        )}

        <TabsContainer>
          <TabButton $active={true}>게시글관리</TabButton>
          <TabButton $active={false}>질문관리</TabButton>
          <TabButton $active={false}>이력관리</TabButton>
        </TabsContainer>

        <Toolbar>
          <LeftToolbar>
            <FilterSelect
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as PostStatus | "ALL")
              }
            >
              <option value="ALL">승인상태: 전체</option>
              <option value={PostStatus.PENDING}>대기</option>
              <option value={PostStatus.APPROVED}>승인</option>
              <option value={PostStatus.REJECTED}>반려</option>
            </FilterSelect>
            <SearchContainer>
              <SearchInput
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon>🔍</SearchIcon>
            </SearchContainer>
          </LeftToolbar>
          <RightToolbar>
            <CreateButton onClick={handleCreateModalOpen}>
              + 게시글 작성
            </CreateButton>
          </RightToolbar>
        </Toolbar>

        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <TableHeader>번호</TableHeader>
                <TableHeader>제목</TableHeader>
                <TableHeader>작성자</TableHeader>
                <TableHeader>승인상태</TableHeader>
                <TableHeader>결재자</TableHeader>
                <TableHeader>결재일</TableHeader>
                <TableHeader>작성일</TableHeader>
              </tr>
            </TableHead>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.postId}>
                  <TableCell>{post.postId}</TableCell>
                  <TableCell>
                    <TableLink
                      as="button"
                      onClick={() => handlePostClick(post.postId)}
                    >
                      {post.title}
                    </TableLink>
                  </TableCell>
                  <TableCell>{post.author.name}</TableCell>
                  <TableCell>
                    <StatusBadge $status={getStatusText(post.status)}>
                      {getStatusText(post.status)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{post.approver?.name || "-"}</TableCell>
                  <TableCell>
                    {post.approvedAt ? formatDate(post.approvedAt) : "-"}
                  </TableCell>
                  <TableCell>{formatDate(post.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <PaginationContainer>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationButton
              key={i}
              $active={i === currentPage}
              onClick={() => setCurrentPage(i)}
            >
              {i + 1}
            </PaginationButton>
          ))}
        </PaginationContainer>

        <ProjectPostDetailModal
          open={isDetailModalOpen}
          onClose={handleDetailModalClose}
          postId={selectedPostId}
        />

        <ProjectPostCreateModal
          open={isCreateModalOpen}
          onClose={handleCreateModalClose}
          onSubmit={handleCreatePost}
        />
      </MainContentWrapper>
    </PageContainer>
  );
}
