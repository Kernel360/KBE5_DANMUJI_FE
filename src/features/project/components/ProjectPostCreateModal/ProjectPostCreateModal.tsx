import React, { useState } from "react";
import type { PostCreateData } from "../../types/post";
import {
  ModalOverlay,
  ModalPanel,
  ModalHeader,
  HeaderTitle,
  CloseButton,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Select,
  TextArea,
  ButtonGroup,
  SubmitButton,
  CancelButton,
} from "./ProjectPostCreateModal.styled.ts";

interface ProjectPostCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PostCreateData) => void;
}

const ProjectPostCreateModal: React.FC<ProjectPostCreateModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<PostCreateData>({
    title: "",
    content: "",
    type: "GENERAL",
    status: "PENDING",
    priority: 1,
    projectId: 1, // TODO: 실제 프로젝트 ID로 변경
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!open) return null;

  return (
    <ModalOverlay>
      <ModalPanel>
        <ModalHeader>
          <HeaderTitle>게시글 작성</HeaderTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="content">내용</Label>
              <TextArea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="type">유형</Label>
              <Select
                id="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as PostCreateData["type"],
                  })
                }
              >
                <option value="GENERAL">일반</option>
                <option value="QUESTION">질문</option>
                <option value="REPORT">보고</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="priority">우선순위</Label>
              <Select
                id="priority"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: parseInt(e.target.value),
                  })
                }
              >
                <option value={1}>낮음</option>
                <option value={2}>중간</option>
                <option value={3}>높음</option>
              </Select>
            </FormGroup>

            <ButtonGroup>
              <CancelButton type="button" onClick={onClose}>
                취소
              </CancelButton>
              <SubmitButton type="submit">등록</SubmitButton>
            </ButtonGroup>
          </Form>
        </ModalBody>
      </ModalPanel>
    </ModalOverlay>
  );
};

export default ProjectPostCreateModal;
