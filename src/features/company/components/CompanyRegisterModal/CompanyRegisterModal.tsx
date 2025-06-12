import api from "@/api/axios";
import React, { useRef } from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: 420px;
  padding: 2rem;
  position: relative;
`;

const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.1);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #9ca3af;
  font-size: 1.25rem;
  cursor: pointer;

  &:hover {
    color: #4b5563;
  }
`;

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.1);
  }
`;

const RegNumberRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const RegInput = styled(Input)`
  width: 3.5rem;
  text-align: center;
  padding-left: 0;
  padding-right: 0;
`;

interface Props {
  open: boolean;
  onClose: () => void;
  onRegisterSuccess?: () => void; // ✅ 새로 추가
}

export default function CompanyRegisterModal({
  open,
  onClose,
  onRegisterSuccess
}: Props) {
  const reg1 = useRef<HTMLInputElement>(null);
  const reg2 = useRef<HTMLInputElement>(null);
  const reg3 = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) return null;

  const handleRegInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    len: number,
    nextRef?: React.RefObject<HTMLInputElement | null>
  ) => {
    const target = e.target as HTMLInputElement;
    let value = target.value.replace(/[^0-9]/g, "");
    if (value.length > len) value = value.slice(0, len);
    target.value = value;
    if (value.length === len && nextRef?.current) {
      nextRef.current.focus();
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>회사 등록</Title>
        <Form
            ref={formRef}
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = Object.fromEntries(formData) as { [key: string]: string };

              // 사업자등록번호 결합
              const bizNo = `${data.reg1}${data.reg2}${data.reg3}`;

              const requestBody = {
                name: data.name,
                bizNo,
                address: data.address,
                ceoName: data.ceoName,
                email: data.email,
                tel: data.tel,
                bio: data.bio
              };

              try {
                await api.post("/api/companies", requestBody);

                // 성공 시 후처리 (예: 알림, 모달 닫기 등)
                alert("회사 등록이 완료되었습니다!");
                onClose();
                onRegisterSuccess?.();
              } catch (error) {
                console.error(error);
                alert("회사 등록 중 오류가 발생했습니다.");
              }
            }}
          >
          <FormGroup>
            <Label>회사명</Label>
            <Input name="name" required placeholder="회사명을 입력하세요" />
          </FormGroup>
          <FormGroup>
            <Label>사업자등록번호</Label>
            <RegNumberRow>
              <RegInput
                name="reg1"
                required
                ref={reg1}
                maxLength={3}
                placeholder="000"
                onChange={(e) => handleRegInput(e, 3, reg2)}
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <span>-</span>
              <RegInput
                name="reg2"
                required
                ref={reg2}
                maxLength={2}
                placeholder="00"
                onChange={(e) => handleRegInput(e, 2, reg3)}
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <span>-</span>
              <RegInput
                name="reg3"
                required
                ref={reg3}
                maxLength={5}
                placeholder="00000"
                onChange={(e) => handleRegInput(e, 5)}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </RegNumberRow>
          </FormGroup>
          <FormGroup>
            <Label>주소</Label>
            <Input name="address" required placeholder="주소를 입력하세요" />
          </FormGroup>
          <FormGroup>
            <Label>사업자 명</Label>
            <Input name="ceoName" required placeholder="사업자 명을 입력하세요" />
          </FormGroup>
          <FormGroup>
            <Label>이메일</Label>
            <Input
              name="email"
              type="email"
              required
              placeholder="이메일을 입력하세요"
            />
          </FormGroup>
          <FormGroup>
            <Label>연락처</Label>
            <Input name="tel" required placeholder="010-0000-0000" />
          </FormGroup>
          <FormGroup>
            <Label>소개</Label>
            <TextArea
              name="bio"
              placeholder="회사에 대한 소개를 입력하세요"
              rows={4}
            />
          </FormGroup>
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
            >
              등록
            </button>
          </div>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}
