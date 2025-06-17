// components/Header/ProjectHeader.tsx
import React from "react";
import { FaBuilding, FaUsers } from "react-icons/fa";
import { FiCalendar, FiPlay } from "react-icons/fi";
import {
  ProjectHeaderContainer,
  ProjectTitle,
  ProjectSubtitle,
  ProjectMeta,
  ProjectPeriod,
  ProjectStatusBadge,
} from "./ProjectHeader.styled";

const ProjectHeader: React.FC = () => {
  // 더미 데이터
  const project = {
    name: "클라우드 기반 ERP 시스템 개발",
    description: "기업 자원 관리를 위한 클라우드 기반 ERP 시스템 구축 프로젝트",
    client: {
      name: "ABC 기업",
      contactPerson: "김코딩",
      email: "kim.coding@abc.com",
      phone: "02-1234-5678",
    },
    developers: [
      {
        name: "이개발",
        role: "수석 개발자",
        email: "lee.dev@company.com",
      },
      {
        name: "박프론트",
        role: "프론트엔드 개발자",
        email: "park.front@company.com",
      },
    ],
  };

  return (
    <ProjectHeaderContainer>
      <ProjectTitle>{project.name}</ProjectTitle>
      {project.description && (
        <ProjectSubtitle>{project.description}</ProjectSubtitle>
      )}

      <ProjectMeta>
        <ProjectPeriod>
          <FiCalendar size={14} />
          프로젝트 기간: 2023.06.01 ~ 2023.12.31
        </ProjectPeriod>
        <ProjectStatusBadge status="IN_PROGRESS">
          <FiPlay size={12} />
          진행중
        </ProjectStatusBadge>
      </ProjectMeta>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          margin: "12px 0 0 0",
          fontSize: "0.95rem",
          color: "#6b7280",
          fontWeight: 400,
          lineHeight: 1.7,
          padding: "0 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FaBuilding size={17} style={{ marginRight: 4, color: "#9ca3af" }} />
          <span style={{ color: "#9ca3af", marginRight: 6 }}>고객사</span>
          <span style={{ color: "#222", fontWeight: 500 }}>
            {project.client.name}
          </span>
          {project.client.contactPerson && (
            <>
              <span style={{ color: "#d1d5db", margin: "0 6px" }}>|</span>
              <span style={{ color: "#9ca3af", marginRight: 6 }}>담당자</span>
              <span style={{ color: "#222", fontWeight: 500 }}>
                {project.client.contactPerson}
              </span>
            </>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FaUsers size={17} style={{ marginRight: 4, color: "#9ca3af" }} />
          <span style={{ color: "#9ca3af", marginRight: 6 }}>개발사</span>
          {project.developers.map((dev, idx) => (
            <span key={dev.name}>
              <span style={{ color: "#222", fontWeight: 500 }}>{dev.name}</span>
              <span style={{ color: "#9ca3af", margin: "0 2px" }}>
                ({dev.role})
              </span>
              {idx !== project.developers.length - 1 && (
                <span style={{ color: "#d1d5db", margin: "0 6px" }}>,</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </ProjectHeaderContainer>
  );
};

export default ProjectHeader;
