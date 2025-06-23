import * as S from "../styled/UserDashboardPage.styled";
import { MdOutlineViewHeadline } from "react-icons/md";
import React from "react";

const ProjectStatusSection = ({ projectTabs, selectedTab, setSelectedTab, getProgressPercent, navigate }) => (
  <S.Section>
    <S.ProgressSectionTitleRow>
      <S.SectionTitle color="#1abc7b">진행중인 프로젝트</S.SectionTitle>
      <S.ViewAllButton onClick={() => navigate("/projects")}>전체 보기
        <S.ViewAllButtonIcon>
          <MdOutlineViewHeadline />
        </S.ViewAllButtonIcon>
      </S.ViewAllButton>
    </S.ProgressSectionTitleRow>
    <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
      {projectTabs.map((project, idx) => (
        <button
          key={project.name}
          onClick={() => setSelectedTab(idx)}
          style={{
            padding: "6px 16px",
            borderRadius: 999,
            border: "none",
            background: selectedTab === idx ? "#1abc7b" : "#e6f9f0",
            color: selectedTab === idx ? "#fff" : "#1abc7b",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "0.97rem",
            transition: "background 0.2s, color 0.2s",
          }}
        >
          {project.name}
        </button>
      ))}
    </div>
    <S.ProjectCard>
      <S.ProjectHeaderRow>
        <S.ProjectTitle>{projectTabs[selectedTab].name}</S.ProjectTitle>
        <S.StatusBadge status={projectTabs[selectedTab].status}>
          {projectTabs[selectedTab].status === "COMPLETED" && "완료"}
          {projectTabs[selectedTab].status === "IN_PROGRESS" && "진행중"}
          {projectTabs[selectedTab].status === "DELAYED" && "지연"}
          {projectTabs[selectedTab].status !== "COMPLETED" &&
            projectTabs[selectedTab].status !== "IN_PROGRESS" &&
            projectTabs[selectedTab].status !== "DELAYED" &&
            projectTabs[selectedTab].status}
        </S.StatusBadge>
      </S.ProjectHeaderRow>
      <div style={{ color: "#8b95a1", fontSize: "0.97rem", marginBottom: 2 }}>
        {projectTabs[selectedTab].description}
      </div>
      <S.ProjectMeta>
        <div>
          시작일: <span style={{ color: "#222", fontWeight: 500 }}>{projectTabs[selectedTab].startDate}</span>
        </div>
        <div>
          마감일: <span style={{ color: "#222", fontWeight: 500 }}>{projectTabs[selectedTab].endDate}</span>
        </div>
      </S.ProjectMeta>
      <S.CompanyRow>
        <div>
          고객사: <S.CompanyName>{projectTabs[selectedTab].clientCompany}</S.CompanyName>
        </div>
        <div>
          개발사: <S.CompanyName>{projectTabs[selectedTab].developerCompany}</S.CompanyName>
        </div>
      </S.CompanyRow>
      <S.Divider />
      <S.ProgressItem>
        <S.ProgressLabel>진행률</S.ProgressLabel>
        <S.ProgressPercent>
          {getProgressPercent(projectTabs[selectedTab].steps)}%
        </S.ProgressPercent>
        <S.ProgressBarWrap>
          <S.ProgressBar percent={getProgressPercent(projectTabs[selectedTab].steps)} />
        </S.ProgressBarWrap>
      </S.ProgressItem>
    </S.ProjectCard>
  </S.Section>
);

export default ProjectStatusSection; 