import React from "react";
import {
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  ErrorMessage,
} from "@/features/board/components/Post/styles/PostFormModal.styled";
import { PostType, PostStatus } from "@/features/project/types/post";

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
        <Label htmlFor="type">유형</Label>
        <Select id="type" name="type" value={formData.type} onChange={onChange}>
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
          onChange={onChange}
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
            onChange={onChange}
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
          onChange={onChange}
          placeholder="게시글 내용을 입력하세요"
          rows={8}
          required
        />
        {formErrors.content && (
          <ErrorMessage>{formErrors.content}</ErrorMessage>
        )}
      </FormGroup>
    </>
  );
};

export default PostFormFields;
