import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 32px 24px;
  margin: 0 24px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
`;

export const StepContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  max-width: 960px;
  width: 100%;
  padding: 0 16px;
`;

export const StepItem = styled.div<{ active?: boolean; complete?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: ${({ active, complete }) =>
    complete ? "#10b981" : active ? "#f59e0b" : "#9ca3af"};
  font-weight: ${({ active }) => (active ? "600" : "400")};
  font-size: 14px;
  position: relative;
  min-width: 64px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const StepIcon = styled.div<{ active?: boolean; complete?: boolean }>`
  background: ${({ complete, active }) =>
    complete
      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
      : active
      ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
      : "#e5e7eb"};
  color: white;
  border-radius: 50%;
  padding: 12px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  box-shadow: ${({ active, complete }) =>
    active
      ? "0 4px 12px rgba(245, 158, 11, 0.3)"
      : complete
      ? "0 4px 12px rgba(16, 185, 129, 0.3)"
      : "0 2px 4px rgba(0, 0, 0, 0.1)"};
  transition: all 0.2s ease;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: ${({ active, complete }) =>
      active
        ? "linear-gradient(135deg, #f59e0b, #d97706)"
        : complete
        ? "linear-gradient(135deg, #10b981, #059669)"
        : "transparent"};
    opacity: ${({ active, complete }) => (active || complete ? 0.3 : 0)};
    z-index: -1;
  }
`;

export const StepLine = styled.div<{ active?: boolean; complete?: boolean }>`
  height: 3px;
  background: ${({ complete, active }) =>
    complete
      ? "linear-gradient(90deg, #10b981 0%, #059669 100%)"
      : active
      ? "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)"
      : "#e5e7eb"};
  flex: 1;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
  align-self: flex-start;
  margin-top: 24px;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ active, complete }) =>
      active || complete
        ? "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)"
        : "none"};
    animation: ${({ active, complete }) =>
      active || complete ? "shimmer 2s infinite" : "none"};
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

// 단계 제목 스타일 추가
export const StepTitle = styled.div<{ active?: boolean; complete?: boolean }>`
  font-weight: ${({ active, complete }) =>
    active || complete ? "600" : "500"};
  font-size: 0.875rem;
  margin-bottom: 4px;
  transition: all 0.2s ease;
`;

export const StepStatus = styled.div<{ active?: boolean; complete?: boolean }>`
  font-size: 0.75rem;
  color: ${({ active, complete }) =>
    complete ? "#10b981" : active ? "#f59e0b" : "#9ca3af"};
  font-weight: 500;
  transition: all 0.2s ease;
`;
