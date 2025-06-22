import React, { useState, useEffect, useCallback, type JSX } from "react";
import {
  AiOutlineFileText,
  AiOutlineSearch,
  AiOutlineReload,
} from "react-icons/ai";
import {
  getPostsWithComments,
  searchPosts,
} from "@/features/project-d/services/postService";
import type {
  Post,
  PostStatus,
  PostType,
} from "@/features/project-d/types/post";
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
} from "../styles/PostListPage.styled";
import PostDetailModal from "../components/DetailModal/ProjectPostDetailModal";
import PostFormModal from "../components/FormModal/PostFormModal";
import { useParams, useSearchParams } from "react-router-dom";
import { showSuccessToast } from "@/utils/errorHandler";

const formatDate = (dateString: string) => {
  let date;
  if (dateString.includes("T")) {
    date = new Date(dateString);
  } else {
    date = new Date(dateString.replace(" ", "T") + "Z");
  }
  date.setHours(date.getHours() + 9);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

export default function PostListPage() {
  const { stepId } = useParams();
  const [searchParams] = useSearchParams();
  const stepName = searchParams.get("stepName") || "알 수 없는 단계";
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [itemsPerPage] = useState(10);
  const [projectId, setProjectId] = useState<number>(1); // 기본값 1

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

  // 게시글 수정 전 단계 정보 추적
  const [editingPostStepId, setEditingPostStepId] = useState<number | null>(
    null
  );

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    let fetched: Post[] = [];
    let page = currentPage;
    let remain = itemsPerPage;
    let keepFetching = true;
    let totalCount = 0;

    try {
      while (remain > 0 && keepFetching) {
        const response = await getPostsWithComments(
          Number(stepId),
          page,
          itemsPerPage
        );
        if (!response.data || response.data.content.length === 0) break;

        // 소프트딜리트 제외
        const visible = response.data.content.filter(
          (post) => !post.isDeleted && !post.delete
        );

        fetched = [...fetched, ...visible];

        // 실제 전체 개수는 백엔드에서 내려주는 totalElements에서 소프트딜리트 제외한 개수로 계산(임시)
        if (
          page === 0 &&
          response.data.page &&
          typeof response.data.page.totalElements === "number"
        ) {
          totalCount = response.data.page.totalElements;
        }

        // 만약 10개가 모이면 break
        if (fetched.length >= itemsPerPage) break;

        // 다음 페이지로
        page += 1;
        remain = itemsPerPage - fetched.length;

        // 마지막 페이지라면 break
        if (response.data.content.length < itemsPerPage) keepFetching = false;
      }

      // posts 가공 로직 추가
      const deletedWithReplies = fetched.filter(
        (post) =>
          (post.isDeleted || post.delete) &&
          fetched.some((reply) => reply.parentId === post.postId)
      );
      const visiblePosts = [
        ...fetched.filter((post) => !post.isDeleted && !post.delete),
        ...deletedWithReplies,
      ];
      setPosts(visiblePosts);

      setTotalElements(totalCount); // 실제 전체 개수(소프트딜리트 제외 필요시 별도 계산)
      setTotalPages(Math.ceil(totalCount / itemsPerPage));

      // 첫 번째 게시글에서 projectId 가져오기
      if (visiblePosts.length > 0 && visiblePosts[0].project?.projectId) {
        setProjectId(visiblePosts[0].project.projectId);
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
  }, [currentPage, itemsPerPage, stepId]);

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

    // 수정할 게시글의 현재 단계 정보 저장
    const targetPost = posts.find((post) => post.postId === postId);
    if (targetPost) {
      setEditingPostStepId(targetPost.stepId || null);
    }

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

    // 단계 변경으로 인해 게시글이 사라졌을 수 있음을 안내
    // (실제로는 백엔드에서 단계별로 게시글을 조회하므로,
    // 단계가 변경된 게시글은 현재 단계 목록에서 사라짐)
    if (editingPostStepId !== null && editingPostStepId !== Number(stepId)) {
      showSuccessToast(
        "게시글 수정 완료 - 단계가 변경되어 현재 목록에서 사라졌습니다."
      );
    }

    // 단계 정보 초기화
    setEditingPostStepId(null);
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 4,
              marginTop: 11,
              height: 34,
              background: "#fdb924",
              borderRadius: 2,
              marginRight: 8,
            }}
          />
          <Title>{stepName} 단계</Title>
        </div>
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
            <FilterToggleButton
              onClick={handleFilterToggle}
              className={isFilterExpanded ? "expanded" : ""}
            >
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
            <FilterLabel style={{ marginBottom: 6 }}>검색</FilterLabel>
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
                if (post.isDeleted || post.delete) {
                  // 답글이 있는 삭제된 게시글
                  // '삭제된 게시글입니다' 회색 텍스트, 클릭 비활성화
                  result.push(
                    <TableRow
                      style={{
                        background: "#f3f4f6",
                        color: "#9ca3af",
                        pointerEvents: "none",
                        cursor: "not-allowed",
                      }}
                    >
                      <TableCell colSpan={6}>삭제된 게시글입니다.</TableCell>
                    </TableRow>
                  );
                } else {
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
                                    답글
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
                                          <span>
                                            질문 {reply.questionCount}
                                          </span>
                                        )}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{reply.author.name}</TableCell>
                            <TableCell $align="center">
                              <StatusBadge
                                $status={getStatusText(reply.status)}
                              >
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
                              답글
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
          <PaginationInfo>
            총 {totalElements}개의 게시글 중{" "}
            {totalElements > 0 ? currentPage * 10 + 1 : 0}-
            {Math.min((currentPage + 1) * 10, totalElements)}개 표시
            {searchTerm.trim() && ` (검색어: "${searchTerm}")`}
          </PaginationInfo>
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
        stepId={stepId ? Number(stepId) : undefined}
        projectId={projectId}
      />
    </PageContainer>
  );
}
