import styled from 'styled-components';

export const Wrapper = styled.div`
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  padding: 32px;
  display: flex;
  flex-direction: column;
`;

export const HeaderTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 20px;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const InfoItem = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 1rem;
  color: #374151;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;