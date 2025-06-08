import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPostDetail,
  updatePost,
} from "@/features/project/services/postService";
import type { Post, PostUpdateRequest } from "@/features/project/types/post";
import {
  PageContainer,
  MainContentWrapper,
  EditForm,
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
} from "./PostEditPage.styled";

export default function PostEditPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<PostUpdateRequest>({
    title: "",
    content: "",
    type: "GENERAL",
    priority: 1,
    status: "PENDING",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!postId) {
      setError("게시글 ID가 제공되지 않았습니다.");
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await getPostDetail(parseInt(postId));
        setPost(response.data);
        setFormData({
          title: response.data.title,
          content: response.data.content,
          type: response.data.type,
          priority: response.data.priority,
          status: response.data.status,
        });
      } catch (err) {
        setError("게시글을 불러오는 데 실패했습니다.");
        console.error("게시글 로드 중 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
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
    if (!postId || !validateForm()) return;

    try {
      setLoading(true);
      const response = await updatePost(parseInt(postId), formData);
      if (response.status === "OK") {
        alert("게시글이 성공적으로 수정되었습니다.");
        navigate(`/posts/${postId}`);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError("게시글 수정 중 오류가 발생했습니다.");
      console.error("게시글 수정 중 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageContainer>로딩 중...</PageContainer>;
  if (error) return <PageContainer>{error}</PageContainer>;
  if (!post) return <PageContainer>게시글을 찾을 수 없습니다.</PageContainer>;

  return (
    <PageContainer>
      <MainContentWrapper>
        <EditForm onSubmit={handleSubmit}>
          <FormTitle>게시글 수정</FormTitle>

          <FormGroup>
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
            />
            {formErrors.title && (
              <ErrorMessage>{formErrors.title}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="content">내용</Label>
            <TextArea
              id="content"
              name="content"
              rows={10}
              value={formData.content}
              onChange={handleChange}
            />
            {formErrors.content && (
              <ErrorMessage>{formErrors.content}</ErrorMessage>
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
              <option value="QUESTION">질문</option>
              <option value="REPORT">보고</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="priority">우선순위</Label>
            <Input
              id="priority"
              name="priority"
              type="number"
              min="1"
              max="5"
              value={formData.priority}
              onChange={handleChange}
            />
          </FormGroup>

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
              <option value="REJECTED">반려</option>
            </Select>
          </FormGroup>

          <ButtonGroup>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? "저장 중..." : "수정 완료"}
            </SubmitButton>
            <CancelButton type="button" onClick={() => navigate(-1)}>
              취소
            </CancelButton>
          </ButtonGroup>
        </EditForm>
      </MainContentWrapper>
    </PageContainer>
  );
}
