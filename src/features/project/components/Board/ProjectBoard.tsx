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
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/axios";
import type {
  Post,
  StepList,
  PostPriority,
  ProjectDetailResponse,
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

// 임시 데이터ㄴ
const posts: Post[] = [
  {
    id: 10,
    step: "기획",
    title: "데이터베이스 설계 완료 보고서",
    writer: "이개발",
    priority: "LOW",
    type: "GENERAL",
    createdAt: "2023.09.10",
    comments: [{ id: 1 }, { id: 2 }],
  },
  {
    id: 9,
    step: "디자인",
    title: "UI/UX 디자인 검토 요청",
    writer: "최디자인",
    priority: "MEDIUM",
    type: "GENERAL",
    createdAt: "2023.09.05",
    comments: [],
  },
  {
    id: 8,
    step: "개발",
    title: "API 개발 진행 상황 보고",
    writer: "정백엔드",
    priority: "HIGH",
    type: "GENERAL",
    createdAt: "2023.08.25",
    comments: [{ id: 1 }],
  },
  {
    id: 7,
    step: "기획",
    title: "프론트엔드 프레임워크 선정 보고서",
    writer: "김프론트",
    priority: "URGENT",
    type: "QUESTION",
    createdAt: "2023.08.18",
    comments: [],
  },
  {
    id: 6,
    step: "기획",
    title: "요구사항 정의서 v1.2",
    writer: "이개발",
    priority: "LOW",
    type: "GENERAL",
    createdAt: "2023.08.05",
    comments: [{ id: 1 }, { id: 2 }, { id: 3 }],
  },
];

const ProjectBoard = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [steps, setSteps] = useState<StepList>([]);
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

  const filteredPosts = posts;

  useEffect(() => {
    const fetchSteps = async () => {
      if (!projectId) return;

      try {
        setLoading(true);
        const response = await api.get<ProjectDetailResponse>(
          `/api/projects/${projectId}`
        );

        const projectSteps = response.data.data.steps
          .filter((step) => !step.isDeleted)
          .sort((a, b) => a.stepOrder - b.stepOrder)
          .map((step) => step.name);

        setSteps(projectSteps);
      } catch (error) {
        console.error("단계 목록 불러오기 실패", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSteps();
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
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
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
                onClick={() =>
                  setIsPriorityDropdownOpen(!isPriorityDropdownOpen)
                }
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
                onClick={() => setIsKeywordDropdownOpen(!isKeywordDropdownOpen)}
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
