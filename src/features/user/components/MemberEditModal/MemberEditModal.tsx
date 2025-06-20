import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import { IoMdClose } from "react-icons/io";
import {
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoBusinessOutline,
  IoShieldOutline,
} from "react-icons/io5";
import { FiEdit3 } from "react-icons/fi";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  Form,
  FormSection,
  FormRow,
  FormGroup,
  Label,
  Input,
  Select,
  ButtonGroup,
  CancelButton,
  SubmitButton,
} from "./MemberEditModal.styled";
import type { MemberFormData } from "../../pages/MemberPage";
import type { Member } from "../../pages/MemberPage";

interface Company {
  id: number;
  name: string;
}

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
    username: "",
    name: "",
    companyId: 0,
    role: "Member",
    position: "",
    phone: "",
    email: "",
  });
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    if (initialData) {
      const mappedData: MemberFormData = {
        username: initialData.username,
        name: initialData.name,
        companyId: Number(initialData.companyId),
        role: initialData.role,
        position: initialData.position,
        phone: initialData.phone,
        email: initialData.email,
      };
      setFormData(mappedData);
    }
  }, [initialData]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get("/api/companies");
        setCompanies(response.data.data.content);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        alert("회사 목록을 불러오는 데 실패했습니다.");
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
      role: name === "role" ? (value as "Manager" | "Member") : prev.role,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValidCompany = companies.some((c) => c.id === formData.companyId);
    if (!isValidCompany && formData.companyId !== 0) {
      alert("선택된 회사가 유효하지 않습니다.");
      return;
    }

    onEdit(formData);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <FiEdit3 />
            회원 정보 수정
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <IoMdClose />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            {/* 기본 정보 섹션 */}
            <FormSection>
              <FormRow>
                <FormGroup>
                  <Label>
                    <IoPersonOutline />
                    아이디
                  </Label>
                  <Input
                    name="username"
                    required
                    placeholder="아이디를 입력하세요"
                    value={formData.username || ""}
                    onChange={handleChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IoPersonOutline />
                    이름
                  </Label>
                  <Input
                    name="name"
                    required
                    placeholder="이름을 입력하세요"
                    value={formData.name || ""}
                    onChange={handleChange}
                  />
                </FormGroup>
              </FormRow>
            </FormSection>

            {/* 회사 정보 섹션 */}
            <FormSection>
              <FormRow>
                <FormGroup>
                  <Label>
                    <IoBusinessOutline />
                    회사
                  </Label>
                  <Select
                    name="companyId"
                    required
                    value={formData.companyId.toString() || ""}
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
                  <Label>
                    <IoShieldOutline />
                    권한
                  </Label>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="Manager">Manager</option>
                    <option value="Member">Member</option>
                  </Select>
                </FormGroup>
              </FormRow>
            </FormSection>

            {/* 연락처 정보 섹션 */}
            <FormSection>
              <FormRow>
                <FormGroup>
                  <Label>
                    <IoCallOutline />
                    전화번호
                  </Label>
                  <Input
                    name="phone"
                    required
                    placeholder="전화번호를 입력하세요"
                    value={formData.phone || ""}
                    onChange={handleChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IoMailOutline />
                    이메일
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    required
                    placeholder="이메일을 입력하세요"
                    value={formData.email || ""}
                    onChange={handleChange}
                  />
                </FormGroup>
              </FormRow>
            </FormSection>

            {/* 직장 정보 섹션 */}
            <FormSection>
              <FormRow>
                <FormGroup>
                  <Label>
                    <IoPersonOutline />
                    직책
                  </Label>
                  <Input
                    name="position"
                    required
                    placeholder="직책을 입력하세요"
                    value={formData.position || ""}
                    onChange={handleChange}
                  />
                </FormGroup>
              </FormRow>
            </FormSection>

            <ButtonGroup>
              <CancelButton type="button" onClick={handleClose}>
                취소
              </CancelButton>
              <SubmitButton type="submit">
                <FiEdit3 />
                저장
              </SubmitButton>
            </ButtonGroup>
          </Form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}
