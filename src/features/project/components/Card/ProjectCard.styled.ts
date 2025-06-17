import styled from "styled-components";

export const ProjectCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 0 0 20px 0;
  display: flex;
  flex-direction: column;
  min-width: 320px;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #f3f4f6;
`;

export const CardTitle = styled.div`
  font-size: 1.17rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.4;
`;

export const CardBadges = styled.div`
  display: flex;
  gap: 8px;
`;

export const Badge = styled.span<{ $color: string }>`
  background-color: ${({ $color }) => $color};
  color: #fff;
  font-size: 0.813rem;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const CardBody = styled.div`
  padding: 20px 24px 0 24px;
`;

export const CardInfoGroup = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.938rem;
  color: #4b5563;
  margin-bottom: 12px;
  line-height: 1.5;

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
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 24px 0 24px;
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
