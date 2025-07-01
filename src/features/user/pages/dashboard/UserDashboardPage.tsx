import { useNavigate } from "react-router-dom";
import * as S from "./styled/UserDashboardPage.styled";
import { useState, useEffect } from "react";
import ProjectStatusSection from "./components/ProjectStatusSection";
import MentionedPostsSection from "./components/MentionedPostsSection";
import WarningProjectsSection from "./components/WarningProjectsSection";
import PriorityPostsSection from "./components/PriorityPostsSection";
import LatestPostsSection from "./components/LatestPostsSection";
import { getProjectStatusByStatus, type ProjectStatusResponse } from "@/features/project/services/projectService";
import type { Project as DashboardProject } from "./components/ProjectStatusSection";

function getProgressPercent(steps: { projectStepStatus: string }[]) {
  if (!steps || !Array.isArray(steps) || steps.length === 0) return 0;
  const completed = steps.filter(
    (s) => s?.projectStepStatus === "COMPLETED"
  ).length;
  return Math.round((completed / steps.length) * 100);
}

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const [selectedStatusTab, setSelectedStatusTab] = useState<"IN_PROGRESS" | "COMPLETED">("IN_PROGRESS");
  const [selectedWarningTab, setSelectedWarningTab] = useState<"DELAY" | "DUE_SOON">("DELAY");
  const [inProgressProjects, setInProgressProjects] = useState<ProjectStatusResponse[]>([]);
  const [completedProjects, setCompletedProjects] = useState<ProjectStatusResponse[]>([]);
  const [delayedProjects, setDelayedProjects] = useState<ProjectStatusResponse[]>([]);
  const [deadlineProjects, setDeadlineProjects] = useState<ProjectStatusResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getProjectStatusByStatus("IN_PROGRESS"),
      getProjectStatusByStatus("COMPLETED"),
      getProjectStatusByStatus("DELAY"),
      getProjectStatusByStatus("DUE_SOON"),
    ])
      .then(([inProgressRes, completedRes, delayedRes, dueSoonRes]) => {
        setInProgressProjects((inProgressRes.data || []).map(item => ({ ...item, status: "IN_PROGRESS" })));
        setCompletedProjects((completedRes.data || []).map(item => ({ ...item, status: "COMPLETED" })));
        setDelayedProjects((delayedRes.data || []).map(item => ({ ...item, status: "DELAY" })));
        setDeadlineProjects((dueSoonRes.data || []).map(item => ({ ...item, status: "DUE_SOON" })));
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "프로젝트 현황을 불러오지 못했습니다.");
        setInProgressProjects([]);
        setCompletedProjects([]);
        setDelayedProjects([]);
        setDeadlineProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <S.Container>
      <S.MainContent>
        <S.DashboardHeader>
          <S.DashboardTitle>대시보드</S.DashboardTitle>
          <S.DashboardDescription>
            오늘의 프로젝트 현황과 주요 알림을 한눈에 확인하세요
          </S.DashboardDescription>
        </S.DashboardHeader>

        <S.LayoutGrid>
          <S.LeftColumn>
            <ProjectStatusSection
              projectTabs={selectedStatusTab === "IN_PROGRESS" ? inProgressProjects : completedProjects}
              selectedStatusTab={selectedStatusTab}
              setSelectedStatusTab={setSelectedStatusTab}
              getProgressPercent={getProgressPercent}
              navigate={navigate}
            />
            <LatestPostsSection />
            <PriorityPostsSection />
          </S.LeftColumn>

          <S.RightColumn>
            <WarningProjectsSection
              delayedProjects={delayedProjects}
              deadlineProjects={deadlineProjects}
              selectedWarningTab={selectedWarningTab}
              setSelectedWarningTab={setSelectedWarningTab}
            />
            <MentionedPostsSection />
          </S.RightColumn>
        </S.LayoutGrid>
      </S.MainContent>
    </S.Container>
  );
};

export default UserDashboardPage;
