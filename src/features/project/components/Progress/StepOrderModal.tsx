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
  CancelButton,
  SaveButton,
  AddStepButton,
  AddStepInput,
  StepOrderNumber,
  EditIcon,
  TrashIcon,
} from "./StepOrderModal.styled";

import { FaGripVertical, FaPlus, FaTimes, FaTrashAlt } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";

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
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [newStepName, setNewStepName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const editingInputRef = useRef<HTMLInputElement>(null);

  const handleDragStart = (idx: number) => setDragIndex(idx);

  const handleDrop = () => {
    if (
      dragIndex === null ||
      dragOverIndex === null ||
      dragIndex === dragOverIndex
    ) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const updated = [...stepList];
    let insertAt = dragOverIndex;
    if (dragIndex < dragOverIndex) insertAt--;
    const [removed] = updated.splice(dragIndex, 1);
    updated.splice(insertAt, 0, removed);
    setStepList(updated);
    setDragIndex(null);
    setDragOverIndex(null);
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

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>단계 수정</ModalTitle>
          <ModalDescription>
            단계의 순서를 변경하고, 이름을 수정하거나 삭제할 수 있습니다.
          </ModalDescription>
        </ModalHeader>

        <StepList>
          {stepList.map((step, idx) => {
            const isDragging = dragIndex === idx;
            const isDropTarget = dragOverIndex === idx && dragIndex !== idx;
            const { text, color, bg } = getStatusStyle(step.projectStepStatus);
            const tempList = [...stepList];
            if (
              isDropTarget &&
              dragIndex !== null &&
              dragOverIndex !== null
            ) {
              const [removed] = tempList.splice(dragIndex, 1);
              let insertAt = dragOverIndex;
              if (dragIndex < dragOverIndex) insertAt--;
              tempList.splice(insertAt, 0, removed);
            }
            return (
              <div
                key={step.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverIndex(idx);
                }}
                onDrop={handleDrop}
              >
                {isDropTarget && (
                  <StepItem style={{ opacity: 0.5 }}>
                    <StepLeft>
                      <StepOrderNumber>{idx + 1}</StepOrderNumber>
                      <FaGripVertical size={13} color="#fbbf24" />
                      <StepName>{stepList[dragIndex!] && stepList[dragIndex!].name}</StepName>
                    </StepLeft>
                  </StepItem>
                )}
                <StepItem
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setDragOverIndex(null);
                  }}
                  isDragging={isDragging}
                >
                  <StepLeft>
                    <StepOrderNumber>{idx + 1}</StepOrderNumber>
                    <FaGripVertical size={13} color={isDragging ? "#fbbf24" : "#d1d5db"} />
                    {editingIdx === idx ? (
                      <AddStepInput
                        ref={editingInputRef}
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onBlur={() => {
                          const name = editingName.trim();
                          if (name) {
                            setStepList((list) =>
                              list.map((s, i) => (i === idx ? { ...s, name } : s))
                            );
                          }
                          setEditingIdx(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const name = editingName.trim();
                            if (name) {
                              setStepList((list) =>
                                list.map((s, i) => (i === idx ? { ...s, name } : s))
                              );
                            }
                            setEditingIdx(null);
                          } else if (e.key === "Escape") {
                            setEditingIdx(null);
                          }
                        }}
                        maxLength={20}
                        autoFocus
                      />
                    ) : (
                      <>
                        <StepName>{step.name}</StepName>
                        <EditIcon>
                          <RiEdit2Fill
                            size={15}
                            title="이름 수정"
                            onClick={() => {
                              setEditingIdx(idx);
                              setEditingName(step.name);
                              setTimeout(() => editingInputRef.current?.focus(), 0);
                            }}
                          />
                        </EditIcon>
                      </>
                    )}
                  </StepLeft>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <StepStatusBadge
                      clickable={step.projectStepStatus === "IN_PROGRESS"}
                      title={
                        step.projectStepStatus === "IN_PROGRESS"
                          ? "클릭하면 완료로 변경"
                          : undefined
                      }
                      onClick={() => {
                        if (step.projectStepStatus === "IN_PROGRESS") {
                          setStepList((list) =>
                            list.map((s, i) =>
                              i === idx
                                ? { ...s, projectStepStatus: "COMPLETED" }
                                : s
                            )
                          );
                        }
                      }}
                      style={{ backgroundColor: bg, color }}
                    >
                      {text}
                    </StepStatusBadge>
                    <TrashIcon>
                      <FaTrashAlt
                        size={14}
                        color="#e11d48"
                        title="단계 삭제"
                        onClick={() => {
                          if (window.confirm("정말 삭제할까요?")) {
                            setStepList(stepList.filter((_, i) => i !== idx));
                          }
                        }}
                      />
                    </TrashIcon>
                  </div>
                </StepItem>
              </div>
            );
          })}

          {!adding && (
            <AddStepButton type="button" onClick={handleAddStep}>
              <FaPlus size={14} /> 단계 추가
            </AddStepButton>
          )}

          {adding && (
            <StepItem>
              <StepLeft>
                <FaGripVertical size={14} color="#d1d5db" />
                <AddStepInput
                  ref={inputRef}
                  value={newStepName}
                  onChange={(e) => setNewStepName(e.target.value)}
                  onBlur={handleAddStepConfirm}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddStepConfirm();
                    if (e.key === "Escape") {
                      setAdding(false);
                      setNewStepName("");
                    }
                  }}
                  placeholder="새 단계 이름"
                  maxLength={20}
                />
                <FaTimes
                  size={13}
                  color="#bdbdbd"
                  style={{ marginLeft: 6, cursor: "pointer" }}
                  onMouseDown={() => {
                    setAdding(false);
                    setNewStepName("");
                  }}
                />
              </StepLeft>
            </StepItem>
          )}
        </StepList>

        <DragGuide>드래그로 순서를 변경할 수 있습니다.</DragGuide>

        <ModalFooter>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <SaveButton onClick={() => onSave?.(stepList)}>저장</SaveButton>
        </ModalFooter>
      </ModalBox>
    </ModalOverlay>
  );
};

export default StepOrderModal;
