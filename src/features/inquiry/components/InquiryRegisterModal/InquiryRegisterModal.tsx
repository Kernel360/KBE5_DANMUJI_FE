import React, { useState } from "react";
import styled from "styled-components";
import { FiX, FiPlus, FiMessageSquare } from "react-icons/fi";
import api from "../../../../api/axios";
import { showSuccessToast } from "../../../../utils/errorHandler";

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(253, 185, 36, 0.1);
  width: 600px;
  padding: 24px;
  position: relative;
  animation: modalSlideIn 0.2s ease-out;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: #f8fafc;
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #475569;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1e293b;

  svg {
    color: #fdb924;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;

  svg {
    color: #f59e0b;
  }
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  background-color: #ffffff;
  color: #374151;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  background-color: #ffffff;
  color: #374151;
  resize: vertical;
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
`;

const CancelButton = styled.button`
  background-color: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e2e8f0;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #fdb924 0%, #f59e0b 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(253, 185, 36, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;


interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function InquiryRegisterModal({ onClose, onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/api/inquiries', { title, content });
      showSuccessToast("문의가 성공적으로 등록되었습니다.");
      onSuccess();
    } catch (error) {
      console.error("문의 등록 실패:", error);
      alert("문의 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>
          <FiX size={20} />
        </CloseButton>
        <Title>
          <FiMessageSquare />
          <span>문의 등록</span>
        </Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="문의 제목을 입력하세요"
              required
              maxLength={255}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="content">내용</Label>
            <TextArea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="문의 내용을 입력하세요"
              required
              maxLength={255}
            />
          </FormGroup>
          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              취소
            </CancelButton>
            <SubmitButton type="submit" disabled={isLoading}>
              <FiPlus />
              {isLoading ? "등록 중..." : "등록하기"}
            </SubmitButton>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
} 