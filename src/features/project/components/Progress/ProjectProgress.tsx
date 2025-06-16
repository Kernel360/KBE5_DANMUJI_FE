import {
  Wrapper,
  StepContainer,
  StepItem,
  StepIcon,
  StepLine
} from './ProjectProgress.styled';

import { FaCheckCircle, FaPaintBrush, FaCode, FaClipboardList, FaSearch, FaFlag } from 'react-icons/fa';

const steps = [
  { label: '기획', icon: <FaCheckCircle />, key: 'plan' },
  { label: '디자인', icon: <FaPaintBrush />, key: 'design' },
  { label: '개발', icon: <FaCode />, key: 'dev' },
  { label: '테스트', icon: <FaClipboardList />, key: 'test' },
  { label: '검수', icon: <FaSearch />, key: 'review' },
  { label: '완료', icon: <FaFlag />, key: 'done' },
];

const currentStep = 'test';

const ProjectProgress = () => {
  let reached = true;

  return (
    <Wrapper>
      <StepContainer>
        {steps.map((step, index) => {
          const active = step.key === currentStep;
          const complete = reached && !active;
          if (active) reached = false;

          return (
            <>
              <StepItem key={step.key} active={active} complete={complete}>
                <StepIcon active={active} complete={complete}>{step.icon}</StepIcon>
                {step.label}
              </StepItem>
              {index !== steps.length - 1 && <StepLine complete={complete}/>}
            </>
          );
        })}
      </StepContainer>
    </Wrapper>
  );
};

export default ProjectProgress;