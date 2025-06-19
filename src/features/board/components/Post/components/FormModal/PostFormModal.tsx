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
  TextArea,
  Select,
  ButtonGroup,
  SubmitButton,
  CancelButton,
  ErrorMessage,
  LoadingSpinner,
  FileUploadArea,
  SpinnerAnimation,
  DropdownContainer,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
} from "@/features/board/components/Post/styles/PostFormModal.styled";
import {
  FiPaperclip,
  FiX,
  FiFile,
  FiImage,
  FiFileText,
  FiDownload,
  FiTrash2,
  FiEdit3,
  FiSave,
  FiPlus,
  FiFlag,
  FiMessageSquare,
  FiCheck,
  FiX as FiXCircle,
  FiChevronDown,
  FiArrowDown,
  FiMinus,
  FiArrowUp,
  FiAlertTriangle,
  FiTarget,
} from "react-icons/fi";

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
  stepId = 1, // 기본값 1
  projectId = 1, // 기본값 1
  onSuccess,
  colorTheme = { main: "#fdb924", sub: "#f59e0b" },
}) => {
  const [formData, setFormData] = useState<PostCreateData & PostUpdateRequest>({
    projectId: projectId,
    title: "",
    content: "",
    type: PostType.GENERAL,
    priority: PostPriority.LOW,
    status: PostStatus.PENDING,
    stepId: stepId,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 파일 업로드 관련 상태
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // 드롭다운 상태
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isStepDropdownOpen, setIsStepDropdownOpen] = useState(false);

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

      try {
        setProjectLoading(true);
        const response = await getProjectDetail(projectId);
        if (response.data) {
          setProjectSteps(response.data.steps);
        }
      } catch (err) {
        console.error("프로젝트 단계 정보 로드 실패:", err);
      } finally {
        setProjectLoading(false);
      }
    };

    if (open) {
      fetchProjectSteps();
    }
  }, [open, projectId]);

  // 수정 모드일 때 기존 게시글 데이터 로드
  useEffect(() => {
    if (open && mode === "edit" && postId) {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const response = await getPostDetail(postId);
          const post = response.data;
          if (post) {
            setFormData({
              projectId: projectId,
              title: post.title,
              content: post.content,
              type: post.type as PostType,
              priority: post.priority as PostPriority,
              status: post.status,
              stepId: stepId,
            });
          }
        } catch (err) {
          setError("게시글을 불러오는 데 실패했습니다.");
          console.error("게시글 로드 중 오류:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    } else if (open && mode === "create") {
      // 생성 모드일 때 폼 초기화
      if (parentId) {
        // 답글 작성 모드일 때 부모 게시글 정보 가져오기
        const fetchParentPost = async () => {
          try {
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
            });
          } catch (err) {
            setError("부모 게시글을 불러오는 데 실패했습니다.");
            console.error("부모 게시글 로드 중 오류:", err);
            // 에러가 발생해도 기본 폼은 설정
            setFormData({
              projectId: projectId,
              title: "",
              content: "",
              type: PostType.GENERAL,
              priority: PostPriority.LOW,
              status: PostStatus.PENDING,
              stepId: stepId,
            });
          } finally {
            setLoading(false);
          }
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
        });
      }
      setError(null);
      setFormErrors({});
    }
  }, [open, mode, postId, parentId, stepId, projectId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "priority" ? (Number(value) as PostPriority) : value,
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
    if (!formData.title.trim()) {
      errors.title = "제목을 입력해주세요.";
    }
    if (!formData.content.trim()) {
      errors.content = "내용을 입력해주세요.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      if (mode === "create") {
        // 게시글 생성
        const requestData = {
          ...formData,
          ...(parentId && { parentId }),
        };
        const response = await createPost(requestData);
        if (response.success || response.message?.includes("완료")) {
          onSuccess?.();
          onClose();
        } else {
          throw new Error(response.message || "게시글 생성에 실패했습니다.");
        }
      } else if (mode === "edit" && postId) {
        // 게시글 수정
        const requestData = {
          projectId: projectId,
          title: formData.title,
          content: formData.content,
          type: formData.type,
          status: formData.status,
          priority: formData.priority,
        };
        const response = await updatePost(postId, requestData);
        if (response.success || response.message?.includes("완료")) {
          onSuccess?.();
          onClose();
        } else {
          throw new Error(response.message || "게시글 수정에 실패했습니다.");
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `게시글 ${
              mode === "create" ? "생성" : "수정"
            } 중 오류가 발생했습니다.`;
      setError(errorMessage);
      console.error(
        `게시글 ${mode === "create" ? "생성" : "수정"} 중 오류:`,
        err
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  // 파일 업로드 관련 핸들러
  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith("image/")) return <FiImage size={16} />;
    if (type.includes("pdf")) return <FiFileText size={16} />;
    if (type.includes("word") || type.includes("document"))
      return <FiFileText size={16} />;
    if (type.includes("excel") || type.includes("spreadsheet"))
      return <FiFileText size={16} />;
    return <FiFile size={16} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  // 단계 상태 텍스트 변환
  const getStepStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "완료";
      case "IN_PROGRESS":
        return "진행중";
      case "PENDING":
        return "대기";
      default:
        return status;
    }
  };

  // 현재 선택된 단계 정보
  const selectedStep = projectSteps.find((step) => step.id === formData.stepId);

  if (!open) return null;

  return (
    <SpinnerAnimation>
      <ModalOverlay onClick={onClose}>
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
                        $active={formData.type !== PostType.GENERAL}
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
                          $active={formData.type === PostType.NOTICE}
                          $color={"#f59e0b"}
                          onClick={() => handleTypeSelect(PostType.NOTICE)}
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
                        $active={formData.priority !== PostPriority.LOW}
                        $color={
                          formData.priority === PostPriority.LOW
                            ? "#10b981"
                            : formData.priority === PostPriority.MEDIUM
                            ? "#fbbf24"
                            : formData.priority === PostPriority.HIGH
                            ? "#a21caf"
                            : "#ef4444"
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
                          onClick={() => handlePrioritySelect(PostPriority.LOW)}
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
                        <FiTarget size={16} style={{ color: colorTheme.sub }} />
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
                                  style={{ fontSize: "12px", color: "#9ca3af" }}
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

                {mode === "edit" && (
                  <FormGroup>
                    <Label htmlFor="status">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <FiCheck size={16} style={{ color: colorTheme.sub }} />
                        상태
                      </div>
                    </Label>
                    <Select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="PENDING">대기</option>
                      <option value="APPROVED">승인</option>
                      <option value="REJECTED">거부</option>
                    </Select>
                  </FormGroup>
                )}

                <FormGroup>
                  <Label htmlFor="content">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <FiFileText size={16} style={{ color: colorTheme.sub }} />
                      내용
                    </div>
                  </Label>
                  <TextArea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="게시글 내용을 입력하세요"
                    rows={8}
                    required
                  />
                  {formErrors.content && (
                    <ErrorMessage>{formErrors.content}</ErrorMessage>
                  )}
                </FormGroup>

                {/* 파일 업로드 섹션 */}
                <FormGroup>
                  <Label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <FiPaperclip
                        size={16}
                        style={{ color: colorTheme.sub }}
                      />
                      첨부파일
                    </div>
                  </Label>
                  <FileUploadArea
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    isDragOver={isDragOver}
                    onClick={handleFileClick}
                  >
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      <FiDownload
                        size={32}
                        style={{ color: "#9ca3af", marginBottom: "8px" }}
                      />
                      <p style={{ margin: "0 0 8px 0", color: "#6b7280" }}>
                        파일을 드래그하여 업로드하거나 클릭하여 선택하세요
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          color: "#9ca3af",
                        }}
                      >
                        최대 5개 파일, 각 파일 최대 10MB
                      </p>
                    </div>
                    <input
                      id="file-input"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      ref={fileInputRef}
                    />
                  </FileUploadArea>
                </FormGroup>

                {/* 첨부된 파일 목록 */}
                {files.length > 0 && (
                  <div style={{ marginTop: "12px" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <FiFile size={16} style={{ color: colorTheme.sub }} />
                      첨부된 파일 ({files.length}개)
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {files.map((file, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 12px",
                            backgroundColor: "#f9fafb",
                            borderRadius: "6px",
                            border: "1px solid #e5e7eb",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              flex: 1,
                            }}
                          >
                            <div style={{ color: colorTheme.sub }}>
                              {getFileIcon(file)}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: "14px",
                                  color: "#374151",
                                  fontWeight: "500",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {file.name}
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#9ca3af",
                                  marginTop: "2px",
                                }}
                              >
                                {formatFileSize(file.size)}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileRemove(index);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#ef4444",
                              cursor: "pointer",
                              padding: "4px",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "background-color 0.2s",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = "#fef2f2";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                            }}
                            title="파일 삭제"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                      <FiX size={16} />
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
                            style={{ width: "16px", height: "16px" }}
                          ></div>
                          처리 중...
                        </>
                      ) : mode === "create" ? (
                        <>
                          <FiSave size={16} />
                          작성
                        </>
                      ) : (
                        <>
                          <FiEdit3 size={16} />
                          수정
                        </>
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
  );
};

export default PostFormModal;
