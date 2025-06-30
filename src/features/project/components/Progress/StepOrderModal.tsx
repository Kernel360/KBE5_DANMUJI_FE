import React, { useState, useRef } from "react";
import {
  ModalOverlay,
  ModalBox,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  StepList,
  StepItem,
  StepLeft,
  StepName,
  StepStatusBadge,
  ModalFooter,
  DragGuide,
  Button,
  CancelButton,
  SaveButton,
} from "./StepOrderModal.styled";
import { FaGripVertical } from "react-icons/fa";

interface Step {
  id: number;
  name: string;
  projectStepStatus: "COMPLETED" | "IN_PROGRESS" | "PENDING";
}

interface StepOrderModalProps {
  steps: Step[];
  onClose: () => void;
  onSave?: (steps: Step[]) => void;
}

const getStatusStyle = (status: Step["projectStepStatus"]) => {
  switch (status) {
    case "COMPLETED":
      return { text: "완료", color: "#15803d", bg: "#ecfdf5" };
    case "IN_PROGRESS":
      return { text: "진행중", color: "#b45309", bg: "#fef3c7" };
    case "PENDING":
    default:
      return { text: "예정", color: "#6b7280", bg: "#f3f4f6" };
  }
};

const StepOrderModal: React.FC<StepOrderModalProps> = ({ steps, onClose, onSave }) => {
  const [stepList, setStepList] = useState(steps);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  const handleDragStart = (idx: number) => setDragIndex(idx);
  const handleDragEnter = (idx: number) => {
    dragOverIndex.current = idx;
  };
  const handleDragEnd = () => {
    if (
      dragIndex === null ||
      dragOverIndex.current === null ||
      dragIndex === dragOverIndex.current
    ) {
      setDragIndex(null);
      dragOverIndex.current = null;
      return;
    }
    const updated = [...stepList];
    const [removed] = updated.splice(dragIndex, 1);
    updated.splice(dragOverIndex.current, 0, removed);
    setStepList(updated);
    setDragIndex(null);
    dragOverIndex.current = null;
  };

  return (
    <ModalOverlay>
      <ModalBox>
        <ModalHeader>
          <ModalTitle>단계 순서 변경</ModalTitle>
          <ModalDescription>단계를 드래그하여 순서를 변경할 수 있습니다.</ModalDescription>
        </ModalHeader>
        <StepList>
          {stepList.map((step, idx) => {
            const isDragging = dragIndex === idx;
            const { text, color, bg } = getStatusStyle(step.projectStepStatus);
            return (
              <StepItem
                key={step.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragEnter={() => handleDragEnter(idx)}
                onDragEnd={handleDragEnd}
                isDragging={isDragging}
              >
                <StepLeft>
                  <FaGripVertical size={14} color="#9ca3af" />
                  <StepName>{step.name}</StepName>
                </StepLeft>
                <StepStatusBadge style={{ backgroundColor: bg, color }}>{text}</StepStatusBadge>
              </StepItem>
            );
          })}
        </StepList>
        <DragGuide>
          <FaGripVertical size={12} color="#9ca3af" />
          단계를 드래그하여 위아래로 이동할 수 있습니다.
        </DragGuide>
        <ModalFooter>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <SaveButton onClick={() => onSave?.(stepList)}>저장</SaveButton>
        </ModalFooter>
      </ModalBox>
    </ModalOverlay>
  );
};

export default StepOrderModal;
