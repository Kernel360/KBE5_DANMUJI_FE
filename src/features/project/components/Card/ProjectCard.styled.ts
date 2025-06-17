import styled from 'styled-components';

export const ProjectCard = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  padding: 0 0 16px 0;
  display: flex;
  flex-direction: column;
  min-width: 320px;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 0 20px;
`;

export const CardTitle = styled.div`
  font-size: 1.13rem;
  font-weight: 700;
  color: #222;
`;

export const CardBadges = styled.div`
  display: flex;
  gap: 6px;
`;

export const Badge = styled.span<{ $color: string }>`
  background-color: ${({ $color }) => $color};
  color: #fff;
  font-size: 0.75rem;
  padding: 2px 10px;
  border-radius: 999px;
  font-weight: 600;
`;

export const CardBody = styled.div`
  padding: 12px 20px 0 20px;
`;

export const CardInfoGroup = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.98rem;
  color: #444;
  margin-bottom: 6px;
`;

export const CardFooter = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 12px 20px 0 20px;
`;

export const DetailButton = styled.button`
  background: #fff;
  color: #fbbf24;
  border: 1px solid #fbbf24;
  border-radius: 6px;
  padding: 4px 18px;
  font-size: 0.98rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #fbbf24;
    color: #fff;
  }
`;

export const ManagerButton = styled.button`
  background: #fbbf24;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 18px;
  font-size: 0.98rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #f59e0b;
  }
`;
