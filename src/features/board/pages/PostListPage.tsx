import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageContainer,
  Header,
  Title,
  Description,
  Toolbar,
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
} from "./PostListPage.styled";
import PostDetailModal from "../components/PostDetailModal/ProjectPostDetailModal";
import { getPosts, searchPosts } from "@/features/project/services/postService";
import type { Post, PostStatus, PostType } from "@/features/project/types/post";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PostStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<PostType | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<number | "ALL">("ALL");
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // 모든 프로젝트의 게시글을 가져오는 함수 (임시로 프로젝트 ID 1 사용)
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      // 검색어가 있으면 검색 API 사용, 없으면 일반 목록 API 사용
      if (searchTerm.trim()) {
        setIsSearching(true);
        response = await searchPosts(searchTerm, currentPage, itemsPerPage);
      } else {
        setIsSearching(false);
        response = await getPosts(
          1, // 임시로 프로젝트 ID 1 사용
          currentPage,
          itemsPerPage,
          statusFilter === "ALL" ? undefined : statusFilter,
          typeFilter === "ALL" ? undefined : typeFilter,
          priorityFilter === "ALL" ? undefined : priorityFilter
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
  }, [
    currentPage,
    itemsPerPage,
    statusFilter,
    typeFilter,
    priorityFilter,
    location.pathname,
  ]);

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
    setCurrentPage(0); // 검색 시 첫 페이지로 이동
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchPosts();
    }
  };

  const handleSearchClick = () => {
    fetchPosts();
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value as PostStatus | "ALL");
    setCurrentPage(0);
  };

  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value as PostType | "ALL");
    setCurrentPage(0);
  };

  const handlePriorityFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPriorityFilter(
      e.target.value === "ALL" ? "ALL" : Number(e.target.value)
    );
    setCurrentPage(0);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const handleCreatePost = () => {
    navigate("/posts/create");
  };

  const handlePostDelete = (deletedPostId: number) => {
    // 게시글 삭제 후 목록 새로고침 (백엔드에서 삭제된 게시글 제외하고 반환)
    console.log(`게시글 ${deletedPostId} 삭제 후 목록 새로고침`);
    fetchPosts();
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

      <Toolbar>
        <ToolbarLeft>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              상태
            </label>
            <FilterSelect
              onChange={handleStatusFilterChange}
              value={statusFilter}
            >
              <option value="ALL">📊 전체 상태</option>
              <option value="PENDING">⏳ 대기</option>
              <option value="APPROVED">✅ 승인</option>
              <option value="REJECTED">❌ 거부</option>
            </FilterSelect>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              유형
            </label>
            <FilterSelect onChange={handleTypeFilterChange} value={typeFilter}>
              <option value="ALL">📝 전체 유형</option>
              <option value="GENERAL">💬 일반</option>
              <option value="NOTICE">📢 공지</option>
            </FilterSelect>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              우선순위
            </label>
            <FilterSelect
              onChange={handlePriorityFilterChange}
              value={priorityFilter}
            >
              <option value="ALL">🎯 전체 우선순위</option>
              <option value={1}>🟢 낮음 (1)</option>
              <option value={2}>🟡 보통 (2)</option>
              <option value={3}>🔴 높음 (3)</option>
            </FilterSelect>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              표시 개수
            </label>
            <FilterSelect
              onChange={handleItemsPerPageChange}
              value={itemsPerPage}
            >
              <option value={10}>📄 10개씩 보기</option>
              <option value={20}>📄 20개씩 보기</option>
              <option value={50}>📄 50개씩 보기</option>
            </FilterSelect>
          </div>
        </ToolbarLeft>
        <ToolbarRight>
          <CreateButton onClick={handleCreatePost}>+ 게시글 작성</CreateButton>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="게시글 제목, 작성자, 내용 검색"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyPress}
            />
            <SearchIcon onClick={handleSearchClick} />
          </SearchContainer>
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

                return [
                  <TableRow
                    key={rootPost.postId}
                    onClick={() => handlePostClick(rootPost.postId)}
                  >
                    <TableCell>
                      <PostTitle>{rootPost.title}</PostTitle>
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
                    const paddingLeft = Math.min(depth, 2) * 36 + 36;

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
                              }}
                            >
                              {"ㄴ"}
                              {topParent.title.length > 15
                                ? topParent.title.slice(0, 15) + "..."
                                : topParent.title}
                            </span>
                          )}
                          <PostTitle>{reply.title}</PostTitle>
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
      />
    </PageContainer>
  );
}
