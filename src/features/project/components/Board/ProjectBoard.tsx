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
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  DropdownContainer,
} from "./ProjectBoard.styled";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/axios";
import type {
  Post,
  StepList,
  PostPriority,
  ProjectDetailResponse,
  PostType,
} from "../../types/Types";
import { POST_PRIORITY_LABELS } from "../../types/Types";
import ProjectPostDetailModal from "@/features/board/components/Post/components/DetailModal/ProjectPostDetailModal";
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
import { FaChevronRight } from "react-icons/fa";

interface ProjectBoardProps {
  projectId: number;
  selectedStepId?: number;
}

const ProjectBoard: React.FC<ProjectBoardProps> = ({
  projectId,
  selectedStepId,
}) => {
  const { projectDetail } = useParams<{ projectId: string }>();
  const [steps, setSteps] = useState<StepList>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStep, setSelectedStep] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<PostPriority | "">(
    ""
  );
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // 프로젝트 스텝 정보 설정
  useEffect(() => {
    if (projectDetail && projectDetail.steps) {
      const projectSteps = projectDetail.steps
        .filter((step) => !step.isDeleted)
        .sort((a, b) => a.stepOrder - b.stepOrder)
        .map((step) => step.name);
      setSteps(projectSteps);
    }
  }, [projectDetail]);

  // 게시글 목록 가져오기
  const fetchPosts = async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const response = await api.get(`/api/posts/project/${projectId}`);
      if (response.data.status === "OK" && response.data.data) {
        setPosts(response.data.data.content || []);
      }
    } catch (error) {
      console.error("게시글 목록 불러오기 실패", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // 선택된 스텝에 따른 게시글 필터링 (필요시 구현)
  const filteredPosts = useMemo(() => {
    if (!selectedStepId) {
      return posts; // 스텝이 선택되지 않았으면 모든 게시글 표시
    }

    // 선택된 스텝의 게시글만 필터링하는 로직
    // 실제 구현시에는 게시글에 스텝 정보가 있어야 함
    return posts.filter((post) => {
      // 예시: post.stepId === selectedStepId
      return true; // 현재는 모든 게시글 표시
    });
  }, [posts, selectedStepId]);

  useEffect(() => {
    fetchPosts();
  }, [projectId]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".dropdown-container")) {
        setIsTypeDropdownOpen(false);
        setIsPriorityDropdownOpen(false);
        setIsKeywordDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRowClick = (postId: number) => {
    setSelectedPostId(postId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPostId(null);
  };

  const handleResetFilters = () => {
    setTypeFilter("ALL");
    setPriorityFilter("ALL");
    setKeywordType("title");
    setKeyword("");
  };

  // 검색 함수 (임시)
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
          <NewButton>
            <FiPlus size={16} />
            게시글 작성
          </NewButton>
        </FilterSearchRight>
      </Filters>

      <Table>
        <Thead>
          <Tr>
            <Th>번호</Th>
            <Th>단계</Th>
            <Th>제목</Th>
            <Th>작성자</Th>
            <Th>유형</Th>
            <Th>우선순위</Th>
            <Th>작성일</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredPosts.map((post) => (
            <Tr
              key={post.id}
              style={{ cursor: "pointer" }}
              onClick={() => handleRowClick(post.id)}
            >
              <Td>{post.id}</Td>
              <Td>{post.step}</Td>
              <Td>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <TitleText>{post.title}</TitleText>
                  {post.comments && post.comments.length > 0 && (
                    <CommentInfo>댓글 {post.comments.length}</CommentInfo>
                  )}
                </div>
              </Td>
              <Td>{post.writer}</Td>
              <Td>
                <TypeBadge type={post.type}>
                  {post.type === "GENERAL" ? "일반" : "질문"}
                </TypeBadge>
              </Td>
              <Td>
                <StatusBadge priority={post.priority}>
                  {POST_PRIORITY_LABELS[post.priority]}
                </StatusBadge>
              </Td>
              <Td>{post.createdAt}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <ProjectPostDetailModal
        open={isModalOpen}
        onClose={handleModalClose}
        postId={selectedPostId}
      />
    </Wrapper>
  );
};

export default ProjectBoard;
