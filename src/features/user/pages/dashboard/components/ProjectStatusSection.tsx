import * as S from "../styled/UserDashboardPage.styled";
import {
  FiCalendar,
  FiGrid,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiAlertCircle,
} from "react-icons/fi";
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

// 프로젝트 상태별 아이콘 반환 함수 (ProjectListPage와 동일하게)
const getStatusIcon = (status: string) => {
  switch (status) {
    case "IN_PROGRESS":
      return <FiClock size={13} style={{ marginRight: 2, color: "#3b82f6" }} />;
    case "COMPLETED":
      return (
        <FiCheckCircle size={13} style={{ marginRight: 2, color: "#10b981" }} />
      );
    case "DELAY":
      return (
        <FiAlertTriangle
          size={13}
          style={{ marginRight: 2, color: "#ef4444" }}
        />
      );
    case "DUE_SOON":
      return (
        <FiAlertCircle size={13} style={{ marginRight: 2, color: "#f59e0b" }} />
      );
    default:
      return null;
  }
};

const ProjectStatusSection: React.FC<ProjectStatusSectionProps> = ({
  projectTabs,
  selectedStatusTab,
  setSelectedStatusTab,
  getProgressPercent,
  navigate,
}) => {
  // 필터링 로직 (선택된 탭과 status가 일치하는 프로젝트만)
  const filteredProjects = projectTabs.filter(
    (project) => project.status === selectedStatusTab
  );

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
                $warning={false}
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
                  <S.StatusBadge
                    $status={project.status}
                    style={{
                      background: "none",
                      color:
                        project.status === "COMPLETED"
                          ? "#10b981"
                          : project.status === "IN_PROGRESS"
                          ? "#3b82f6"
                          : "#fdb924",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      borderRadius: 0,
                      padding: 0,
                      letterSpacing: 0.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {project.status === "COMPLETED" && (
                      <FiCheckCircle
                        size={14}
                        style={{ color: "#10b981", marginRight: 2 }}
                      />
                    )}
                    {project.status === "IN_PROGRESS" && (
                      <FiClock
                        size={14}
                        style={{ color: "#3b82f6", marginRight: 2 }}
                      />
                    )}
                    <span
                      style={{
                        color:
                          project.status === "COMPLETED"
                            ? "#10b981"
                            : project.status === "IN_PROGRESS"
                            ? "#3b82f6"
                            : undefined,
                        fontWeight: 600,
                        fontSize: "0.85rem",
                      }}
                    >
                      {project.status === "COMPLETED" && "완료"}
                      {project.status === "IN_PROGRESS" && "진행중"}
                    </span>
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
                  <span>
                    {project.startDate.replace(/-/g, ".")} ~{" "}
                    {project.endDate.replace(/-/g, ".")}
                  </span>
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
                          gap: 8,
                        }}
                      >
                        {project.steps &&
                          project.steps.length > 0 &&
                          project.steps
                            .sort((a, b) => a.stepOrder - b.stepOrder)
                            .map((step, idx) => (
                              <div
                                key={step.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                {step.projectStepStatus === "COMPLETED" ? (
                                  <FiCheckCircle
                                    size={14}
                                    style={{ color: "#10b981" }}
                                  />
                                ) : step.projectStepStatus === "IN_PROGRESS" ? (
                                  <span
                                    style={{
                                      display: "inline-block",
                                      width: 12,
                                      height: 12,
                                      borderRadius: "50%",
                                      background: "#fdb924",
                                      border: "2px solid #fdb924",
                                      marginRight: 1,
                                    }}
                                  />
                                ) : (
                                  <span
                                    style={{
                                      display: "inline-block",
                                      width: 12,
                                      height: 12,
                                      borderRadius: "50%",
                                      background: "#e5e7eb",
                                      border: "2px solid #e5e7eb",
                                      marginRight: 1,
                                    }}
                                  />
                                )}
                                <span
                                  style={{
                                    fontSize: 12,
                                    color: "#374151",
                                    fontWeight: 500,
                                  }}
                                >
                                  {step.name}
                                </span>
                                {idx !== project.steps.length - 1 && (
                                  <span
                                    style={{
                                      color: "#bdbdbd",
                                      margin: "0 2px",
                                    }}
                                  >
                                    &rarr;
                                  </span>
                                )}
                              </div>
                            ))}
                        <S.ProjectProgressStep style={{ fontSize: "0.8rem" }}>
                          {/* {project.steps.find((s) => s.projectStepStatus === "IN_PROGRESS")?.name || "진행중"} */}
                        </S.ProjectProgressStep>
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <S.ProgressBarWrap style={{ marginTop: 0, flex: 1 }}>
                        <S.ProgressBar $percent={percent} />
                      </S.ProgressBarWrap>
                      <S.ProjectProgressPercent $percent={percent}>
                        {percent}%
                      </S.ProjectProgressPercent>
                    </div>
                  </div>
                </S.ProjectProgressInfo>
              </S.ProjectCard>
            );
          })}
        </S.ProgressList>
      )}
    </S.Section>
  );
};

export default ProjectStatusSection;
