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

import { FaGripVertical, FaPlus, FaTimes } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { StatusButton } from "../Board/ProjectBoard.styled";
import { RiEdit2Fill } from "react-icons/ri";
import { showErrorToast, showSuccessToast } from "@/utils/errorHandler";
import { motion } from "framer-motion";

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

const StepOrderModal: React.FC<StepOrderModalProps> = ({
  projectId,
  onClose,
  onSaved,
}) => {
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
    api
      .get(`/api/project-steps/${projectId}`)
      .then((res) => {
        const sorted = [...res.data.data].sort(
          (a, b) => a.stepOrder - b.stepOrder
        );
        setStepList(sorted);
      })
      .catch(console.error);
  }, [projectId]);

  const reorderSteps = (newSteps: Step[]) => {
    const ids = newSteps.map((step) => step.id);
    api
      .put(`/api/project-steps/${projectId}/reorder`, ids)
      .then(() => {
        setStepList(newSteps);
        onSaved?.();
      })
      .catch(console.error);
  };

  const createStep = (name: string) => {
    api
      .post(`/api/project-steps?projectId=${projectId}`, { name })
      .then(() => api.get(`/api/project-steps/${projectId}`))
      .then((res) => setStepList(res.data.data))
      .catch(console.error);
  };

  const getVirtualStepList = () => {
    if (
      dragIndex === null ||
      dragOverIndex === null ||
      dragIndex === dragOverIndex ||
      dragOverIndex === dragIndex + 1
    ) {
      return stepList;
    }
    const temp = [...stepList];
    const [moved] = temp.splice(dragIndex, 1);
    const insertAt =
      dragIndex < dragOverIndex ? dragOverIndex - 1 : dragOverIndex;
    temp.splice(insertAt, 0, moved);
    return temp;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (
      dragIndex == null ||
      dragOverIndex == null ||
      dragIndex === dragOverIndex ||
      dragOverIndex === dragIndex + 1
    )
      return;

    const updated = getVirtualStepList();
    setStepList(updated);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDragIndex(idx);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
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

  const handleSave = async () => {
    try {
      // 이름이 변경된 단계만 찾아서 PUT 요청
      const changedSteps = stepList.filter(
        (step, idx) => step.name !== originalStepList[idx]?.name
      );
      for (const step of changedSteps) {
        await api.put(
          `/api/project-steps/${step.id}`,
          { name: step.name },
          {
            params: { projectId },
          }
        );
      }
      await reorderSteps(stepList);
      onClose();
      showSuccessToast("저장되었습니다");
    } catch (e) {
      showErrorToast(e);
    }
  };

  // 원본 단계 리스트를 저장해둠
  const originalStepList = React.useRef(stepList).current;

  const virtualList = getVirtualStepList();

  return (
    <ModalOverlay
      onClick={() => {
        onClose();
        window.location.reload();
      }}
    >
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>단계 수정</ModalTitle>
          <ModalDescription>
            단계의 순서를 변경하고, 이름을 수정하거나 삭제할 수 있습니다.
          </ModalDescription>
          <DragGuide>드래그로 순서를 변경할 수 있습니다.</DragGuide>
        </ModalHeader>

        <StepList>
          {virtualList.map((step, idx) => {
            const originalIdx = stepList.findIndex((s) => s.id === step.id);
            const isDragging = originalIdx === dragIndex;
            const isDropTarget =
              dragOverIndex === idx &&
              dragIndex !== null &&
              originalIdx !== dragOverIndex &&
              dragOverIndex !== originalIdx + 1;

            const { text, color, bg } = getStatusStyle(step.projectStepStatus);

            return (
              <motion.div
                layout
                key={step.id}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={handleDrop}
                style={{ position: "relative" }}
              >
                {isDropTarget && dragIndex !== null && (
                  <StepItem
                    isDropTarget
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 0,
                      zIndex: 2,
                      pointerEvents: "none",
                    }}
                  >
                    <StepLeft>
                      <StepOrderNumber>{idx + 1}</StepOrderNumber>
                      <FaGripVertical size={13} color="#2563eb" />
                      <StepName>{stepList[dragIndex].name}</StepName>
                    </StepLeft>
                  </StepItem>
                )}
                <StepItem
                  draggable
                  onDragStart={(e) => handleDragStart(e, originalIdx)}
                  onDragEnd={handleDragEnd}
                  isDragging={isDragging}
                  isDropTarget={isDropTarget}
                >
                  <StepLeft>
                    <StepOrderNumber>{idx + 1}</StepOrderNumber>
                    <FaGripVertical
                      size={13}
                      color={isDragging ? "#fbbf24" : "#d1d5db"}
                    />
                    {editingIdx === originalIdx ? (
                      <AddStepInput
                        ref={editingInputRef}
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onBlur={() => {
                          const name = editingName.trim();
                          if (name)
                            setStepList((list) =>
                              list.map((s, i) =>
                                i === originalIdx ? { ...s, name } : s
                              )
                            );
                          setEditingIdx(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const name = editingName.trim();
                            if (name)
                              setStepList((list) =>
                                list.map((s, i) =>
                                  i === originalIdx ? { ...s, name } : s
                                )
                              );
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
                              setEditingIdx(originalIdx);
                              setEditingName(step.name);
                              setTimeout(
                                () => editingInputRef.current?.focus(),
                                0
                              );
                            }}
                          />
                        </EditIcon>
                      </>
                    )}
                  </StepLeft>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    {(step.projectStepStatus === "IN_PROGRESS" ||
                      step.projectStepStatus === "COMPLETED") && (
                      <StatusButton
                        $active={false}
                        $color="#6b7280"
                        style={{
                          marginLeft: 8,
                          minWidth: 60,
                          padding: "4px 12px",
                          fontSize: 13,
                        }}
                        title="예정으로 되돌리기"
                        onClick={async () => {
                          try {
                            await api.put(
                              `/api/project-steps/${step.id}/revert`,
                              null,
                              {
                                params: { projectId },
                              }
                            );
                            setStepList((list) =>
                              list.map((s) =>
                                s.id === step.id
                                  ? { ...s, projectStepStatus: "PENDING" }
                                  : s
                              )
                            );
                            showSuccessToast("예정 상태로 되돌렸습니다");
                          } catch (e) {
                            showErrorToast(e);
                          }
                        }}
                      >
                        초기화
                      </StatusButton>
                    )}
                    <StepStatusBadge
                      style={{ backgroundColor: bg, color }}
                      clickable={true}
                      onClick={async () => {
                        try {
                          // 상태 토글: PENDING -> IN_PROGRESS -> COMPLETED -> IN_PROGRESS ...
                          let newStatus = "IN_PROGRESS";
                          if (step.projectStepStatus === "IN_PROGRESS")
                            newStatus = "COMPLETED";
                          else if (step.projectStepStatus === "COMPLETED")
                            newStatus = "IN_PROGRESS";
                          await api.put(
                            `/api/project-steps/${step.id}/status`,
                            null,
                            {
                              params: { projectId },
                            }
                          );
                          setStepList((list) =>
                            list.map((s) =>
                              s.id === step.id
                                ? {
                                    ...s,
                                    projectStepStatus:
                                      newStatus as Step["projectStepStatus"],
                                  }
                                : s
                            )
                          );
                          showSuccessToast("상태가 변경되었습니다");
                        } catch (e) {
                          showErrorToast(e);
                        }
                      }}
                    >
                      {text}
                    </StepStatusBadge>

                    <TrashIcon>
                      <FiTrash2
                        size={17}
                        color="#e11d48"
                        title="단계 삭제"
                        style={{ cursor: "pointer", marginLeft: 2 }}
                        onClick={async () => {
                          if (window.confirm("단계를 정말 삭제할까요?")) {
                            try {
                              await api.delete(
                                `/api/project-steps/${step.id}`,
                                {
                                  params: { projectId: projectId },
                                }
                              );
                              setStepList((list) =>
                                list.filter((s) => s.id !== step.id)
                              );
                              showSuccessToast("삭제되었습니다");
                            } catch (e) {
                              console.error(e);
                            }
                          }
                        }}
                      />
                    </TrashIcon>
                  </div>
                </StepItem>
              </motion.div>
            );
          })}
          {/* 마지막 요소 아래 드롭 타겟 (motion.div로 감싸서 FLIP 애니메이션 적용) */}
          <motion.div layout>
            <div
              style={{ height: 32 }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setDragOverIndex(stepList.length);
              }}
              onDrop={handleDrop}
            >
              {dragOverIndex === stepList.length && dragIndex !== null && (
                <StepItem
                  isDropTarget
                  style={{
                    position: "relative",
                    left: 0,
                    right: 0,
                    zIndex: 2,
                    pointerEvents: "none",
                  }}
                >
                  <StepLeft>
                    <StepOrderNumber>{stepList.length}</StepOrderNumber>
                    <FaGripVertical size={13} color="#2563eb" />
                    <StepName>{stepList[dragIndex].name}</StepName>
                  </StepLeft>
                </StepItem>
              )}
            </div>
          </motion.div>

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

        <ModalFooter>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <SaveButton type="button" onClick={handleSave}>
            저장
          </SaveButton>
        </ModalFooter>
      </ModalBox>
    </ModalOverlay>
  );
};

export default StepOrderModal;
