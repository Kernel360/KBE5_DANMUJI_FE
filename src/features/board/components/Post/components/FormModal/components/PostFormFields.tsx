import React from "react";
import {
  FormGroup,
  Label,
  Input,
  Select,
  ErrorMessage,
  RelativeTextareaWrapper,
  ResizeGuide,
} from "@/features/board/components/Post/styles/PostFormModal.styled";
import { PostType, PostStatus } from "@/features/project-d/types/post";
import MentionTextArea from "@/components/MentionTextArea";

interface PostFormFieldsProps {
  formData: {
    title: string;
    content: string;
    type: PostType;
    priority: number;
    status: PostStatus;
  };
  mode: "create" | "edit";
  parentId?: number;
  formErrors: Record<string, string>;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

const PostFormFields: React.FC<PostFormFieldsProps> = ({
  formData,
  mode,
  parentId,
  formErrors,
  onChange,
}) => {
  // @ 기능을 위한 content 변경 핸들러
  const handleContentChange = (newContent: string) => {
    // 기존 onChange와 호환되도록 이벤트 객체를 시뮬레이션
    const syntheticEvent = {
      target: {
        name: "content",
        value: newContent,
      },
    } as React.ChangeEvent<HTMLTextAreaElement>;

    onChange(syntheticEvent);
  };

  return (
    <>
      <FormGroup>
        <Label htmlFor="title">제목 *</Label>
        <Input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={onChange}
          placeholder={
            parentId ? "답글 제목을 입력하세요" : "게시글 제목을 입력하세요"
          }
          required
        />
        {formErrors.title && <ErrorMessage>{formErrors.title}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="type">유형 *</Label>
        <Select
          id="type"
          name="type"
          value={formData.type}
          onChange={onChange}
          required
        >
          <option value="">유형을 선택하세요</option>
          <option value="NOTICE">공지사항</option>
          <option value="QUESTION">질문</option>
          <option value="GENERAL">일반</option>
        </Select>
        {formErrors.type && <ErrorMessage>{formErrors.type}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="priority">우선순위 *</Label>
        <Select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={onChange}
          required
        >
          <option value="">우선순위를 선택하세요</option>
          <option value={1}>낮음</option>
          <option value={2}>보통</option>
          <option value={3}>높음</option>
          <option value={4}>긴급</option>
        </Select>
        {formErrors.priority && (
          <ErrorMessage>{formErrors.priority}</ErrorMessage>
        )}
      </FormGroup>

      {mode === "edit" && (
        <FormGroup>
          <Label htmlFor="status">상태 *</Label>
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={onChange}
            required
          >
            <option value="">상태를 선택하세요</option>
            <option value="OPEN">열림</option>
            <option value="IN_PROGRESS">진행중</option>
            <option value="RESOLVED">해결됨</option>
            <option value="CLOSED">닫힘</option>
          </Select>
          {formErrors.status && (
            <ErrorMessage>{formErrors.status}</ErrorMessage>
          )}
        </FormGroup>
      )}

      <FormGroup>
        <Label htmlFor="content">내용 *</Label>
        <RelativeTextareaWrapper>
          <MentionTextArea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleContentChange}
            placeholder="게시글 내용을 입력하세요. @를 입력하여 사용자를 언급할 수 있습니다. (크기 조절 가능)"
            rows={8}
          />
          <ResizeGuide>
            <svg width="16" height="16" viewBox="0 0 18 18">
              <path
                d="M6 16h2v-2H6v2zm4 0h2v-4h-2v4zm4 0h2v-6h-2v6z"
                fill="#bdbdbd"
              />
            </svg>
            크기조절
          </ResizeGuide>
        </RelativeTextareaWrapper>
        {formErrors.content && (
          <ErrorMessage>{formErrors.content}</ErrorMessage>
        )}
      </FormGroup>
    </>
  );
};

export default PostFormFields;
