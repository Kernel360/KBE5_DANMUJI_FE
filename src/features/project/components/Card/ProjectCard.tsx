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
  FiAlertCircle,
} from "react-icons/fi";
import { AiOutlineSelect } from "react-icons/ai";
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
      case "DUE_SOON":
        return {
          text: "기한임박",
          color: "#f59e0b",
          icon: <FiAlertCircle size={14} />,
        };
      default:
        return { text: status, color: "#6b7280", icon: null };
    }
  };

  const statusInfo = getStatus();

  return (
    <Card $status={status}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardBadges>
          <Badge $color={statusInfo.color} $status={status}>
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span>진행률</span>
            <span>{progress}%</span>
          </div>
          <progress value={progress} max={100} />
        </CardProgress>
      </CardBody>
      <CardFooter>
        <StageButton onClick={handleStageClick}>
          <AiOutlineSelect size={14} />
          보기
        </StageButton>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
