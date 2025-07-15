import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const ModalBox = styled.div`
  background: #fff;
  width: 520px;
  padding: 22px 20px 18px 20px;
  border-radius: 10px;
`;

export const ModalHeader = styled.div`
  margin-bottom: 30px;
`;

export const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
  padding-left: 16px;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 1.4rem;
    background: #fdb924;
    border-radius: 2px;
  }
`;

export const ModalDescription = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
`;

export const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 15px;
`;

export const StepItem = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDragging" && prop !== "isDropTarget",
})<{ isDragging?: boolean; isDropTarget?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ isDragging, isDropTarget }) =>
    isDragging ? "#fde68a" : isDropTarget ? "#dbeafe" : "#fff"};
  border: ${({ isDragging, isDropTarget }) =>
    isDragging
      ? "2.5px solid #fbbf24"
      : isDropTarget
      ? "2.5px solid #2563eb"
      : "1.5px solid #e5e7eb"};
  box-shadow: ${({ isDragging, isDropTarget }) =>
    isDragging
      ? "0 6px 24px 0 #fbbf2477, 0 0 0 5px #fde68a88"
      : isDropTarget
      ? "0 4px 16px 0 #2563eb33, 0 0 0 4px #dbeafe88"
      : "none"};
  opacity: ${({ isDragging, isDropTarget }) =>
    isDragging ? 0.97 : isDropTarget ? 0.95 : 1};
  transform: ${({ isDragging, isDropTarget }) =>
    isDragging ? "scale(1.06)" : isDropTarget ? "scale(1.02)" : "none"};
  z-index: ${({ isDragging, isDropTarget }) =>
    isDragging ? 20 : isDropTarget ? 15 : 1};
  min-height: 48px;
  border-radius: 7px;
  padding: 8px 13px;
  transition: transform 0.38s cubic-bezier(0.22, 0.61, 0.36, 1),
    box-shadow 0.18s, background 0.18s, border 0.18s, opacity 0.18s;
  margin-bottom: 1px;
  cursor: ${({ isDragging }) => (isDragging ? "grabbing" : "grab")};
`;

export const StepLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
`;

export const StepName = styled.span`
  font-size: 15px;
  font-weight: 500;
  margin-left: 4px;
  margin-right: 2px;
`;

export const StepStatusBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "clickable",
})<{ clickable?: boolean }>`
  font-size: 13px;
  padding: 2px 10px;
  border-radius: 7px;
  border: ${({ clickable }) => (clickable ? "1px solid #fde68a" : "none")};
  cursor: ${({ clickable }) => (clickable ? "pointer" : "default")};
  opacity: ${({ clickable }) => (clickable ? 1 : 0.85)};
  transition: background 0.15s, color 0.15s;
`;

export const DragGuide = styled.div`
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 10px 0;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 6px;
`;

export const CancelButton = styled.button`
  background: #f3f4f6;
  color: #23272f;
  cursor: pointer;
  padding: 8px 22px;
  font-size: 15px;
  border-radius: 7px;
  border: none;
`;

export const SaveButton = styled.button`
  background: #fbbf24;
  color: #fff;
  cursor: pointer;
  padding: 8px 22px;
  font-size: 15px;
  border-radius: 7px;
  border: none;
`;

export const AddStepButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto 10px auto;
  background: #fef3c7;
  color: #b45309;
  font-weight: 700;
  font-size: 15px;
  border: 1.5px solid #fde68a;
  border-radius: 8px;
  padding: 8px 18px;
  box-shadow: 0 1px 4px #fde68a33;
  cursor: pointer;
`;

export const AddStepInput = styled.input`
  font-size: 15px;
  font-weight: 400;
  border: 1px solid #e5e7eb;
  outline: none;
  background: #f9fafb;
  color: #23272f;
  width: 110px;
  margin-left: 4px;
  border-radius: 6px;
  padding: 3px 7px;
  min-height: 28px;
`;

export const StepOrderNumber = styled.span`
  color: #23272f;
  font-weight: 700;
  font-size: 14px;
  margin-right: 6px;
`;

export const EditIcon = styled.span`
  margin-left: 2px;
  cursor: pointer;
  transition: color 0.15s;
  display: flex;
  align-items: center;
  color: #bdbdbd;
  &:hover {
    color: #6366f1;
  }
`;

export const TrashIcon = styled.span`
  margin-left: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const DropIndicator = styled.div`
  height: 6px;
  background: #fde68a;
  border-radius: 4px;
  margin: 2px 0;
  transition: background 0.15s;
`;
