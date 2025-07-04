import * as S from "../styled/UserDashboardPage.styled";
import { MdOutlineViewHeadline } from "react-icons/md";
import {
  FiLayers,
  FiCalendar,
  FiHome,
  FiGrid,
  FiPackage,
} from "react-icons/fi";
import React, { useState, useEffect } from "react";
import type { ProjectStatusResponse } from "@/features/project/services/projectService";

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
  projectTabs: ProjectStatusResponse[];
  selectedStatusTab: "IN_PROGRESS" | "COMPLETED";
  setSelectedStatusTab: (tab: "IN_PROGRESS" | "COMPLETED") => void;
  getProgressPercent: (steps: ProjectStep[]) => number;
  navigate: (path: string) => void;
}

const STATUS_TABS = [
  { key: "IN_PROGRESS", label: "진행중" },
  { key: "COMPLETED", label: "완료" },
];

const ProjectStatusSection: React.FC<ProjectStatusSectionProps> = ({
  projectTabs,
  selectedStatusTab,
  setSelectedStatusTab,
  getProgressPercent,
  navigate,
}) => {
  // 필터링 로직
  const filteredProjects = projectTabs.filter((project) => {
    if (selectedStatusTab === "IN_PROGRESS") return project.status === "IN_PROGRESS";
    if (selectedStatusTab === "COMPLETED") return project.status === "COMPLETED";
    return false;
  });

  // 진행중 탭에서만 animatedPercents 배열 사용
  // const [animatedPercents, setAnimatedPercents] = useState<number[]>([]);
  // useEffect(() => {
  //   if (selectedStatusTab === "IN_PROGRESS") {
  //     const percents = filteredProjects.slice(0, 4).map(() => 0);
  //     setAnimatedPercents(percents);
  //     const timeouts = filteredProjects.slice(0, 4).map((project, idx) =>
  //       setTimeout(() => {
  //         setAnimatedPercents((prev) => {
  //           const copy = [...prev];
  //           copy[idx] = getProgressPercent(project.steps);
  //           return copy;
  //         });
  //       }, 100)
  //     );
  //     return () => timeouts.forEach((t) => clearTimeout(t));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedStatusTab, filteredProjects.length]);

  return (
    <S.Section>
      <S.ProgressSectionTitleRow>
        <S.SectionTitle color="#111827">
          <FiPackage
            size={20}
            style={{
              marginRight: "8px",
              color: "#3b82f6",
              verticalAlign: "middle",
            }}
          />
          내 프로젝트
        </S.SectionTitle>
        <S.ViewAllButton onClick={() => navigate("/projects")}>
          <S.ViewAllButtonIcon>
            <FiGrid />
          </S.ViewAllButtonIcon>
          전체 보기
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
            $selected={selectedStatusTab === tab.key}
            onClick={() => setSelectedStatusTab(tab.key as any)}
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
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          {filteredProjects.map((project, idx) => {
            const percent = project.progress;
            return (
              <S.ProjectCard
                key={`project-${project.id}-${idx}`}
                onClick={() => navigate(`/projects/${project.id}/detail`)}
                style={{ cursor: "pointer" }}
              >
                <S.ProjectHeaderRow>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "4px",
                    }}
                  >
                    <FiPackage size={13} style={{ color: "#8b5cf6" }} />
                    <S.ProjectTitle style={{ fontSize: "0.9rem" }}>
                      {project.name}
                    </S.ProjectTitle>
                  </div>
                  {selectedStatusTab !== "IN_PROGRESS" && (
                    <S.StatusBadge $status={project.status}>
                      {project.status === "COMPLETED" && "완료"}
                      {project.status === "IN_PROGRESS" && "진행중"}
                      {project.status === "DELAY" && "지연"}
                      {project.status === "DUE_SOON" && "기한임박"}
                      {project.status !== "COMPLETED" &&
                        project.status !== "IN_PROGRESS" &&
                        project.status !== "DELAY" &&
                        project.status !== "DUE_SOON" &&
                        project.status}
                    </S.StatusBadge>
                  )}
                </S.ProjectHeaderRow>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "4px",
                    fontSize: "0.8rem",
                    color: "#6b7280",
                  }}
                >
                  <FiCalendar size={12} />
                  <span>
                    {project.startDate.replace(/-/g, ".")} ~{" "}
                    {project.endDate.replace(/-/g, ".")}
                  </span>
                </div>
                {selectedStatusTab === "IN_PROGRESS" ? (
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
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FiLayers size={12} style={{ color: "#6366f1" }} />
                          <S.ProjectProgressStep style={{ fontSize: "0.8rem" }}>
                            {/* {project.steps.find(
                              (s) => s.projectStepStatus === "IN_PROGRESS"
                            )?.name || "진행중"} */}
                          </S.ProjectProgressStep>
                        </div>
                        <S.ProjectProgressPercent $percent={percent}>
                          {percent}%
                        </S.ProjectProgressPercent>
                      </div>
                      <S.ProgressBarWrap style={{ marginTop: 0 }}>
                        <S.ProgressBar $percent={percent} />
                      </S.ProgressBarWrap>
                    </div>
                  </S.ProjectProgressInfo>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.8rem",
                      color: "#6b7280",
                    }}
                  >
                    <FiHome size={12} />
                    {/* <span>
                      고객사: {project.clientCompany} / 개발사:{" "}
                      {project.developerCompany}
                    </span> */}
                  </div>
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
