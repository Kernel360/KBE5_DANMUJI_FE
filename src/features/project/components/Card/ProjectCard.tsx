import React from 'react';
import {
  ProjectCard as Card,
  CardHeader,
  CardTitle,
  CardBadges,
  Badge,
  CardBody,
  CardInfo,
  CardFooter,
  DetailButton,
  ManagerButton,
} from '../../pages/ProjectListPage.styled';
import type { Project } from '../../types/Types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardBadges>
          <Badge $color="#2563eb">{project.status}</Badge>
          <Badge $color="#ef4444">{project.priority}</Badge>
        </CardBadges>
      </CardHeader>
      <CardBody>
        <CardInfo><div>고객사</div><div>{project.client}</div></CardInfo>
        <CardInfo><div>고객 담당자</div><div>{project.clientManager}</div></CardInfo>
        <CardInfo><div>개발 담당자</div><div>{project.devManagers}</div></CardInfo>
        <CardInfo><div>시작일</div><div>{project.startDate}</div></CardInfo>
        <CardInfo><div>종료 예정일</div><div>{project.endDate}</div></CardInfo>
      </CardBody>
      <CardFooter>
        <DetailButton>상세 보기</DetailButton>
        <ManagerButton>담당자 관리</ManagerButton>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard; 