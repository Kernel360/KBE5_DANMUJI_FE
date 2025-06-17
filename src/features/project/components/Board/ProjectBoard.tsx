import {
  Wrapper,
  Filters,
  FilterGroup,
  FilterLabel,
  FilterSearchRight,
  Select,
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
  StatusButtonGroup,
  StatusButton,
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
import { POST_PRIORITY_OPTIONS, POST_PRIORITY_LABELS } from "../../types/Types";
import ProjectPostDetailModal from "@/features/board/components/Post/components/DetailModal/ProjectPostDetailModal";
import {
  FiFileText,
  FiUser,
  FiMessageCircle,
  FiFlag,
  FiArrowUp,
  FiSearch,
  FiRotateCcw,
} from "react-icons/fi";

// 임시 데이터
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

  return (
    <Wrapper>
      <Filters>
        <FilterGroup>
          <FilterLabel>게시글 유형</FilterLabel>
          <StatusButtonGroup>
            <StatusButton
              $active={typeFilter === "ALL"}
              $color={"#6b7280"}
              onClick={() => setTypeFilter("ALL")}
            >
              <FiFileText size={16} />
              <span>전체</span>
            </StatusButton>
            <StatusButton
              $active={typeFilter === "GENERAL"}
              $color={"#3b82f6"}
              onClick={() => setTypeFilter("GENERAL")}
            >
              <FiMessageCircle size={16} />
              <span>일반</span>
            </StatusButton>
            <StatusButton
              $active={typeFilter === "QUESTION"}
              $color={"#f59e0b"}
              onClick={() => setTypeFilter("QUESTION")}
            >
              <FiFlag size={16} />
              <span>질문</span>
            </StatusButton>
          </StatusButtonGroup>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>우선순위</FilterLabel>
          <StatusButtonGroup>
            <StatusButton
              $active={priorityFilter === "ALL"}
              $color={"#6b7280"}
              onClick={() => setPriorityFilter("ALL")}
            >
              <FiArrowUp size={16} />
              <span>전체</span>
            </StatusButton>
            <StatusButton
              $active={priorityFilter === "LOW"}
              $color={"#10b981"}
              onClick={() => setPriorityFilter("LOW")}
            >
              <span>낮음</span>
            </StatusButton>
            <StatusButton
              $active={priorityFilter === "MEDIUM"}
              $color={"#fbbf24"}
              onClick={() => setPriorityFilter("MEDIUM")}
            >
              <span>보통</span>
            </StatusButton>
            <StatusButton
              $active={priorityFilter === "HIGH"}
              $color={"#a21caf"}
              onClick={() => setPriorityFilter("HIGH")}
            >
              <span>높음</span>
            </StatusButton>
            <StatusButton
              $active={priorityFilter === "URGENT"}
              $color={"#ef4444"}
              onClick={() => setPriorityFilter("URGENT")}
            >
              <span>긴급</span>
            </StatusButton>
          </StatusButtonGroup>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>키워드</FilterLabel>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <StatusButtonGroup>
              <StatusButton
                $active={keywordType === "title"}
                $color={"#3b82f6"}
                onClick={() => setKeywordType("title")}
              >
                <FiFileText size={16} />
                <span>제목</span>
              </StatusButton>
              <StatusButton
                $active={keywordType === "writer"}
                $color={"#10b981"}
                onClick={() => setKeywordType("writer")}
              >
                <FiUser size={16} />
                <span>작성자</span>
              </StatusButton>
            </StatusButtonGroup>
            <SearchInput
              placeholder={
                keywordType === "title" ? "제목으로 검색" : "작성자로 검색"
              }
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
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
          </div>
        </FilterGroup>
      </Filters>

      <Table>
        <Thead>
          <Tr>
            <Th>번호</Th>
            <Th>단계</Th>
            <Th>제목</Th>
            <Th>작성자</Th>
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
