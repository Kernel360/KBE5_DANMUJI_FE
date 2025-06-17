import React from "react";
import {
  Wrapper,
  StepContainer,
  StepItem,
  StepIcon,
  StepLine,
  StepTitle,
  StepStatus,
} from "./ProjectProgress.styled";

import {
  FaCheckCircle,
  FaPaintBrush,
  FaCode,
  FaClipboardList,
  FaSearch,
  FaFlag,
} from "react-icons/fa";

const steps = [
  { label: "기획", icon: FaCheckCircle, key: "plan", status: "완료" },
  { label: "디자인", icon: FaPaintBrush, key: "design", status: "진행중" },
  { label: "개발", icon: FaCode, key: "dev", status: "대기" },
  { label: "테스트", icon: FaClipboardList, key: "test", status: "대기" },
  { label: "검수", icon: FaSearch, key: "review", status: "대기" },
  { label: "완료", icon: FaFlag, key: "done", status: "대기" },
];

const currentStep = "design";

const ProjectProgress = () => {
  let reached = true;

  return (
    <Wrapper>
      <StepContainer>
        {steps.map((step, index) => {
          const active = step.key === currentStep;
          const complete = reached && !active;
          if (active) reached = false;

          const Icon = step.icon;
          const iconColor = complete || active ? "#ffffff" : "#9ca3af";

          return (
            <React.Fragment key={step.key}>
              <StepItem active={active} complete={complete}>
                <StepIcon active={active} complete={complete}>
                  <Icon size={18} color={iconColor} />
                </StepIcon>
                <StepTitle active={active} complete={complete}>
                  {step.label}
                </StepTitle>
                <StepStatus active={active} complete={complete}>
                  {complete ? "완료" : active ? "진행중" : "대기"}
                </StepStatus>
              </StepItem>
              {index !== steps.length - 1 && (
                <StepLine active={active} complete={complete} />
              )}
            </React.Fragment>
          );
        })}
      </StepContainer>
    </Wrapper>
  );
};

export default ProjectProgress;
