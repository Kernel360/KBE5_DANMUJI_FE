// components/Header/ProjectHeader.tsx
import React from "react";
import { FiHome, FiUser } from "react-icons/fi";
import { TbMoneybag } from "react-icons/tb";
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiAlertCircle,
  FiArrowLeft,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  ProjectHeaderContainer,
  ProjectTitle,
  ProjectMeta,
  ProjectPeriod,
  BackButton,
  ProjectDescription,
  HeaderTopBar,
  AdminButtonGroup,
  EditButton,
  DeactivateButton,
  ProjectCost,
  CompanyMemberSection,
  CompanyRow,
  CompanyIcon,
  CompanyLabel,
  CompanyName,
  CompanyDivider,
  CompanyUnassigned,
  MemberListModalOverlay,
  MemberListModalContent,
  MemberListModalTitle,
  MemberListItem,
  MemberName,
  MemberPosition,
  MemberType,
  MemberListEmpty,
  MemberListModalClose,
} from "./ProjectHeader.styled";
import type { ProjectDetailResponse } from "../../services/projectService";
import { useAuth } from "@/hooks/useAuth";
import api from "@/api/axios";
import MemberDetailModal from "@/features/user/components/MemberDetailModal/MemberDetailModal";
import { useState } from "react";

interface ProjectHeaderProps {
  projectDetail: ProjectDetailResponse;
  onEdit: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projectDetail,
  onEdit,
}) => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [memberListModal, setMemberListModal] = useState<{
    open: boolean;
    company: any;
    members: any[];
    type: "client" | "dev" | null;
  }>({ open: false, company: null, members: [], type: null });
  const [memberDetailModal, setMemberDetailModal] = useState<{
    open: boolean;
    memberId: number | null;
  }>({ open: false, memberId: null });

  const handleBack = () => {
    navigate("/projects");
  };

  const handleDeactivate = async () => {
    if (
      !window.confirm(
        "정말 이 프로젝트를 비활성화하시겠습니까? \n이력관리에서 복구 가능합니다."
      )
    )
      return;
    try {
      const id = projectDetail.id;
      await api.delete(`/api/projects/${id}`);
      alert("프로젝트가 비활성화되었습니다.");
      navigate("/projects");
    } catch (e) {
      alert("비활성화에 실패했습니다.");
    }
  };

  // 상태별 아이콘 반환 함수
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return <FiClock size={14} style={{ marginRight: 4 }} />;
      case "COMPLETED":
        return <FiCheckCircle size={14} style={{ marginRight: 4 }} />;
      case "DELAY":
        return <FiAlertTriangle size={14} style={{ marginRight: 4 }} />;
      case "DUE_SOON":
        return <FiAlertCircle size={14} style={{ marginRight: 4 }} />;
      default:
        return null;
    }
  };

  // 상태 텍스트 변환
  const getStatusText = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "진행중";
      case "COMPLETED":
        return "완료";
      case "DELAY":
        return "지연";
      case "DUE_SOON":
        return "기한 임박";
      default:
        return status;
    }
  };

  // 상태 색상 반환
  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "#2563eb";
      case "COMPLETED":
        return "#059669";
      case "DELAY":
        return "#ef4444";
      case "DUE_SOON":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const statusColor = getStatusColor(projectDetail.projectStatus);
  const statusText = getStatusText(projectDetail.projectStatus);

  return (
    <ProjectHeaderContainer>
      <HeaderTopBar>
        <BackButton onClick={handleBack}>
          <FiArrowLeft size={16} />
          목록으로
        </BackButton>
        {role === "ROLE_ADMIN" && (
          <AdminButtonGroup>
            <EditButton onClick={onEdit}>편집</EditButton>
            <DeactivateButton onClick={handleDeactivate}>
              비활성화
            </DeactivateButton>
          </AdminButtonGroup>
        )}
      </HeaderTopBar>
      <ProjectTitle>{projectDetail.name}</ProjectTitle>
      {projectDetail.description && (
        <ProjectDescription>{projectDetail.description}</ProjectDescription>
      )}
      {typeof projectDetail.projectCost !== "undefined" &&
        projectDetail.projectCost !== null && (
          <ProjectCost
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: "0.92rem",
              color: "#6b7280",
              fontWeight: 500,
              margin: "0 0 8px 24px",
            }}
          >
            <TbMoneybag
              size={16}
              style={{ color: "#fdb924", marginRight: 2 }}
            />
            프로젝트 예산: {Number(projectDetail.projectCost).toLocaleString()}
            원
          </ProjectCost>
        )}
      <ProjectMeta>
        <ProjectPeriod
          style={{
            fontSize: "0.92rem",
            color: "#6b7280",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <FiCalendar size={16} style={{ color: "#fdb924", marginRight: 2 }} />
          프로젝트 기간: {projectDetail.startDate} ~ {projectDetail.endDate}
        </ProjectPeriod>
        <span
          style={{
            color: statusColor,
            fontWeight: 600,
            fontSize: "0.95rem",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {getStatusIcon(projectDetail.projectStatus)}
          {statusText}
        </span>
      </ProjectMeta>

      <CompanyMemberSection>
        <CompanyRow>
          <CompanyIcon>
            <FiHome size={17} style={{ color: "#9ca3af" }} />
          </CompanyIcon>
          <CompanyLabel>고객사</CompanyLabel>
          {projectDetail.clients && projectDetail.clients.length > 0 ? (
            projectDetail.clients.map((client, idx) => (
              <CompanyName
                key={client.id}
                $type="client"
                onClick={() =>
                  setMemberListModal({
                    open: true,
                    company: client,
                    members: client.assignUsers,
                    type: "client",
                  })
                }
              >
                {client.companyName}
                {idx < projectDetail.clients.length - 1 && (
                  <CompanyDivider>|</CompanyDivider>
                )}
              </CompanyName>
            ))
          ) : (
            <CompanyUnassigned>미지정</CompanyUnassigned>
          )}
        </CompanyRow>
        <CompanyRow>
          <CompanyIcon>
            <FiUser size={17} style={{ color: "#9ca3af" }} />
          </CompanyIcon>
          <CompanyLabel>개발사</CompanyLabel>
          {projectDetail.developers && projectDetail.developers.length > 0 ? (
            projectDetail.developers.map((dev, idx) => (
              <CompanyName
                key={dev.id}
                $type="dev"
                onClick={() =>
                  setMemberListModal({
                    open: true,
                    company: dev,
                    members: dev.assignUsers,
                    type: "dev",
                  })
                }
              >
                {dev.companyName}
                {idx < projectDetail.developers.length - 1 && (
                  <CompanyDivider>|</CompanyDivider>
                )}
              </CompanyName>
            ))
          ) : (
            <CompanyUnassigned>미지정</CompanyUnassigned>
          )}
        </CompanyRow>
      </CompanyMemberSection>
      {/* 멤버 리스트 모달 */}
      {memberListModal.open && (
        <MemberListModalOverlay
          onClick={() =>
            setMemberListModal({
              open: false,
              company: null,
              members: [],
              type: null,
            })
          }
        >
          <MemberListModalContent onClick={(e) => e.stopPropagation()}>
            <MemberListModalTitle>
              {memberListModal.company?.companyName} 멤버 목록
            </MemberListModalTitle>
            {memberListModal.members && memberListModal.members.length > 0 ? (
              memberListModal.members.map((m) => (
                <MemberListItem key={m.id}>
                  <MemberName>{m.name}</MemberName>
                  <MemberPosition>{m.positon || m.position}</MemberPosition>
                  <MemberType>
                    {m.userType === "MANAGER" ? "담당자" : "멤버"}
                  </MemberType>
                </MemberListItem>
              ))
            ) : (
              <MemberListEmpty>멤버 없음</MemberListEmpty>
            )}
            <MemberListModalClose
              onClick={() =>
                setMemberListModal({
                  open: false,
                  company: null,
                  members: [],
                  type: null,
                })
              }
            >
              ×
            </MemberListModalClose>
          </MemberListModalContent>
        </MemberListModalOverlay>
      )}
    </ProjectHeaderContainer>
  );
};

export default ProjectHeader;
