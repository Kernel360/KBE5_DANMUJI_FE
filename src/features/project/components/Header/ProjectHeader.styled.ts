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

export const ProjectStatusBadge = styled.div<{ status: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${({ status }) => {
    switch (status) {
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
`;

// 프로젝트 부제목
export const ProjectSubtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 16px 24px;
  line-height: 1.5;
`;
