import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 32px 0 0 0;
  margin: 0;
  background: #fff;
  border: none;
  box-shadow: none;
  display: flex;
  justify-content: center;
`;

export const StepContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 960px;
  width: 100%;
  padding: 0 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: none;
  justify-content: center;
`;

export const StepItem = styled.div<{
  $active?: boolean;
  $complete?: boolean;
  selected?: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: ${({ $active, $complete }) =>
    $complete ? "#10b981" : $active ? "#f59e0b" : "#9ca3af"};
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  font-size: 15px;
  position: relative;
  min-width: 56px;
  cursor: pointer;
  gap: 2px;
  padding: 8px;
  border-radius: 8px;
  outline: none;
  border: 2px solid transparent;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f9fafb;
    border-color: #e5e7eb;
    transform: translateY(-1px);
  }

  &:focus {
    background-color: #f3f4f6;
    border-color: #d1d5db;
    outline: none;
  }
`;

export const StepIcon = styled.div<{ $active?: boolean; $complete?: boolean }>`
  background: ${({ $complete, $active }) =>
    $complete ? "#10b981" : $active ? "#f59e0b" : "#e5e7eb"};
  color: white;
  border-radius: 50%;
  padding: 8px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  box-shadow: ${({ $active }) => ($active ? "0 0 0 3px #fef3c7" : "none")};
  transition: all 0.2s ease;
  position: relative;

  svg {
    color: ${({ $complete, $active }) =>
      $complete || $active ? "#ffffff" : "#9ca3af"};
    transition: color 0.2s ease;
  }
`;

export const StepLine = styled.div<{ $active?: boolean; $complete?: boolean }>`
  height: 2px;
  background: ${({ $complete, $active }) =>
    $complete ? "#10b981" : $active ? "#f59e0b" : "#e5e7eb"};
  flex: 1;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
  align-self: center;
  margin-bottom: 25px;
  transition: all 0.2s ease;
`;

export const StepTitle = styled.div<{ $active?: boolean; $complete?: boolean }>`
  font-weight: 500;
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 0;
  transition: all 0.2s ease;
`;

export const StepStatus = styled.div<{ $active?: boolean; $complete?: boolean }>`
  font-size: 0.8rem;
  color: ${({ $active, $complete }) =>
    $complete ? "#10b981" : $active ? "#f59e0b" : "#9ca3af"};
  font-weight: 500;
  transition: all 0.2s ease;
`;
