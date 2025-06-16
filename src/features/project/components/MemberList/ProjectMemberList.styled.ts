import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background-color: #ffffff;
`;

export const Section = styled.div`
  margin-bottom: 24px;
`;

export const SectionTitle = styled.h2`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
`;

export const UnifiedCompanyRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

export const CompanyGroup = styled.div`
  flex: 1;
`;

export const CompanyList = styled.div<{ count: number }>`
  display: flex;
  gap: 16px;

  & > div {
    flex: ${({ count }) => (count === 1 ? '0 0 50%' : count === 2 ? '0 0 33.33%' : '0 0 100%')};
  }
`;

export const CompanyCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 12px;
  background-color: #f9fafb;
  width: 100%;
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
`;

export const Name = styled.span`
  font-weight: 500;
`;

export const Role = styled.span`
  font-size: 12px;
  color: #6b7280;
`;
