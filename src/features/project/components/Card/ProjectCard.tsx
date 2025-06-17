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
  StageButton,
  CardProgress,
} from "./ProjectCard.styled";
import {
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiChevronRight,
} from "react-icons/fi";

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
  const { name, client, status, startDate, endDate, progress = 0 } = project;

  const { role } = useAuth();
  const navigate = useNavigate();

  const handleStageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/projects/${project.id}/detail`);
  };

  const getStatus = () => {
    switch (status) {
      case "IN_PROGRESS":
        return {
          text: "진행중",
          color: "#3b82f6",
          icon: <FiClock size={14} />,
        };
      case "COMPLETED":
        return {
          text: "완료",
          color: "#10b981",
          icon: <FiCheckCircle size={14} />,
        };
      case "DELAYED":
        return {
          text: "지연",
          color: "#ef4444",
          icon: <FiAlertTriangle size={14} />,
        };
      default:
        return { text: status, color: "#6b7280", icon: null };
    }
  };

  const statusInfo = getStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardBadges>
          <Badge $color={statusInfo.color}>
            {statusInfo.icon}
            {statusInfo.text}
          </Badge>
        </CardBadges>
      </CardHeader>
      <CardBody>
        <CardInfoGroup>
          <span>고객사</span>
          <span>{client}</span>
        </CardInfoGroup>
        <CardInfoGroup>
          <span>기간</span>
          <span>
            {startDate} ~ {endDate}
          </span>
        </CardInfoGroup>
        <CardProgress>
          <span>진행률</span>
          <progress value={progress} max={100} />
          <span>{progress}%</span>
        </CardProgress>
      </CardBody>
      <CardFooter>
        <StageButton onClick={handleStageClick}>
          단계별 보기 <FiChevronRight size={16} />
        </StageButton>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
