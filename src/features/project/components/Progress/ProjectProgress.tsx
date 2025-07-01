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
  FaList,
  FaPen,
} from "react-icons/fa";
import type { ProjectDetailResponse } from "../../services/projectService";
import StepOrderModal from "./StepOrderModal";

interface ProjectProgressProps {
  projectDetail: ProjectDetailResponse;
  onStepSelect?: (stepId: number) => void;
  selectedStepId?: number;
  canEditStep?: boolean;
}

const ProjectProgress: React.FC<ProjectProgressProps> = ({
  projectDetail,
  onStepSelect,
  selectedStepId,
  canEditStep,
}) => {
  const [isStepOrderModalOpen, setStepOrderModalOpen] = React.useState(false);

  // 스텝 상태에 따른 아이콘 매핑
  const getStepIcon = (stepName: string) => {
    const name = stepName.toLowerCase();
    if (name.includes("요구사항") || name.includes("기획")) return FaList;
    if (name.includes("설계") || name.includes("디자인")) return FaPaintBrush;
    if (name.includes("개발") || name.includes("구현")) return FaCode;
    if (name.includes("테스트")) return FaClipboardList;
    if (name.includes("검수") || name.includes("검토")) return FaSearch;
    if (name.includes("완료") || name.includes("배포")) return FaFlag;
    return FaCheckCircle; // 기본 아이콘
  };

  // 스텝 상태 텍스트 변환
  const getStepStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "완료";
      case "IN_PROGRESS":
        return "진행중";
      case "PENDING":
        return "";
      default:
        return status;
    }
  };

  // 현재 진행 중인 스텝 찾기
  const getCurrentStepIndex = () => {
    return projectDetail.steps.findIndex(
      (step) => step.projectStepStatus === "IN_PROGRESS"
    );
  };

  const currentStepIndex = getCurrentStepIndex();

  const steps = [...projectDetail.steps].sort(
    (a, b) => a.stepOrder - b.stepOrder
  );

  // 스텝 클릭 핸들러
  const handleStepClick = (stepId: number) => {
    if (onStepSelect) {
      onStepSelect(stepId);
    }
  };

  return (
    <Wrapper style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}>
        {canEditStep && (
          <button
            onClick={() => setStepOrderModalOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 20,
            }}
            title="단계 수정"
          >
            <FaPen size={18} color="#6b7280" />
          </button>
        )}
      </div>
      <StepContainer>
        {steps.map((step, index) => {
          const isActive = step.projectStepStatus === "IN_PROGRESS";
          const isComplete = step.projectStepStatus === "COMPLETED";
          const isReached = index <= currentStepIndex || isComplete;
          const isSelected = selectedStepId === step.id;

          const Icon = getStepIcon(step.name);

          return (
            <React.Fragment key={step.id}>
              <StepItem
                $active={isActive || isSelected}
                complete={isComplete}
                selected={isSelected}
                onClick={() => handleStepClick(step.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleStepClick(step.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`${step.name} 단계 선택`}
              >
                <StepIcon
                  $active={isActive || isSelected}
                  complete={isComplete}
                >
                  <Icon size={18} />
                </StepIcon>
                <StepTitle
                  $active={isActive || isSelected}
                  complete={isComplete}
                >
                  {step.name}
                </StepTitle>
                <StepStatus
                  $active={isActive || isSelected}
                  complete={isComplete}
                >
                  {getStepStatusText(step.projectStepStatus)}
                </StepStatus>
              </StepItem>
              {index !== steps.length - 1 && (
                <StepLine $active={isActive} complete={isComplete} />
              )}
            </React.Fragment>
          );
        })}
      </StepContainer>
      {isStepOrderModalOpen && (
        <StepOrderModal
          projectId={projectDetail.id}
          onClose={() => setStepOrderModalOpen(false)}
          onSaved={() => {
            setStepOrderModalOpen(false);
            window.location.reload();
          }}
        />
      )}
    </Wrapper>
  );
};

export default ProjectProgress;
