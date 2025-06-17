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
  gap: 20px;
  max-width: 960px;
  width: 100%;
  padding: 20px 16px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  justify-content: center;
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
  min-width: 56px;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 2px;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const StepIcon = styled.div<{ active?: boolean; complete?: boolean }>`
  background: ${({ complete, active }) =>
    complete ? "#10b981" : active ? "#f59e0b" : "#e5e7eb"};
  color: white;
  border-radius: 50%;
  padding: 8px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  box-shadow: none;
  transition: all 0.2s ease;
  position: relative;
`;

export const StepLine = styled.div<{ active?: boolean; complete?: boolean }>`
  height: 2px;
  background: ${({ complete, active }) =>
    complete ? "#10b981" : active ? "#f59e0b" : "#e5e7eb"};
  flex: 1;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
  align-self: flex-start;
  margin-top: 19px;
`;

export const StepTitle = styled.div<{ active?: boolean; complete?: boolean }>`
  font-weight: 500;
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0;
  transition: all 0.2s ease;
`;

export const StepStatus = styled.div<{ active?: boolean; complete?: boolean }>`
  font-size: 0.8rem;
  color: ${({ active, complete }) =>
    complete ? "#10b981" : active ? "#f59e0b" : "#9ca3af"};
  font-weight: 500;
  transition: all 0.2s ease;
`;
