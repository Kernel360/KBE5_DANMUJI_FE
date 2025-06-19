import React, { useState, useEffect, type JSX } from "react";
import { getPostsByProjectStep } from "../../../project-d/services/postService";
import type { PostSummaryReadResponse } from "../../../project-d/types/post";
import {
  Wrapper,
  Filters,
  FilterGroup,
  FilterLabel,
  FilterLeft,
  FilterSearchRight,
  NewButton,
  SearchInput,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  StatusBadge,
  TitleText,
  CommentInfo,
  TypeBadge,
  DropdownContainer,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
} from "./ProjectBoard.styled";
import {
  FiFileText,
  FiUser,
  FiMessageCircle,
  FiFlag,
  FiArrowUp,
  FiSearch,
  FiRotateCcw,
  FiChevronDown,
  FiArrowDown,
  FiMinus,
  FiAlertTriangle,
  FiGrid,
  FiPlus,
} from "react-icons/fi";
import { POST_PRIORITY_LABELS } from "../../types/Types";
import {
  PaginationContainer,
  PaginationInfo,
  PaginationNav,
  PaginationButton,
} from "@/features/board/components/Post/styles/PostListPage.styled";
import ProjectPostDetailModal from "@/features/board/components/Post/components/DetailModal/ProjectPostDetailModal";
import PostFormModal from "@/features/board/components/Post/components/FormModal/PostFormModal";

interface ProjectBoardProps {
  projectId: number;
  selectedStepId?: number;
}

const ProjectBoard: React.FC<ProjectBoardProps> = ({
  projectId,
  selectedStepId,
}) => {
  const [posts, setPosts] = useState<PostSummaryReadResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // 게시글 유형 필터
  const [typeFilter, setTypeFilter] = useState<"ALL" | "GENERAL" | "QUESTION">(
    "ALL"
  );
  // 우선순위 필터
  const [priorityFilter, setPriorityFilter] = useState<
    "ALL" | "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  >("ALL");
  // 키워드 필터
  const [keywordType, setKeywordType] = useState<"title" | "writer">("title");
  const [keyword, setKeyword] = useState("");

  // 드롭다운 상태
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isKeywordDropdownOpen, setIsKeywordDropdownOpen] = useState(false);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  // 게시글 작성 모달 상태
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formModalMode, setFormModalMode] = useState<"create" | "edit">(
    "create"
  );
  const [formModalPostId, setFormModalPostId] = useState<number | null>(null);
  const [formModalParentId, setFormModalParentId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchPosts = async () => {
      if (!selectedStepId) {
        setPosts([]);
        setTotalPages(0);
        setTotalElements(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getPostsByProjectStep(
          projectId,
          selectedStepId,
          currentPage,
          10
        );
        setPosts(response.content);
        setTotalPages(response.page.totalPages);
        setTotalElements(response.page.totalElements);
      } catch (err) {
        setError("게시글을 불러오는데 실패했습니다.");
        console.error("게시글 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [projectId, selectedStepId, currentPage]);

  // 필터링된 게시글
  const filteredPosts = posts.filter((post) => {
    // 유형 필터
    if (typeFilter !== "ALL" && post.type !== typeFilter) return false;

    // 우선순위 필터
    if (priorityFilter !== "ALL" && post.priority !== priorityFilter)
      return false;

    // 키워드 필터
    if (keyword) {
      if (keywordType === "title" && !post.title.includes(keyword))
        return false;
      if (keywordType === "writer" && !post.authorName.includes(keyword))
        return false;
    }

    return true;
  });

  const handleRowClick = (postId: number) => {
    setSelectedPostId(postId);
    setDetailModalOpen(true);
  };

  const handleResetFilters = () => {
    setTypeFilter("ALL");
    setPriorityFilter("ALL");
    setKeywordType("title");
    setKeyword("");
  };

  const handleSearch = () => {
    // 실제 검색 요청 로직 작성
    console.log("검색 요청:", keywordType, keyword);
  };

  const handleTypeDropdownToggle = () => {
    setIsTypeDropdownOpen((prev) => {
      if (!prev) {
        setIsPriorityDropdownOpen(false);
        setIsKeywordDropdownOpen(false);
      }
      return !prev;
    });
  };

  const handlePriorityDropdownToggle = () => {
    setIsPriorityDropdownOpen((prev) => {
      if (!prev) {
        setIsTypeDropdownOpen(false);
        setIsKeywordDropdownOpen(false);
      }
      return !prev;
    });
  };

  const handleKeywordDropdownToggle = () => {
    setIsKeywordDropdownOpen((prev) => {
      if (!prev) {
        setIsTypeDropdownOpen(false);
        setIsPriorityDropdownOpen(false);
      }
      return !prev;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // 게시글 작성 모달 핸들러
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

  // 게시글 계층 렌더링 함수
  const renderPosts = (
    posts: PostSummaryReadResponse[],
    parentId: number | null = null,
    depth: number = 0
  ): JSX.Element[] => {
    return posts
      .filter((post) => post.parentId === parentId)
      .map((post) => [
        <Tr
          key={post.postId}
          style={{
            cursor: "pointer",
            background: depth > 0 ? "#f9fafb" : undefined,
          }}
          onClick={() => handleRowClick(post.postId)}
        >
          <Td style={depth > 0 ? { paddingLeft: 32 * depth } : {}}>
            <TitleText>
              {depth > 0 && (
                <>
                  <span
                    style={{
                      color: "#fdb924",
                      fontSize: "0.85em",
                      fontWeight: 700,
                      marginRight: 8,
                    }}
                  >
                    ㄴ [답글]
                  </span>
                </>
              )}
              {post.title}
            </TitleText>
          </Td>
          <Td>
            {post.comments && post.comments.length > 0 ? (
              <CommentInfo>댓글 {post.comments.length}</CommentInfo>
            ) : (
              ""
            )}
          </Td>
          <Td>
            <span>{post.authorName}</span>
          </Td>
          <Td>
            <TypeBadge type={post.type as "GENERAL" | "QUESTION"}>
              {post.type === "GENERAL" ? "일반" : "질문"}
            </TypeBadge>
          </Td>
          <Td>
            <StatusBadge priority={post.priority as PostPriority}>
              {POST_PRIORITY_LABELS[post.priority as PostPriority] ??
                post.priority}
            </StatusBadge>
          </Td>
          <Td>{formatDate(post.createdAt)}</Td>
        </Tr>,
        // 답글(자식)도 재귀적으로 렌더링
        ...renderPosts(posts, post.postId, depth + 1),
      ])
      .flat();
  };

  return (
    <Wrapper>
      <Filters>
        <FilterLeft>
          <FilterGroup>
            <FilterLabel>게시글 유형</FilterLabel>
            <DropdownContainer className="dropdown-container">
              <DropdownButton
                $active={typeFilter !== "ALL"}
                $color={
                  typeFilter === "ALL"
                    ? "#6b7280"
                    : typeFilter === "GENERAL"
                    ? "#3b82f6"
                    : "#f59e0b"
                }
                $isOpen={isTypeDropdownOpen}
                onClick={handleTypeDropdownToggle}
              >
                {typeFilter === "ALL" ? (
                  <FiGrid size={16} />
                ) : typeFilter === "GENERAL" ? (
                  <FiMessageCircle size={16} />
                ) : (
                  <FiFlag size={16} />
                )}
                <span>
                  {typeFilter === "ALL"
                    ? "전체"
                    : typeFilter === "GENERAL"
                    ? "일반"
                    : "질문"}
                </span>
                <FiChevronDown size={16} />
              </DropdownButton>
              <DropdownMenu $isOpen={isTypeDropdownOpen}>
                <DropdownItem
                  $active={typeFilter === "ALL"}
                  $color={"#6b7280"}
                  onClick={() => {
                    setTypeFilter("ALL");
                    setIsTypeDropdownOpen(false);
                  }}
                >
                  <FiGrid size={16} />
                  <span>전체</span>
                </DropdownItem>
                <DropdownItem
                  $active={typeFilter === "GENERAL"}
                  $color={"#3b82f6"}
                  onClick={() => {
                    setTypeFilter("GENERAL");
                    setIsTypeDropdownOpen(false);
                  }}
                >
                  <FiMessageCircle size={16} />
                  <span>일반</span>
                </DropdownItem>
                <DropdownItem
                  $active={typeFilter === "QUESTION"}
                  $color={"#f59e0b"}
                  onClick={() => {
                    setTypeFilter("QUESTION");
                    setIsTypeDropdownOpen(false);
                  }}
                >
                  <FiFlag size={16} />
                  <span>질문</span>
                </DropdownItem>
              </DropdownMenu>
            </DropdownContainer>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>우선순위</FilterLabel>
            <DropdownContainer className="dropdown-container">
              <DropdownButton
                $active={priorityFilter !== "ALL"}
                $color={
                  priorityFilter === "ALL"
                    ? "#6b7280"
                    : priorityFilter === "LOW"
                    ? "#10b981"
                    : priorityFilter === "MEDIUM"
                    ? "#fbbf24"
                    : priorityFilter === "HIGH"
                    ? "#a21caf"
                    : "#ef4444"
                }
                $isOpen={isPriorityDropdownOpen}
                onClick={handlePriorityDropdownToggle}
              >
                {priorityFilter === "ALL" ? (
                  <FiGrid size={16} />
                ) : priorityFilter === "LOW" ? (
                  <FiArrowDown size={16} />
                ) : priorityFilter === "MEDIUM" ? (
                  <FiMinus size={16} />
                ) : priorityFilter === "HIGH" ? (
                  <FiArrowUp size={16} />
                ) : (
                  <FiAlertTriangle size={16} />
                )}
                <span>
                  {priorityFilter === "ALL"
                    ? "전체"
                    : priorityFilter === "LOW"
                    ? "낮음"
                    : priorityFilter === "MEDIUM"
                    ? "보통"
                    : priorityFilter === "HIGH"
                    ? "높음"
                    : "긴급"}
                </span>
                <FiChevronDown size={16} />
              </DropdownButton>
              <DropdownMenu $isOpen={isPriorityDropdownOpen}>
                <DropdownItem
                  $active={priorityFilter === "ALL"}
                  $color={"#6b7280"}
                  onClick={() => {
                    setPriorityFilter("ALL");
                    setIsPriorityDropdownOpen(false);
                  }}
                >
                  <FiGrid size={16} />
                  <span>전체</span>
                </DropdownItem>
                <DropdownItem
                  $active={priorityFilter === "LOW"}
                  $color={"#10b981"}
                  onClick={() => {
                    setPriorityFilter("LOW");
                    setIsPriorityDropdownOpen(false);
                  }}
                >
                  <FiArrowDown size={16} />
                  <span>낮음</span>
                </DropdownItem>
                <DropdownItem
                  $active={priorityFilter === "MEDIUM"}
                  $color={"#fbbf24"}
                  onClick={() => {
                    setPriorityFilter("MEDIUM");
                    setIsPriorityDropdownOpen(false);
                  }}
                >
                  <FiMinus size={16} />
                  <span>보통</span>
                </DropdownItem>
                <DropdownItem
                  $active={priorityFilter === "HIGH"}
                  $color={"#a21caf"}
                  onClick={() => {
                    setPriorityFilter("HIGH");
                    setIsPriorityDropdownOpen(false);
                  }}
                >
                  <FiArrowUp size={16} />
                  <span>높음</span>
                </DropdownItem>
                <DropdownItem
                  $active={priorityFilter === "URGENT"}
                  $color={"#ef4444"}
                  onClick={() => {
                    setPriorityFilter("URGENT");
                    setIsPriorityDropdownOpen(false);
                  }}
                >
                  <FiAlertTriangle size={16} />
                  <span>긴급</span>
                </DropdownItem>
              </DropdownMenu>
            </DropdownContainer>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>키워드</FilterLabel>
            <DropdownContainer className="dropdown-container">
              <DropdownButton
                $active={true}
                $color={keywordType === "title" ? "#3b82f6" : "#10b981"}
                $isOpen={isKeywordDropdownOpen}
                onClick={handleKeywordDropdownToggle}
              >
                {keywordType === "title" ? (
                  <FiFileText size={16} />
                ) : (
                  <FiUser size={16} />
                )}
                <span>{keywordType === "title" ? "제목" : "작성자"}</span>
                <FiChevronDown size={16} />
              </DropdownButton>
              <DropdownMenu $isOpen={isKeywordDropdownOpen}>
                <DropdownItem
                  $active={keywordType === "title"}
                  $color={"#3b82f6"}
                  onClick={() => {
                    setKeywordType("title");
                    setIsKeywordDropdownOpen(false);
                  }}
                >
                  <FiFileText size={16} />
                  <span>제목</span>
                </DropdownItem>
                <DropdownItem
                  $active={keywordType === "writer"}
                  $color={"#10b981"}
                  onClick={() => {
                    setKeywordType("writer");
                    setIsKeywordDropdownOpen(false);
                  }}
                >
                  <FiUser size={16} />
                  <span>작성자</span>
                </DropdownItem>
              </DropdownMenu>
            </DropdownContainer>
          </FilterGroup>

          <SearchInput
            placeholder={
              keywordType === "title" ? "제목으로 검색" : "작성자로 검색"
            }
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <NewButton
            style={{
              minWidth: "auto",
              padding: "10px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={handleSearch}
          >
            <FiSearch size={16} />
          </NewButton>
          <NewButton
            onClick={handleResetFilters}
            style={{
              minWidth: "auto",
              padding: "10px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FiRotateCcw size={16} />
          </NewButton>
        </FilterLeft>
        <FilterSearchRight>
          <NewButton onClick={handleCreatePost}>
            <FiPlus size={16} />
            게시글 작성
          </NewButton>
        </FilterSearchRight>
      </Filters>

      <Table>
        <Thead>
          <Tr>
            <Th>제목</Th>
            <Th></Th>
            <Th>작성자</Th>
            <Th>유형</Th>
            <Th>우선순위</Th>
            <Th>작성일</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            <Tr>
              <Td colSpan={6}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px 24px",
                    gap: "12px",
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span>게시글을 불러오는 중...</span>
                </div>
              </Td>
            </Tr>
          ) : error ? (
            <Tr>
              <Td colSpan={6}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px 24px",
                    color: "#ef4444",
                    fontSize: "14px",
                  }}
                >
                  <span>게시글을 불러오는데 실패했습니다: {error}</span>
                </div>
              </Td>
            </Tr>
          ) : filteredPosts.length === 0 ? (
            <Tr>
              <Td colSpan={6}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px 24px",
                    color: "#9ca3af",
                    fontSize: "14px",
                  }}
                >
                  <span>게시글이 없습니다.</span>
                </div>
              </Td>
            </Tr>
          ) : (
            renderPosts(filteredPosts)
          )}
        </Tbody>
      </Table>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <PaginationContainer>
          <PaginationInfo>
            {currentPage + 1} / {totalPages} 페이지
          </PaginationInfo>
          <PaginationNav>
            <PaginationButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              이전
            </PaginationButton>
            <PaginationButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              다음
            </PaginationButton>
          </PaginationNav>
        </PaginationContainer>
      )}

      <ProjectPostDetailModal
        open={detailModalOpen}
        postId={selectedPostId}
        onClose={() => setDetailModalOpen(false)}
      />

      <PostFormModal
        open={isFormModalOpen}
        mode={formModalMode}
        postId={formModalPostId || undefined}
        parentId={formModalParentId || undefined}
        stepId={selectedStepId}
        projectId={projectId}
        onClose={handleFormModalClose}
        onSuccess={handleFormModalSuccess}
      />
    </Wrapper>
  );
};

export default ProjectBoard;
