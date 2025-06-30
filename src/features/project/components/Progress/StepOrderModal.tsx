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
import { FaGripVertical, FaPlus, FaTimes, FaTrashAlt } from "react-icons/fa";

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
  const [adding, setAdding] = useState(false);
  const [newStepName, setNewStepName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleAddStep = () => {
    setAdding(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  const handleAddStepConfirm = () => {
    const name = newStepName.trim();
    if (name) {
      setStepList([
        ...stepList,
        {
          id: Date.now(),
          name,
          projectStepStatus: "PENDING",
        },
      ]);
    }
    setAdding(false);
    setNewStepName("");
  };
  const handleAddStepCancel = () => {
    setAdding(false);
    setNewStepName("");
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <StepStatusBadge style={{ backgroundColor: bg, color }}>{text}</StepStatusBadge>
                  <FaTrashAlt
                    size={15}
                    color="#e11d48"
                    style={{ cursor: 'pointer', marginLeft: 8 }}
                    title="단계 삭제"
                    onClick={() => {
                      if (window.confirm('정말 삭제할까요?')) {
                        setStepList(stepList.filter((_, i) => i !== idx));
                      }
                    }}
                  />
                </div>
              </StepItem>
            );
          })}
          {adding && (
            <StepItem isDragging={false} style={{ background: "#f9fafb", border: "2px dashed #d1d5db", minWidth: 120, alignItems: "center", justifyContent: "center", gap: 0 }}>
              <StepLeft>
                <FaGripVertical size={14} color="#d1d5db" />
                <input
                  ref={inputRef}
                  value={newStepName}
                  onChange={e => setNewStepName(e.target.value)}
                  onBlur={handleAddStepConfirm}
                  onKeyDown={e => {
                    if (e.key === "Enter") handleAddStepConfirm();
                    if (e.key === "Escape") handleAddStepCancel();
                  }}
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    width: 160,
                    marginLeft: 8,
                  }}
                  placeholder="새 단계 이름"
                  maxLength={20}
                />
                <FaTimes size={13} color="#bdbdbd" style={{ marginLeft: 6, cursor: "pointer" }} onMouseDown={handleAddStepCancel} />
              </StepLeft>
              <StepStatusBadge style={{ backgroundColor: "#f3f4f6", color: "#6b7280" }}>예정</StepStatusBadge>
            </StepItem>
          )}
        </StepList>
        <Button type="button" onClick={handleAddStep} style={{
          display: adding ? "none" : "flex",
          alignItems: "center",
          gap: 8,
          margin: "0 auto 18px auto",
          background: "#f3f4f6",
          color: "#6366f1",
          fontWeight: 700,
          fontSize: 15,
          border: "none",
          borderRadius: 8,
          padding: "10px 22px",
          boxShadow: "0 1px 4px #e5e7eb22",
          cursor: "pointer"
        }}>
          <FaPlus size={14} /> 단계 추가
        </Button>
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
