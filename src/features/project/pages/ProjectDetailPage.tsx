import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as S from "./ProjectDetailPage.styled";
import api from "@/api/axios";

interface UserCompanyResponse {
  id: number;
  name: string;
  companyName: string;
  position: string;
}

interface ProjectStepSimpleResponse {
  id: number;
  stepOrder: number;
  name: string;
  status: string;
  approver?: string;
}

interface ProjectDetail {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  clients: UserCompanyResponse[];
  developers: UserCompanyResponse[];
  steps: ProjectStepSimpleResponse[];
}

interface AddStepForm {
  name: string;
  approver: string;
}

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [tab, setTab] = useState(0);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState(false);
  const [addStepForm, setAddStepForm] = useState<AddStepForm>({
    name: "",
    approver: ""
  });

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/projects/${projectId}`);
        setProject(response.data.data);
      } catch (err) {
        console.error("Failed to fetch project detail:", err);
        setError("프로젝트 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectDetail();
    }
  }, [projectId]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!project) return <div>프로젝트를 찾을 수 없습니다.</div>;

  // 단계들을 stepOrder 순서대로 정렬하고 COMPLETED 상태만 필터링
  const sortedSteps = [...project.steps]
    .sort((a, b) => a.stepOrder - b.stepOrder)
    .filter(step => step.status === 'COMPLETED');

  const handleEditStep = (step: ProjectStepSimpleResponse) => {
    setAddStepForm({
      name: step.name,
      approver: step.approver || ""
    });
    setIsAddStepModalOpen(true);
  };

  const handleDeleteStep = async (stepId: number) => {
    if (!confirm("정말로 이 단계를 삭제하시겠습니까?")) return;
    
    try {
      await api.delete(`/api/projects/steps/${stepId}`);
      // 프로젝트 정보 다시 불러오기
      const response = await api.get(`/api/projects/${projectId}`);
      setProject(response.data.data);
    } catch (err) {
      console.error("Failed to delete step:", err);
      alert("단계 삭제에 실패했습니다.");
    }
  };

  const handleAddStep = async () => {
    if (!addStepForm.name.trim() || !addStepForm.approver.trim()) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      const newStepOrder = project?.steps.length ? Math.max(...project.steps.map(s => s.stepOrder)) + 1 : 1;
      await api.post(`/api/projects/${projectId}/steps`, {
        name: addStepForm.name,
        stepOrder: newStepOrder,
        status: "PENDING",
        approver: addStepForm.approver
      });
      
      // 프로젝트 정보 다시 불러오기
      const response = await api.get(`/api/projects/${projectId}`);
      setProject(response.data.data);
      setAddStepForm({ name: "", approver: "" });
      setIsAddStepModalOpen(false);
    } catch (err) {
      console.error("Failed to add step:", err);
      alert("단계 추가에 실패했습니다.");
    }
  };

  return (
    <S.PageContainer>
      <S.MainContentWrapper>
        <S.ProjectDetailSection>
          <S.ProjectTitle>{project.name}</S.ProjectTitle>
          <S.ProjectDescription>{project.description}</S.ProjectDescription>
          <S.ProjectPeriod>
            프로젝트 기간 : {project.startDate} ~ {project.endDate}
          </S.ProjectPeriod>
          <S.ProjectInfoGrid>
            <div>
              <S.ProjectInfoItem>
                <S.InfoLabel>고객사</S.InfoLabel>
                <S.InfoValue>{project.clients[0]?.companyName || "미지정"}</S.InfoValue>
              </S.ProjectInfoItem>
              <S.ProjectInfoItem>
                <S.InfoLabel>고객 담당자</S.InfoLabel>
                <S.InfoValue>{project.clients[0]?.name || "미지정"}</S.InfoValue>
              </S.ProjectInfoItem>
            </div>
            <div>
              <S.ProjectInfoItem>
                <S.InfoLabel>개발사</S.InfoLabel>
                <S.InfoValue>{project.developers[0]?.companyName || "미지정"}</S.InfoValue>
              </S.ProjectInfoItem>
              <S.ProjectInfoItem>
                <S.InfoLabel>개발 담당자</S.InfoLabel>
                <S.InfoValue>{project.developers[0]?.name || "미지정"}</S.InfoValue>
              </S.ProjectInfoItem>
            </div>
          </S.ProjectInfoGrid>
          <S.ProjectStepsContainer>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <S.InfoLabel>프로젝트 단계</S.InfoLabel>
              <S.ActionButton variant="add" onClick={() => setIsAddStepModalOpen(true)}>
                단계 추가
              </S.ActionButton>
            </div>
            <S.StepsList>
              {sortedSteps.map((step, index) => (
                <React.Fragment key={step.id}>
                  {index > 0 && <S.StepDivider> → </S.StepDivider>}
                  <S.StepItem status={step.status}>{step.name}</S.StepItem>
                </React.Fragment>
              ))}
            </S.StepsList>
          </S.ProjectStepsContainer>
        </S.ProjectDetailSection>

        <S.TabsContainer>
          <S.TabButton active={tab === 0} onClick={() => setTab(0)}>게시글관리</S.TabButton>
          <S.TabButton active={tab === 1} onClick={() => setTab(1)}>질문관리</S.TabButton>
          <S.TabButton active={tab === 2} onClick={() => setTab(2)}>이력관리</S.TabButton>
        </S.TabsContainer>
        <S.TabContent>
          {tab === 0 && <div>게시글관리 탭 내용</div>}
          {tab === 1 && <div>질문관리 탭 내용</div>}
          {tab === 2 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>프로젝트 단계</h3>
                <S.ActionButton variant="add" onClick={() => setIsAddStepModalOpen(true)}>
                  단계 추가
                </S.ActionButton>
              </div>
              <S.HistoryStepList>
                {project?.steps.sort((a, b) => a.stepOrder - b.stepOrder).map(step => (
                  <S.HistoryStepItem key={step.id}>
                    <S.HistoryStepHeader>
                      <S.HistoryStepName>{step.name}</S.HistoryStepName>
                    </S.HistoryStepHeader>
                    <S.HistoryStepApprover>승인자: {step.approver || "미지정"}</S.HistoryStepApprover>
                    <S.HistoryStepActions>
                      <S.ActionButton variant="edit" onClick={() => handleEditStep(step)}>수정</S.ActionButton>
                      <S.ActionButton variant="delete" onClick={() => handleDeleteStep(step.id)}>삭제</S.ActionButton>
                    </S.HistoryStepActions>
                  </S.HistoryStepItem>
                ))}
              </S.HistoryStepList>
            </div>
          )}
        </S.TabContent>

        {isAddStepModalOpen && (
          <S.ModalOverlay onClick={() => setIsAddStepModalOpen(false)}>
            <S.ModalContent onClick={e => e.stopPropagation()}>
              <S.ModalHeader>
                <S.ModalTitle>새 단계 추가</S.ModalTitle>
                <S.CloseButton onClick={() => setIsAddStepModalOpen(false)}>&times;</S.CloseButton>
              </S.ModalHeader>
              
              <S.AddStepModalContent>
                <S.FormGroup>
                  <S.FormLabel>단계 이름</S.FormLabel>
                  <S.FormInput
                    type="text"
                    value={addStepForm.name}
                    onChange={e => setAddStepForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="단계 이름을 입력하세요"
                  />
                </S.FormGroup>
                
                <S.FormGroup>
                  <S.FormLabel>승인자</S.FormLabel>
                  <S.FormInput
                    type="text"
                    value={addStepForm.approver}
                    onChange={e => setAddStepForm(prev => ({ ...prev, approver: e.target.value }))}
                    placeholder="승인자 이름을 입력하세요"
                  />
                </S.FormGroup>

                <S.ActionButton variant="add" onClick={handleAddStep}>
                  단계 추가
                </S.ActionButton>
              </S.AddStepModalContent>
            </S.ModalContent>
          </S.ModalOverlay>
        )}
      </S.MainContentWrapper>
    </S.PageContainer>
  );
} 