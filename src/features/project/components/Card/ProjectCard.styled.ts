import styled from "styled-components";

export const ProjectCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 0 0 12px 0;
  display: flex;
  flex-direction: column;
  min-width: 240px;
  max-width: 320px;
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 8px 16px;
  border-bottom: 1px solid #f3f4f6;
`;

export const CardTitle = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
`;

export const CardBadges = styled.div`
  display: flex;
  gap: 6px;
`;

export const Badge = styled.span<{ $color: string }>`
  background: none;
  color: ${({ $color }) => $color};
  font-size: 0.85rem;
  padding: 0 6px;
  border-radius: 12px;
  font-weight: 700;
  box-shadow: none;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const CardBody = styled.div`
  padding: 10px 16px 0 16px;
`;

export const CardInfoGroup = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
  color: #4b5563;
  margin-bottom: 7px;
  line-height: 1.4;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const CardProgress = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;

  span {
    font-size: 0.875rem;
    color: #6b7280;
    margin-right: 8px;
  }

  progress {
    width: 100%;
    height: 8px;
    margin: 8px 0;
    border-radius: 4px;
    background-color: #f3f4f6;

    &::-webkit-progress-bar {
      background-color: #f3f4f6;
      border-radius: 4px;
    }

    &::-webkit-progress-value {
      background-color: #fbbf24;
      border-radius: 4px;
    }
  }
`;

export const CardFooter = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding: 10px 16px 0 16px;
  margin-top: auto;
`;

export const DetailButton = styled.button`
  background: #fff;
  color: #fbbf24;
  border: 2px solid #fbbf24;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 0.938rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #fbbf24;
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(251, 191, 36, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ManagerButton = styled.button`
  background: #fbbf24;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 0.938rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(251, 191, 36, 0.2);

  &:hover {
    background: #f59e0b;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(251, 191, 36, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;
