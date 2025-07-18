import React, { useState, useEffect, useRef } from "react";
import {
  createPost,
  updatePost,
  getPostDetail,
} from "@/features/project-d/services/postService";
import {
  type PostCreateData,
  type PostUpdateRequest,
  PostStatus,
  PostType,
  PostPriority,
  type PostFile,
} from "@/features/project-d/types/post";
import { getProjectDetail } from "@/features/project/services/projectService";
import type { ProjectDetailResponse } from "@/features/project/services/projectService";
import {
  ModalOverlay,
  ModalPanel,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  FormGroup,
  Label,
  Input,
  ButtonGroup,
  SubmitButton,
  CancelButton,
  ErrorMessage,
  LoadingSpinner,
  SpinnerAnimation,
  DropdownContainer,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
} from "@/features/board/components/Post/styles/PostFormModal.styled";
import {
  FiEdit3,
  FiFlag,
  FiMessageSquare,
  FiX as FiXCircle,
  FiChevronDown,
  FiArrowDown,
  FiMinus,
  FiArrowUp,
  FiAlertTriangle,
  FiTarget,
  FiPlus,
} from "react-icons/fi";
import FullScreenContentEditor from "./FullScreenContentEditor";
import FileUploadSection from "./components/FileUploadSection";
import ContentEditorSection from "./components/ContentEditorSection";
import {
  showErrorToast,
  showSuccessToast,
  withErrorHandling,
} from "@/utils/errorHandler";
import LinkInputSection from "./components/LinkInputSection";

interface PostFormModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  postId?: number;
  parentId?: number;
  stepId?: number;
  projectId?: number;
  onSuccess?: () => void;
  colorTheme?: { main: string; sub: string };
}

const PostFormModal: React.FC<PostFormModalProps> = ({
  open,
  onClose,
  mode,
  postId,
  parentId,
  stepId,
  projectId,
  onSuccess,
  colorTheme = { main: "#fdb924", sub: "#f59e0b" },
}) => {
  const [formData, setFormData] = useState<PostCreateData & PostUpdateRequest>({
    projectId: projectId || 1, // projectId가 없을 때만 기본값 사용
    title: "",
    content: "",
    type: PostType.GENERAL,
    priority: PostPriority.LOW,
    status: PostStatus.PENDING,
    stepId: stepId || 1, // stepId가 없을 때만 기본값 사용
    parentId: parentId || null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 파일 업로드 관련 상태
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // 기존 파일 관련 상태 (수정 모드용)
  const [existingFiles, setExistingFiles] = useState<PostFile[]>([]);
  const [deletedFileIds, setDeletedFileIds] = useState<number[]>([]);

  // 링크 관련 상태
  const [existingLinks, setExistingLinks] = useState<
    { id: number; url: string }[]
  >([]);
  const [newLinks, setNewLinks] = useState<string[]>([]);
  const [deletedLinkIds, setDeletedLinkIds] = useState<number[]>([]);

  // 드롭다운 상태
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isStepDropdownOpen, setIsStepDropdownOpen] = useState(false);

  // 마크다운 에디터 모드 상태
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFullScreenModal, setIsFullScreenModal] = useState(false);

  // 프로젝트 단계 정보
  const [projectSteps, setProjectSteps] = useState<
    ProjectDetailResponse["steps"]
  >([]);
  const [projectLoading, setProjectLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 프로젝트 단계 정보 가져오기
  useEffect(() => {
    const fetchProjectSteps = async () => {
      if (!projectId) return;

      await withErrorHandling(async () => {
        setProjectLoading(true);
        const response = await getProjectDetail(projectId);
        if (response.data) {
          setProjectSteps(response.data.steps);

          // 생성 모드에서 사용자가 현재 위치한 단계를 기본값으로 설정
          if (mode === "create") {
            // stepId prop이 있으면 해당 단계를 사용, 없으면 진행중인 단계 사용
            const targetStepId =
              stepId ||
              response.data.steps.find(
                (step) => step.projectStepStatus === "IN_PROGRESS"
              )?.id ||
              1;

            setFormData((prev) => ({
              ...prev,
              stepId: targetStepId,
            }));
          }
          // 수정 모드에서는 기존 게시글의 stepId가 유효한지 확인하고,
          // 유효하지 않으면 첫 번째 단계로 설정
          else if (mode === "edit") {
            const currentStepId = formData.stepId;
            const isValidStep = response.data.steps.some(
              (step) => step.id === currentStepId
            );

            if (!isValidStep && response.data.steps.length > 0) {
              setFormData((prev) => ({
                ...prev,
                stepId: response.data.steps[0].id,
              }));
            }
          }
        }
        return response;
      }, "프로젝트 단계 정보를 불러오는데 실패했습니다.");

      setProjectLoading(false);
    };

    if (open) {
      fetchProjectSteps();
    }
  }, [open, projectId, mode, stepId]);

  // 수정 모드일 때 기존 게시글 데이터 로드
  useEffect(() => {
    if (open && mode === "edit" && postId) {
      const fetchPost = async () => {
        await withErrorHandling(async () => {
          setLoading(true);
          const response = await getPostDetail(postId);
          const post = response.data;
          if (post) {
            // 기존 게시글의 stepId를 우선적으로 사용
            // (기존 게시글이 속한 단계가 기본으로 선택되도록)
            const currentStepId = post.projectStepId || stepId;

            // 프로젝트 단계 정보가 이미 로드되어 있다면 유효성 검사
            let validStepId = currentStepId;
            if (projectSteps.length > 0) {
              const isValidStep = projectSteps.some(
                (step) => step.id === currentStepId
              );
              if (!isValidStep) {
                validStepId = projectSteps[0].id;
              }
            }

            setFormData({
              projectId: projectId,
              title: post.title,
              content: post.content,
              type: post.type as PostType,
              priority: post.priority as PostPriority,
              status: post.status,
              stepId: validStepId, // 유효성 검사를 거친 stepId 사용
              parentId: post.parentId || null,
            });
            // 기존 파일 정보 설정
            setExistingFiles(post.files || []);
            setDeletedFileIds([]);
            // 기존 링크 정보 설정
            setExistingLinks(post.links || []);
            setNewLinks([]);
            setDeletedLinkIds([]);
          }
          return response;
        }, "게시글을 불러오는데 실패했습니다.");

        setLoading(false);
      };
      fetchPost();
    } else if (open && mode === "create") {
      if (parentId) {
        // 답글 작성 모드일 때 부모 게시글 정보 가져오기
        const fetchParentPost = async () => {
          const result = await withErrorHandling(async () => {
            setLoading(true);
            // const response = await getPostDetail(parentId);
            // const parentPost = response.data;
            setFormData({
              projectId: projectId,
              title: "",
              content: "",
              type: PostType.GENERAL,
              priority: PostPriority.LOW,
              status: PostStatus.PENDING,
              stepId: stepId,
              parentId: parentId,
            });
            return null;
          }, "부모 게시글을 불러오는데 실패했습니다.");

          // 에러가 발생해도 기본 폼은 설정
          if (!result) {
            setFormData({
              projectId: projectId,
              title: "",
              content: "",
              type: PostType.GENERAL,
              priority: PostPriority.LOW,
              status: PostStatus.PENDING,
              stepId: stepId,
              parentId: parentId,
            });
          }
          setLoading(false);
        };
        fetchParentPost();
      } else {
        // 일반 게시글 작성 모드
        setFormData({
          projectId: projectId,
          title: "",
          content: "",
          type: PostType.GENERAL,
          priority: PostPriority.LOW,
          status: PostStatus.PENDING,
          stepId: stepId,
          parentId: null,
        });
      }
      setError(null);
      setFormErrors({});
      // 생성 모드에서는 기존 파일 초기화
      setExistingFiles([]);
      setDeletedFileIds([]);
      // 생성 모드에서는 기존 링크 초기화
      setExistingLinks([]);
      setNewLinks([]);
      setDeletedLinkIds([]);
    }
  }, [open, mode, postId, parentId, stepId, projectId, projectSteps]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "priority"
          ? (Number(value) as unknown as PostPriority)
          : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // 드롭다운 토글 핸들러
  const handleTypeDropdownToggle = () => {
    setIsTypeDropdownOpen((prev) => {
      if (!prev) {
        setIsPriorityDropdownOpen(false);
        setIsStepDropdownOpen(false);
      }
      return !prev;
    });
  };

  const handlePriorityDropdownToggle = () => {
    setIsPriorityDropdownOpen((prev) => {
      if (!prev) {
        setIsTypeDropdownOpen(false);
        setIsStepDropdownOpen(false);
      }
      return !prev;
    });
  };

  const handleStepDropdownToggle = () => {
    setIsStepDropdownOpen((prev) => {
      if (!prev) {
        setIsTypeDropdownOpen(false);
        setIsPriorityDropdownOpen(false);
      }
      return !prev;
    });
  };

  // 드롭다운 아이템 선택 핸들러
  const handleTypeSelect = (type: PostType) => {
    setFormData((prev) => ({ ...prev, type }));
    setIsTypeDropdownOpen(false);
  };

  const handlePrioritySelect = (priority: PostPriority) => {
    setFormData((prev) => ({ ...prev, priority }));
    setIsPriorityDropdownOpen(false);
  };

  const handleStepSelect = (stepId: number) => {
    setFormData((prev) => ({ ...prev, stepId }));
    setIsStepDropdownOpen(false);
  };

  // 모달 내 클릭 시 드롭다운 닫기
  const handleModalClick = (e: React.MouseEvent) => {
    // 드롭다운 컨테이너나 버튼을 클릭한 경우는 제외
    const target = e.target as HTMLElement;
    if (
      target.closest(".dropdown-container") ||
      target.closest("[data-dropdown]")
    ) {
      return;
    }

    // 다른 곳을 클릭하면 모든 드롭다운 닫기
    setIsTypeDropdownOpen(false);
    setIsPriorityDropdownOpen(false);
    setIsStepDropdownOpen(false);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    // 제목: 필수, 1~50자
    if (!formData.title.trim()) {
      errors.title = "제목을 입력해주세요.";
    } else if (formData.title.trim().length > 50) {
      errors.title = "게시글 제목은 50자 이하로 입력해주세요.";
    }
    // 내용: 필수, 1~1000자
    if (!formData.content.trim()) {
      errors.content = "내용을 입력해주세요.";
    } else if (formData.content.trim().length > 1000) {
      errors.content = "게시글 내용은 1,000자 이하로 입력해주세요.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await withErrorHandling(async () => {
      setLoading(true);
      setError(null);

      if (mode === "create") {
        // 게시글 생성
        const requestData = {
          ...formData,
          ...(newLinks.length > 0 && { newLinks }),
        };

        const response = await createPost(requestData, files);
        if (response.success || response.message?.includes("완료")) {
          // 상태 초기화
          setFiles([]);
          setExistingFiles([]);
          setDeletedFileIds([]);
          setExistingLinks([]);
          setNewLinks([]);
          setDeletedLinkIds([]);
          setIsDragOver(false);
          showSuccessToast("게시글이 성공적으로 생성되었습니다.");
          onSuccess?.();
          onClose();
          return response;
        } else {
          // 서버 validation 에러 메시지 노출
          if (response.message) {
            setError(response.message);
          }
          throw new Error(response.message || "게시글 생성에 실패했습니다.");
        }
      } else if (mode === "edit" && postId) {
        // 게시글 수정
        const requestData = {
          projectId: projectId,
          title: formData.title,
          content: formData.content,
          type: formData.type,
          priority: formData.priority,
          stepId: formData.stepId,
          ...(deletedFileIds.length > 0 && { fileIdsToDelete: deletedFileIds }),
          ...(deletedLinkIds.length > 0 && { linkIdsToDelete: deletedLinkIds }),
          ...(newLinks.length > 0 && { newLinks }),
        };

        // 수정 전 기존 게시글 정보 저장 (단계 변경 확인용)
        const originalPost = await getPostDetail(postId);
        const originalStepId = originalPost.data?.projectStepId;

        const response = await updatePost(postId, requestData, files);
        if (response.success || response.message?.includes("완료")) {
          // 상태 초기화
          setFiles([]);
          setExistingFiles([]);
          setDeletedFileIds([]);
          setExistingLinks([]);
          setNewLinks([]);
          setDeletedLinkIds([]);
          setIsDragOver(false);

          // 단계가 변경된 경우 특별한 메시지 표시
          if (originalStepId && originalStepId !== formData.stepId) {
            const stepNames = projectSteps.reduce((acc, step) => {
              acc[step.id] = step.name;
              return acc;
            }, {} as Record<number, string>);

            const originalStepName =
              stepNames[originalStepId] || "알 수 없는 단계";
            const newStepName = stepNames[formData.stepId] || "알 수 없는 단계";

            showSuccessToast(
              `게시글이 성공적으로 수정되었습니다. (${originalStepName} → ${newStepName})`
            );
          } else {
            showSuccessToast("게시글이 성공적으로 수정되었습니다.");
          }

          onSuccess?.();
          onClose();
          return response;
        } else {
          // 서버 validation 에러 메시지 노출
          if (response.message) {
            setError(response.message);
          }
          throw new Error(response.message || "게시글 수정에 실패했습니다.");
        }
      }
    }, undefined); // 에러 메시지를 undefined로 설정하여 withErrorHandling에서 토스트를 표시하지 않음

    // withErrorHandling에서 null이 반환되면 에러가 발생한 것이므로 직접 에러 토스트 표시
    if (result === null) {
      if (!error) {
        showErrorToast(
          `게시글 ${mode === "create" ? "생성" : "수정"}에 실패했습니다.`
        );
      }
    }

    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      projectId: projectId || 1,
      title: "",
      content: "",
      type: PostType.GENERAL,
      priority: PostPriority.LOW,
      status: PostStatus.PENDING,
      stepId: stepId || 1,
      parentId: parentId || null,
    });
    setFiles([]);
    setExistingFiles([]);
    setDeletedFileIds([]);
    setExistingLinks([]);
    setNewLinks([]);
    setDeletedLinkIds([]);
    setFormErrors({});
    setError(null);
    onClose();
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);

    // 파일 크기 제한 (50MB - 백엔드 설정에 맞춤)
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    const validFiles = droppedFiles.filter((file) => {
      if (file.size > maxFileSize) {
        showErrorToast(
          `${file.name} 업로드 가능한 파일 용량을 초과했습니다. (최대 50MB)`
        );
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // 파일 크기 제한 (30MB - 백엔드 설정에 맞춤)
    const maxFileSize = 30 * 1024 * 1024; // 30MB
    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxFileSize) {
        showErrorToast(
          `${file.name} 업로드 가능한 파일 용량을 초과했습니다. (최대 30MB)`
        );
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExistingFileRemove = (fileId: number) => {
    setDeletedFileIds((prev) => [...prev, fileId]);
    setExistingFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const getStepStatusText = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "진행중";
      case "COMPLETED":
        return "완료";
      case "PENDING":
        return "";
      default:
        return status;
    }
  };

  // 현재 선택된 단계 정보
  const selectedStep = projectSteps.find((step) => step.id === formData.stepId);

  const handleFullScreenConfirm = (newContent: string) => {
    setFormData((prev) => ({
      ...prev,
      content: newContent,
    }));
    setIsFullScreenModal(false);
  };

  const handleFullScreenClose = () => {
    setIsFullScreenModal(false);
  };

  // ESC 키 이벤트 처리
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open && !isFullScreenModal) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [open, onClose, isFullScreenModal]);

  // 모달 바깥 클릭 처리 - 바깥 클릭 시 모달 닫지 않음
  const handleOverlayClick = () => {
    // 바깥 클릭 시 모달을 닫지 않도록 아무것도 하지 않음
    // ESC 키로만 모달을 닫을 수 있음
  };

  if (!open) return null;

  return (
    <>
      <SpinnerAnimation>
        <ModalOverlay onClick={handleOverlayClick}>
          <ModalPanel onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {mode === "create" ? (
                    <>
                      <FiPlus size={20} style={{ color: colorTheme.main }} />
                      <span>{parentId ? "답글 작성" : "새 게시글 작성"}</span>
                    </>
                  ) : (
                    <>
                      <FiEdit3 size={20} style={{ color: colorTheme.main }} />
                      <span>게시글 수정</span>
                    </>
                  )}
                </div>
              </ModalTitle>
              <ModalCloseButton onClick={onClose}>
                <FiXCircle size={18} />
              </ModalCloseButton>
            </ModalHeader>

            <ModalBody onClick={handleModalClick}>
              {loading ? (
                <LoadingSpinner>로딩 중...</LoadingSpinner>
              ) : (
                <form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label htmlFor="title">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <FiEdit3 size={16} style={{ color: colorTheme.sub }} />
                        제목
                      </div>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder={
                        parentId
                          ? "답글 제목을 입력하세요"
                          : "게시글 제목을 입력하세요"
                      }
                      required
                    />
                    {formErrors.title && (
                      <ErrorMessage>{formErrors.title}</ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup style={{ display: "flex", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <Label htmlFor="type">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <FiMessageSquare
                            size={16}
                            style={{ color: colorTheme.sub }}
                          />
                          유형
                        </div>
                      </Label>
                      <DropdownContainer
                        className="dropdown-container"
                        data-dropdown="type"
                      >
                        <DropdownButton
                          $active={true}
                          $color={
                            formData.type === PostType.GENERAL
                              ? "#3b82f6"
                              : "#f59e0b"
                          }
                          $isOpen={isTypeDropdownOpen}
                          onClick={handleTypeDropdownToggle}
                          type="button"
                        >
                          <span className="dropdown-label">
                            {formData.type === PostType.GENERAL ? (
                              <FiMessageSquare size={16} />
                            ) : (
                              <FiFlag size={16} />
                            )}
                            <span>
                              {formData.type === PostType.GENERAL
                                ? "일반"
                                : "질문"}
                            </span>
                          </span>
                          <span className="dropdown-arrow">
                            <FiChevronDown size={16} />
                          </span>
                        </DropdownButton>
                        <DropdownMenu $isOpen={isTypeDropdownOpen}>
                          <DropdownItem
                            $active={formData.type === PostType.GENERAL}
                            $color={"#3b82f6"}
                            onClick={() => handleTypeSelect(PostType.GENERAL)}
                          >
                            <FiMessageSquare size={16} />
                            <span>일반</span>
                          </DropdownItem>
                          <DropdownItem
                            $active={formData.type === PostType.QUESTION}
                            $color={"#f59e0b"}
                            onClick={() => handleTypeSelect(PostType.QUESTION)}
                          >
                            <FiFlag size={16} />
                            <span>질문</span>
                          </DropdownItem>
                        </DropdownMenu>
                      </DropdownContainer>
                    </div>
                    <div style={{ flex: 1 }}>
                      <Label htmlFor="priority">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <FiFlag size={16} style={{ color: colorTheme.sub }} />
                          우선순위
                        </div>
                      </Label>
                      <DropdownContainer
                        className="dropdown-container"
                        data-dropdown="priority"
                      >
                        <DropdownButton
                          $active={true}
                          $color={
                            formData.priority === PostPriority.LOW
                              ? "#10b981"
                              : formData.priority === PostPriority.MEDIUM
                              ? "#fbbf24"
                              : formData.priority === PostPriority.HIGH
                              ? "#a21caf"
                              : formData.priority === PostPriority.URGENT
                              ? "#ef4444"
                              : "#10b981"
                          }
                          $isOpen={isPriorityDropdownOpen}
                          onClick={handlePriorityDropdownToggle}
                          type="button"
                        >
                          <span className="dropdown-label">
                            {formData.priority === PostPriority.LOW ? (
                              <FiArrowDown size={16} />
                            ) : formData.priority === PostPriority.MEDIUM ? (
                              <FiMinus size={16} />
                            ) : formData.priority === PostPriority.HIGH ? (
                              <FiArrowUp size={16} />
                            ) : (
                              <FiAlertTriangle size={16} />
                            )}
                            <span>
                              {formData.priority === PostPriority.LOW
                                ? "낮음"
                                : formData.priority === PostPriority.MEDIUM
                                ? "보통"
                                : formData.priority === PostPriority.HIGH
                                ? "높음"
                                : "긴급"}
                            </span>
                          </span>
                          <span className="dropdown-arrow">
                            <FiChevronDown size={16} />
                          </span>
                        </DropdownButton>
                        <DropdownMenu $isOpen={isPriorityDropdownOpen}>
                          <DropdownItem
                            $active={formData.priority === PostPriority.LOW}
                            $color={"#10b981"}
                            onClick={() =>
                              handlePrioritySelect(PostPriority.LOW)
                            }
                          >
                            <FiArrowDown size={16} />
                            <span>낮음</span>
                          </DropdownItem>
                          <DropdownItem
                            $active={formData.priority === PostPriority.MEDIUM}
                            $color={"#fbbf24"}
                            onClick={() =>
                              handlePrioritySelect(PostPriority.MEDIUM)
                            }
                          >
                            <FiMinus size={16} />
                            <span>보통</span>
                          </DropdownItem>
                          <DropdownItem
                            $active={formData.priority === PostPriority.HIGH}
                            $color={"#a21caf"}
                            onClick={() =>
                              handlePrioritySelect(PostPriority.HIGH)
                            }
                          >
                            <FiArrowUp size={16} />
                            <span>높음</span>
                          </DropdownItem>
                          <DropdownItem
                            $active={formData.priority === PostPriority.URGENT}
                            $color={"#ef4444"}
                            onClick={() =>
                              handlePrioritySelect(PostPriority.URGENT)
                            }
                          >
                            <FiAlertTriangle size={16} />
                            <span>긴급</span>
                          </DropdownItem>
                        </DropdownMenu>
                      </DropdownContainer>
                    </div>
                    <div style={{ flex: 1 }}>
                      <Label htmlFor="step">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <FiTarget
                            size={16}
                            style={{ color: colorTheme.sub }}
                          />
                          단계
                        </div>
                      </Label>
                      <DropdownContainer
                        className="dropdown-container"
                        data-dropdown="step"
                      >
                        <DropdownButton
                          $active={true}
                          $color={
                            selectedStep?.projectStepStatus === "IN_PROGRESS"
                              ? "#fdb924"
                              : selectedStep?.projectStepStatus === "COMPLETED"
                              ? "#10b981"
                              : "#6b7280"
                          }
                          $isOpen={isStepDropdownOpen}
                          onClick={handleStepDropdownToggle}
                          type="button"
                          disabled={projectLoading}
                        >
                          <span className="dropdown-label">
                            {projectLoading ? (
                              <div
                                className="spinner"
                                style={{ width: "16px", height: "16px" }}
                              ></div>
                            ) : (
                              <FiTarget size={16} />
                            )}
                            <span>
                              {projectLoading
                                ? "로딩 중..."
                                : selectedStep
                                ? selectedStep.name
                                : "단계 선택"}
                            </span>
                          </span>
                          <span className="dropdown-arrow">
                            <FiChevronDown size={16} />
                          </span>
                        </DropdownButton>
                        <DropdownMenu $isOpen={isStepDropdownOpen}>
                          {projectSteps
                            .sort((a, b) => a.stepOrder - b.stepOrder)
                            .map((step) => (
                              <DropdownItem
                                key={step.id}
                                $active={formData.stepId === step.id}
                                $color={
                                  step.projectStepStatus === "IN_PROGRESS"
                                    ? "#fdb924"
                                    : step.projectStepStatus === "COMPLETED"
                                    ? "#10b981"
                                    : "#6b7280"
                                }
                                onClick={() => handleStepSelect(step.id)}
                              >
                                <FiTarget size={16} />
                                <div style={{ flex: 1 }}>
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    {step.name}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      color: "#9ca3af",
                                    }}
                                  >
                                    {getStepStatusText(step.projectStepStatus)}
                                  </div>
                                </div>
                              </DropdownItem>
                            ))}
                        </DropdownMenu>
                      </DropdownContainer>
                    </div>
                  </FormGroup>

                  <ContentEditorSection
                    content={formData.content}
                    isMarkdownMode={isMarkdownMode}
                    isPreviewMode={isPreviewMode}
                    formErrors={formErrors}
                    onContentChange={handleChange}
                    onMarkdownModeToggle={() => {
                      setIsMarkdownMode(!isMarkdownMode);
                      if (!isMarkdownMode) {
                        setIsPreviewMode(false);
                      }
                    }}
                    onPreviewModeToggle={() => {
                      setIsPreviewMode(!isPreviewMode);
                    }}
                    onFullScreenOpen={() => setIsFullScreenModal(true)}
                    colorTheme={colorTheme}
                  />

                  <FileUploadSection
                    files={files}
                    existingFiles={existingFiles}
                    isDragOver={isDragOver}
                    fileInputRef={fileInputRef}
                    handleFileDrop={handleFileDrop}
                    handleDragOver={handleDragOver}
                    handleDragLeave={handleDragLeave}
                    handleFileClick={handleFileClick}
                    handleFileChange={handleFileChange}
                    handleFileRemove={handleFileRemove}
                    handleExistingFileRemove={handleExistingFileRemove}
                    colorTheme={colorTheme}
                  />

                  <LinkInputSection
                    mode={mode}
                    existingLinks={existingLinks}
                    setExistingLinks={setExistingLinks}
                    newLinks={newLinks}
                    setNewLinks={setNewLinks}
                    deletedLinkIds={deletedLinkIds}
                    setDeletedLinkIds={setDeletedLinkIds}
                  />

                  {error && <ErrorMessage>{error}</ErrorMessage>}

                  <ButtonGroup>
                    <CancelButton type="button" onClick={handleCancel}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        취소
                      </div>
                    </CancelButton>
                    <SubmitButton type="submit" disabled={loading}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        {loading ? (
                          <>
                            <div
                              className="spinner"
                              style={{ width: "1px", height: "16px" }}
                            ></div>
                            처리 중...
                          </>
                        ) : mode === "create" ? (
                          <>확인</>
                        ) : (
                          <>수정</>
                        )}
                      </div>
                    </SubmitButton>
                  </ButtonGroup>
                </form>
              )}
            </ModalBody>
          </ModalPanel>
        </ModalOverlay>
      </SpinnerAnimation>

      {/* 전체화면 내용 편집기 */}
      <FullScreenContentEditor
        isOpen={isFullScreenModal}
        onClose={handleFullScreenClose}
        onConfirm={handleFullScreenConfirm}
        initialContent={formData.content}
        colorTheme={colorTheme}
      />
    </>
  );
};

export default PostFormModal;
