import React, { useRef, useEffect } from "react";
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

const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 0.25rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;

  input[type="radio"] {
    accent-color: #fdb924;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  ${(props) =>
    props.$variant === "primary"
      ? `
    background-color: #3b82f6;
    color: white;

    &:hover {
      background-color: #2563eb;
    }
  `
      : `
    background-color: #f3f4f6;
    color: #4b5563;

    &:hover {
      background-color: #e5e7eb;
    }
  `}
`;

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData: any;
}

export default function CompanyEditModal({
  open,
  onClose,
  onSave,
  initialData,
}: Props) {
  const reg1 = useRef<HTMLInputElement>(null);
  const reg2 = useRef<HTMLInputElement>(null);
  const reg3 = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (open && formRef.current && initialData) {
      // 폼 값 세팅
      formRef.current.name.value = initialData.name || "";
      formRef.current.companyType.value = initialData.companyType || "";
      const [r1, r2, r3] = (initialData.reg || "").split("-");
      formRef.current.reg1.value = r1 || "";
      formRef.current.reg2.value = r2 || "";
      formRef.current.reg3.value = r3 || "";
      formRef.current.addr.value = initialData.addr || "";
      formRef.current.owner.value = initialData.owner || "";
      formRef.current.email.value = initialData.email || "";
      formRef.current.phone.value = initialData.phone || "";
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleRegInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    len: number,
    nextRef?: React.RefObject<HTMLInputElement>
  ) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > len) value = value.slice(0, len);
    e.target.value = value;
    if (value.length === len && nextRef) nextRef.current?.focus();
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>회사 정보 수정</Title>
        <Form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.currentTarget));
            onSave(data);
          }}
        >
          <FormGroup>
            <Label>회사명</Label>
            <Input name="name" required placeholder="회사명을 입력하세요" />
          </FormGroup>
          <FormGroup>
            <Label>회사 구분</Label>
            <RadioGroup>
              <RadioLabel>
                <input
                  type="radio"
                  name="companyType"
                  value="CLIENT"
                  required
                />
                고객사
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  name="companyType"
                  value="AGENCY"
                  required
                />
                개발사
              </RadioLabel>
            </RadioGroup>
          </FormGroup>
          <FormGroup>
            <Label>사업자등록번호</Label>
            <div className="flex gap-2">
              <Input
                name="reg1"
                required
                ref={reg1}
                maxLength={3}
                className="w-14 border rounded px-2 py-2 text-center"
                placeholder="000"
                onInput={(e) => handleRegInput(e as any, 3, reg2)}
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <span className="self-center">-</span>
              <Input
                name="reg2"
                required
                ref={reg2}
                maxLength={2}
                className="w-10 border rounded px-2 py-2 text-center"
                placeholder="00"
                onInput={(e) => handleRegInput(e as any, 2, reg3)}
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <span className="self-center">-</span>
              <Input
                name="reg3"
                required
                ref={reg3}
                maxLength={5}
                className="w-16 border rounded px-2 py-2 text-center"
                placeholder="00000"
                onInput={(e) => handleRegInput(e as any, 5)}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
          </FormGroup>
          <FormGroup>
            <Label>주소</Label>
            <Input name="addr" required placeholder="주소를 입력하세요" />
          </FormGroup>
          <FormGroup>
            <Label>사업자 명</Label>
            <Input name="owner" required placeholder="사업자 명을 입력하세요" />
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
            <Input name="phone" required placeholder="010-0000-0000" />
          </FormGroup>
          <ButtonGroup>
            <Button type="button" onClick={onClose} $variant="secondary">
              취소
            </Button>
            <Button type="submit" $variant="primary">
              저장
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}
