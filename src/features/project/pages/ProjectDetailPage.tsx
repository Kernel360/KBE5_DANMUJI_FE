import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as S from "./ProjectDetailPage.styled";
import api from "@/api/axios";
import { getPosts } from "@/features/project/services/postService";

interface UserCompanyResponse {
  id: number;
  companyId: number;
  name: string;
  companyName: string;
  position: string;
}

interface User {
  id: number;
  name: string;
}

interface ProjectStepSimpleResponse {
  id: number;
  stepOrder: number;
  name: string;
  projectStepStatus: string;
  projectFeedbackStepStatus: string;
  user: User | null;
  isDeleted: boolean;
}

interface ProjectDetail {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  projectStatus: string;
  clients: UserCompanyResponse[];
  developers: UserCompanyResponse[];
  steps: ProjectStepSimpleResponse[];
}

interface AddStepForm {
  name: string;
  userId: number;
  projectFeedbackStepStatus: string | null;
}

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [tab, setTab] = useState(0);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState(false);
  const [clientUsers, setClientUsers] = useState<User[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingStepId, setEditingStepId] = useState<number | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const [addStepForm, setAddStepForm] = useState<AddStepForm>({
    name: "",
    userId: 0,
    projectFeedbackStepStatus: null,
  });
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [posts, setPosts] = useState<any[]>([]); // 실제 Post 타입으로 교체 가능
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const response = await api.get("/api/users/me");
        setLoggedInUserId(response.data.data.id);
      } catch (err) {
        console.error("Failed to fetch logged in user:", err);
      }
    };
    fetchLoggedInUser();
  }, []);

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

  useEffect(() => {
    const fetchClientUsers = async () => {
      if (project?.clients[0]?.id) {
        try {
          const response = await api.get(
            `/api/companies/${project.clients[0].companyId}/users`
          );
          setClientUsers(response.data.data);
        } catch (err) {
          console.error("Failed to fetch client users:", err);
        }
      }
    };
    fetchClientUsers();
  }, [project?.clients]);

  useEffect(() => {
    if (project) {
      console.log("Project data:", project);
      console.log(
        "Step projectStepStatus:",
        project.steps.map((step) => step.projectStepStatus)
      );
    }
  }, [project]);

  // 단계들을 stepOrder 순서대로 정렬
  const sortedSteps = [...(project?.steps ?? [])]
    .sort((a, b) => a.stepOrder - b.stepOrder)
    .filter((step: ProjectStepSimpleResponse) => step.isDeleted === false);

  // 첫 마운트 시 첫 번째 step 자동 선택
  useEffect(() => {
    if (sortedSteps.length > 0 && selectedStepId === null) {
      setSelectedStepId(sortedSteps[0].id);
    }
  }, [sortedSteps, selectedStepId]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!project) return <div>프로젝트를 찾을 수 없습니다.</div>;

  const handleEditStep = (step: ProjectStepSimpleResponse) => {
    setAddStepForm({
      name: step.name,
      userId: step.user ? step.user.id : 0,
      projectFeedbackStepStatus: step.projectFeedbackStepStatus,
    });
    setIsEditMode(true);
    setIsAddStepModalOpen(true);
    setEditingStepId(step.id);
  };

  const handleDeleteStep = async (stepId: number) => {
    if (!confirm("정말로 이 단계를 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/api/step/${stepId}`);
      // 프로젝트 정보 다시 불러오기
      const response = await api.get(`/api/projects/${projectId}`);
      setProject(response.data.data);
    } catch (err) {
      console.error("Failed to delete step:", err);
      alert("단계 삭제에 실패했습니다.");
    }
  };

  const handleAddStepClick = () => {
    setAddStepForm({
      name: "",
      userId: 0,
      projectFeedbackStepStatus: null,
    });
    setIsEditMode(false);
    setIsAddStepModalOpen(true);
  };

  const handleAddStep = async () => {
    if (!addStepForm.name.trim() || !addStepForm.userId) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      if (isEditMode) {
        // 수정 모드
        const editData = {
          name: addStepForm.name,
          userId: addStepForm.userId,
          projectFeedbackStepStatus: addStepForm.projectFeedbackStepStatus,
        };
        console.log("수정 요청 데이터:", editData);
        await api.put(`/api/step/${editingStepId}`, editData);
      } else {
        // 추가 모드
        const newStepOrder = project?.steps.length
          ? Math.max(...project.steps.map((s) => s.stepOrder)) + 1
          : 1;
        const addData = {
          name: addStepForm.name,
          stepOrder: newStepOrder,
          userId: addStepForm.userId,
        };
        console.log("추가 요청 데이터:", addData);
        await api.post(`/api/step?projectId=${projectId}`, addData);
      }

      // 프로젝트 정보 다시 불러오기
      const response = await api.get(`/api/projects/${projectId}`);
      setProject(response.data.data);
      setAddStepForm({ name: "", userId: 0, projectFeedbackStepStatus: null });
      setIsAddStepModalOpen(false);
      setIsEditMode(false);
    } catch (err) {
      console.error("Failed to add/edit step:", err);
      alert(
        isEditMode ? "단계 수정에 실패했습니다." : "단계 추가에 실패했습니다."
      );
    }
  };

  const handleApprovalStatus = async (
    stepId: number,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      await api.put(
        `/api/step/${stepId}/approval?projectFeedbackStepStatus=${status}`
      );
      const response = await api.get(`/api/projects/${projectId}`);
      setProject(response.data.data);
    } catch (err) {
      console.error(
        `Failed to ${status === "APPROVED" ? "approve" : "reject"} step:`,
        err
      );
      alert(`단계 ${status === "APPROVED" ? "승인" : "거절"}에 실패했습니다.`);
    }
  };

  const handleProjectStatusChange = async () => {
    try {
      await api.put(`/api/projects/${projectId}/status`);
      const response = await api.get(`/api/projects/${projectId}`);
      setProject(response.data.data);
    } catch (err) {
      console.error("Failed to change project status:", err);
      alert("프로젝트 상태 변경에 실패했습니다.");
    }
  };

  return (
    <S.PageContainer>
      <S.MainContentWrapper>
        <S.ProjectDetailSection>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <S.ProjectTitle>{project.name}</S.ProjectTitle>
              <S.StatusBadge color={project.projectStatus === 'COMPLETED' ? 'red' : 'green'}>
                {project.projectStatus}
              </S.StatusBadge>
            </div>
            <S.ActionButton variant="edit" onClick={handleProjectStatusChange}>
              프로젝트 상태 변경
            </S.ActionButton>
          </div>
          <S.ProjectDescription>{project.description}</S.ProjectDescription>
          <S.ProjectPeriod>
            프로젝트 기간 : {project.startDate} ~ {project.endDate}
          </S.ProjectPeriod>
          <S.ProjectInfoGrid>
            <div>
              <S.ProjectInfoItem>
                <S.InfoLabel>고객사</S.InfoLabel>
                <S.InfoValue>
                  {project.clients[0]?.companyName || "미지정"}
                </S.InfoValue>
              </S.ProjectInfoItem>
              <S.ProjectInfoItem>
                <S.InfoLabel>고객 담당자</S.InfoLabel>
                <S.InfoValue>
                  {project.clients[0]?.name || "미지정"}
                </S.InfoValue>
              </S.ProjectInfoItem>
            </div>
            <div>
              <S.ProjectInfoItem>
                <S.InfoLabel>개발사</S.InfoLabel>
                <S.InfoValue>
                  {project.developers[0]?.companyName || "미지정"}
                </S.InfoValue>
              </S.ProjectInfoItem>
              <S.ProjectInfoItem>
                <S.InfoLabel>개발 담당자</S.InfoLabel>
                <S.InfoValue>
                  {project.developers[0]?.name || "미지정"}
                </S.InfoValue>
              </S.ProjectInfoItem>
            </div>
          </S.ProjectInfoGrid>
          <S.ProjectStepsContainer>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <S.InfoLabel>프로젝트 단계</S.InfoLabel>
            </div>
            <S.StepsList>
              {sortedSteps.map((step, index) => {
                const isDone = step.projectStepStatus === "DONE";
                const isActive =
                  selectedStepId === step.id ||
                  step.projectStepStatus === "IN_PROGRESS";
                const isWaiting = !isDone && !isActive;
                return (
                  <button
                    key={step.id}
                    type="button"
                    aria-label={
                      step.name +
                      (isDone ? " 완료" : isActive ? " 진행중" : " 대기")
                    }
                    onClick={() => {
                      navigate(
                        `/posts/${step.id}?stepName=${encodeURIComponent(
                          step.name
                        )}`
                      );
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1,
                      minWidth: 70,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      outline: "none",
                      padding: 0,
                      margin: 0,
                    }}
                    onMouseOver={(e) => {
                      if (!isDone && !isActive) {
                        e.currentTarget.children[0].style.background =
                          "#f9fafb";
                        e.currentTarget.children[0].style.border =
                          "1.5px solid #fdb924";
                        e.currentTarget.children[1].style.color = "#fdb924";
                        e.currentTarget.children[2].style.color = "#fdb924";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isDone && !isActive) {
                        e.currentTarget.children[0].style.background =
                          "#f5f5f5";
                        e.currentTarget.children[0].style.border =
                          "1.5px solid #e5e7eb";
                        e.currentTarget.children[1].style.color = "#888";
                        e.currentTarget.children[2].style.color = "#888";
                      }
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 16,
                        background: isDone
                          ? "#e6fbe6"
                          : isActive
                          ? "#fffbe8"
                          : "#f5f5f5",
                        border: isActive
                          ? "2.5px solid #fdb924"
                          : "1.5px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 4,
                        boxShadow: isActive
                          ? "0 2px 8px 0 rgba(253,185,36,0.10)"
                          : "none",
                        transition: "all 0.2s",
                      }}
                    >
                      {isDone ? (
                        <span
                          style={{
                            color: "#22c55e",
                            fontSize: 26,
                            fontWeight: 700,
                          }}
                        >
                          ✔
                        </span>
                      ) : isActive ? (
                        <span
                          style={{
                            color: "#fdb924",
                            fontSize: 26,
                            fontWeight: 700,
                          }}
                        >
                          ⏱
                        </span>
                      ) : (
                        <span
                          style={{
                            color: "#888",
                            fontSize: 22,
                            fontWeight: 700,
                          }}
                        >
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 15,
                        color: isDone
                          ? "#22c55e"
                          : isActive
                          ? "#fdb924"
                          : "#888",
                        marginBottom: 2,
                        transition: "color 0.2s",
                      }}
                    >
                      {step.name}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: isDone
                          ? "#22c55e"
                          : isActive
                          ? "#fdb924"
                          : "#888",
                        fontWeight: 500,
                        transition: "color 0.2s",
                      }}
                    >
                      {isDone ? "완료" : isActive ? "진행중" : "대기"}
                    </div>
                  </button>
                );
              })}
            </S.StepsList>
          </S.ProjectStepsContainer>
        </S.ProjectDetailSection>

        <S.TabsContainer>
          <S.TabButton active={tab === 0} onClick={() => setTab(0)}>
            게시글관리
          </S.TabButton>
          <S.TabButton active={tab === 1} onClick={() => setTab(1)}>
            질문관리
          </S.TabButton>
          <S.TabButton active={tab === 2} onClick={() => setTab(2)}>
            이력관리
          </S.TabButton>
        </S.TabsContainer>
        <S.TabContent>
          {tab === 0 && (
            <div>
              {/* 게시글 목록 렌더링 */}
              {postsLoading ? (
                <div>게시글 불러오는 중...</div>
              ) : postsError ? (
                <div style={{ color: "red" }}>{postsError}</div>
              ) : posts.length === 0 ? (
                <div>해당 단계에 게시글이 없습니다.</div>
              ) : (
                <ul>
                  {posts.map((post) => (
                    <li key={post.postId}>{post.title}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {tab === 1 && <div>질문관리 탭 내용</div>}
          {tab === 2 && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h3 style={{ margin: 0 }}>프로젝트 단계</h3>
                <S.ActionButton variant="add" onClick={handleAddStepClick}>
                  단계 추가
                </S.ActionButton>
              </div>
              <S.HistoryStepList>
                {project?.steps
                  .filter((step) => !step.isDeleted)
                  .sort((a, b) => a.stepOrder - b.stepOrder)
                  .map((step) => (
                    <S.HistoryStepItem key={step.id}>
                      <S.HistoryStepHeader>
                        <S.HistoryStepName>{step.name}</S.HistoryStepName>
                      </S.HistoryStepHeader>
                      <S.HistoryStepApprover>
                        승인자: {step.user ? step.user.name : "-"}
                      </S.HistoryStepApprover>
                      <S.HistoryStepApprover>
                        승인상태:{" "}
                        {step.projectFeedbackStepStatus
                          ? step.projectFeedbackStepStatus
                          : "-"}
                      </S.HistoryStepApprover>
                      <S.HistoryStepActions>
                        {loggedInUserId === step.user?.id &&
                          step.projectFeedbackStepStatus === "REQUESTED" && (
                            <>
                              <S.ActionButton
                                variant="approve"
                                onClick={() =>
                                  handleApprovalStatus(step.id, "APPROVED")
                                }
                              >
                                승인
                              </S.ActionButton>
                              <S.ActionButton
                                variant="reject"
                                onClick={() =>
                                  handleApprovalStatus(step.id, "REJECTED")
                                }
                              >
                                거절
                              </S.ActionButton>
                            </>
                          )}
                        <S.ActionButton
                          variant="edit"
                          onClick={() => handleEditStep(step)}
                        >
                          수정
                        </S.ActionButton>
                        <S.ActionButton
                          variant="delete"
                          onClick={() => handleDeleteStep(step.id)}
                        >
                          삭제
                        </S.ActionButton>
                      </S.HistoryStepActions>
                    </S.HistoryStepItem>
                  ))}
              </S.HistoryStepList>
            </div>
          )}
        </S.TabContent>

        {isAddStepModalOpen && (
          <S.ModalOverlay onClick={() => setIsAddStepModalOpen(false)}>
            <S.ModalContent onClick={(e) => e.stopPropagation()}>
              <S.ModalHeader>
                <S.ModalTitle>
                  {isEditMode ? "단계 수정" : "새 단계 추가"}
                </S.ModalTitle>
                <S.CloseButton onClick={() => setIsAddStepModalOpen(false)}>
                  &times;
                </S.CloseButton>
              </S.ModalHeader>

              <S.AddStepModalContent>
                <S.FormGroup>
                  <S.FormLabel>단계 이름</S.FormLabel>
                  <S.FormInput
                    type="text"
                    value={addStepForm.name}
                    onChange={(e) =>
                      setAddStepForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="단계 이름을 입력하세요"
                  />
                </S.FormGroup>

                <S.FormGroup>
                  <S.FormLabel>승인자</S.FormLabel>
                  {isEditMode && addStepForm.userId > 0 && (
                    <S.CurrentApprover>
                      현재 승인자:{" "}
                      {clientUsers.find(
                        (user) => user.id === addStepForm.userId
                      )?.name || "-"}
                    </S.CurrentApprover>
                  )}
                  <S.FormSelect
                    value={addStepForm.userId}
                    onChange={(e) =>
                      setAddStepForm((prev) => ({
                        ...prev,
                        userId: parseInt(e.target.value),
                      }))
                    }
                  >
                    <option value={0}>승인자를 선택하세요</option>
                    {Array.isArray(clientUsers) &&
                      clientUsers.map((clientUser) => (
                        <option key={clientUser.id} value={clientUser.id}>
                          {clientUser.name}
                        </option>
                      ))}
                  </S.FormSelect>
                </S.FormGroup>

                <S.ActionButton variant="add" onClick={handleAddStep}>
                  {isEditMode ? "수정하기" : "단계 추가"}
                </S.ActionButton>
              </S.AddStepModalContent>
            </S.ModalContent>
          </S.ModalOverlay>
        )}
      </S.MainContentWrapper>
    </S.PageContainer>
  );
}
