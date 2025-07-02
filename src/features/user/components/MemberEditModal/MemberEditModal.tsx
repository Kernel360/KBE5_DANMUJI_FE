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
import type { Member } from "../../pages/MemberPage";
import ReactSelect from "react-select";
import CompanyRegisterModal from "@/features/company/components/CompanyRegisterModal";

interface Company {
  id: number;
  name: string;
}

export interface MemberFormData {
  username: string;
  name: string;
  companyId?: number;
  role: string;
  position: string;
  phone: string;
  email: string;
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
  const [formData, setFormData] = useState<
    Omit<MemberFormData, "companyId"> & { companyId: number | "" }
  >({
    username: "",
    name: "",
    companyId: "",
    role: "Member",
    position: "",
    phone: "",
    email: "",
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username,
        name: initialData.name,
        companyId:
          initialData.companyId === undefined || initialData.companyId === null
            ? ""
            : Number(initialData.companyId),
        role: initialData.role,
        position: initialData.position,
        phone: initialData.phone,
        email: initialData.email,
      });
    }
  }, [initialData]);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/api/companies/all");
      setCompanies(res.data.data);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      setCompanies([]);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "companyId" ? (value === "" ? "" : Number(value)) : value,
      role: name === "role" ? (value as "Manager" | "Member") : prev.role,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      formData.companyId === "" ||
      formData.companyId === 0 ||
      formData.companyId === undefined
    ) {
      onEdit({
        ...formData,
        companyId: undefined,
      });
      return;
    }

    const isValidCompany = companies.some((c) => c.id === formData.companyId);
    if (!isValidCompany) {
      alert("선택된 업체가 유효하지 않습니다.");
      return;
    }

    onEdit({
      ...formData,
      phone: formData.phone.replace(/\D/g, ""),
      companyId:
        typeof formData.companyId === "number" ? formData.companyId : undefined,
    });
  };

  const handleClose = () => {
    onClose();
  };

  const handleCompanyRegisterSuccess = () => {
    setCompanyModalOpen(false);
    fetchCompanies();
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <ModalOverlay>
      <ModalContent>
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
            {/* 아이디 */}
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
                    readOnly
                  />
                </FormGroup>
                <FormGroup />
              </FormRow>
            </FormSection>

            {/* 업체 + 직책 */}
            <FormSection>
              <FormRow>
                <FormGroup>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Label style={{ marginBottom: 0 }}>
                      <IoBusinessOutline />
                      업체
                    </Label>
                    <button
                      type="button"
                      style={{
                        fontSize: 11,
                        background: "#fbbf24",
                        color: "#fff",
                        border: "none",
                        borderRadius: 5,
                        padding: "2px 8px",
                        cursor: "pointer",
                        height: 22,
                        lineHeight: 1,
                      }}
                      onClick={() => setCompanyModalOpen(true)}
                    >
                      업체 등록
                    </button>
                  </div>
                  <ReactSelect
                    options={Array.isArray(companies) ? companies.map((company) => ({
                      value: company.id,
                      label: company.name,
                    })) : []}
                    isClearable
                    isSearchable
                    placeholder="업체 선택"
                    value={
                      companies && formData.companyId !== ""
                        ? companies
                            .map((company) => ({
                              value: company.id,
                              label: company.name,
                            }))
                            .find((option) => option.value === formData.companyId) || null
                        : null
                    }
                    onChange={(selected) => {
                      setFormData((prev) => ({
                        ...prev,
                        companyId: selected ? selected.value : "",
                      }));
                    }}
                    styles={{
                      menu: (base) => ({
                        ...base,
                        maxHeight: 220,
                        minWidth: '100%',
                        width: '100%',
                        zIndex: 9999,
                      }),
                      option: (base, state) => ({
                        ...base,
                        minHeight: 40,
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: state.isSelected
                          ? '#fdb924'
                          : state.isFocused
                          ? '#fef3c7'
                          : '#fff',
                        color: state.isSelected ? '#fff' : '#222',
                        fontWeight: state.isSelected ? 700 : 500,
                        cursor: 'pointer',
                      }),
                      control: (base) => ({
                        ...base,
                        minHeight: 40,
                        borderRadius: 8,
                        borderColor: '#e5e7eb',
                        boxShadow: 'none',
                        '&:hover': { borderColor: '#fdb924' },
                      }),
                      menuList: (base) => ({
                        ...base,
                        maxHeight: 220,
                        paddingTop: 0,
                        paddingBottom: 0,
                      }),
                    }}
                  />
                  {companyModalOpen && (
                    <CompanyRegisterModal
                      open={companyModalOpen}
                      onClose={() => setCompanyModalOpen(false)}
                      onRegisterSuccess={handleCompanyRegisterSuccess}
                    />
                  )}
                </FormGroup>
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

            {/* 이름 + 권한 */}
            <FormSection>
              <FormRow>
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

            {/* 이메일 + 전화번호 */}
            <FormSection>
              <FormRow>
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
                    type="tel"
                    inputMode="numeric"
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
