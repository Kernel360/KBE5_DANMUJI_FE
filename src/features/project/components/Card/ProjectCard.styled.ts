import styled from "styled-components";

export const ProjectCard = styled.div<{ $status?: string }>`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 0 0 12px 0;
  display: flex;
  flex-direction: column;
  min-width: 220px;
  max-width: 100%;
  width: 100%;
  flex: 1 1 0;
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  border: ${({ $status }) =>
    $status === "DELAYED"
      ? "2px solid #ef4444"
      : $status === "DUE_SOON"
      ? "2px solid #f59e0b"
      : "1px solid transparent"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 900px) {
    min-width: 180px;
    max-width: 100%;
    flex-basis: 48%;
  }

  @media (max-width: 600px) {
    min-width: 120px;
    max-width: 100%;
    flex-basis: 100%;
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
      background-image: linear-gradient(
        90deg,
        #60a5fa 0%,
        #a78bfa 50%,
        #f472b6 100%
      );
      border-radius: 4px;
      transition: background-image 0.3s;
    }

    &::-moz-progress-bar {
      background-image: linear-gradient(
        90deg,
        #60a5fa 0%,
        #a78bfa 50%,
        #f472b6 100%
      );
      border-radius: 4px;
      transition: background-image 0.3s;
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

export const StageButton = styled.button`
  background: #fdb924;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 0.92rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.18s;
  height: 32px;
  min-width: 0;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.07);
  &:hover {
    background: #fbbf24;
    color: #fff;
    border-color: transparent;
    box-shadow: 0 2px 8px 0 rgba(253, 185, 36, 0.12);
  }
`;
