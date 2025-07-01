import * as S from "../styled/UserDashboardPage.styled";
import { FaProjectDiagram } from "react-icons/fa";
import { FiLayers, FiCalendar } from "react-icons/fi";
import React from "react";

interface Project {
  id: string | number;
  name: string;
  status: string;
  endDate: string;
  steps: { projectStepStatus: string; name: string }[];
}

interface WarningProjectsSectionProps {
  projectTabs: Project[];
  selectedWarningTab: "DELAYED" | "DEADLINE";
  setSelectedWarningTab: (tab: "DELAYED" | "DEADLINE") => void;
}

const getProgressPercent = (steps: { projectStepStatus: string }[]) => {
  if (!steps || steps.length === 0) return 0;
  const completed = steps.filter(
    (s) => s.projectStepStatus === "COMPLETED"
  ).length;
  return Math.round((completed / steps.length) * 100);
};

const WarningProjectsSection: React.FC<WarningProjectsSectionProps> = ({
  projectTabs,
  selectedWarningTab,
  setSelectedWarningTab,
}) => (
  <S.Section>
    <S.SectionTitle color="#111827">
      <FaProjectDiagram
        size={20}
        style={{
          marginRight: "8px",
          color: "#dc2626",
          verticalAlign: "middle",
        }}
      />
      주의 프로젝트
    </S.SectionTitle>
    <div
      style={{
        display: "flex",
        gap: 0,
        marginBottom: 12,
        borderBottom: "1px solid #eee",
      }}
    >
      <S.WarningTabButton
        $selected={selectedWarningTab === "DELAYED"}
        onClick={() => setSelectedWarningTab("DELAYED")}
      >
        지연 상태
      </S.WarningTabButton>
      <S.WarningTabButton
        $selected={selectedWarningTab === "DEADLINE"}
        onClick={() => setSelectedWarningTab("DEADLINE")}
      >
        마감 7일 이내
      </S.WarningTabButton>
    </div>
    {(() => {
      const filtered = projectTabs.filter((project) => {
        const today = new Date();
        const end = new Date(project.endDate);
        const diff = (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        if (selectedWarningTab === "DELAYED") {
          return project.status === "DELAYED";
        } else {
          return project.status !== "DELAYED" && diff <= 7 && diff >= 0;
        }
      });
      if (filtered.length === 0) {
        return (
          <S.ProgressListEmpty>
            {selectedWarningTab === "DELAYED"
              ? "지연 상태의 주의 프로젝트가 없습니다."
              : "마감 7일 이내의 주의 프로젝트가 없습니다."}
          </S.ProgressListEmpty>
        );
      }
      return filtered.map((project, idx) => {
        const today = new Date();
        const end = new Date(project.endDate);
        const diff = Math.ceil(
          (today.getTime() - end.getTime()) / (1000 * 60 * 60 * 24)
        );
        return (
          <S.ProjectCard
            key={`warning-project-${project.id}-${idx}`}
            onClick={() =>
              window.location.assign(`/projects/${project.id}/detail`)
            }
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
                <FaProjectDiagram size={13} style={{ color: "#8b5cf6" }} />
                <S.ProjectTitle style={{ fontSize: "0.9rem" }}>
                  {project.name}
                </S.ProjectTitle>
              </div>
              <S.StatusBadge $status={project.status}>
                {project.status === "COMPLETED" && "완료"}
                {project.status === "IN_PROGRESS" && "진행중"}
                {project.status === "DELAYED" &&
                  `${diff > 0 ? `${diff}일 지연` : "지연"}`}
                {project.status !== "COMPLETED" &&
                  project.status !== "IN_PROGRESS" &&
                  project.status !== "DELAYED" &&
                  project.status !== "PENDING" &&
                  project.status}
              </S.StatusBadge>
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
              <span>마감일: {project.endDate.replace(/-/g, ".")}</span>
            </div>

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
                      {project.steps.find(
                        (s) => s.projectStepStatus === "IN_PROGRESS"
                      )?.name || "진행중"}
                    </S.ProjectProgressStep>
                  </div>
                  <S.ProjectProgressPercent
                    $percent={getProgressPercent(project.steps)}
                    style={{
                      color:
                        project.status === "DELAYED" ? "#dc2626" : "#f59e0b",
                    }}
                  >
                    {getProgressPercent(project.steps)}%
                  </S.ProjectProgressPercent>
                </div>
                <S.ProgressBarWrap style={{ marginTop: 0 }}>
                  <S.WarningProgressBar
                    $percent={getProgressPercent(project.steps)}
                    $status={project.status}
                  />
                </S.ProgressBarWrap>
              </div>
            </S.ProjectProgressInfo>
          </S.ProjectCard>
        );
      });
    })()}
  </S.Section>
);

export default WarningProjectsSection;
