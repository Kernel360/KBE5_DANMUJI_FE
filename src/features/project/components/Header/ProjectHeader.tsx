// components/Header/ProjectHeader.tsx
import { FiCalendar, FiPlay, FiUsers, FiHome } from "react-icons/fi";
import {
  Wrapper,
  HeaderContent,
  Title,
  Subtitle,
  ProjectMeta,
  ProjectPeriod,
  ProjectStatusBadge,
  ProjectInfoSection,
  InfoCard,
  InfoCardHeader,
  InfoCardIcon,
  InfoCardTitle,
  InfoCardContent,
  InfoItemCard,
  InfoLabel,
  InfoValue,
  InfoValueHighlight,
} from "./ProjectHeader.styled";

const ProjectHeader = () => {
  return (
    <>
      <Wrapper>
        <HeaderContent>
          <Title>클라우드 기반 ERP 시스템 개발</Title>
          <Subtitle>
            기업 자원 관리를 위한 클라우드 기반 ERP 시스템 구축 프로젝트
          </Subtitle>
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
        </HeaderContent>
      </Wrapper>

      <ProjectInfoSection>
        <InfoCard>
          <InfoCardHeader>
            <InfoCardIcon>
              <FiHome size={20} />
            </InfoCardIcon>
            <InfoCardTitle>고객사 정보</InfoCardTitle>
          </InfoCardHeader>
          <InfoCardContent>
            <InfoItemCard>
              <InfoLabel>고객사</InfoLabel>
              <InfoValueHighlight>ABC 기업</InfoValueHighlight>
            </InfoItemCard>
            <InfoItemCard>
              <InfoLabel>담당자</InfoLabel>
              <InfoValue>김코딩</InfoValue>
            </InfoItemCard>
            <InfoItemCard>
              <InfoLabel>직책</InfoLabel>
              <InfoValue>IT 팀장</InfoValue>
            </InfoItemCard>
          </InfoCardContent>
        </InfoCard>

        <InfoCard>
          <InfoCardHeader>
            <InfoCardIcon>
              <FiUsers size={20} />
            </InfoCardIcon>
            <InfoCardTitle>개발사 정보</InfoCardTitle>
          </InfoCardHeader>
          <InfoCardContent>
            <InfoItemCard>
              <InfoLabel>개발사</InfoLabel>
              <InfoValueHighlight>XYZ 소프트웨어</InfoValueHighlight>
            </InfoItemCard>
            <InfoItemCard>
              <InfoLabel>담당자</InfoLabel>
              <InfoValue>이개발</InfoValue>
            </InfoItemCard>
            <InfoItemCard>
              <InfoLabel>직책</InfoLabel>
              <InfoValue>수석 개발자</InfoValue>
            </InfoItemCard>
          </InfoCardContent>
        </InfoCard>
      </ProjectInfoSection>
    </>
  );
};

export default ProjectHeader;
