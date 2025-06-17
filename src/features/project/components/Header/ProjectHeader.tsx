// components/Header/ProjectHeader.tsx
import {
  Wrapper,
  Title,
  Subtitle,
  InfoList,
} from './ProjectHeader.styled';

const ProjectHeader = () => {
  return (
    <Wrapper>
      <Title>클라우드 기반 ERP 시스템 개발</Title>
      <Subtitle>기업 자원 관리를 위한 클라우드 기반 ERP 시스템 구축 프로젝트</Subtitle>
      <InfoList>
        <div>프로젝트 기간: <strong>2023.06.01 ~ 2023.12.31</strong></div>
        {/* <div>고객사: ABC 기업 · 개발사: XYZ 소프트웨어</div>
        <div>담당자: 김코딩 · PM: 이개발 · 직무: IT 팀장 · 유형: 수석 개발자</div> */}
      </InfoList>
    </Wrapper>
  );
};

export default ProjectHeader;
