import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 32px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: center;
  background-color: #f9fafb;
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
        complete ? '#10b981' : active ? '#f59e0b' : '#9ca3af'};
  font-weight: ${({ active }) => (active ? '600' : '400')};
  font-size: 14px;
  position: relative;
  min-width: 64px;
`;

export const StepIcon = styled.div<{ active?: boolean; complete?: boolean }>`
  background-color: ${({ complete, active }) =>
        complete ? '#10b981' : active ? '#f59e0b' : '#e5e7eb'};
  color: white;
  border-radius: 50%;
  padding: 8px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  box-shadow: ${({ active }) => (active ? '0 0 0 3px #fef3c7' : 'none')};
`;

export const StepLine = styled.div<{ active?: boolean; complete?: boolean }>`
  height: 2px;
  background-color: ${({ complete, active }) =>
        complete ? '#10b981' : active ? '#f59e0b' : '#e5e7eb'};
  flex: 1;
`;