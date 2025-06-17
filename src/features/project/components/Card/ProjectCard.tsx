import React from 'react';
import {
  ProjectCard as Card,
  CardHeader,
  CardTitle,
  CardBadges,
  Badge,
  CardBody,
  CardInfoGroup,
  CardFooter,
  DetailButton,
  ManagerButton,
} from './ProjectCard.styled';

import type { Project } from '../../types/Types';

const STATUS_MAP = {
  'IN_PROGRESS': '진행중',
  'COMPLETED': '완료',
  'DELAYED': '지연'
} as const;

const STATUS_COLORS = {
  'IN_PROGRESS': '#2563eb',
  'COMPLETED': '#059669',
  'DELAYED': '#ef4444'
} as const;

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const {
    name,
    client,
    clientManager,
    devManagers,
    status,
    startDate,
    endDate,
    // progress,
  } = project;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardBadges>
          <Badge $color={STATUS_COLORS[status]}>{STATUS_MAP[status]}</Badge>
        </CardBadges>
      </CardHeader>

      <CardBody>
        <CardInfoGroup>
          <div>고객사</div>
          <div>{client}</div>
        </CardInfoGroup>
        <CardInfoGroup>
          <div>고객 담당자</div>
          <div>{clientManager}</div>
        </CardInfoGroup>
        <CardInfoGroup>
          <div>개발사</div>
          <div>{client}</div>
        </CardInfoGroup>
        <CardInfoGroup>
          <div>개발 담당자</div>
          <div>{devManagers}</div>
        </CardInfoGroup>
        <CardInfoGroup>
          <div>기간</div>
          <div>{startDate} ~ {endDate}</div>
        </CardInfoGroup>

        {/* {progress !== undefined && (
          <CardProgress>
            <span>진행률</span>
            <progress value={progress} max={100} />
            <span>{progress}%</span>
          </CardProgress>
        )} */}
      </CardBody>

      <CardFooter>
        <DetailButton>상세 보기</DetailButton>
        <ManagerButton>담당자 관리</ManagerButton>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
