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
  flex-wrap: wrap;
`;

export const ProjectPeriod = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f3f4f6;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
`;

export const ProjectStatusBadge = styled.div<{ status: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  background: ${({ status }) => {
    switch (status) {
      case "COMPLETED":
        return "#dcfce7";
      case "IN_PROGRESS":
        return "#dbeafe";
      case "DELAYED":
        return "#fee2e2";
      default:
        return "#f3f4f6";
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case "COMPLETED":
        return "#166534";
      case "IN_PROGRESS":
        return "#1e40af";
      case "DELAYED":
        return "#dc2626";
      default:
        return "#374151";
    }
  }};
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

// 프로젝트 정보 카드 섹션
export const ProjectInfoSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

export const InfoCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
`;

export const InfoCardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fbbf24;
  color: white;
  font-size: 1.2rem;
`;

export const InfoCardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

export const InfoCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InfoItemCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
`;

export const InfoLabel = styled.span`
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
`;

export const InfoValue = styled.span`
  font-size: 1rem;
  color: #111827;
  font-weight: 600;
  text-align: right;
`;

export const InfoValueHighlight = styled(InfoValue)`
  color: #3b82f6;
  background: #eff6ff;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
`;
