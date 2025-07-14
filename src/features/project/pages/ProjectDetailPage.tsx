import { useEffect, useState } from "react";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import ProjectHeader from "../components/Header/ProjectHeader";
import ProjectProgress from "../components/Progress/ProjectProgress";
import ProjectBoard from "../components/Board/ProjectBoard";
import {
  getProjectDetail,
  type ProjectDetailResponse,
} from "../services/projectService";
import styled from "styled-components";
import ProjectCreateModal from "../components/ProjectCreateModal";
import api from "@/api/axios";
import { useAuth } from "@/hooks/useAuth";
import KanbanBoard from "../components/Checklist/KanbanBoard";
import {
  DetailPageContainer,
  PageTitle,
  PageDescription,
  LoadingContainer,
  ErrorContainer,
} from "./ProjectDetailPage.styled";
// import ProjectMemberList from "../components/MemberList/ProjectMemberList";
// import ProjectFileList from '../components/FileList/ProjectFileList';

// 프로젝트 수정 폼 타입 정의
interface ProjectEditForm {
  name: string;
  description: string;
  projectCost: string;
  startDate: string;
  endDate: string;
  devManagerId: string;
  clientManagerId: string;
  devUserId: string;
  clientUserId: string;
}

// 프로젝트 수정 요청 페이로드 타입
interface ProjectEditPayload {
  name: string;
  description: string;
  projectCost: number;
  startDate: string;
  endDate: string;
  devManagerId: number[];
  clientManagerId: number[];
  devUserId: number[];
  clientUserId: number[];
}

// 토글 버튼 스타일
export const TabButton = styled.button<{ $active: boolean }>`
  padding: 6px 18px;
  border: none;
  background: transparent;
  font-size: 1rem;
  font-weight: ${(props) => (props.$active ? 700 : 500)};
  color: ${(props) => (props.$active ? "#f59e0b" : "#bdbdbd")};
  border-bottom: ${(props) => (props.$active ? "2px solid #fdb924" : "none")};
  cursor: pointer;
  transition: color 0.18s, border-bottom 0.18s, background 0.18s;
  border-radius: 0;
  margin: 0 0 0 0;
  &:hover {
    background: #fffbe8;
    color: #f59e0b;
  }
`;
const ToggleTabGroup = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 0;
  margin: 18px 0 0px 33px;
`;

const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const [projectDetail, setProjectDetail] =
    useState<ProjectDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<number | undefined>(
    undefined
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { role } = useAuth();
  const [viewType, setViewType] = useState<"post" | "checklist">("post");
  const location = useLocation();
  const openPostId = location.state?.openPostId as number | undefined;
  const openChecklistId = location.state?.openChecklistId as number | undefined;
  // 프로젝트 상세 정보 가져오기
  const fetchProjectDetail = async () => {
    if (!projectId) {
      setError("프로젝트 ID가 없습니다.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getProjectDetail(parseInt(projectId));

      if (response.data) {
        setProjectDetail(response.data);

        // 진행중인 단계를 기본으로 선택
        const inProgressStep = response.data.steps.find(
          (step) => step.projectStepStatus === "IN_PROGRESS"
        );
        if (inProgressStep) {
          setSelectedStepId(inProgressStep.id);
        }
      }
    } catch (err) {
      console.error("프로젝트 상세 정보 불러오기 실패", err);
      setError("프로젝트 상세 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetail();
  }, [projectId]);

  // URL 파라미터에서 tab=checklist가 있으면 체크리스트 탭으로 설정
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "checklist") {
      setViewType("checklist");
    }
  }, [searchParams]);

  const handleStepSelect = (stepId: number) => {
    setSelectedStepId(stepId);
    // 선택된 단계 정보 로깅
    const selectedStep = projectDetail?.steps.find(
      (step) => step.id === stepId
    );
    console.log(`Selected step: ${stepId} - ${selectedStep?.name}`);

    // ProjectBoard가 자동으로 해당 단계의 게시글을 필터링하여 표시합니다
    // selectedStepId가 변경되면 ProjectBoard의 useEffect가 트리거되어
    // 해당 단계의 게시글만 가져오게 됩니다
  };

  // 편집 저장 핸들러
  const handleEditSave = async (form: ProjectEditForm) => {
    if (!projectId) return;
    try {
      // 필드 변환 및 PUT 요청
      const payload: ProjectEditPayload = {
        name: form.name,
        description: form.description,
        projectCost: form.projectCost ? Number(form.projectCost) : 0,
        startDate: form.startDate,
        endDate: form.endDate,
        devManagerId: form.devManagerId
          ? form.devManagerId
              .split(",")
              .map((s: string) => Number(s.trim()))
              .filter(Boolean)
          : [],
        clientManagerId: form.clientManagerId
          ? form.clientManagerId
              .split(",")
              .map((s: string) => Number(s.trim()))
              .filter(Boolean)
          : [],
        devUserId: form.devUserId
          ? form.devUserId
              .split(",")
              .map((s: string) => Number(s.trim()))
              .filter(Boolean)
          : [],
        clientUserId: form.clientUserId
          ? form.clientUserId
              .split(",")
              .map((s: string) => Number(s.trim()))
              .filter(Boolean)
          : [],
      };
      await api.put(`/api/projects/${projectId}`, payload);
      setEditModalOpen(false);
      fetchProjectDetail();
    } catch (e) {
      alert("프로젝트 수정에 실패했습니다." + e);
    }
  };

  if (loading) {
    return (
      <DetailPageContainer>
        <PageTitle>프로젝트 상세</PageTitle>
        <PageDescription>
          프로젝트의 상세 정보와 진행 상황을 확인하세요.
        </PageDescription>
        <LoadingContainer>프로젝트 상세 정보를 불러오는 중...</LoadingContainer>
      </DetailPageContainer>
    );
  }

  if (error || !projectDetail) {
    return (
      <DetailPageContainer>
        <PageTitle>프로젝트 상세</PageTitle>
        <PageDescription>
          프로젝트의 상세 정보와 진행 상황을 확인하세요.
        </PageDescription>
        <ErrorContainer>
          {error || "프로젝트 정보를 찾을 수 없습니다."}
        </ErrorContainer>
      </DetailPageContainer>
    );
  }

  return (
    <DetailPageContainer>
      <PageTitle>프로젝트 상세</PageTitle>
      <PageDescription>
        프로젝트의 상세 정보와 진행 상황을 확인하세요.
      </PageDescription>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          background: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <ProjectHeader
          projectDetail={projectDetail}
          onEdit={() => setEditModalOpen(true)}
        />
        {/* <ProjectMemberList projectDetail={projectDetail} /> */}
        <ProjectProgress
          projectDetail={projectDetail}
          onStepSelect={handleStepSelect}
          selectedStepId={selectedStepId}
          canEditStep={
            // projectDetail.myUserType === "MANAGER" &&
            projectDetail.myCompanyType === "DEVELOPER" || role === "ROLE_ADMIN"
          }
          onStepOrderSaved={fetchProjectDetail}
        />
        <ToggleTabGroup>
          <TabButton
            $active={viewType === "post"}
            onClick={() => setViewType("post")}
          >
            게시글
          </TabButton>
          <TabButton
            $active={viewType === "checklist"}
            onClick={() => setViewType("checklist")}
          >
            체크리스트
          </TabButton>
        </ToggleTabGroup>
        {viewType === "post" ? (
          <ProjectBoard
            projectId={projectDetail.id}
            selectedStepId={selectedStepId}
            openPostId={openPostId}
          />
        ) : (
          <KanbanBoard
            projectId={projectDetail.id}
            selectedStepId={selectedStepId ?? 0}
            canEditStep={
              projectDetail.myCompanyType === "DEVELOPER" ||
              role === "ROLE_ADMIN"
            }
            projectSteps={projectDetail.steps} // 단계 목록 전달
          />
        )}
        {/* <div style={{ display: "flex", gap: 24, padding: "0 24px 24px" }}>
          <div style={{ flex: 2 }}>
            <ProjectBoard
              projectId={projectDetail.id}
              selectedStepId={selectedStepId}
            />
            {/* <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <ProjectFileList />
                    </div> */}
        {/* </div> */}
      </div>
      <ProjectCreateModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        editMode={true}
        projectData={projectDetail}
        onSave={handleEditSave}
      />
    </DetailPageContainer>
  );
};

export default ProjectDetailPage;
