import React, { useState, useEffect } from "react";
import { searchPosts } from "../../../project-d/services/postService";
import { getProjectDetail } from "../../services/projectService";
import type { PostSummaryReadResponse } from "../../../project-d/types/post";
import { PostPriority, PostType } from "../../../project-d/types/post";
import type { ProjectDetailStep } from "../../services/projectService";
import { Wrapper } from "./ProjectBoard.styled";
import ProjectPostDetailModal from "@/features/board/components/Post/components/DetailModal/ProjectPostDetailModal";
import PostFormModal from "@/features/board/components/Post/components/FormModal/PostFormModal";
import { showSuccessToast } from "@/utils/errorHandler";
import ProjectBoardFilters from "./ProjectBoardFilters";
import ProjectBoardTable from "./ProjectBoardTable";
import ProjectBoardPagination from "./ProjectBoardPagination";

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
  const [typeFilter, setTypeFilter] = useState<"ALL" | PostType>("ALL");
  // 우선순위 필터
  const [priorityFilter, setPriorityFilter] = useState<"ALL" | PostPriority>(
    "ALL"
  );
  // 단계별 필터 추가
  const [stepFilter, setStepFilter] = useState<number | "ALL">("ALL");
  // 키워드 필터
  const [keywordType, setKeywordType] = useState<"title" | "writer">("title");
  const [keyword, setKeyword] = useState("");

  // 프로젝트 단계 정보 상태 추가
  const [projectSteps, setProjectSteps] = useState<ProjectDetailStep[]>([]);

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

  // 게시글 수정 전 단계 정보 추적
  const [editingPostStepId, setEditingPostStepId] = useState<number | null>(
    null
  );

  // 단계 이름 상태 추가
  const [stepName, setStepName] = useState<string>("");

  // fetchPosts 함수
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
      // 모든 경우에 검색 API 사용
      const searchParams: {
        title?: string;
        author?: string;
        type?: PostType;
        priority?: PostPriority;
      } = {};

      if (typeFilter !== "ALL") {
        searchParams.type = typeFilter as PostType;
      }
      if (priorityFilter !== "ALL") {
        searchParams.priority = priorityFilter as PostPriority;
      }
      if (keyword) {
        if (keywordType === "title") {
          searchParams.title = keyword;
        } else {
          searchParams.author = keyword;
        }
      }

      // 단계별 필터링 처리
      let targetStepId: number | null;
      if (stepFilter !== "ALL") {
        // 특정 단계 선택 시
        targetStepId = stepFilter;
      } else {
        // "전체" 선택 시 - 모든 단계에서 검색
        targetStepId = null;
      }

      const response = await searchPosts(
        projectId,
        targetStepId,
        searchParams,
        currentPage,
        10
      );

      if (response.data) {
        setPosts(response.data.content);
        setTotalPages(response.data.page.totalPages);
        setTotalElements(response.data.page.totalElements);
      }
    } catch (err) {
      setError("게시글을 불러오는데 실패했습니다.");
      console.error("게시글 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  // selectedStepId가 변경될 때 stepFilter도 업데이트
  useEffect(() => {
    if (selectedStepId) {
      setStepFilter(selectedStepId);
    }
  }, [selectedStepId]);

  useEffect(() => {
    fetchPosts();
  }, [
    projectId,
    selectedStepId,
    currentPage,
    typeFilter,
    priorityFilter,
    stepFilter,
  ]);

  // 단계 이름 가져오기
  const fetchStepName = async () => {
    if (!selectedStepId) {
      setStepName("");
      return;
    }

    try {
      const response = await getProjectDetail(projectId);
      if (response.data) {
        const step = response.data.steps.find((s) => s.id === selectedStepId);
        if (step) {
          setStepName(step.name);
        }
      }
    } catch (err) {
      console.error("단계 정보 조회 실패:", err);
      setStepName("");
    }
  };

  useEffect(() => {
    fetchStepName();
  }, [projectId, selectedStepId]);

  // 프로젝트 단계 정보 가져오기
  const fetchProjectSteps = async () => {
    try {
      const response = await getProjectDetail(projectId);
      if (response.data) {
        setProjectSteps(response.data.steps);
        // 진행중(IN_PROGRESS) 단계가 있으면 id가 가장 작은 단계로 stepFilter 설정
        const inProgressSteps = response.data.steps.filter(
          (s) => s.projectStepStatus === "IN_PROGRESS"
        );
        if (inProgressSteps.length > 0) {
          const minIdStep = inProgressSteps.reduce((prev, curr) =>
            prev.id < curr.id ? prev : curr
          );
          setStepFilter(minIdStep.id);
        } else {
          setStepFilter("ALL");
        }
      }
    } catch (err) {
      console.error("프로젝트 단계 정보 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchProjectSteps();
  }, [projectId]);

  const handleRowClick = (postId: number) => {
    setSelectedPostId(postId);
    setDetailModalOpen(true);
  };

  // 단계 클릭 핸들러 추가
  const handleStepClick = (stepId: number) => {
    setStepFilter(stepId);
    setCurrentPage(0); // 페이지를 첫 페이지로 리셋
  };

  const handleResetFilters = () => {
    setTypeFilter("ALL");
    setPriorityFilter("ALL");
    setStepFilter("ALL");
    setKeywordType("title");
    setKeyword("");
    setCurrentPage(0); // 첫 페이지로 이동
  };

  const handleSearch = () => {
    // 검색 버튼 클릭 시 게시글 목록 새로고침
    setCurrentPage(0); // 첫 페이지로 이동
    fetchPosts();
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

    // 수정할 게시글의 현재 단계 정보 저장
    const targetPost = posts.find((post) => post.postId === postId);
    if (targetPost) {
      setEditingPostStepId(targetPost.projectStepId || null);
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
    if (editingPostStepId !== null && editingPostStepId !== selectedStepId) {
      showSuccessToast(
        "게시글 수정 완료 - 단계가 변경되어 현재 목록에서 사라졌습니다."
      );
    }

    // 단계 정보 초기화
    setEditingPostStepId(null);
  };

  const handlePostDelete = () => {
    // 게시글 삭제 후 목록 새로고침
    fetchPosts();
  };

  return (
    <Wrapper>
      <ProjectBoardFilters
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        stepFilter={stepFilter}
        setStepFilter={setStepFilter}
        keywordType={keywordType}
        setKeywordType={setKeywordType}
        keyword={keyword}
        setKeyword={setKeyword}
        projectSteps={projectSteps}
        onSearch={handleSearch}
        onResetFilters={handleResetFilters}
        onCreatePost={handleCreatePost}
      />

      <ProjectBoardTable
        posts={posts}
        loading={loading}
        error={error}
        projectSteps={projectSteps}
        onRowClick={handleRowClick}
        onStepClick={handleStepClick}
      />

      <ProjectBoardPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={handlePageChange}
      />

      <ProjectPostDetailModal
        open={detailModalOpen}
        postId={selectedPostId}
        stepName={stepName}
        onClose={() => setDetailModalOpen(false)}
        onEditPost={handleEditPost}
        onReplyPost={handleReplyPost}
        onPostDelete={handlePostDelete}
      />

      <PostFormModal
        open={isFormModalOpen}
        onClose={handleFormModalClose}
        mode={formModalMode}
        postId={formModalPostId ?? undefined}
        parentId={formModalParentId ?? undefined}
        stepId={selectedStepId}
        projectId={projectId}
        onSuccess={handleFormModalSuccess}
        colorTheme={{ main: "#fdb924", sub: "#f59e0b" }}
      />
    </Wrapper>
  );
};

export default ProjectBoard;
