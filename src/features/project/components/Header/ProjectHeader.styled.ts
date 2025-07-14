import styled from "styled-components";

export const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin: 24px;
  margin-bottom: -10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const HeaderTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
  max-width: 600px;
`;

export const ProjectMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0 0 24px 24px;
  flex-wrap: wrap;
`;

export const ProjectPeriod = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

export const ProjectStatusBadge = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${({ $status }) => {
    switch ($status) {
      case "IN_PROGRESS":
        return `
          background: #dbeafe;
          color: #1d4ed8;
        `;
      case "COMPLETED":
        return `
          background: #dcfce7;
          color: #15803d;
        `;
      case "PENDING":
        return `
          background: #fef3c7;
          color: #d97706;
        `;
      default:
        return `
          background: #f3f4f6;
          color: #6b7280;
        `;
    }
  }}
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const InfoItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
  }

  strong {
    color: white;
    font-weight: 600;
  }
`;

// 프로젝트 정보 섹션
export const ProjectInfoSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin: 24px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const InfoSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
  justify-content: space-between;
`;

export const InfoSectionIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fbbf24;
  color: white;
  font-size: 0.875rem;
`;

export const InfoSectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex: 1;
`;

export const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.2);
  }
`;

export const InfoSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.3s ease;
  overflow: hidden;
`;

export const InfoItemCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
`;

export const InfoLabel = styled.span`
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
`;

export const InfoValue = styled.span`
  font-size: 0.8rem;
  color: #111827;
  font-weight: 600;
  text-align: right;
`;

export const InfoValueHighlight = styled(InfoValue)`
  color: #3b82f6;
  background: #eff6ff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
`;

export const DeveloperList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DeveloperItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  background: #f9fafb;
  border-radius: 4px;
  border: 1px solid #e5e7eb;

  &:not(:last-child) {
    margin-bottom: 2px;
  }

  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

// 프로젝트 헤더 컨테이너
export const ProjectHeaderContainer = styled.div`
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 24px 0;
`;

// 프로젝트 제목
export const ProjectTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 24px;
  line-height: 1.2;
  word-break: break-all;
  white-space: pre-line;
  overflow-wrap: break-word;
`;

// 프로젝트 개요(Description)
export const ProjectDescription = styled.p`
  font-size: 1.05rem;
  color: #6b7280;
  font-weight: 400;
  margin: 0 0 8px 24px;
  line-height: 1.5;
  word-break: break-all;
  white-space: pre-line;
  overflow-wrap: break-word;
`;

// 프로젝트 부제목
export const ProjectSubtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 16px 24px;
  line-height: 1.5;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  margin-left: 24px;
  margin-bottom: 16px;
  background: #ffffff;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.925rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover {
    background: #f9fafb;
    color: #111827;
    border-color: #d1d5db;
  }
`;

// Header top bar (flex row for back button and admin actions)
export const HeaderTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  margin-right: 24px;
`;

// Admin button group
export const AdminButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

// Edit button
export const EditButton = styled.button`
  background: #fdb924;
  color: #fff;
  border: 0;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s ease;
  &:hover {
    background: #f59e0b;
  }
`;

// Deactivate button
export const DeactivateButton = styled.button`
  background: #aaa;
  color: #fff;
  border: 0;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.7;
`;

// Project cost display
export const ProjectCost = styled.div`
  font-size: 1.08rem;
  color: #4338ca;
  font-weight: 600;
  margin: 0 0 8px 24px;
  line-height: 1.5;
  letter-spacing: 0.01em;
`;

// Company/member list section
export const CompanyMemberSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 12px 0 0 0;
  font-size: 0.95rem;
  color: #6b7280;
  font-weight: 400;
  line-height: 1.7;
  padding: 0 24px;
`;

export const CompanyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CompanyIcon = styled.span`
  display: flex;
  align-items: center;
  margin-right: 4px;
  color: #9ca3af;
`;

export const CompanyLabel = styled.span`
  color: #9ca3af;
  margin-right: 6px;
`;

export const CompanyName = styled.span<{ $type: "client" | "dev" }>`
  color: ${({ $type }) => ($type === "client" ? "#2563eb" : "#19c37d")};
  font-weight: 600;
  cursor: pointer;
  margin-right: 8px;
`;

export const CompanyDivider = styled.span`
  color: #d1d5db;
  margin: 0 4px;
`;

export const CompanyUnassigned = styled.span`
  color: #aaa;
`;

// Member list modal overlay
export const MemberListModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Member list modal content
export const MemberListModalContent = styled.div`
  background: #fff;
  border-radius: 12px;
  min-width: 340px;
  max-width: 400px;
  width: 90vw;
  padding: 28px;
  position: relative;
`;

export const MemberListModalTitle = styled.div`
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 16px;
`;

export const MemberListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.2s;
  background: #f9fafb;
`;

export const MemberName = styled.span`
  font-weight: 600;
`;

export const MemberPosition = styled.span`
  color: #888;
  font-size: 13px;
`;

export const MemberType = styled.span`
  color: #aaa;
  font-size: 12px;
  margin-left: auto;
`;

export const MemberListEmpty = styled.div`
  color: #aaa;
  text-align: center;
  padding: 20px;
`;

export const MemberListModalClose = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: 0;
  font-size: 22px;
  cursor: pointer;
`;
