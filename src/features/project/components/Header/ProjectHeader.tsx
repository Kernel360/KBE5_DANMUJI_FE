// components/Header/ProjectHeader.tsx
import React from "react";
import { FaBuilding, FaUsers } from "react-icons/fa";
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
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
  const [memberListModal, setMemberListModal] = useState<{ open: boolean; company: any; members: any[]; type: 'client' | 'dev' | null }>({ open: false, company: null, members: [], type: null });
  const [memberDetailModal, setMemberDetailModal] = useState<{ open: boolean; memberId: number | null }>({ open: false, memberId: null });

  const handleBack = () => {
    navigate("/projects");
  };

  const handleDeactivate = async () => {
    if (!window.confirm("정말 이 프로젝트를 비활성화하시겠습니까?")) return;
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
      default:
        return "#6b7280";
    }
  };

  const statusColor = getStatusColor(projectDetail.projectStatus);
  const statusText = getStatusText(projectDetail.projectStatus);

  return (
    <ProjectHeaderContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          marginRight: "24px",
        }}
      >
        <BackButton onClick={handleBack}>
          <FiArrowLeft size={16} />
          목록으로
        </BackButton>
        {role === "ROLE_ADMIN" && (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onEdit}
              style={{
                background: "#fdb924",
                color: "#fff",
                border: 0,
                borderRadius: 6,
                padding: "8px 16px",
                fontWeight: 500,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "background-color 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#f59e0b";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#fdb924";
              }}
            >
              편집
            </button>
            <button
              onClick={handleDeactivate}
              style={{
                background: "#aaa",
                color: "#fff",
                border: 0,
                borderRadius: 6,
                padding: "8px 16px",
                fontWeight: 500,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                opacity: 0.7,
              }}
            >
              비활성화
            </button>
          </div>
        )}
      </div>
      <ProjectTitle>{projectDetail.name}</ProjectTitle>
      {projectDetail.description && (
        <ProjectDescription>{projectDetail.description}</ProjectDescription>
      )}
      <ProjectMeta>
        <ProjectPeriod>
          <FiCalendar size={14} />
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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          margin: "12px 0 0 0",
          fontSize: "0.95rem",
          color: "#6b7280",
          fontWeight: 400,
          lineHeight: 1.7,
          padding: "0 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FaBuilding size={17} style={{ marginRight: 4, color: "#9ca3af" }} />
          <span style={{ color: "#9ca3af", marginRight: 6 }}>고객사</span>
          {projectDetail.clients && projectDetail.clients.length > 0 ? (
            projectDetail.clients.map((client, idx) => (
              <span key={client.id} style={{ color: "#2563eb", fontWeight: 600, cursor: "pointer", marginRight: 8 }}
                onClick={() => setMemberListModal({ open: true, company: client, members: client.assignUsers, type: 'client' })}>
                {client.companyName}
                {idx < projectDetail.clients.length - 1 && <span style={{ color: "#d1d5db", margin: "0 4px" }}>|</span>}
              </span>
            ))
          ) : (
            <span style={{ color: "#aaa" }}>미지정</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FaUsers size={17} style={{ marginRight: 4, color: "#9ca3af" }} />
          <span style={{ color: "#9ca3af", marginRight: 6 }}>개발사</span>
          {projectDetail.developers && projectDetail.developers.length > 0 ? (
            projectDetail.developers.map((dev, idx) => (
              <span key={dev.id} style={{ color: "#19c37d", fontWeight: 600, cursor: "pointer", marginRight: 8 }}
                onClick={() => setMemberListModal({ open: true, company: dev, members: dev.assignUsers, type: 'dev' })}>
                {dev.companyName}
                {idx < projectDetail.developers.length - 1 && <span style={{ color: "#d1d5db", margin: "0 4px" }}>|</span>}
              </span>
            ))
          ) : (
            <span style={{ color: "#aaa" }}>미지정</span>
          )}
        </div>
      </div>
      {/* 멤버 리스트 모달 */}
      {memberListModal.open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setMemberListModal({ open: false, company: null, members: [], type: null })}>
          <div style={{ background: '#fff', borderRadius: 12, minWidth: 340, maxWidth: 400, width: '90vw', padding: 28, position: 'relative' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>{memberListModal.company?.companyName} 멤버 목록</div>
            {memberListModal.members && memberListModal.members.length > 0 ? (
              memberListModal.members.map((m) => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer', padding: 8, borderRadius: 6, transition: 'background 0.2s', background: '#f9fafb' }}>
                  <span style={{ fontWeight: 600 }}>{m.name}</span>
                  <span style={{ color: '#888', fontSize: 13 }}>{m.positon || m.position}</span>
                  <span style={{ color: '#aaa', fontSize: 12, marginLeft: 'auto' }}>{m.userType === 'MANAGER' ? '담당자' : '멤버'}</span>
                </div>
              ))
            ) : (
              <div style={{ color: '#aaa', textAlign: 'center', padding: 20 }}>멤버 없음</div>
            )}
            <button style={{ position: 'absolute', top: 12, right: 12, background: 'transparent', border: 0, fontSize: 22, cursor: 'pointer' }} onClick={() => setMemberListModal({ open: false, company: null, members: [], type: null })}>×</button>
          </div>
        </div>
      )}
    </ProjectHeaderContainer>
  );
};

export default ProjectHeader;
