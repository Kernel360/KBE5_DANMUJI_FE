import * as S from "../styled/UserDashboardPage.styled";
import { MdOutlineViewHeadline } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { FaProjectDiagram } from "react-icons/fa";
import React, { useState, useEffect } from "react";

// 타입 정의 추가
export type ProjectStep = {
  id: number;
  stepOrder: number;
  name: string;
  projectStepStatus: string;
};

export type Project = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  steps: ProjectStep[];
  clientCompany: string;
  developerCompany: string;
  users: any[];
};

export interface ProjectStatusSectionProps {
  projectTabs: Project[];
  getProgressPercent: (steps: ProjectStep[]) => number;
  navigate: (path: string) => void;
}

const STATUS_TABS = [
  { key: "IN_PROGRESS", label: "진행중" },
  { key: "COMPLETED", label: "완료" },
];

const ProjectStatusSection: React.FC<ProjectStatusSectionProps> = ({
  projectTabs,
  getProgressPercent,
  navigate,
}) => {
  const [statusTab, setStatusTab] = useState<"IN_PROGRESS" | "COMPLETED">(
    "IN_PROGRESS"
  );

  // 필터링 로직
  const filteredProjects = projectTabs.filter((project) => {
    if (statusTab === "IN_PROGRESS") return project.status === "IN_PROGRESS";
    if (statusTab === "COMPLETED") return project.status === "COMPLETED";
    return false;
  });

  // 진행중 탭에서만 animatedPercents 배열 사용
  const [animatedPercents, setAnimatedPercents] = useState<number[]>([]);
  useEffect(() => {
    if (statusTab === "IN_PROGRESS") {
      const percents = filteredProjects.slice(0, 4).map((project) => 0);
      setAnimatedPercents(percents);
      const timeouts = filteredProjects.slice(0, 4).map((project, idx) =>
        setTimeout(() => {
          setAnimatedPercents((prev) => {
            const copy = [...prev];
            copy[idx] = getProgressPercent(project.steps);
            return copy;
          });
        }, 100)
      );
      return () => timeouts.forEach((t) => clearTimeout(t));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusTab, filteredProjects.length]);

  return (
    <S.Section>
      <S.ProgressSectionTitleRow>
        <S.SectionTitle color="#1abc7b">
          <FaProjectDiagram
            size={20}
            style={{
              marginRight: "8px",
              color: "#1abc7b",
              verticalAlign: "middle",
            }}
          />
          내 프로젝트
        </S.SectionTitle>
        <S.ViewAllButton onClick={() => navigate("/projects")}>
          전체 보기
          <S.ViewAllButtonIcon>
            <MdOutlineViewHeadline />
          </S.ViewAllButtonIcon>
        </S.ViewAllButton>
      </S.ProgressSectionTitleRow>
      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: 12,
          borderBottom: "1px solid #eee",
          flex: 1,
        }}
      >
        {STATUS_TABS.map((tab) => (
          <S.ProjectStatusTabButton
            key={tab.key}
            selected={statusTab === tab.key}
            onClick={() => setStatusTab(tab.key as any)}
          >
            {tab.label}
          </S.ProjectStatusTabButton>
        ))}
      </div>
      {filteredProjects.length === 0 ? (
        <S.ProgressListEmpty>
          해당 상태의 프로젝트가 없습니다.
        </S.ProgressListEmpty>
      ) : (
        <S.ProgressList
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          {filteredProjects.slice(0, 4).map((project, idx) => {
            const percent = getProgressPercent(project.steps);
            return (
              <S.ProjectCard
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}/detail`)}
                style={{ cursor: "pointer" }}
              >
                <S.ProjectHeaderRow>
                  <S.ProjectTitle>{project.name}</S.ProjectTitle>
                  {statusTab !== "IN_PROGRESS" && (
                    <S.StatusBadge status={project.status}>
                      {project.status === "COMPLETED" && "완료"}
                      {project.status === "IN_PROGRESS" && "진행중"}
                      {project.status !== "COMPLETED" &&
                        project.status !== "IN_PROGRESS" &&
                        project.status}
                    </S.StatusBadge>
                  )}
                </S.ProjectHeaderRow>
                <S.ProjectDate>
                  {project.startDate} ~ {project.endDate}
                </S.ProjectDate>
                {statusTab === "IN_PROGRESS" ? (
                  <S.ProjectProgressInfo>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 3,
                        }}
                      >
                        <S.ProjectProgressStep>
                          {project.steps.find(
                            (s) => s.projectStepStatus === "IN_PROGRESS"
                          )?.name || "진행중"}
                        </S.ProjectProgressStep>
                        <S.ProjectProgressPercent percent={percent}>
                          {percent}%
                        </S.ProjectProgressPercent>
                      </div>
                      <S.ProgressBarWrap style={{ marginTop: 0 }}>
                        <S.ProgressBar percent={animatedPercents[idx] ?? 0} />
                      </S.ProgressBarWrap>
                    </div>
                  </S.ProjectProgressInfo>
                ) : (
                  <S.ProjectMeta>
                    고객사: {project.clientCompany} / 개발사:{" "}
                    {project.developerCompany}
                  </S.ProjectMeta>
                )}
              </S.ProjectCard>
            );
          })}
        </S.ProgressList>
      )}
    </S.Section>
  );
};

export default ProjectStatusSection;
