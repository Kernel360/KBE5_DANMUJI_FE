import React from "react";
import { useNavigate } from "react-router-dom";
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
} from "./ProjectCard.styled";
import { FiClock, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

import { useAuth } from "@/hooks/useAuth";

import type { Project } from "../../types/Types";

const STATUS_MAP = {
  IN_PROGRESS: "진행중",
  COMPLETED: "완료",
  DELAYED: "지연",
} as const;

const STATUS_COLORS = {
  IN_PROGRESS: "#2563eb",
  COMPLETED: "#059669",
  DELAYED: "#ef4444",
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
  } = project;

  const { role } = useAuth();
  const navigate = useNavigate();

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    navigate(`/projects/${project.id}/detail`);
  };

  const handleManagerClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    // TODO: 담당자 정보 표시 로직 구현
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "#3b82f6";
      case "COMPLETED":
        return "#10b981";
      case "DELAYED":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "진행중";
      case "COMPLETED":
        return "완료";
      case "DELAYED":
        return "지연";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return <FiClock size={14} style={{ marginRight: 2 }} />;
      case "COMPLETED":
        return <FiCheckCircle size={14} style={{ marginRight: 2 }} />;
      case "DELAYED":
        return <FiAlertTriangle size={14} style={{ marginRight: 2 }} />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardBadges>
          <Badge $color={getStatusColor(status)}>
            {getStatusIcon(status)}
            {getStatusText(status)}
          </Badge>
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
          <div>
            {startDate} ~ {endDate}
          </div>
        </CardInfoGroup>
      </CardBody>

      <CardFooter>
        <DetailButton onClick={handleDetailClick}>상세 보기</DetailButton>
        {role === "ROLE_ADMIN" && (
          <ManagerButton onClick={handleManagerClick}>
            담당자 관리
          </ManagerButton>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
