import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f9fafb;
`;

export const MainContentWrapper = styled.div`
  max-width: 1200px;
  margin: 40px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 32px 40px;
`;

export const ProjectDetailSection = styled.section`
  margin-bottom: 32px;
`;

export const ProjectTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #22223b;
  margin-bottom: 8px;
`;

export const ProjectDescription = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
  margin-bottom: 12px;
`;

export const ProjectPeriod = styled.p`
  color: #888;
  font-size: 1rem;
  margin-bottom: 20px;
`;

export const ProjectInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  background: #f6f7fb;
  border-radius: 8px;
  padding: 24px;
`;

export const ProjectInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InfoLabel = styled.span`
  font-size: 1rem;
  color: #6b7280;
  font-weight: 500;
`;

export const InfoValue = styled.span`
  font-size: 1.1rem;
  color: #22223b;
  font-weight: 600;
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
  width: ${props => props.progress}%;
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

export const TabButton = styled.button<{ active: boolean }>`
  padding: 16px 32px;
  border: none;
  background: transparent;
  font-size: 1.25rem;
  font-weight: ${props => (props.active ? 700 : 500)};
  color: ${props => (props.active ? "#4f46e5" : "#6b7280")};
  border-bottom: ${props => (props.active ? "3px solid #4f46e5" : "none")};
  cursor: pointer;
  transition: color 0.2s;
`;

export const TabContent = styled.div`
  padding: 32px 0;
`;

export const ProjectStepsContainer = styled.div`
  margin-top: 24px;
  background: #f6f7fb;
  border-radius: 8px;
  padding: 24px;
`;

export const StepsList = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
  flex-wrap: wrap;
  gap: 8px;
`;

export const StepItem = styled.span<{ projectStepStatus: string }>`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => {
    switch (props.projectStepStatus) {
      case 'PENDING':
        return '#22223b';
      case 'IN_PROGRESS':
        return '#22c55e';
      case 'COMPLETED':
        return '#3b82f6';
      default:
        return '#22223b';
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

export const ActionButton = styled.button<{ variant?: 'edit' | 'delete' | 'add' | 'approve' | 'reject' }>`
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  
  ${props => {
    switch (props.variant) {
      case 'edit':
        return `
          background: #e0e7ff;
          color: #4f46e5;
          &:hover {
            background: #c7d2fe;
          }
        `;
      case 'delete':
        return `
          background: #fee2e2;
          color: #ef4444;
          &:hover {
            background: #fecaca;
          }
        `;
      case 'add':
        return `
          background: #4f46e5;
          color: white;
          &:hover {
            background: #4338ca;
          }
        `;
      case 'approve':
        return `
          background: #dcfce7;
          color: #22c55e;
          &:hover {
            background: #bbf7d0;
          }
        `;
      case 'reject':
        return `
          background: #fee2e2;
          color: #ef4444;
          &:hover {
            background: #fecaca;
          }
        `;
      default:
        return '';
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
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
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