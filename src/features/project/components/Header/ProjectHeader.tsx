// components/Header/ProjectHeader.tsx
import React, { useState } from "react";
import {
  FaBuilding,
  FaUsers,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { FiCalendar, FiPlay } from "react-icons/fi";
import {
  ProjectHeaderContainer,
  ProjectTitle,
  ProjectSubtitle,
  ProjectMeta,
  ProjectPeriod,
  ProjectStatusBadge,
  ProjectInfoSection,
  InfoSection,
  InfoSectionHeader,
  InfoSectionIcon,
  InfoSectionTitle,
  ToggleButton,
  InfoSectionContent,
  InfoItemCard,
  InfoLabel,
  InfoValue,
  InfoValueHighlight,
} from "./ProjectHeader.styled";

const ProjectHeader: React.FC = () => {
  const [isClientInfoExpanded, setIsClientInfoExpanded] = useState(true);
  const [isDeveloperInfoExpanded, setIsDeveloperInfoExpanded] = useState(true);

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
      {
        name: "김백엔드",
        role: "백엔드 개발자",
        email: "kim.back@company.com",
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

      <ProjectInfoSection>
        {/* 고객사 정보 */}
        <InfoSection>
          <InfoSectionHeader>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <InfoSectionIcon>
                <FaBuilding />
              </InfoSectionIcon>
              <InfoSectionTitle>고객사 정보</InfoSectionTitle>
            </div>
            <ToggleButton
              onClick={() => setIsClientInfoExpanded(!isClientInfoExpanded)}
              aria-label={isClientInfoExpanded ? "접기" : "펼치기"}
            >
              {isClientInfoExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </ToggleButton>
          </InfoSectionHeader>

          <InfoSectionContent
            style={{
              maxHeight: isClientInfoExpanded ? "200px" : "0",
              opacity: isClientInfoExpanded ? 1 : 0,
            }}
          >
            <InfoItemCard>
              <InfoLabel>고객사명</InfoLabel>
              <InfoValue>{project.client.name}</InfoValue>
            </InfoItemCard>

            {project.client.contactPerson && (
              <InfoItemCard>
                <InfoLabel>담당자</InfoLabel>
                <InfoValue>{project.client.contactPerson}</InfoValue>
              </InfoItemCard>
            )}

            {project.client.email && (
              <InfoItemCard>
                <InfoLabel>이메일</InfoLabel>
                <InfoValue>{project.client.email}</InfoValue>
              </InfoItemCard>
            )}

            {project.client.phone && (
              <InfoItemCard>
                <InfoLabel>연락처</InfoLabel>
                <InfoValue>{project.client.phone}</InfoValue>
              </InfoItemCard>
            )}
          </InfoSectionContent>
        </InfoSection>

        {/* 개발사 정보 */}
        <InfoSection>
          <InfoSectionHeader>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <InfoSectionIcon>
                <FaUsers />
              </InfoSectionIcon>
              <InfoSectionTitle>개발사 정보</InfoSectionTitle>
            </div>
            <ToggleButton
              onClick={() =>
                setIsDeveloperInfoExpanded(!isDeveloperInfoExpanded)
              }
              aria-label={isDeveloperInfoExpanded ? "접기" : "펼치기"}
            >
              {isDeveloperInfoExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </ToggleButton>
          </InfoSectionHeader>

          <InfoSectionContent
            style={{
              maxHeight: isDeveloperInfoExpanded ? "300px" : "0",
              opacity: isDeveloperInfoExpanded ? 1 : 0,
            }}
          >
            {project.developers.map((developer, index) => (
              <div key={index}>
                <InfoItemCard>
                  <InfoLabel>개발사 {index + 1}</InfoLabel>
                  <InfoValueHighlight>{developer.name}</InfoValueHighlight>
                </InfoItemCard>
                <InfoItemCard>
                  <InfoLabel>역할</InfoLabel>
                  <InfoValue>{developer.role}</InfoValue>
                </InfoItemCard>
                {developer.email && (
                  <InfoItemCard>
                    <InfoLabel>이메일</InfoLabel>
                    <InfoValue>{developer.email}</InfoValue>
                  </InfoItemCard>
                )}
                {index < project.developers.length - 1 && (
                  <div style={{ height: "8px" }}></div>
                )}
              </div>
            ))}
          </InfoSectionContent>
        </InfoSection>
      </ProjectInfoSection>
    </ProjectHeaderContainer>
  );
};

export default ProjectHeader;
