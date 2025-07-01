import * as S from "../styled/UserDashboardPage.styled";
import { FiLayers, FiCalendar, FiPackage } from "react-icons/fi";
import React from "react";
import type { ProjectStatusResponse } from "@/features/project/services/projectService";

interface WarningProjectsSectionProps {
  delayedProjects: ProjectStatusResponse[];
  deadlineProjects: ProjectStatusResponse[];
  selectedWarningTab: "DELAY" | "DUE_SOON";
  setSelectedWarningTab: (tab: "DELAY" | "DUE_SOON") => void;
}

const getProgressPercent = (steps: { projectStepStatus: string }[]) => {
  if (!steps || !Array.isArray(steps) || steps.length === 0) return 0;
  const completed = steps.filter(
    (s) => s?.projectStepStatus === "COMPLETED"
  ).length;
  return Math.round((completed / steps.length) * 100);
};

const WarningProjectsSection: React.FC<WarningProjectsSectionProps> = ({
  delayedProjects,
  deadlineProjects,
  selectedWarningTab,
  setSelectedWarningTab,
}) => {
  const delayCount = delayedProjects.length;
  const dueSoonCount = deadlineProjects.length;
  const projectTabs = selectedWarningTab === "DELAY" ? delayedProjects : deadlineProjects;

  return (
    <S.Section>
      <S.SectionTitle color="#111827">
        <FiPackage
          size={20}
          style={{
            marginRight: "8px",
            color: "#dc2626",
            verticalAlign: "middle",
          }}
        />
        이슈 프로젝트
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
          $selected={selectedWarningTab === "DELAY"}
          onClick={() => setSelectedWarningTab("DELAY")}
        >
          지연 상태 <span style={{ color: '#dc2626', marginLeft: 4 }}>({delayCount}개)</span>
        </S.WarningTabButton>
        <S.WarningTabButton
          $selected={selectedWarningTab === "DUE_SOON"}
          onClick={() => setSelectedWarningTab("DUE_SOON")}
        >
          마감 7일 이내 <span style={{ color: '#f59e0b', marginLeft: 4 }}>({dueSoonCount}개)</span>
        </S.WarningTabButton>
      </div>
      {(() => {
        const filtered = projectTabs.filter((project) => {
          const today = new Date();
          const end = new Date(project.endDate);
          const diff = (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
          if (selectedWarningTab === "DELAY") {
            return project.status === "DELAY";
          } else {
            return project.status !== "DELAY" && diff <= 7 && diff >= 0;
          }
        });
        if (filtered.length === 0) {
          return (
            <S.ProgressListEmpty>
              {selectedWarningTab === "DELAY"
                ? "지연 상태의 주의 프로젝트가 없습니다."
                : "마감 7일 이내의 주의 프로젝트가 없습니다."}
            </S.ProgressListEmpty>
          );
        }
        return (
          <S.ProgressList
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            {filtered.map((project, idx) => {
              const today = new Date();
              const end = new Date(project.endDate);
              
              // 날짜만 비교하기 위해 시간을 00:00:00으로 설정
              const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const endNormalized = new Date(end.getFullYear(), end.getMonth(), end.getDate());
              
              console.log('Date Debug:', {
                projectName: project.name,
                endDate: project.endDate,
                parsedEnd: end,
                today: today,
                todayNormalized: todayNormalized,
                endNormalized: endNormalized,
                diff: Math.ceil((endNormalized.getTime() - todayNormalized.getTime()) / (1000 * 60 * 60 * 24))
              });
              
              let dayInfo = '';
              if (project.status === "DELAY") {
                const diff = Math.ceil((todayNormalized.getTime() - endNormalized.getTime()) / (1000 * 60 * 60 * 24));
                dayInfo = diff > 0 ? `${diff}일 지연` : '지연';
              } else if (project.status === "DUE_SOON") {
                const diff = Math.ceil((endNormalized.getTime() - todayNormalized.getTime()) / (1000 * 60 * 60 * 24));
                dayInfo = diff > 0 ? `D-${diff}` : '오늘 마감';
              }
              return (
                <S.ProjectCard
                  key={`warning-project-${project.id}-${idx}`}
                  onClick={() =>
                    window.location.assign(`/projects/${project.id}/detail`)
                  }
                >
                  <S.ProjectHeaderRow style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                    {dayInfo && (
                      <span style={{
                        fontSize: '0.8rem',
                        color: project.status === 'DELAY' ? '#dc2626' : '#f59e0b',
                        marginLeft: 8,
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                      }}>{dayInfo}</span>
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
                    <span>마감일: {project.endDate.replace(/-/g, ".")}</span>
                  </div>
{/* 
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
                              project.status === "DELAYED"
                                ? "#dc2626"
                                : "#f59e0b",
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
                  </S.ProjectProgressInfo> */}
                </S.ProjectCard>
              );
            })}
          </S.ProgressList>
        );
      })()}
    </S.Section>
  );
};

export default WarningProjectsSection;
