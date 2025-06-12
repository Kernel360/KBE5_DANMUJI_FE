import React, { useState, useEffect, useCallback, type JSX } from "react";
import {
  AiOutlineFileText,
  AiOutlineSearch,
  AiOutlineReload,
} from "react-icons/ai";
import {
  getPostsWithComments,
  searchPosts,
} from "@/features/project/services/postService";
import type { Post, PostStatus, PostType } from "@/features/project/types/post";
import {
  PageContainer,
  Header,
  Title,
  Description,
  FilterSelect,
  SearchInput,
  TableContainer,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  PostTitle,
  StatusBadge,
  PaginationContainer,
  PaginationInfo,
  PaginationNav,
  PaginationButton,
  LoadingSpinner,
  ErrorMessage,
  CreateButton,
  FilterSection,
  FilterHeader,
  FilterToggleButton,
  FilterGrid,
  FilterGroup,
  FilterLabel,
  FilterButtonGroup,
  SearchButton,
  ResetButton,
} from "./PostListPage.styled";
import PostDetailModal from "../components/Post/DetailModal/ProjectPostDetailModal";
import PostFormModal from "../components/Post/FormModal/PostFormModal";

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("ko-KR", options);
};

const getStatusText = (status: PostStatus) => {
  switch (status) {
    case "PENDING":
      return "대기";
    case "APPROVED":
      return "승인";
    case "REJECTED":
      return "거부";
    default:
      return status;
  }
};

const getTypeText = (type: PostType) => {
  switch (type) {
    case "NOTICE":
      return "공지";
    case "GENERAL":
      return "일반";
    case "REPORT":
      return "보고";
    default:
      return type;
  }
};

const getPriorityText = (priority: number) => {
  switch (priority) {
    case 1:
      return "낮음";
    case 2:
      return "보통";
    case 3:
      return "높음";
    default:
      return priority.toString();
  }
};

const getPriorityStyle = (priority: number) => {
  switch (priority) {
    case 1:
      return {
        background: "#d1fae5",
        color: "#059669",
      };
    case 2:
      return {
        background: "#fef3c7",
        color: "#d97706",
      };
    case 3:
      return {
        background: "#fee2e2",
        color: "#dc2626",
      };
    default:
      return {
        background: "#f3f4f6",
        color: "#6b7280",
      };
  }
};

const stepName = "설계"; // TODO: 실제 단계명 연동 시 교체

export default function PostListPage() {
  const stepId = 1; // 임시로 단계 ID 1 사용
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [itemsPerPage] = useState(10);

  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"title" | "content" | "author">(
    "title"
  );
  const [statusFilter, setStatusFilter] = useState<PostStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<PostType | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<number | "ALL">("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  // 실제 검색에 사용될 상태 (검색 버튼 클릭 시 업데이트)
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [activeSearchType, setActiveSearchType] = useState<
    "title" | "content" | "author"
  >("title");
  const [activeStatusFilter, setActiveStatusFilter] = useState<
    PostStatus | "ALL"
  >("ALL");
  const [activeTypeFilter, setActiveTypeFilter] = useState<PostType | "ALL">(
    "ALL"
  );
  const [activePriorityFilter, setActivePriorityFilter] = useState<
    number | "ALL"
  >("ALL");
  const [activeAssigneeFilter, setActiveAssigneeFilter] = useState("");
  const [activeClientFilter, setActiveClientFilter] = useState("");

  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formModalMode, setFormModalMode] = useState<"create" | "edit">(
    "create"
  );
  const [formModalPostId, setFormModalPostId] = useState<number | null>(null);
  const [formModalParentId, setFormModalParentId] = useState<number | null>(
    null
  );

  // 모든 프로젝트의 게시글을 가져오는 함수 (임시로 프로젝트 ID 1 사용)
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let response;

      // 검색어나 필터가 있는 경우 검색 API 사용
      const hasFilters =
        activeSearchTerm.trim() ||
        activeStatusFilter !== "ALL" ||
        activeTypeFilter !== "ALL" ||
        activePriorityFilter !== "ALL" ||
        activeAssigneeFilter !== "" ||
        activeClientFilter !== "";

      if (hasFilters) {
        const searchParams: {
          status?: PostStatus;
          type?: PostType;
          priority?: number;
          author?: string;
          clientCompany?: string;
          title?: string;
        } = {
          status: activeStatusFilter === "ALL" ? undefined : activeStatusFilter,
          type: activeTypeFilter === "ALL" ? undefined : activeTypeFilter,
          priority:
            activePriorityFilter === "ALL" ? undefined : activePriorityFilter,
          author:
            activeAssigneeFilter === "" ? undefined : activeAssigneeFilter,
          clientCompany:
            activeClientFilter === "" ? undefined : activeClientFilter,
        };

        // 검색 타입에 따라 다른 필드 설정
        if (activeSearchType === "title") {
          searchParams.title = activeSearchTerm;
        } else if (activeSearchType === "content") {
          // content 검색은 새로운 API에서 지원하지 않으므로 title로 대체
          searchParams.title = activeSearchTerm;
        } else if (activeSearchType === "author") {
          searchParams.author = activeSearchTerm;
        }

        console.log("검색 파라미터:", searchParams);
        console.log("활성 검색 상태:", {
          activeSearchTerm,
          activeSearchType,
          activeStatusFilter,
          activeTypeFilter,
          activePriorityFilter,
          activeAssigneeFilter,
          activeClientFilter,
        });

        response = await searchPosts(
          stepId,
          searchParams,
          currentPage,
          itemsPerPage
        );
      } else {
        // 검색어도 없고 필터도 없는 경우에만 일반 목록 API 사용
        response = await getPostsWithComments(
          stepId,
          currentPage,
          itemsPerPage
        );
      }

      if (response.data) {
        setPosts(response.data.content);
        setTotalPages(response.data.page.totalPages);
        setTotalElements(response.data.page.totalElements);

        // 현재 페이지에 게시글이 없고, 총 페이지가 1보다 크면 이전 페이지로 이동
        if (
          response.data.content.length === 0 &&
          response.data.page.totalPages > 1 &&
          response.data.page.number > 0
        ) {
          setCurrentPage(response.data.page.number - 1);
        }
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes("완료")) {
        // 완료 메시지는 무시
      } else {
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
        console.error("게시글 목록 조회 중 오류:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [
    activeSearchTerm,
    activeSearchType,
    activeStatusFilter,
    activeTypeFilter,
    activePriorityFilter,
    activeAssigneeFilter,
    activeClientFilter,
    currentPage,
    itemsPerPage,
    stepId,
  ]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePostClick = (postId: number) => {
    setSelectedPostId(postId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPostId(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(); // 검색 함수 호출
    }
  };

  const handleSearch = () => {
    setCurrentPage(0);
    setActiveSearchTerm(searchTerm);
    setActiveSearchType(searchType);
    setActiveStatusFilter(statusFilter);
    setActiveTypeFilter(typeFilter);
    setActivePriorityFilter(priorityFilter);
    setActiveAssigneeFilter(assigneeFilter);
    setActiveClientFilter(clientFilter);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value as PostStatus | "ALL");
  };

  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value as PostType | "ALL");
  };

  const handlePriorityFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPriorityFilter(
      e.target.value === "ALL" ? "ALL" : Number(e.target.value)
    );
  };

  const handleCreatePost = () => {
    setFormModalMode("create");
    setFormModalPostId(null);
    setFormModalParentId(null);
    setIsFormModalOpen(true);
  };

  const handleEditPost = (postId: number) => {
    setFormModalMode("edit");
    setFormModalPostId(postId);
    setFormModalParentId(null);
    setIsFormModalOpen(true);
  };

  const handleReplyPost = (parentId: number) => {
    setFormModalMode("create");
    setFormModalPostId(null);
    setFormModalParentId(parentId);
    setIsFormModalOpen(true);
  };

  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
    setFormModalPostId(null);
    setFormModalParentId(null);
  };

  const handleFormModalSuccess = () => {
    // 게시글 목록 새로고침
    fetchPosts();
  };

  const handlePostDelete = () => {
    // 게시글 삭제 후 목록 새로고침 (백엔드에서 삭제된 게시글 제외하고 반환)
    fetchPosts();
  };

  // 필터 관련 핸들러 함수들
  const handleFilterToggle = () => {
    setIsFilterExpanded(!isFilterExpanded);
  };

  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value as "title" | "content" | "author");
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSearchType("title");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setPriorityFilter("ALL");
    setAssigneeFilter("");
    setClientFilter("");
    setCurrentPage(0);

    // 실제 검색 상태도 초기화
    setActiveSearchTerm("");
    setActiveSearchType("title");
    setActiveStatusFilter("ALL");
    setActiveTypeFilter("ALL");
    setActivePriorityFilter("ALL");
    setActiveAssigneeFilter("");
    setActiveClientFilter("");
  };

  if (loading && posts.length === 0) {
    return (
      <PageContainer>
        <LoadingSpinner>로딩 중...</LoadingSpinner>
      </PageContainer>
    );
  }

  if (error && posts.length === 0) {
    return (
      <PageContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>{stepName}</Title>
        <Description>
          프로젝트 단계에 해당하는 게시글을 확인하고 소통하세요!
        </Description>
      </Header>

      {/* 필터링 검색 영역 */}
      <FilterSection>
        <FilterHeader>
          <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "#333" }}>
            검색 및 필터
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FilterToggleButton onClick={handleFilterToggle}>
              {isFilterExpanded ? "필터 접기" : "필터 펼치기"}
              <AiOutlineReload size={16} />
            </FilterToggleButton>
            <CreateButton
              style={{
                fontSize: "0.92rem",
                padding: "0.38rem 0.9rem",
                minWidth: 90,
              }}
              onClick={handleCreatePost}
            >
              <AiOutlineFileText size={15} style={{ marginBottom: 1 }} /> 게시글
              작성
            </CreateButton>
          </div>
        </FilterHeader>

        <FilterGrid $isExpanded={isFilterExpanded}>
          {/* 검색어 입력 */}
          <FilterGroup>
            <FilterLabel htmlFor="searchTypeSelect">검색 기준</FilterLabel>
            <FilterSelect
              id="searchTypeSelect"
              value={searchType}
              onChange={handleSearchTypeChange}
              style={{ marginBottom: 0, marginRight: 0 }}
            >
              <option value="title">제목</option>
              <option value="author">작성자</option>
            </FilterSelect>
            <div style={{ position: "relative", width: "100%" }}>
              <SearchInput
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleSearchKeyPress}
                placeholder={
                  searchType === "title"
                    ? "게시글 제목을 입력하세요"
                    : "작성자명을 입력하세요"
                }
              />
            </div>
          </FilterGroup>

          {/* 상태 필터 */}
          <FilterGroup>
            <FilterLabel>상태</FilterLabel>
            <FilterSelect
              onChange={handleStatusFilterChange}
              value={statusFilter}
            >
              <option value="ALL">전체 상태</option>
              <option value="PENDING">대기</option>
              <option value="APPROVED">승인</option>
              <option value="REJECTED">거부</option>
            </FilterSelect>
          </FilterGroup>

          {/* 유형 필터 */}
          <FilterGroup>
            <FilterLabel>유형</FilterLabel>
            <FilterSelect onChange={handleTypeFilterChange} value={typeFilter}>
              <option value="ALL">전체 유형</option>
              <option value="GENERAL">일반</option>
              <option value="NOTICE">공지</option>
              <option value="REPORT">보고</option>
            </FilterSelect>
          </FilterGroup>

          {/* 우선순위 필터 */}
          <FilterGroup>
            <FilterLabel>우선순위</FilterLabel>
            <FilterSelect
              onChange={handlePriorityFilterChange}
              value={priorityFilter}
            >
              <option value="ALL">전체 우선순위</option>
              <option value={1}>낮음 (1)</option>
              <option value={2}>보통 (2)</option>
              <option value={3}>높음 (3)</option>
            </FilterSelect>
          </FilterGroup>
        </FilterGrid>

        <FilterButtonGroup>
          <SearchButton onClick={handleSearch}>
            <AiOutlineSearch size={14} />
            검색
          </SearchButton>
          <ResetButton onClick={handleResetFilters}>
            <AiOutlineReload size={14} />
            초기화
          </ResetButton>
        </FilterButtonGroup>
      </FilterSection>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>제목</TableHeader>
              <TableHeader>작성자</TableHeader>
              <TableHeader $align="center">상태</TableHeader>
              <TableHeader $align="center">유형</TableHeader>
              <TableHeader $align="center">우선순위</TableHeader>
              <TableHeader $align="center">작성일</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {(() => {
              const result: JSX.Element[] = [];
              const processedReplies = new Set();

              posts.forEach((post) => {
                if (!post.parentId) {
                  // 부모 게시글 렌더링
                  result.push(
                    <TableRow
                      key={post.postId}
                      onClick={() => handlePostClick(post.postId)}
                    >
                      <TableCell>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <PostTitle>
                            {post.title.length > 30
                              ? post.title.slice(0, 30) + "..."
                              : post.title}
                          </PostTitle>
                          {(post.comments && post.comments.length > 0) ||
                          (post.questionCount !== undefined &&
                            post.questionCount > 0) ? (
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "#9ca3af",
                                display: "flex",
                                gap: "0.5rem",
                              }}
                            >
                              {post.comments && post.comments.length > 0 && (
                                <span>댓글 {post.comments.length}</span>
                              )}
                              {post.questionCount !== undefined &&
                                post.questionCount > 0 && (
                                  <span>질문 {post.questionCount}</span>
                                )}
                            </div>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>{post.author.name}</TableCell>
                      <TableCell $align="center">
                        <StatusBadge $status={getStatusText(post.status)}>
                          {getStatusText(post.status)}
                        </StatusBadge>
                      </TableCell>
                      <TableCell $align="center">
                        {getTypeText(post.type)}
                      </TableCell>
                      <TableCell $align="center">
                        <span
                          style={{
                            ...getPriorityStyle(post.priority),
                            fontWeight: 600,
                            fontSize: 13,
                            borderRadius: 8,
                            padding: "2px 12px",
                            display: "inline-block",
                          }}
                        >
                          {getPriorityText(post.priority)}
                        </span>
                      </TableCell>
                      <TableCell $align="center">
                        {formatDate(post.createdAt)}
                      </TableCell>
                    </TableRow>
                  );

                  // 이 부모의 답글들을 바로 다음에 렌더링
                  const replies = posts.filter(
                    (p) => p.parentId === post.postId
                  );
                  replies.forEach((reply) => {
                    if (!processedReplies.has(reply.postId)) {
                      processedReplies.add(reply.postId);
                      result.push(
                        <TableRow
                          key={reply.postId}
                          onClick={() => handlePostClick(reply.postId)}
                        >
                          <TableCell style={{ paddingLeft: 40 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <span
                                  style={{
                                    display: "inline-block",
                                    background: "#fdb924",
                                    color: "white",
                                    borderRadius: 4,
                                    fontSize: "0.75em",
                                    padding: "2px 7px",
                                    marginRight: 8,
                                    verticalAlign: "middle",
                                  }}
                                >
                                  [답글]
                                </span>
                                <span
                                  style={{
                                    color: "#888",
                                    fontSize: "0.92em",
                                    display: "inline-flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {post.title.length > 10
                                    ? post.title.slice(0, 10) + "..."
                                    : post.title}
                                </span>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  flex: 1,
                                }}
                              >
                                <PostTitle>
                                  {reply.title.length > 20
                                    ? reply.title.slice(0, 20) + "..."
                                    : reply.title}
                                </PostTitle>
                                {(reply.comments &&
                                  reply.comments.length > 0) ||
                                (reply.questionCount !== undefined &&
                                  reply.questionCount > 0) ? (
                                  <div
                                    style={{
                                      fontSize: "0.75rem",
                                      color: "#9ca3af",
                                      display: "flex",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    {reply.comments &&
                                      reply.comments.length > 0 && (
                                        <span>
                                          댓글 {reply.comments.length}
                                        </span>
                                      )}
                                    {reply.questionCount !== undefined &&
                                      reply.questionCount > 0 && (
                                        <span>질문 {reply.questionCount}</span>
                                      )}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{reply.author.name}</TableCell>
                          <TableCell $align="center">
                            <StatusBadge $status={getStatusText(reply.status)}>
                              {getStatusText(reply.status)}
                            </StatusBadge>
                          </TableCell>
                          <TableCell $align="center">
                            {getTypeText(reply.type)}
                          </TableCell>
                          <TableCell $align="center">
                            <span
                              style={{
                                ...getPriorityStyle(reply.priority),
                                fontWeight: 600,
                                fontSize: 13,
                                borderRadius: 8,
                                padding: "2px 12px",
                                display: "inline-block",
                              }}
                            >
                              {getPriorityText(reply.priority)}
                            </span>
                          </TableCell>
                          <TableCell $align="center">
                            {formatDate(reply.createdAt)}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  });
                }
              });

              // 처리되지 않은 답글들 (부모가 없는 경우) 렌더링
              posts.forEach((post) => {
                if (post.parentId && !processedReplies.has(post.postId)) {
                  processedReplies.add(post.postId);
                  const topParent = posts.find(
                    (p) => p.postId === post.parentId
                  );
                  result.push(
                    <TableRow
                      key={post.postId}
                      onClick={() => handlePostClick(post.postId)}
                    >
                      <TableCell style={{ paddingLeft: 40 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                background: "#fdb924",
                                color: "white",
                                borderRadius: 4,
                                fontSize: "0.75em",
                                padding: "2px 7px",
                                marginRight: 8,
                                verticalAlign: "middle",
                              }}
                            >
                              [답글]
                            </span>
                            {topParent && (
                              <span
                                style={{
                                  color: "#888",
                                  fontSize: "0.92em",
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}
                              >
                                {topParent.title.length > 10
                                  ? topParent.title.slice(0, 10) + "..."
                                  : topParent.title}
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              flex: 1,
                            }}
                          >
                            <PostTitle>
                              {post.title.length > 20
                                ? post.title.slice(0, 20) + "..."
                                : post.title}
                            </PostTitle>
                            {(post.comments && post.comments.length > 0) ||
                            (post.questionCount !== undefined &&
                              post.questionCount > 0) ? (
                              <div
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#9ca3af",
                                  display: "flex",
                                  gap: "0.5rem",
                                }}
                              >
                                {post.comments && post.comments.length > 0 && (
                                  <span>댓글 {post.comments.length}</span>
                                )}
                                {post.questionCount !== undefined &&
                                  post.questionCount > 0 && (
                                    <span>질문 {post.questionCount}</span>
                                  )}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{post.author.name}</TableCell>
                      <TableCell $align="center">
                        <StatusBadge $status={getStatusText(post.status)}>
                          {getStatusText(post.status)}
                        </StatusBadge>
                      </TableCell>
                      <TableCell $align="center">
                        {getTypeText(post.type)}
                      </TableCell>
                      <TableCell $align="center">
                        <span
                          style={{
                            ...getPriorityStyle(post.priority),
                            fontWeight: 600,
                            fontSize: 13,
                            borderRadius: 8,
                            padding: "2px 12px",
                            display: "inline-block",
                          }}
                        >
                          {getPriorityText(post.priority)}
                        </span>
                      </TableCell>
                      <TableCell $align="center">
                        {formatDate(post.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                }
              });

              return result;
            })()}
          </TableBody>
        </Table>

        {posts.length === 0 && !loading && (
          <div
            style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}
          >
            {searchTerm.trim()
              ? `"${searchTerm}" 검색 결과가 없습니다.`
              : "게시글이 없습니다."}
          </div>
        )}
      </TableContainer>

      {totalPages > 1 && (
        <PaginationContainer>
          <PaginationInfo>
            총 {totalElements}개의 게시글 중{" "}
            {totalElements > 0 ? currentPage * 10 + 1 : 0}-
            {Math.min((currentPage + 1) * 10, totalElements)}개 표시
            {searchTerm.trim() && ` (검색어: "${searchTerm}")`}
          </PaginationInfo>
          <PaginationNav>
            <PaginationButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              이전
            </PaginationButton>
            {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
              <PaginationButton
                key={page}
                onClick={() => handlePageChange(page)}
                $active={currentPage === page}
              >
                {page + 1}
              </PaginationButton>
            ))}
            <PaginationButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              다음
            </PaginationButton>
          </PaginationNav>
        </PaginationContainer>
      )}

      {totalPages <= 1 && totalElements > 0 && (
        <PaginationContainer>
          <PaginationInfo>
            총 {totalElements}개의 게시글
            {searchTerm.trim() && ` (검색어: "${searchTerm}")`}
          </PaginationInfo>
        </PaginationContainer>
      )}

      <PostDetailModal
        open={isModalOpen}
        onClose={handleModalClose}
        postId={selectedPostId}
        onPostDelete={handlePostDelete}
        onEditPost={handleEditPost}
        onReplyPost={handleReplyPost}
      />

      <PostFormModal
        open={isFormModalOpen}
        onClose={handleFormModalClose}
        onSuccess={handleFormModalSuccess}
        mode={formModalMode}
        postId={formModalPostId || undefined}
        parentId={formModalParentId || undefined}
        stepId={1}
      />
    </PageContainer>
  );
}
