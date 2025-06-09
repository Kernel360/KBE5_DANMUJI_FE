import React, { useRef, useEffect, useState } from "react";
import styled from 'styled-components';
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
} from "./CompanyEditModal.styled";

interface CompanyData {
  name?: string;
  bizNo?: number;
  address?: string;
  ceoName?: string;
  email?: string;
  tel?: string;
  bio?: string;
}

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
  onSave: (data: CompanyData) => void;
  initialData: CompanyData | null;
}

export default function CompanyEditModal({
  open,
  onClose,
  onSave,
  initialData,
}: Props) {
  const reg1Ref = useRef<HTMLInputElement>(null);
  const reg2Ref = useRef<HTMLInputElement>(null);
  const reg3Ref = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CompanyData>(initialData || {});
  const [reg1, setReg1] = useState("");
  const [reg2, setReg2] = useState("");
  const [reg3, setReg3] = useState("");

  useEffect(() => {
    if (open && initialData) {
      setFormData(initialData);
      if (initialData.bizNo !== undefined && initialData.bizNo !== null) {
        const regStr = String(initialData.bizNo).padStart(10, "0");
        setReg1(regStr.slice(0, 3));
        setReg2(regStr.slice(3, 5));
        setReg3(regStr.slice(5));
      } else {
        setReg1("");
        setReg2("");
        setReg3("");
      }
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleRegInput = (
    e: React.FormEvent<HTMLInputElement>,
    len: number,
    setReg: React.Dispatch<React.SetStateAction<string>>,
    nextRef?: React.RefObject<HTMLInputElement>
  ) => {
    let value = e.currentTarget.value.replace(/[^0-9]/g, "");
    if (value.length > len) value = value.slice(0, len);
    setReg(value);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullBizNo = reg1 + reg2 + reg3;
    const finalData: CompanyData = {
      ...formData,
      bizNo: fullBizNo.length === 10 ? Number(fullBizNo) : undefined,
    };
    onSave(finalData);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>회사 정보 수정</Title>
        <Form onSubmit={handleSubmit}>
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
            <Label>사업자등록번호</Label>
            <RegNumberRow>
              <RegInput
                ref={reg1Ref}
                maxLength={3}
                placeholder="000"
                inputMode="numeric"
                value={reg1}
                onInput={(e) => handleRegInput(e, 3, setReg1, reg2Ref)}
              />
              <span>-</span>
              <RegInput
                ref={reg2Ref}
                maxLength={2}
                placeholder="00"
                inputMode="numeric"
                value={reg2}
                onInput={(e) => handleRegInput(e, 2, setReg2, reg3Ref)}
              />
              <span>-</span>
              <RegInput
                ref={reg3Ref}
                maxLength={5}
                placeholder="00000"
                inputMode="numeric"
                value={reg3}
                onInput={(e) => handleRegInput(e, 5, setReg3)}
              />
            </RegNumberRow>
          </FormGroup>
          <FormGroup>
            <Label>주소</Label>
            <Input
              name="address"
              required
              placeholder="주소를 입력하세요"
              value={formData.address || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>사업자 명</Label>
            <Input
              name="ceoName"
              required
              placeholder="사업자 명을 입력하세요"
              value={formData.ceoName || ""}
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
              name="tel"
              required
              placeholder="010-0000-0000"
              value={formData.tel || ""}
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
