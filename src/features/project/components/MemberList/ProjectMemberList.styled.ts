import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  min-height: 10vh;
  background: rgba(255, 255, 255, 0.8);
  padding: 0 0 0 32px;
`;

export const Inner = styled.div`
  width: 100%;
  max-width: 960px;
  margin-left: 32px;
`;

export const SectionTitle = styled.h2`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    width: 4px;
    height: 20px;
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    border-radius: 2px;
  }
`;

export const UnifiedCompanyRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

export const CompanyGroup = styled.div`
  flex: 1;
`;

export const CompanyList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

export const CompanyCard = styled.div`
  width: 220px; 
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  background-color: #f9fafb;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
    border-color: #fde68a;
  }
`;


export const CompanyHeader = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
  border-bottom: 1px dashed #d1d5db;
  padding-bottom: 2px;
`;

export const MemberCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const MemberRow = styled.div`
  display: flex;
  gap: 6px;
  font-size: 13px;
  color: #111827;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(251, 191, 36, 0.08);
  }
`;

export const Name = styled.span`
  font-weight: 500;
  color: #111827;
`;

export const Position = styled.span`
  font-size: 12px;
  color: #6b7280;
  background: rgba(243, 244, 246, 0.8);
  padding: 2px 8px;
  border-radius: 12px;
`;
