import React, { useState, useEffect, type JSX, useRef } from "react";
import {
  getPostsByProjectStep,
  searchPosts,
} from "../../../project-d/services/postService";
import { getProjectDetail } from "../../services/projectService";
import type {
  PostSummaryReadResponse,
  PostDetailReadResponse,
} from "../../../project-d/types/post";
import type { ProjectDetailStep } from "../../services/projectService";
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
  PaginationContainer,
  PaginationInfo,
  PaginationNav,
  PaginationButton,
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
  FiTarget,
  FiCalendar,
  FiTag,
  FiStar,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { LuUserRoundCog } from "react-icons/lu";
import { POST_PRIORITY_LABELS } from "../../types/Types";
import ProjectPostDetailModal from "@/features/board/components/Post/components/DetailModal/ProjectPostDetailModal";
import PostFormModal from "@/features/board/components/Post/components/FormModal/PostFormModal";
import { showSuccessToast } from "@/utils/errorHandler";

interface ProjectBoardProps {
  projectId: number;
  selectedStepId?: number;
}

const ProjectBoard: React.FC<ProjectBoardProps> = ({
  projectId,
  selectedStepId,
}) => {
  const [posts, setPosts] = useState<PostDetailReadResponse[]>([]);
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
  // 단계별 필터 추가
  const [stepFilter, setStepFilter] = useState<number | "ALL">("ALL");
  // 키워드 필터
  const [keywordType, setKeywordType] = useState<"title" | "writer">("title");
  const [keyword, setKeyword] = useState("");

  // 프로젝트 단계 정보 상태 추가
  const [projectSteps, setProjectSteps] = useState<ProjectDetailStep[]>([]);

  // 드롭다운 상태
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isStepDropdownOpen, setIsStepDropdownOpen] = useState(false);
  const [isKeywordDropdownOpen, setIsKeywordDropdownOpen] = useState(false);

  // 드롭다운 refs
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const priorityDropdownRef = useRef<HTMLDivElement>(null);
  const stepDropdownRef = useRef<HTMLDivElement>(null);
  const keywordDropdownRef = useRef<HTMLDivElement>(null);

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

  // 드롭다운 위치 조정 함수
  const adjustDropdownPosition = (
    dropdownRef: React.RefObject<HTMLDivElement>
  ) => {
    if (!dropdownRef.current) return;

    const rect = dropdownRef.current.getBoundingClientRect();
    const dropdownMenu = dropdownRef.current.querySelector(
      "[data-dropdown-menu]"
    ) as HTMLElement;

    if (!dropdownMenu) return;

    const menuHeight = dropdownMenu.offsetHeight;
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - rect.bottom;
    const spaceAbove = rect.top;

    // 아래쪽 공간이 부족하고 위쪽 공간이 충분하면 위쪽으로 표시
    if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
      dropdownMenu.style.top = "auto";
      dropdownMenu.style.bottom = "100%";
      dropdownMenu.style.marginTop = "0";
      dropdownMenu.style.marginBottom = "4px";
    } else {
      dropdownMenu.style.top = "100%";
      dropdownMenu.style.bottom = "auto";
      dropdownMenu.style.marginTop = "4px";
      dropdownMenu.style.marginBottom = "0";
    }
  };

  // 드롭다운 외부 클릭 및 ESC 키 처리
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(target) &&
        isTypeDropdownOpen
      ) {
        setIsTypeDropdownOpen(false);
      }

      if (
        priorityDropdownRef.current &&
        !priorityDropdownRef.current.contains(target) &&
        isPriorityDropdownOpen
      ) {
        setIsPriorityDropdownOpen(false);
      }

      if (
        stepDropdownRef.current &&
        !stepDropdownRef.current.contains(target) &&
        isStepDropdownOpen
      ) {
        setIsStepDropdownOpen(false);
      }

      if (
        keywordDropdownRef.current &&
        !keywordDropdownRef.current.contains(target) &&
        isKeywordDropdownOpen
      ) {
        setIsKeywordDropdownOpen(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsTypeDropdownOpen(false);
        setIsPriorityDropdownOpen(false);
        setIsStepDropdownOpen(false);
        setIsKeywordDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [
    isTypeDropdownOpen,
    isPriorityDropdownOpen,
    isStepDropdownOpen,
    isKeywordDropdownOpen,
  ]);

  // fetchPosts 함수를 컴포넌트 레벨로 이동
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
      // 필터 조건이 있는 경우 검색 API 사용
      if (
        typeFilter !== "ALL" ||
        priorityFilter !== "ALL" ||
        stepFilter !== "ALL" ||
        keyword
      ) {
        const searchParams: any = {};

        if (typeFilter !== "ALL") {
          searchParams.type = typeFilter;
        }
        if (priorityFilter !== "ALL") {
          searchParams.priority = priorityFilter;
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
      } else {
        // 필터 조건이 없는 경우 기존 API 사용
        const response = await getPostsByProjectStep(
          projectId,
          selectedStepId,
          currentPage,
          10
        );
        setPosts(response.content);
        setTotalPages(response.page.totalPages);
        setTotalElements(response.page.totalElements);
      }
    } catch (err) {
      setError("게시글을 불러오는데 실패했습니다.");
      console.error("게시글 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

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

  // 필터링된 게시글 (API에서 처리하므로 클라이언트 필터링 제거)
  const filteredPosts = posts;

  const handleRowClick = (postId: number) => {
    setSelectedPostId(postId);
    setDetailModalOpen(true);
  };

  const handleResetFilters = () => {
    setTypeFilter("ALL");
    setPriorityFilter("ALL");
    setStepFilter("ALL");
    setKeywordType("title");
    setKeyword("");
    setCurrentPage(0); // 첫 페이지로 이동
    // 필터 리셋 후 API 호출은 useEffect에서 자동으로 트리거됨
  };

  const handleSearch = () => {
    // 검색 버튼 클릭 시 게시글 목록 새로고침
    setCurrentPage(0); // 첫 페이지로 이동
    fetchPosts();
  };

  const handleTypeDropdownToggle = () => {
    setIsTypeDropdownOpen((prev) => {
      if (!prev) {
        setIsPriorityDropdownOpen(false);
        setIsKeywordDropdownOpen(false);
        // 드롭다운이 열릴 때 위치 조정
        setTimeout(() => adjustDropdownPosition(typeDropdownRef), 0);
      }
      return !prev;
    });
  };

  const handlePriorityDropdownToggle = () => {
    setIsPriorityDropdownOpen((prev) => {
      if (!prev) {
        setIsTypeDropdownOpen(false);
        setIsKeywordDropdownOpen(false);
        // 드롭다운이 열릴 때 위치 조정
        setTimeout(() => adjustDropdownPosition(priorityDropdownRef), 0);
      }
      return !prev;
    });
  };

  const handleKeywordDropdownToggle = () => {
    setIsKeywordDropdownOpen((prev) => {
      if (!prev) {
        setIsTypeDropdownOpen(false);
        setIsPriorityDropdownOpen(false);
        // 드롭다운이 열릴 때 위치 조정
        setTimeout(() => adjustDropdownPosition(keywordDropdownRef), 0);
      }
      return !prev;
    });
  };

  const handleStepDropdownToggle = () => {
    setIsStepDropdownOpen((prev) => {
      if (!prev) {
        setIsTypeDropdownOpen(false);
        setIsPriorityDropdownOpen(false);
        setIsKeywordDropdownOpen(false);
        // 드롭다운이 열릴 때 위치 조정
        setTimeout(() => adjustDropdownPosition(stepDropdownRef), 0);
      }
      return !prev;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const timeStr = date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <span style={{ fontSize: "14px", color: "#374151" }}>{dateStr}</span>
        <span style={{ fontSize: "12px", color: "#6b7280" }}>{timeStr}</span>
      </div>
    );
  };

  // 게시글의 단계 이름을 가져오는 헬퍼 함수
  const getStepName = (stepId: number | null): string => {
    if (!stepId) return "";
    const step = projectSteps.find((s) => s.id === stepId);
    return step ? step.name : "";
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

  const handlePostDelete = (deletedPostId: number) => {
    // 게시글 삭제 후 목록 새로고침
    fetchPosts();
  };

  // 게시글 계층 렌더링 함수 (검색 시에는 관계 표시 안함)
  const renderPosts = (posts: PostDetailReadResponse[]): JSX.Element[] => {
    // 검색 조건이 있는지 확인
    const hasSearchConditions =
      typeFilter !== "ALL" ||
      priorityFilter !== "ALL" ||
      stepFilter !== "ALL" ||
      keyword;

    if (hasSearchConditions) {
      // 검색 시에는 단순 리스트로 렌더링
      return posts.map((post) => (
        <Tr key={post.postId} onClick={() => handleRowClick(post.postId || 0)}>
          <Td>
            <TitleText>
              {getStepName(post.projectStepId) && (
                <span
                  style={{
                    color: "#9ca3af",
                    fontSize: "0.85em",
                    marginRight: "8px",
                  }}
                >
                  {getStepName(post.projectStepId)}
                </span>
              )}
              {post.title}
            </TitleText>
          </Td>
          <Td>
            {(post.commentCount ?? post.comments?.length ?? 0) > 0 && (
              <span style={{ color: "#9ca3af", fontSize: "0.9em" }}>
                댓글 {post.commentCount ?? post.comments?.length}
              </span>
            )}
          </Td>
          <Td>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FiUser size={14} style={{ color: "#3b82f6" }} />
              <span>{post.authorName}</span>
            </div>
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
          <Td style={{ textAlign: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <FiCalendar size={14} style={{ color: "#8b5cf6" }} />
              {formatDate(post.createdAt)}
            </div>
          </Td>
        </Tr>
      ));
    } else {
      // 일반 목록 조회 시에는 부모-자식 관계 표시
      // 부모 게시글들 (parentId가 null인 것들)
      const parentPosts = posts.filter((post) => post.parentId === null);

      // 답글들 (parentId가 null이 아닌 것들)
      const replyPosts = posts.filter((post) => post.parentId !== null);

      const result: JSX.Element[] = [];

      // 부모 게시글들을 먼저 렌더링
      parentPosts.forEach((parentPost) => {
        // 부모 게시글 추가
        result.push(
          <Tr
            key={parentPost.postId}
            onClick={() => handleRowClick(parentPost.postId || 0)}
          >
            <Td>
              <TitleText>
                {getStepName(parentPost.projectStepId) && (
                  <span
                    style={{
                      color: "#9ca3af",
                      fontSize: "0.85em",
                      marginRight: "8px",
                    }}
                  >
                    {getStepName(parentPost.projectStepId)}
                  </span>
                )}
                {parentPost.title}
              </TitleText>
            </Td>
            <Td>
              {(parentPost.commentCount ?? parentPost.comments?.length ?? 0) >
                0 && (
                <span style={{ color: "#9ca3af", fontSize: "0.9em" }}>
                  댓글 {parentPost.commentCount ?? parentPost.comments?.length}
                </span>
              )}
            </Td>
            <Td>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <FiUser size={14} style={{ color: "#3b82f6" }} />
                <span>{parentPost.authorName}</span>
              </div>
            </Td>
            <Td>
              <TypeBadge type={parentPost.type as "GENERAL" | "QUESTION"}>
                {parentPost.type === "GENERAL" ? "일반" : "질문"}
              </TypeBadge>
            </Td>
            <Td>
              <StatusBadge priority={parentPost.priority as PostPriority}>
                {POST_PRIORITY_LABELS[parentPost.priority as PostPriority] ??
                  parentPost.priority}
              </StatusBadge>
            </Td>
            <Td style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <FiCalendar size={14} style={{ color: "#8b5cf6" }} />
                {formatDate(parentPost.createdAt)}
              </div>
            </Td>
          </Tr>
        );

        // 이 부모에 대한 답글들을 찾아서 바로 아래에 렌더링
        const children = replyPosts.filter(
          (reply) => reply.parentId === parentPost.postId
        );
        children.forEach((child) => {
          result.push(
            <Tr
              key={child.postId}
              onClick={() => handleRowClick(child.postId || 0)}
            >
              <Td style={{ paddingLeft: 32 }}>
                <TitleText>
                  {getStepName(child.projectStepId) && (
                    <span
                      style={{
                        color: "#9ca3af",
                        fontSize: "0.85em",
                        marginRight: "8px",
                      }}
                    >
                      {getStepName(child.projectStepId)}
                    </span>
                  )}
                  <span
                    style={{
                      color: "#fdb924",
                      fontSize: "0.85em",
                      fontWeight: 600,
                    }}
                  >
                    [답글]
                  </span>{" "}
                  <span
                    style={{
                      color: "#6b7280",
                      fontSize: "0.85em",
                    }}
                  >
                    @{parentPost.title}
                  </span>{" "}
                  {child.title}
                </TitleText>
              </Td>
              <Td>
                {(child.commentCount ?? child.comments?.length ?? 0) > 0 && (
                  <span style={{ color: "#9ca3af", fontSize: "0.9em" }}>
                    댓글 {child.commentCount ?? child.comments?.length}
                  </span>
                )}
              </Td>
              <Td>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FiUser size={14} style={{ color: "#3b82f6" }} />
                  <span>{child.authorName}</span>
                </div>
              </Td>
              <Td>
                <TypeBadge type={child.type as "GENERAL" | "QUESTION"}>
                  {child.type === "GENERAL" ? "일반" : "질문"}
                </TypeBadge>
              </Td>
              <Td>
                <StatusBadge priority={child.priority as PostPriority}>
                  {POST_PRIORITY_LABELS[child.priority as PostPriority] ??
                    child.priority}
                </StatusBadge>
              </Td>
              <Td style={{ textAlign: "center" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <FiCalendar size={14} style={{ color: "#8b5cf6" }} />
                  {formatDate(child.createdAt)}
                </div>
              </Td>
            </Tr>
          );
        });
      });

      // 부모가 검색 결과에 없는 답글들 (고아 답글)을 마지막에 렌더링
      const orphanReplies = replyPosts.filter(
        (reply) =>
          !parentPosts.some((parent) => parent.postId === reply.parentId)
      );

      orphanReplies.forEach((orphan) => {
        result.push(
          <Tr
            key={orphan.postId}
            onClick={() => handleRowClick(orphan.postId || 0)}
          >
            <Td>
              <TitleText>
                {getStepName(orphan.projectStepId) && (
                  <span
                    style={{
                      color: "#9ca3af",
                      fontSize: "0.85em",
                      marginRight: "8px",
                    }}
                  >
                    {getStepName(orphan.projectStepId)}
                  </span>
                )}
                <span
                  style={{
                    color: "#fdb924",
                    fontSize: "0.85em",
                    fontWeight: 600,
                  }}
                >
                  [답글]
                </span>{" "}
                {orphan.title}
              </TitleText>
            </Td>
            <Td>
              {(orphan.commentCount ?? orphan.comments?.length ?? 0) > 0 && (
                <span style={{ color: "#9ca3af", fontSize: "0.9em" }}>
                  댓글 {orphan.commentCount ?? orphan.comments?.length}
                </span>
              )}
            </Td>
            <Td>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <FiUser size={14} style={{ color: "#3b82f6" }} />
                <span>{orphan.authorName}</span>
              </div>
            </Td>
            <Td>
              <TypeBadge type={orphan.type as "GENERAL" | "QUESTION"}>
                {orphan.type === "GENERAL" ? "일반" : "질문"}
              </TypeBadge>
            </Td>
            <Td>
              <StatusBadge priority={orphan.priority as PostPriority}>
                {POST_PRIORITY_LABELS[orphan.priority as PostPriority] ??
                  orphan.priority}
              </StatusBadge>
            </Td>
            <Td style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <FiCalendar size={14} style={{ color: "#8b5cf6" }} />
                {formatDate(orphan.createdAt)}
              </div>
            </Td>
          </Tr>
        );
      });

      return result;
    }
  };

  return (
    <Wrapper>
      <Filters>
        <FilterLeft>
          <FilterGroup>
            <FilterLabel>게시글 유형</FilterLabel>
            <DropdownContainer
              ref={typeDropdownRef}
              className="dropdown-container"
            >
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
              <DropdownMenu $isOpen={isTypeDropdownOpen} data-dropdown-menu>
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
            <DropdownContainer
              ref={priorityDropdownRef}
              className="dropdown-container"
            >
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
              <DropdownMenu $isOpen={isPriorityDropdownOpen} data-dropdown-menu>
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
            <FilterLabel>단계</FilterLabel>
            <DropdownContainer
              ref={stepDropdownRef}
              className="dropdown-container"
            >
              <DropdownButton
                $active={stepFilter !== "ALL"}
                $color={
                  stepFilter === "ALL"
                    ? "#6b7280"
                    : (() => {
                        const selectedStep = projectSteps.find(
                          (step) => step.id === stepFilter
                        );
                        if (!selectedStep) return "#6b7280";

                        switch (selectedStep.projectStepStatus) {
                          case "IN_PROGRESS":
                            return "#fdb924"; // 진행중 - 주황색
                          case "COMPLETED":
                            return "#10b981"; // 완료 - 초록색
                          case "PENDING":
                            return "#6b7280"; // 대기 - 회색
                          default:
                            return "#6b7280"; // 기본 - 회색
                        }
                      })()
                }
                $isOpen={isStepDropdownOpen}
                onClick={handleStepDropdownToggle}
              >
                <FiTarget size={16} />
                <span>
                  {stepFilter === "ALL"
                    ? "전체"
                    : projectSteps.find((step) => step.id === stepFilter)
                        ?.name || "알 수 없음"}
                </span>
                <FiChevronDown size={16} />
              </DropdownButton>
              <DropdownMenu $isOpen={isStepDropdownOpen} data-dropdown-menu>
                <DropdownItem
                  $active={stepFilter === "ALL"}
                  $color={"#6b7280"}
                  onClick={() => {
                    setStepFilter("ALL");
                    setIsStepDropdownOpen(false);
                  }}
                >
                  <FiTarget size={16} />
                  <span>전체</span>
                </DropdownItem>
                {projectSteps
                  .filter((step) => !step.isDeleted)
                  .sort((a, b) => a.stepOrder - b.stepOrder)
                  .map((step) => (
                    <DropdownItem
                      key={step.id}
                      $active={stepFilter === step.id}
                      $color={"#10b981"}
                      onClick={() => {
                        setStepFilter(step.id);
                        setIsStepDropdownOpen(false);
                      }}
                    >
                      <FiTarget size={16} />
                      <span>{step.name}</span>
                    </DropdownItem>
                  ))}
              </DropdownMenu>
            </DropdownContainer>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>키워드</FilterLabel>
            <DropdownContainer
              ref={keywordDropdownRef}
              className="dropdown-container"
            >
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
              <DropdownMenu $isOpen={isKeywordDropdownOpen} data-dropdown-menu>
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
            <Th style={{ width: "20%" }}>제목</Th>
            <Th style={{ width: "5%" }}></Th>
            <Th style={{ textAlign: "left", width: "5%" }}>작성자</Th>
            <Th style={{ width: "5%" }}>유형</Th>
            <Th style={{ width: "5%" }}>우선순위</Th>
            <Th style={{ textAlign: "center", width: "10%" }}>작성일</Th>
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
          <PaginationNav>
            {/* 첫 페이지가 아니면 이전 버튼 렌더 */}
            {currentPage > 0 && (
              <PaginationButton
                onClick={() => handlePageChange(currentPage - 1)}
              >
                이전
              </PaginationButton>
            )}

            {/* 페이지 번호 버튼들을 동적으로 생성 */}
            {Array.from({ length: totalPages }, (_, idx) => (
              <PaginationButton
                key={idx}
                $active={currentPage === idx}
                onClick={() => handlePageChange(idx)}
              >
                {idx + 1}
              </PaginationButton>
            ))}

            {/* 마지막 페이지가 아니면 다음 버튼 렌더 */}
            {currentPage + 1 < totalPages && (
              <PaginationButton
                onClick={() => handlePageChange(currentPage + 1)}
              >
                다음
              </PaginationButton>
            )}
          </PaginationNav>
          <PaginationInfo>
            총 {totalElements}개 항목 중 {currentPage * 10 + 1}-
            {Math.min((currentPage + 1) * 10, totalElements)}개 표시
          </PaginationInfo>
        </PaginationContainer>
      )}

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
