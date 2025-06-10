import React, { useState } from "react";
import { createAnswer } from "../../services/questionService";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  FormGroup,
  Label,
  TextArea,
  ButtonGroup,
  SubmitButton,
  CancelButton,
  ErrorMessage,
} from "./AnswerCreateModal.styled";

interface AnswerCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: string;
  onAnswerCreated?: () => void;
}

const AnswerCreateModal: React.FC<AnswerCreateModalProps> = ({
  isOpen,
  onClose,
  questionId,
  onAnswerCreated,
}) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("답변 내용을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createAnswer({
        questionId,
        content: content.trim(),
      });

      // 성공 시 폼 초기화
      setContent("");
      onAnswerCreated?.();
      onClose();
    } catch (err) {
      setError("답변 생성에 실패했습니다. 다시 시도해주세요.");
      console.error("Error creating answer:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setContent("");
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>답변 작성</ModalTitle>
          <CloseButton onClick={handleClose} disabled={loading}>
            ×
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="content">답변 내용 *</Label>
              <TextArea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="질문에 대한 답변을 자세히 작성해주세요"
                rows={8}
                maxLength={2000}
                disabled={loading}
              />
            </FormGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <ButtonGroup>
              <CancelButton
                type="button"
                onClick={handleClose}
                disabled={loading}
              >
                취소
              </CancelButton>
              <SubmitButton type="submit" disabled={loading || !content.trim()}>
                {loading ? "작성 중..." : "답변 작성"}
              </SubmitButton>
            </ButtonGroup>
          </form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AnswerCreateModal;
