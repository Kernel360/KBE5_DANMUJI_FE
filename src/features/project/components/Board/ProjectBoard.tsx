import React, { useState, useEffect } from "react";
import { getPostsByProjectStep } from "../../../project-d/services/postService";
import type { PostSummaryReadResponse } from "../../../project-d/types/post";
import {
  BoardContainer,
  BoardHeader,
  BoardTitle,
  PostButton,
  PostList,
  PostItem,
  PostContent,
  PostTitle,
  PostMeta,
  PostIcon,
  LoadingContainer,
  ErrorContainer,
  EmptyContainer,
} from "./ProjectBoard.styled";
import { FaPlus, FaChevronRight } from "react-icons/fa";

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

  const handlePostClick = (post?: PostSummaryReadResponse) => {
    if (post) {
      console.log("게시글 클릭:", post);
      // 여기에 게시글 상세 모달 또는 페이지 이동 로직 추가
    } else {
      console.log("새 게시글 작성");
      // 여기에 게시글 작성 모달 로직 추가
    }
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

  return (
    <BoardContainer>
      <BoardHeader>
        <BoardTitle>게시글</BoardTitle>
        <PostButton onClick={() => handlePostClick()}>
          <FaPlus size={14} />
          게시글 작성
        </PostButton>
      </BoardHeader>

      {selectedStepId && (
        <div
          style={{
            padding: "8px 12px",
            backgroundColor: "#fef3c7",
            borderRadius: "6px",
            marginBottom: "16px",
            fontSize: "14px",
            color: "#92400e",
          }}
        >
          선택된 스텝의 게시글을 표시합니다. (총 {totalElements}개)
        </div>
      )}

      <PostList>
        {loading ? (
          <LoadingContainer>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span>게시글을 불러오는 중...</span>
          </LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <span>게시글을 불러오는데 실패했습니다: {error}</span>
          </ErrorContainer>
        ) : posts.length === 0 ? (
          <EmptyContainer>
            <span>게시글이 없습니다.</span>
          </EmptyContainer>
        ) : (
          <>
            {posts.map((post) => (
              <PostItem key={post.postId} onClick={() => handlePostClick(post)}>
                <PostContent>
                  <PostTitle>{post.title}</PostTitle>
                  <PostMeta>
                    <span>{post.authorName}</span>
                    <span>{formatDate(post.createdAt)}</span>
                    <span
                      style={{
                        padding: "2px 6px",
                        backgroundColor:
                          post.type === "GENERAL" ? "#dbeafe" : "#fef3c7",
                        color: post.type === "GENERAL" ? "#1e40af" : "#92400e",
                        borderRadius: "4px",
                        fontSize: "12px",
                      }}
                    >
                      {post.type === "GENERAL" ? "일반" : "질문"}
                    </span>
                  </PostMeta>
                </PostContent>
                <PostIcon>
                  <FaChevronRight size={14} />
                </PostIcon>
              </PostItem>
            ))}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "20px",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    backgroundColor: currentPage === 0 ? "#f3f4f6" : "#ffffff",
                    color: currentPage === 0 ? "#9ca3af" : "#374151",
                    cursor: currentPage === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  이전
                </button>
                <span
                  style={{
                    padding: "8px 12px",
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  {currentPage + 1} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    backgroundColor:
                      currentPage === totalPages - 1 ? "#f3f4f6" : "#ffffff",
                    color:
                      currentPage === totalPages - 1 ? "#9ca3af" : "#374151",
                    cursor:
                      currentPage === totalPages - 1
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </PostList>
    </BoardContainer>
  );
};

export default ProjectBoard;
