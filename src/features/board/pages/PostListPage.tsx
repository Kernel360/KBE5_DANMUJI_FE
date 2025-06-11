import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  AiOutlineBarChart,
  AiOutlineFileText,
  AiOutlineTag,
  AiOutlineFile,
  AiOutlineSearch,
  AiOutlineReload,
} from "react-icons/ai";
import {
  PageContainer,
  Header,
  Title,
  Description,
  Toolbar,
  FilterSelect,
  SearchInput,
  SearchIcon,
  TableContainer,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  StatusBadge,
  PaginationContainer,
  PaginationInfo,
  PaginationNav,
  PaginationButton,
  PostTitle,
  LoadingSpinner,
  ErrorMessage,
  CreateButton,
  ToolbarLeft,
  ToolbarRight,
  FilterSection,
  FilterHeader,
  FilterTitle,
  FilterToggleButton,
  FilterGrid,
  FilterGroup,
  FilterLabel,
  FilterInput,
  FilterButtonGroup,
  SearchButton,
  ResetButton,
  DateRangeGroup,
  DateRangeLabel,
  StyledDatePicker,
} from "./PostListPage.styled";
import PostDetailModal from "../components/PostDetailModal/ProjectPostDetailModal";
import PostFormModal from "../components/PostFormModal/PostFormModal";
import {
  searchPosts,
  getPostsWithComments,
} from "@/features/project/services/postService";
import type {
  Post,
  PostStatus,
  PostType,
  PostSearchRequest,
} from "@/features/project/types/post";
import { useLocation } from "react-router-dom";

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

export default function PostListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 필터링 검색 관련 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"title" | "content" | "author">(
    "title"
  );
  const [statusFilter, setStatusFilter] = useState<PostStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<PostType | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<number | "ALL">("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("");
  const [clientFilter, setClientFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [isFilterChanged, setIsFilterChanged] = useState(false);

  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // PostFormModal 관련 상태
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formModalMode, setFormModalMode] = useState<"create" | "edit">(
    "create"
  );
  const [formModalPostId, setFormModalPostId] = useState<number | null>(null);
  const [formModalParentId, setFormModalParentId] = useState<number | null>(
    null
  );

  // 모든 프로젝트의 게시글을 가져오는 함수 (임시로 프로젝트 ID 1 사용)
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      // 검색어가 있거나 필터가 적용된 경우 검색 API 사용
      const hasFilters =
        statusFilter !== "ALL" ||
        typeFilter !== "ALL" ||
        priorityFilter !== "ALL" ||
        assigneeFilter !== "" ||
        clientFilter !== "" ||
        startDate ||
        endDate;

      if (searchTerm.trim() || hasFilters) {
        console.log("=== 검색 API 호출 ===");
        console.log("검색어:", searchTerm);
        console.log("검색 타입:", searchType);
        console.log("필터 적용 여부:", hasFilters);

        const searchRequest: PostSearchRequest = {
          status: statusFilter === "ALL" ? undefined : statusFilter,
          type: typeFilter === "ALL" ? undefined : typeFilter,
          priority: priorityFilter === "ALL" ? undefined : priorityFilter,
          assignee: assigneeFilter === "" ? undefined : assigneeFilter,
          client: clientFilter === "" ? undefined : clientFilter,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        };

        // 검색 타입에 따라 다른 필드 설정
        if (searchType === "title") {
          searchRequest.title = searchTerm;
        } else if (searchType === "content") {
          searchRequest.content = searchTerm;
        } else if (searchType === "author") {
          searchRequest.author = searchTerm;
        }

        console.log("검색 요청 객체:", searchRequest);
        console.log("실제 전송될 파라미터:", {
          ...searchRequest,
          page: currentPage,
          size: itemsPerPage,
        });
        response = await searchPosts(searchRequest, currentPage, itemsPerPage);
        console.log("검색 API 응답:", response);
        console.log("검색 결과 데이터:", response.data);
        console.log("======================");
      } else {
        // 검색어도 없고 필터도 없는 경우에만 일반 목록 API 사용
        console.log("=== 일반 목록 API 호출 ===");
        response = await getPostsWithComments(
          1, // 임시로 프로젝트 ID 1 사용
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
          currentPage > 0
        ) {
          console.log(
            `현재 페이지(${currentPage})에 게시글이 없어서 이전 페이지로 이동합니다.`
          );
          setCurrentPage(currentPage - 1);
        }
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

  useEffect(() => {
    fetchPosts();
  }, [currentPage, itemsPerPage, location.pathname]);

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
    setIsFilterChanged(true);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setCurrentPage(0);
      setIsFilterChanged(false);
      fetchPosts();
    }
  };

  const handleSearchClick = () => {
    setCurrentPage(0);
    setIsFilterChanged(false);
    fetchPosts();
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value as PostStatus | "ALL");
    setIsFilterChanged(true);
  };

  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value as PostType | "ALL");
    setIsFilterChanged(true);
  };

  const handlePriorityFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPriorityFilter(
      e.target.value === "ALL" ? "ALL" : Number(e.target.value)
    );
    setIsFilterChanged(true);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
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

  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
    setFormModalPostId(null);
    setFormModalParentId(null);
  };

  const handleFormModalSuccess = () => {
    // 게시글 목록 새로고침
    fetchPosts();
  };

  const handlePostDelete = (deletedPostId: number) => {
    // 게시글 삭제 후 목록 새로고침 (백엔드에서 삭제된 게시글 제외하고 반환)
    console.log(`게시글 ${deletedPostId} 삭제 후 목록 새로고침`);
    fetchPosts();
  };

  // 필터 관련 핸들러 함수들
  const handleFilterToggle = () => {
    setIsFilterExpanded(!isFilterExpanded);
  };

  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value as "title" | "content" | "author");
    setIsFilterChanged(true);
  };

  const handleAssigneeFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAssigneeFilter(e.target.value);
    setIsFilterChanged(true);
  };

  const handleClientFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientFilter(e.target.value);
    setIsFilterChanged(true);
  };

  const handleSearch = () => {
    setCurrentPage(0);
    setIsFilterChanged(false);
    fetchPosts();
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSearchType("title");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setPriorityFilter("ALL");
    setAssigneeFilter("");
    setClientFilter("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(0);
    setIsFilterChanged(false);
    fetchPosts(); // 초기화 후에는 즉시 검색 실행
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
        <Title>게시글 목록</Title>
        <Description>프로젝트 관련 게시글을 확인하고 질문하세요.</Description>
      </Header>

      {/* 필터링 검색 영역 */}
      <FilterSection>
        <FilterHeader>
          <FilterTitle>검색 및 필터</FilterTitle>
          <FilterToggleButton onClick={handleFilterToggle}>
            {isFilterExpanded ? "필터 접기" : "필터 펼치기"}
            <AiOutlineReload size={16} />
          </FilterToggleButton>
        </FilterHeader>

        <FilterGrid $isExpanded={isFilterExpanded}>
          {/* 검색어 입력 */}
          <FilterGroup>
            <FilterLabel>검색어</FilterLabel>
            <div style={{ position: "relative" }}>
              <FilterInput
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleSearchKeyPress}
                placeholder={
                  searchType === "title"
                    ? "게시글 제목을 입력하세요"
                    : searchType === "content"
                    ? "게시글 내용을 입력하세요"
                    : "작성자명을 입력하세요"
                }
              />
              <SearchIcon onClick={handleSearchClick} />
            </div>
          </FilterGroup>

          {/* 검색 타입 선택 */}
          <FilterGroup>
            <FilterLabel>검색 타입</FilterLabel>
            <FilterSelect value={searchType} onChange={handleSearchTypeChange}>
              <option value="title">제목으로 검색</option>
              <option value="content">내용으로 검색</option>
              <option value="author">작성자로 검색</option>
            </FilterSelect>
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

          {/* 담당자 필터 */}
          <FilterGroup>
            <FilterLabel>담당자</FilterLabel>
            <FilterInput
              type="text"
              value={assigneeFilter}
              onChange={handleAssigneeFilterChange}
              placeholder="담당자명을 입력하세요"
            />
          </FilterGroup>

          {/* 고객사 필터 */}
          <FilterGroup>
            <FilterLabel>고객사</FilterLabel>
            <FilterInput
              type="text"
              value={clientFilter}
              onChange={handleClientFilterChange}
              placeholder="고객사명을 입력하세요"
            />
          </FilterGroup>

          {/* 날짜 범위 */}
          <FilterGroup>
            <FilterLabel>시작일</FilterLabel>
            <StyledDatePicker>
              <DatePicker
                selected={startDate ? new Date(startDate) : null}
                onChange={(date) => {
                  if (date) {
                    setStartDate(date.toISOString().split("T")[0]);
                    setIsFilterChanged(true);
                  }
                }}
                dateFormat="yyyy-MM-dd"
                placeholderText="시작일을 선택하세요"
                isClearable
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={15}
              />
            </StyledDatePicker>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>종료일</FilterLabel>
            <StyledDatePicker>
              <DatePicker
                selected={endDate ? new Date(endDate) : null}
                onChange={(date) => {
                  if (date) {
                    setEndDate(date.toISOString().split("T")[0]);
                    setIsFilterChanged(true);
                  }
                }}
                dateFormat="yyyy-MM-dd"
                placeholderText="종료일을 선택하세요"
                isClearable
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={15}
              />
            </StyledDatePicker>
          </FilterGroup>
        </FilterGrid>

        <FilterButtonGroup>
          <SearchButton
            onClick={handleSearch}
            style={{
              background: isFilterChanged ? "#f59e0b" : "#fdb924",
              transform: isFilterChanged ? "scale(1.05)" : "scale(1)",
            }}
          >
            <AiOutlineSearch size={16} />
            {isFilterChanged ? "검색 실행" : "검색"}
          </SearchButton>
          <ResetButton onClick={handleResetFilters}>
            <AiOutlineReload size={16} />
            초기화
          </ResetButton>
        </FilterButtonGroup>
      </FilterSection>

      {/* 게시글 작성 버튼과 표시 개수 선택 */}
      <Toolbar>
        <ToolbarLeft>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
              minWidth: "120px",
            }}
          >
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "0.125rem",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <AiOutlineFile size={14} />
              표시 개수
            </label>
            <FilterSelect
              onChange={handleItemsPerPageChange}
              value={itemsPerPage}
            >
              <option value={10}>10개씩 보기</option>
              <option value={20}>20개씩 보기</option>
              <option value={50}>50개씩 보기</option>
            </FilterSelect>
          </div>
        </ToolbarLeft>
        <ToolbarRight>
          <CreateButton
            style={{
              background: "#fbbf24",
              color: "#222",
              fontWeight: 700,
              fontSize: "16px",
              borderRadius: "8px",
              height: "44px",
              minWidth: "140px",
            }}
            onClick={handleCreatePost}
          >
            + 게시글 작성
          </CreateButton>
        </ToolbarRight>
      </Toolbar>

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
            {posts
              .filter((post) => !post.parentId)
              .map((rootPost) => {
                // 이 게시글을 부모로 하는 모든 답글(1,2,3...depth) 평면적으로 시간순 정렬
                const allReplies = posts.filter((p) => {
                  let parent = p.parentId;
                  while (parent) {
                    if (parent === rootPost.postId) return true;
                    const parentPost = posts.find((pp) => pp.postId === parent);
                    parent = parentPost?.parentId || null;
                  }
                  return false;
                });

                // 시간순 정렬
                allReplies.sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                );

                // 검색어가 있을 때 댓글 내용도 검색
                const hasMatchingComment =
                  searchTerm.trim() &&
                  rootPost.comments &&
                  rootPost.comments.some((comment) =>
                    comment.content
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  );

                return [
                  <TableRow
                    key={rootPost.postId}
                    onClick={() => handlePostClick(rootPost.postId)}
                    style={hasMatchingComment ? { background: "#fef3c7" } : {}}
                  >
                    <TableCell>
                      <PostTitle style={{ color: "#000000" }}>
                        {rootPost.title}
                        {rootPost.comments && rootPost.comments.length > 0 && (
                          <span
                            style={{
                              display: "inline-block",
                              background: "#60a5fa",
                              color: "white",
                              borderRadius: "12px",
                              fontSize: "0.75rem",
                              padding: "2px 8px",
                              marginLeft: "8px",
                              fontWeight: "500",
                            }}
                          >
                            댓글 {rootPost.comments.length}
                          </span>
                        )}
                        {rootPost.questionCount !== undefined &&
                          rootPost.questionCount > 0 && (
                            <span
                              style={{
                                display: "inline-block",
                                background: "#34d399",
                                color: "white",
                                borderRadius: "12px",
                                fontSize: "0.75rem",
                                padding: "2px 8px",
                                marginLeft: "8px",
                                fontWeight: "500",
                              }}
                            >
                              질문 {rootPost.questionCount}
                            </span>
                          )}
                        {hasMatchingComment && (
                          <span
                            style={{
                              display: "inline-block",
                              background: "#f59e0b",
                              color: "white",
                              borderRadius: "12px",
                              fontSize: "0.75rem",
                              padding: "2px 8px",
                              marginLeft: "8px",
                              fontWeight: "500",
                            }}
                          >
                            댓글에서 검색됨
                          </span>
                        )}
                      </PostTitle>
                    </TableCell>
                    <TableCell>{rootPost.author.name}</TableCell>
                    <TableCell $align="center">
                      <StatusBadge $status={getStatusText(rootPost.status)}>
                        {getStatusText(rootPost.status)}
                      </StatusBadge>
                    </TableCell>
                    <TableCell $align="center">
                      {getTypeText(rootPost.type)}
                    </TableCell>
                    <TableCell $align="center">{rootPost.priority}</TableCell>
                    <TableCell $align="center">
                      {formatDate(rootPost.createdAt)}
                    </TableCell>
                  </TableRow>,
                  // 모든 답글 게시글(1-depth, 2-depth, 3-depth...) 평면 렌더링
                  ...allReplies.map((reply) => {
                    // 답글의 depth 계산
                    let depth = 0;
                    let currentParentId = reply.parentId;
                    while (currentParentId) {
                      depth++;
                      const parentPost = posts.find(
                        (p) => p.postId === currentParentId
                      );
                      currentParentId = parentPost ? parentPost.parentId : null;
                    }

                    // 최상위 부모 게시글 찾기
                    const topParent = posts.find(
                      (p) => p.postId === reply.parentId
                    );

                    // 들여쓰기 계산 (2-depth까지만, 그 이후는 동일)
                    const paddingLeft = Math.min(depth, 2) * 20 + 20;

                    // 뱃지 색상 (1-depth는 노란색, 2-depth 이상은 회색)
                    const badgeColor = depth === 1 ? "#fdb924" : "#6b7280";

                    return (
                      <TableRow
                        key={reply.postId}
                        onClick={() => handlePostClick(reply.postId)}
                        style={{ background: "#f8f9fa" }}
                      >
                        <TableCell style={{ paddingLeft }}>
                          <span
                            style={{
                              display: "inline-block",
                              background: badgeColor,
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
                                marginRight: 8,
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                            >
                              {topParent.title.length > 15
                                ? topParent.title.slice(0, 15) + "..."
                                : topParent.title}
                            </span>
                          )}
                          <PostTitle style={{ color: "#000000" }}>
                            {reply.title}
                            {reply.comments && reply.comments.length > 0 && (
                              <span
                                style={{
                                  display: "inline-block",
                                  background: "#60a5fa",
                                  color: "white",
                                  borderRadius: "12px",
                                  fontSize: "0.75rem",
                                  padding: "2px 8px",
                                  marginLeft: "8px",
                                  fontWeight: "500",
                                }}
                              >
                                댓글 {reply.comments.length}
                              </span>
                            )}
                            {reply.questionCount !== undefined &&
                              reply.questionCount > 0 && (
                                <span
                                  style={{
                                    display: "inline-block",
                                    background: "#34d399",
                                    color: "white",
                                    borderRadius: "12px",
                                    fontSize: "0.75rem",
                                    padding: "2px 8px",
                                    marginLeft: "8px",
                                    fontWeight: "500",
                                  }}
                                >
                                  질문 {reply.questionCount}
                                </span>
                              )}
                          </PostTitle>
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
                        <TableCell $align="center">{reply.priority}</TableCell>
                        <TableCell $align="center">
                          {formatDate(reply.createdAt)}
                        </TableCell>
                      </TableRow>
                    );
                  }),
                ];
              })}
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
            총 {totalElements}개의 게시글 중 {currentPage * itemsPerPage + 1}-
            {Math.min((currentPage + 1) * itemsPerPage, totalElements)}개 표시
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

      <PostDetailModal
        open={isModalOpen}
        onClose={handleModalClose}
        postId={selectedPostId}
        onPostDelete={handlePostDelete}
        onEditPost={handleEditPost}
      />

      <PostFormModal
        open={isFormModalOpen}
        onClose={handleFormModalClose}
        onSuccess={handleFormModalSuccess}
        mode={formModalMode}
        postId={formModalPostId}
        parentId={formModalParentId}
      />
    </PageContainer>
  );
}
