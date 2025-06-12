import React, { useState, useEffect } from "react";
import {
  createPost,
  updatePost,
  getPostDetail,
} from "@/features/project/services/postService";
import {
  type PostCreateData,
  type PostUpdateRequest,
  type Post,
  PostType,
  PostStatus,
} from "@/features/project/types/post";
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
} from "./PostFormModal.styled";

interface PostFormModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  postId?: number;
  parentId?: number;
  stepId?: number;
  onSuccess?: () => void;
}

const PostFormModal: React.FC<PostFormModalProps> = ({
  open,
  onClose,
  mode,
  postId,
  parentId,
  stepId = 1, // 기본값 1
  onSuccess,
}) => {
  const [formData, setFormData] = useState<PostCreateData & PostUpdateRequest>({
    title: "",
    content: "",
    type: PostType.GENERAL,
    priority: 1,
    status: PostStatus.PENDING,
    stepId: stepId,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 수정 모드일 때 기존 게시글 데이터 로드
  useEffect(() => {
    if (open && mode === "edit" && postId) {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const response = await getPostDetail(postId);
          const post: Post = response.data;
          setFormData({
            title: post.title,
            content: post.content,
            type: post.type,
            priority: post.priority,
            status: post.status,
            stepId: stepId,
          });
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
              title: "",
              content: "",
              type: PostType.GENERAL,
              priority: 1,
              status: PostStatus.PENDING,
              stepId: stepId,
            });
          } catch (err) {
            setError("부모 게시글을 불러오는 데 실패했습니다.");
            console.error("부모 게시글 로드 중 오류:", err);
            // 에러가 발생해도 기본 폼은 설정
            setFormData({
              title: "",
              content: "",
              type: PostType.GENERAL,
              priority: 1,
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
          title: "",
          content: "",
          type: PostType.GENERAL,
          priority: 1,
          status: PostStatus.PENDING,
          stepId: stepId,
        });
      }
      setError(null);
      setFormErrors({});
    }
  }, [open, mode, postId, parentId, stepId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "priority" ? parseInt(value, 10) : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
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

  if (!open) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalPanel onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {mode === "create"
              ? parentId
                ? "답글 작성"
                : "새 게시글 작성"
              : "게시글 수정"}
          </ModalTitle>
          <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          {loading ? (
            <LoadingSpinner>로딩 중...</LoadingSpinner>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="title">제목 *</Label>
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

              <FormGroup>
                <Label htmlFor="type">유형</Label>
                <Select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="GENERAL">일반</option>
                  <option value="NOTICE">공지</option>
                  <option value="REPORT">보고</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="priority">우선순위</Label>
                <Select
                  id="priority"
                  name="priority"
                  value={formData.priority.toString()}
                  onChange={handleChange}
                >
                  <option value="1">낮음</option>
                  <option value="2">보통</option>
                  <option value="3">높음</option>
                </Select>
              </FormGroup>

              {mode === "edit" && (
                <FormGroup>
                  <Label htmlFor="status">상태</Label>
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
                <Label htmlFor="content">내용 *</Label>
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

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <ButtonGroup>
                <CancelButton type="button" onClick={handleCancel}>
                  취소
                </CancelButton>
                <SubmitButton type="submit" disabled={loading}>
                  {loading ? "처리 중..." : mode === "create" ? "작성" : "수정"}
                </SubmitButton>
              </ButtonGroup>
            </form>
          )}
        </ModalBody>
      </ModalPanel>
    </ModalOverlay>
  );
};

export default PostFormModal;
