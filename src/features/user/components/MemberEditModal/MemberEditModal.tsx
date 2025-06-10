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
  Select,
} from "./MemberEditModal.styled";
import type { MemberFormData } from '../../pages/MemberPage';
import type { Member } from '../../pages/MemberPage';

interface Props {
  onClose: () => void;
  onEdit: (data: MemberFormData) => Promise<void>;
  initialData: Member | null;
}

export default function MemberEditModal({
  onClose,
  onEdit,
  initialData,
}: Props) {
  const [formData, setFormData] = useState<MemberFormData>({
    name: "",
    company: "",
    role: "Member",
    position: "",
    tel: "",
  });

  useEffect(() => {
    if (initialData) {
      const mappedData: MemberFormData = {
        name: initialData.name,
        company: initialData.company,
        role: initialData.role,
        position: initialData.position,
        tel: initialData.tel,
      };
      setFormData(mappedData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      role: name === "role" ? (value as 'Manager' | 'Member') : prev.role,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onEdit(formData);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>회원 정보 수정</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>이름</Label>
            <Input
              name="name"
              required
              placeholder="이름을 입력하세요"
              value={formData.name || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>회사</Label>
            <Input
              name="company"
              required
              placeholder="회사를 입력하세요"
              value={formData.company || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>권한</Label>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Manager">Manager</option>
              <option value="Member">Member</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>직책</Label>
            <Input
              name="position"
              required
              placeholder="직책을 입력하세요"
              value={formData.position || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>전화번호</Label>
            <Input
              name="tel"
              required
              placeholder="전화번호를 입력하세요"
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