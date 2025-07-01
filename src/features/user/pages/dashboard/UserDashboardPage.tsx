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
  const [inProgressProjects, setInProgressProjects] = useState<DashboardProject[]>([]);
  const [completedProjects, setCompletedProjects] = useState<DashboardProject[]>([]);
  const [delayedProjects, setDelayedProjects] = useState<DashboardProject[]>([]);
  const [deadlineProjects, setDeadlineProjects] = useState<DashboardProject[]>([]);
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
        const mapToProject = (item: any, status: string): DashboardProject => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          startDate: item.startDate,
          endDate: item.endDate,
          status: status,
          steps: item.steps || [],
          clientCompany: item.clientCompany || '',
          developerCompany: item.developerCompany || '',
          users: item.users || [],
        });
        setInProgressProjects((inProgressRes.data || []).map((item: any) => mapToProject(item, "IN_PROGRESS")));
        setCompletedProjects((completedRes.data || []).map((item: any) => mapToProject(item, "COMPLETED")));
        setDelayedProjects((delayedRes.data || []).map((item: any) => mapToProject(item, "DELAY")));
        setDeadlineProjects((dueSoonRes.data || []).map((item: any) => mapToProject(item, "DUE_SOON")));
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "프로젝트 현황을 불러오지 못했습니다.");
        setInProgressProjects([]);
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
