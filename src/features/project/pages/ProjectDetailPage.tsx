import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
// import ProjectMemberList from "../components/MemberList/ProjectMemberList";
// import ProjectFileList from '../components/FileList/ProjectFileList';

const DetailPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100vh;
  padding: 32px 32px;
`;

const PageTitle = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: -7px;
  padding-left: 16px;
  position: relative;
  color: #111827;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 1.4rem;
    background: #fdb924;
    border-radius: 2px;
  }
`;

const PageDescription = styled.p`
  color: #bdbdbd;
  font-size: 0.9rem;
  margin-bottom: 18px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 1.1rem;
  color: #666;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 1.1rem;
  color: #ef4444;
`;

const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [projectDetail, setProjectDetail] =
    useState<ProjectDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<number | undefined>(
    undefined
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { role } = useAuth();
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
  const handleEditSave = async (form: any) => {
    if (!projectId) return;
    try {
      // 필드 변환 및 PUT 요청
      const payload = {
        name: form.name,
        description: form.description,
        projectCost: form.projectCost ? Number(form.projectCost) : 0,
        startDate: form.startDate,
        endDate: form.endDate,
        devManagerId: form.devManagerId
          ? form.devManagerId
              .split(",")
              .map((s: any) => Number(s.trim()))
              .filter(Boolean)
          : [],
        clientManagerId: form.clientManagerId
          ? form.clientManagerId
              .split(",")
              .map((s: any) => Number(s.trim()))
              .filter(Boolean)
          : [],
        devUserId: form.devUserId
          ? form.devUserId
              .split(",")
              .map((s: any) => Number(s.trim()))
              .filter(Boolean)
          : [],
        clientUserId: form.clientUserId
          ? form.clientUserId
              .split(",")
              .map((s: any) => Number(s.trim()))
              .filter(Boolean)
          : [],
      };
      await api.put(`/api/projects/${projectId}`, payload);
      setEditModalOpen(false);
      fetchProjectDetail();
    } catch (e) {
      alert("프로젝트 수정에 실패했습니다.");
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
            projectDetail.myCompanyType === "DEVELOPER" ||
            role === "ROLE_ADMIN"
          }
          onStepOrderSaved={fetchProjectDetail}
        />
        <div style={{ display: "flex", gap: 24, padding: "0 24px 24px" }}>
          <div style={{ flex: 2 }}>
            <ProjectBoard
              projectId={projectDetail.id}
              selectedStepId={selectedStepId}
            />
            {/* <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <ProjectFileList />
                    </div> */}
          </div>
        </div>
      </div>
      <ProjectCreateModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        editMode={true}
        projectData={projectDetail as any}
        onSave={handleEditSave as any}
      />
    </DetailPageContainer>
  );
};

export default ProjectDetailPage;
