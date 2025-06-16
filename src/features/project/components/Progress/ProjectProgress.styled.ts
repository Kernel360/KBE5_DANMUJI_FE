import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: center;
`;

export const StepContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 800px;
  width: 100%;
`;

export const StepItem = styled.div<{ active?: boolean; complete?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ active, complete }) =>
        complete ? '#10b981' : active ? '#f59e0b' : '#9ca3af'};
  font-weight: ${({ active }) => (active ? '600' : '400')};
  font-size: 16px;
  position: relative;
`;

export const StepIcon = styled.div<{ active?: boolean; complete?: boolean }>`
  background-color: ${({ active, complete }) =>
        complete ? '#10b981' : active ? '#f59e0b' : '#9ca3af'};
  color: white;
  border-radius: 50%;
  padding: 6px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
`;

export const StepLine = styled.div<{ complete?: boolean }>`
  height: 2px;
  background-color: ${({ complete }) => complete ? '#10b981' : '#9ca3af'};
  flex: 1;
`;
