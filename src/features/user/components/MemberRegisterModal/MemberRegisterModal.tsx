import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import {
  ModalOverlay,
  ModalContent,
  CloseButton,
  Title,
  Form,
  FormGroup,
  Label,
  Input,
  Select,
  ButtonGroup,
  Button,
} from "./MemberRegisterModal.styled";
import type { MemberFormData } from "../../pages/MemberPage";

interface Company {
  id: number;
  name: string;
}

interface Props {
  onClose: () => void;
  onRegister: (data: MemberFormData) => Promise<void>;
}

export default function MemberRegisterModal({
  onClose,
  onRegister,
}: Props) {
  const [formData, setFormData] = useState<MemberFormData>({
    username: "",
    name: "",
    email: "",
    phone: "",
    position: "",
    companyId: 0,
    role: "Member",
  });
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/api/companies');
        setCompanies(response.data.data.content);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
        alert('회사 목록을 불러오는 데 실패했습니다.');
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "companyId" ? Number(value) : value,
      role: name === "role" ? (value as 'Manager' | 'Member') : prev.role,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValidCompany = companies.some(c => c.id === formData.companyId);
    if (!isValidCompany && formData.companyId !== 0) {
      alert('선택된 회사가 유효하지 않습니다.');
      return;
    }

    try {
      await onRegister(formData);
      alert("회원 등록이 완료되었습니다!");
      onClose();
    } catch (error) {
      console.error(error);
      alert("회원 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>회원 등록</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>아이디</Label>
            <Input name="username" required placeholder="아이디를 입력하세요" value={formData.username} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label>이름</Label>
            <Input name="name" required placeholder="이름을 입력하세요" value={formData.name} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label>이메일</Label>
            <Input name="email" type="email" required placeholder="이메일을 입력하세요" value={formData.email} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label>전화번호</Label>
            <Input name="phone" required placeholder="전화번호를 입력하세요" value={formData.phone} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label>직책</Label>
            <Input name="position" required placeholder="직책을 입력하세요" value={formData.position} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label>회사</Label>
            <Select
              name="companyId"
              required
              value={formData.companyId.toString()}
              onChange={handleChange}
            >
              <option value="">회사 선택</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id.toString()}>
                  {company.name}
                </option>
              ))}
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>권한</Label>
            <Select name="role" value={formData.role} onChange={handleChange}>
              <option value="Manager">Manager</option>
              <option value="Member">Member</option>
            </Select>
          </FormGroup>
          <ButtonGroup>
            <Button type="button" onClick={onClose} $variant="secondary">
              취소
            </Button>
            <Button type="submit" $variant="primary">
              등록
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
} 