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
  CardProgress,
} from "./ProjectCard.styled";
import {
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiAlertCircle,
} from "react-icons/fi";

import type { Project } from "../../types/Types";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { name , clientCompanies, devCompanies, projectStatus, startDate, endDate, progress } = project;

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/projects/${project.id}/detail`);
  };

  const getStatus = () => {
    switch (projectStatus) {
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
      case "DELAY":
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
        return { text: projectStatus, color: "#6b7280", icon: null };
    }
  };

  const statusInfo = getStatus();

  return (
    <Card $status={projectStatus} onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <CardHeader>
        <CardTitle>
          {name.length > 10 ? name.slice(0, 10) + '...' : name}
        </CardTitle>
        <CardBadges>
          <Badge $color={statusInfo.color} $status={projectStatus}>
            {statusInfo.icon}
            {statusInfo.text}
          </Badge>
        </CardBadges>
      </CardHeader>
      <CardBody>
        <CardInfoGroup>
          <span>고객사</span>
          <span>{clientCompanies}</span>
        </CardInfoGroup>
        <CardInfoGroup>
          <span>개발사</span>
          <span>{devCompanies}</span>
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
    </Card>
  );
};

export default ProjectCard;
