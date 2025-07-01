import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f9fafb;
`;

export const MainContentWrapper = styled.div`
  max-width: 1200px;
  margin: 40px 48px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 32px 40px;
`;

export const ProjectDetailSection = styled.section`
  margin-bottom: 32px;
`;

export const ProjectHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
`;

export const ProjectHeaderContent = styled.div`
  position: relative;
  z-index: 1;
`;

export const ProjectTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ProjectDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin: 0 0 20px 0;
  line-height: 1.6;
  max-width: 600px;
`;

export const ProjectMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
`;

export const ProjectPeriod = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

export const ProjectStatusBadge = styled.div<{ status: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  background: ${({ status }) => {
    switch (status) {
      case "COMPLETED":
        return "rgba(34, 197, 94, 0.2)";
      case "IN_PROGRESS":
        return "rgba(59, 130, 246, 0.2)";
      case "DELAYED":
        return "rgba(239, 68, 68, 0.2)";
      default:
        return "rgba(255, 255, 255, 0.15)";
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case "COMPLETED":
        return "#22c55e";
      case "IN_PROGRESS":
        return "#3b82f6";
      case "DELAYED":
        return "#ef4444";
      default:
        return "white";
    }
  }};
  border: 1px solid
    ${({ status }) => {
      switch (status) {
        case "COMPLETED":
          return "rgba(34, 197, 94, 0.3)";
        case "IN_PROGRESS":
          return "rgba(59, 130, 246, 0.3)";
        case "DELAYED":
          return "rgba(239, 68, 68, 0.3)";
        default:
          return "rgba(255, 255, 255, 0.2)";
      }
    }};
  backdrop-filter: blur(10px);
`;

export const ProjectInfoSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

export const InfoCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
`;

export const InfoCardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.2rem;
`;

export const InfoCardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

export const InfoCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
`;

export const InfoLabel = styled.span`
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
`;

export const InfoValue = styled.span`
  font-size: 1rem;
  color: #111827;
  font-weight: 600;
  text-align: right;
`;

export const InfoValueHighlight = styled(InfoValue)`
  color: #3b82f6;
  background: #eff6ff;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
`;

export const ProjectStepsContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const StepsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
`;

export const StepsTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StepsList = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 8px 0;
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  background: #e5e7eb;
  border-radius: 6px;
  height: 12px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: #4f46e5;
  width: ${(props) => props.progress}%;
  border-radius: 6px;
  transition: width 0.4s;
`;

export const ProgressLabel = styled.span`
  font-size: 0.95rem;
  color: #4f46e5;
  font-weight: 700;
  margin-left: 8px;
`;

export const TabsContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 24px;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  padding: 16px 32px;
  border: none;
  background: transparent;
  font-size: 1.25rem;
  font-weight: ${(props) => (props.$active ? 700 : 500)};
  color: ${(props) => (props.$active ? "#4f46e5" : "#6b7280")};
  border-bottom: ${(props) => (props.$active ? "3px solid #4f46e5" : "none")};
  cursor: pointer;
  transition: color 0.2s;
`;

export const TabContent = styled.div`
  padding: 32px 0;
`;

export const StepItem = styled.span<{ projectStepStatus: string }>`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${(props) => {
    switch (props.projectStepStatus) {
      case "PENDING":
        return "#22223b";
      case "IN_PROGRESS":
        return "#22c55e";
      case "COMPLETED":
        return "#3b82f6";
      default:
        return "#22223b";
    }
  }};
`;

export const StepDivider = styled.span`
  color: #6b7280;
  font-weight: 500;
  margin: 0 4px;
`;

export const EditButton = styled.button`
  background: none;
  border: none;
  color: #4f46e5;
  cursor: pointer;
  font-size: 0.9rem;
  margin-left: 12px;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background: #f3f4f6;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #22223b;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;

  &:hover {
    color: #22223b;
  }
`;

export const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StepInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StepOrder = styled.span`
  font-weight: 600;
  color: #4f46e5;
`;

export const StepName = styled.span`
  font-size: 1rem;
  color: #22223b;
`;

export const StepActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionButton = styled.button<{
  variant?: "edit" | "delete" | "add" | "approve" | "reject";
}>`
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;

  ${(props) => {
    switch (props.variant) {
      case "edit":
        return `
          background: #e0e7ff;
          color: #4f46e5;
          &:hover {
            background: #c7d2fe;
          }
        `;
      case "delete":
        return `
          background: #fee2e2;
          color: #ef4444;
          &:hover {
            background: #fecaca;
          }
        `;
      case "add":
        return `
          background: #4f46e5;
          color: white;
          &:hover {
            background: #4338ca;
          }
        `;
      case "approve":
        return `
          background: #dcfce7;
          color: #22c55e;
          &:hover {
            background: #bbf7d0;
          }
        `;
      case "reject":
        return `
          background: #fee2e2;
          color: #ef4444;
          &:hover {
            background: #fecaca;
          }
        `;
      default:
        return "";
    }
  }}
`;

export const AddStepButton = styled(ActionButton)`
  margin-top: 16px;
  width: 100%;
  padding: 12px;
  font-size: 1rem;
`;

export const HistoryStepList = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding: 8px 0;
`;

export const HistoryStepItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  min-width: 200px;
  border: 1px solid #e5e7eb;
`;

export const HistoryStepHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HistoryStepName = styled.span`
  font-weight: 600;
  color: #22223b;
`;

export const HistoryStepApprover = styled.span`
  font-size: 0.9rem;
  color: #6b7280;
`;

export const HistoryStepActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

export const AddStepModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormLabel = styled.label`
  font-weight: 500;
  color: #374151;
`;

export const FormInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.1);
  }
`;

export const FormSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
`;

export const ModalStepItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
`;

export const CurrentApprover = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 8px;
`;

export const StatusBadge = styled.div<{ color: string }>`
  padding: 4px 12px;
  border-radius: 16px;
  background-color: ${(props) =>
    props.color === "green" ? "#e6f4ea" : "#f5f5f5"};
  color: ${(props) => (props.color === "green" ? "#1e7e34" : "#666")};
  font-size: 14px;
  font-weight: 500;
`;
