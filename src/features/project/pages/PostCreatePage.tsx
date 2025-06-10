import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPost } from "@/features/project/services/postService";
import type { PostCreateData } from "@/features/project/types/post";
import {
  PageContainer,
  MainContentWrapper,
  CreateForm,
  FormTitle,
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  ButtonGroup,
  SubmitButton,
  CancelButton,
  ErrorMessage,
} from "./PostCreatePage.styled";

export default function PostCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<PostCreateData>({
    title: "",
    content: "",
    type: "GENERAL",
    priority: 1,
    status: "PENDING",
    projectId: 1, // 임시로 프로젝트 ID 1 사용
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // URL에서 parentId 파라미터 읽기
  const parentId = searchParams.get("parentId");

  // 디버깅을 위한 로그
  console.log("Current formData:", formData);
  console.log("URL parentId:", parentId);
  console.log("formData.type:", formData.type, "typeof:", typeof formData.type);
  console.log(
    "formData.priority:",
    formData.priority,
    "typeof:",
    typeof formData.priority
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    console.log(
      `handleChange - name: ${name}, value: ${value}, type: ${typeof value}`
    );

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: name === "priority" ? parseInt(value, 10) : value,
      };
      console.log(`Updated formData:`, newData);
      return newData;
    });
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

      // 백엔드 API에 맞는 데이터 형식으로 변환
      const requestData = {
        ...formData,
        // enum 값을 그대로 사용 (백엔드에서 문자열로 처리)
        type: formData.type,
        status: formData.status,
        priority: formData.priority,
        projectId: formData.projectId,
        // 답글인 경우 parentId 추가
        ...(parentId && { parentId: parseInt(parentId, 10) }),
      };

      console.log("전송할 데이터:", requestData);
      const response = await createPost(requestData);

      if (response.success || response.message?.includes("완료")) {
        // 성공 시 바로 목록 페이지로 이동 (alert 제거로 부드러운 UX)
        navigate("/posts");
      } else {
        throw new Error(response.message || "게시글 생성에 실패했습니다.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "게시글 생성 중 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("게시글 생성 중 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/posts");
  };

  return (
    <PageContainer>
      <MainContentWrapper>
        <CreateForm onSubmit={handleSubmit}>
          <FormTitle>{parentId ? "답글 작성" : "새 게시글 작성"}</FormTitle>

          <FormGroup>
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="게시글 제목을 입력하세요"
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

          <FormGroup>
            <Label htmlFor="content">내용 *</Label>
            <TextArea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="게시글 내용을 입력하세요"
              rows={10}
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
              {loading ? "생성 중..." : "게시글 생성"}
            </SubmitButton>
          </ButtonGroup>
        </CreateForm>
      </MainContentWrapper>
    </PageContainer>
  );
}
