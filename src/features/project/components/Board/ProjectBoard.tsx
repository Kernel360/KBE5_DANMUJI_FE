import {
  Wrapper,
  Filters,
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

  const filteredPosts = posts.filter(
    (post) =>
      (selectedPriority ? post.priority === selectedPriority : true) &&
      (selectedStep ? post.step === selectedStep : true)
  );

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

  return (
    <Wrapper>
      <Filters>
        <Select>
          <option>제목</option>
        </Select>
        <SearchInput placeholder="게시글 검색..." />

        <Select
          value={selectedStep}
          onChange={(e) => setSelectedStep(e.target.value)}
          disabled={loading}
        >
          <option value="">현재 단계: 전체</option>
          {steps.map((step) => (
            <option key={step} value={step}>
              {step}
            </option>
          ))}
        </Select>

        {/* <Select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value as PostPriority)}>
          <option value="">우선 순위: 전체</option>
          {POST_PRIORITY_OPTIONS.map((priority) => (
            <option key={priority} value={priority}>
              {POST_PRIORITY_LABELS[priority]}
            </option>
          ))}
        </Select> */}

        <NewButton>+ 게시글 작성</NewButton>
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
