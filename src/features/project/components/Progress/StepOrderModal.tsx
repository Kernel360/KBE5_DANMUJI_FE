import React, { useState, useEffect, useRef } from "react";
import api from "@/api/axios";
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
  projectId: number;
  onClose: () => void;
  onSaved?: () => void;
}

const getStatusStyle = (status: Step["projectStepStatus"]) => {
  switch (status) {
    case "COMPLETED":
      return { text: "완료", color: "#15803d", bg: "#ecfdf5" };
    case "IN_PROGRESS":
      return { text: "진행중", color: "#b45309", bg: "#fef3c7" };
    default:
      return { text: "예정", color: "#6b7280", bg: "#f3f4f6" };
  }
};

const StepOrderModal: React.FC<StepOrderModalProps> = ({ projectId, onClose, onSaved }) => {
  const [stepList, setStepList] = useState<Step[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [newStepName, setNewStepName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const editingInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!projectId) return;
    api.get(`/api/project-steps/${projectId}`)
      .then(res => {
        const sorted = [...res.data.data].sort((a, b) => a.stepOrder - b.stepOrder);
        setStepList(sorted);
      })
      .catch(console.error);
  }, [projectId]);

  const reorderSteps = (newSteps: Step[]) => {
    const ids = newSteps.map(step => step.id);
    api.put(`/api/project-steps/${projectId}/reorder`, ids)
      .then(() => {
        setStepList(newSteps);
        onSaved?.();
      })
      .catch(console.error);
  };

  const createStep = (name: string) => {
    api.post(`/api/project-steps?projectId=${projectId}`, { name })
      .then(() => api.get(`/api/project-steps/${projectId}`))
      .then(res => setStepList(res.data.data))
      .catch(console.error);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (
      dragIndex == null ||
      dragOverIndex == null ||
      dragIndex === dragOverIndex ||
      dragOverIndex === dragIndex + 1 // 바로 뒤에는 드롭 불가
    ) return;

    const updated = [...stepList];
    const [removed] = updated.splice(dragIndex, 1);

    // 뒤로 이동할 때는 dragOverIndex - 1에 삽입
    const insertIndex = dragIndex < dragOverIndex ? dragOverIndex - 1 : dragOverIndex;
    updated.splice(insertIndex, 0, removed);

    setStepList(updated);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDragIndex(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', ''); // 드래그 데이터 설정
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(idx);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleAddStepConfirm = () => {
    const name = newStepName.trim();
    if (!name) return;
    createStep(name);
    setAdding(false);
    setNewStepName("");
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>단계 수정</ModalTitle>
          <ModalDescription>단계의 순서를 변경하고, 이름을 수정하거나 삭제할 수 있습니다.</ModalDescription>
        </ModalHeader>

        <StepList>
          {stepList.map((step, idx) => {
            const isDragging = dragIndex === idx;
            const isDropTarget =
              dragOverIndex === idx &&
              dragIndex !== null &&
              idx !== dragIndex &&
              idx !== dragIndex + 1;
            const { text, color, bg } = getStatusStyle(step.projectStepStatus);

            return (
              <div
                key={step.id}
                onDragOver={e => handleDragOver(e, idx)}
                onDrop={handleDrop}
              >
                {isDropTarget && (
                  <StepItem style={{ opacity: 0.5 }}>
                    <StepLeft>
                      <StepOrderNumber>{idx + 1}</StepOrderNumber>
                      <FaGripVertical size={13} color="#fbbf24" />
                      <StepName>{stepList[dragIndex!].name}</StepName>
                    </StepLeft>
                  </StepItem>
                )}
                <StepItem
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragEnd={handleDragEnd}
                  isDragging={isDragging}
                >
                  <StepLeft>
                    <StepOrderNumber>{idx + 1}</StepOrderNumber>
                    <FaGripVertical size={13} color={isDragging ? "#fbbf24" : "#d1d5db"} />
                    {editingIdx === idx ? (
                      <AddStepInput
                        ref={editingInputRef}
                        value={editingName}
                        onChange={e => setEditingName(e.target.value)}
                        onBlur={() => {
                          const name = editingName.trim();
                          if (name) setStepList(list => list.map((s, i) => i === idx ? { ...s, name } : s));
                          setEditingIdx(null);
                        }}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            const name = editingName.trim();
                            if (name) setStepList(list => list.map((s, i) => i === idx ? { ...s, name } : s));
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
                          <RiEdit2Fill size={15} title="이름 수정" onClick={() => {
                            setEditingIdx(idx);
                            setEditingName(step.name);
                            setTimeout(() => editingInputRef.current?.focus(), 0);
                          }} />
                        </EditIcon>
                      </>
                    )}
                  </StepLeft>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <StepStatusBadge style={{ backgroundColor: bg, color }}>{text}</StepStatusBadge>
                    <TrashIcon>
                      <FaTrashAlt size={14} color="#e11d48" title="단계 삭제" onClick={() => {
                        if (window.confirm("정말 삭제할까요?")) {
                          setStepList(list => list.filter((_, i) => i !== idx));
                        }
                      }} />
                    </TrashIcon>
                  </div>
                </StepItem>
              </div>
            );
          })}

          {!adding && (
            <AddStepButton type="button" onClick={() => setAdding(true)}>
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
                  onChange={e => setNewStepName(e.target.value)}
                  onBlur={handleAddStepConfirm}
                  onKeyDown={e => {
                    if (e.key === "Enter") handleAddStepConfirm();
                    if (e.key === "Escape") {
                      setAdding(false);
                      setNewStepName("");
                    }
                  }}
                  placeholder="새 단계 이름"
                  maxLength={20}
                />
                <FaTimes size={13} color="#bdbdbd" style={{ marginLeft: 6, cursor: "pointer" }} onMouseDown={() => {
                  setAdding(false);
                  setNewStepName("");
                }} />
              </StepLeft>
            </StepItem>
          )}
        </StepList>

        <DragGuide>드래그로 순서를 변경할 수 있습니다.</DragGuide>

        <ModalFooter>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <SaveButton onClick={() => {
            reorderSteps(stepList);
          }}>저장</SaveButton>
        </ModalFooter>
      </ModalBox>
    </ModalOverlay>
  );
};

export default StepOrderModal;