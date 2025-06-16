// components/Progress/ProjectProgress.tsx
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const StepList = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
  color: #374151;
`;

const ProgressBar = styled.div`
  background: #e5e7eb;
  border-radius: 4px;
  height: 8px;
  overflow: hidden;
`;

const ProgressValue = styled.div`
  background: #3b82f6;
  width: 65%;
  height: 100%;
`;

const Percentage = styled.div`
  margin-top: 4px;
  font-size: 13px;
  color: #6b7280;
`;

const ProjectProgress = () => {
  return (
    <Wrapper>
      <StepList>요구사항 분석 · <strong>설계</strong> · 개발 · 테스트</StepList>
      <ProgressBar><ProgressValue /></ProgressBar>
      <Percentage>프로젝트 진행률: 65%</Percentage>
    </Wrapper>
  );
};

export default ProjectProgress;
