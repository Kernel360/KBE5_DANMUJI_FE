import * as S from "../styled/UserDashboardPage.styled";
import { FaProjectDiagram } from "react-icons/fa";
import React from "react";

interface Project {
  id: string | number;
  name: string;
  status: string;
  endDate: string;
}

interface WarningProjectsSectionProps {
  projectTabs: Project[];
  selectedWarningTab: "DELAYED" | "DEADLINE";
  setSelectedWarningTab: (tab: "DELAYED" | "DEADLINE") => void;
}

const WarningProjectsSection: React.FC<WarningProjectsSectionProps> = ({
  projectTabs,
  selectedWarningTab,
  setSelectedWarningTab,
}) => (
  <S.Section>
    <S.SectionTitle color="#dc2626">
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
        selected={selectedWarningTab === "DELAYED"}
        onClick={() => setSelectedWarningTab("DELAYED")}
      >
        지연 상태
      </S.WarningTabButton>
      <S.WarningTabButton
        selected={selectedWarningTab === "DEADLINE"}
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
            style={{
              marginBottom: 8,
              border: "1px solid #fecaca",
              background: "#fff",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fef2f2";
              e.currentTarget.style.borderColor = "#fca5a5";
              e.currentTarget.style.boxShadow =
                "0 2px 8px rgba(239, 68, 68, 0.1)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.borderColor = "#fecaca";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "#dc2626",
                }}
              >
                {project.name}
              </div>
              <S.StatusBadge $status={project.status}>
                {project.status === "COMPLETED" && "완료"}
                {project.status === "IN_PROGRESS" && "진행중"}
                {project.status === "DELAYED" &&
                  `${diff > 0 ? `${diff}일 지연` : "지연"}`}
                {project.status === "PENDING" && "보류"}
                {project.status !== "COMPLETED" &&
                  project.status !== "IN_PROGRESS" &&
                  project.status !== "DELAYED" &&
                  project.status !== "PENDING" &&
                  project.status}
              </S.StatusBadge>
            </div>
            <div style={{ color: "#bdbdbd", fontSize: 12, marginBottom: 2 }}>
              마감일:{" "}
              <b
                style={{
                  color:
                    project.status === "DELAYED" ||
                    ((new Date(project.endDate).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24) <=
                      7 &&
                      (new Date(project.endDate).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24) >=
                        0)
                      ? "#dc2626"
                      : "#374151",
                }}
              >
                {project.endDate}
              </b>
            </div>
          </S.ProjectCard>
        );
      });
    })()}
  </S.Section>
);

export default WarningProjectsSection;
