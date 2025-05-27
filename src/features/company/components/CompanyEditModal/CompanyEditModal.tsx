import React, { useRef, useEffect, useState } from "react";
import {
  ModalOverlay,
  ModalContent,
  CloseButton,
  Title,
  Form,
  FormGroup,
  Label,
  Input,
  ButtonGroup,
  Button,
  RadioGroup,
  RadioLabel,
} from "./CompanyEditModal.styled";

interface CompanyData {
  name?: string;
  companyType?: "CLIENT" | "AGENCY"; // 회사 유형을 더 구체적으로 정의
  reg?: string;
  addr?: string;
  owner?: string;
  email?: string;
  phone?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: CompanyData) => void;
  initialData: CompanyData;
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
  const [formData, setFormData] = useState<CompanyData>(initialData || {});

  useEffect(() => {
    if (open && initialData) {
      // 폼 값 세팅
      setFormData(initialData);
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleRegInput = (
    e: React.FormEvent<HTMLInputElement>,
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>회사 정보 수정</Title>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
        >
          <FormGroup>
            <Label>회사명</Label>
            <Input
              name="name"
              required
              placeholder="회사명을 입력하세요"
              value={formData.name || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>회사 유형</Label>
            <RadioGroup>
              <RadioLabel>
                <input
                  type="radio"
                  name="companyType"
                  value="CLIENT"
                  checked={formData.companyType === "CLIENT"}
                  onChange={handleChange}
                />
                고객사
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  name="companyType"
                  value="AGENCY"
                  checked={formData.companyType === "AGENCY"}
                  onChange={handleChange}
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
                onInput={(e) => handleRegInput(e, 3, reg2)}
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.reg?.split("-")[0] || ""}
                onChange={handleChange}
              />
              <span className="self-center">-</span>
              <Input
                name="reg2"
                required
                ref={reg2}
                maxLength={2}
                className="w-10 border rounded px-2 py-2 text-center"
                placeholder="00"
                onInput={(e) => handleRegInput(e, 2, reg3)}
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.reg?.split("-")[1] || ""}
                onChange={handleChange}
              />
              <span className="self-center">-</span>
              <Input
                name="reg3"
                required
                ref={reg3}
                maxLength={5}
                className="w-16 border rounded px-2 py-2 text-center"
                placeholder="00000"
                onInput={(e) => handleRegInput(e, 5)}
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.reg?.split("-")[2] || ""}
                onChange={handleChange}
              />
            </div>
          </FormGroup>
          <FormGroup>
            <Label>주소</Label>
            <Input
              name="addr"
              required
              placeholder="주소를 입력하세요"
              value={formData.addr || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>사업자 명</Label>
            <Input
              name="owner"
              required
              placeholder="사업자 명을 입력하세요"
              value={formData.owner || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>이메일</Label>
            <Input
              name="email"
              type="email"
              required
              placeholder="이메일을 입력하세요"
              value={formData.email || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>연락처</Label>
            <Input
              name="phone"
              required
              placeholder="010-0000-0000"
              value={formData.phone || ""}
              onChange={handleChange}
            />
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
