import styled, { keyframes, css } from "styled-components";

const blinkAnimation = keyframes`
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0.3;
  }
`;

const blinkBorderAnimation = keyframes`
  0%, 50% {
    border-color: ${({ $status }: { $status?: string }) =>
      $status === "DELAYED"
        ? "#ef4444"
        : $status === "DUE_SOON"
        ? "#f59e0b"
        : "transparent"};
  }
  51%, 100% {
    border-color: ${({ $status }: { $status?: string }) =>
      $status === "DELAYED"
        ? "#fca5a5"
        : $status === "DUE_SOON"
        ? "#fcd34d"
        : "transparent"};
  }
`;

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
  border: 2px solid transparent;
  ${({ $status }) =>
    ($status === "DELAYED" || $status === "DUE_SOON") &&
    css`
      animation: ${blinkBorderAnimation} 0.8s ease-in-out infinite;
    `}

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

export const Badge = styled.span<{ $color: string; $status?: string }>`
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
  ${({ $status }) =>
    ($status === "DELAYED" || $status === "DUE_SOON") &&
    css`
      animation: ${blinkAnimation} 0.8s ease-in-out infinite;
    `}
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
  background: #ffffff;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 0.92rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  height: 32px;
  min-width: 0;

  &:hover {
    background: #fdb924;
    color: #ffffff;
    border-color: transparent;
  }
`;
