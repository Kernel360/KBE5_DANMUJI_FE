import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const ModalBox = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px 28px 24px;
  width: min(480px, 92vw);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ModalHeader = styled.div``;

export const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
`;

export const ModalDescription = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

export const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const StepItem = styled.div<{ isDragging: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 10px;
  background-color: #ffffff;
  border: ${({ isDragging }) => (isDragging ? "2px solid #facc15" : "1px solid #e5e7eb")};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  cursor: grab;
  transition: all 0.2s ease;
`;

export const StepLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StepName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
`;

export const StepStatusBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
`;

export const DragGuide = styled.div`
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

export const Button = styled.button`
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
`;

export const CancelButton = styled(Button)`
  background: #f9fafb;
  color: #111827;
  border: 1px solid #d1d5db;
`;

export const SaveButton = styled(Button)`
  background: #facc15;
  color: #1f2937;
  border: none;
  box-shadow: 0 2px 8px rgba(234, 179, 8, 0.3);
`;
