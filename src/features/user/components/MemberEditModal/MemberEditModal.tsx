import React, { useEffect, useState, useRef } from "react";
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

// 전화번호 자동 하이픈 함수
function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  // 1588-1588, 1544-1234 등 8자리 대표번호
  if (/^1[0-9]{3}[0-9]{4}$/.test(cleaned)) {
    return cleaned.replace(/(\d{4})(\d{4})/, '$1-$2');
  }
  // 02-xxxx-xxxx (서울 2자리 지역번호)
  if (/^02\d{8}$/.test(cleaned)) {
    return cleaned.replace(/(02)(\d{4})(\d{4})/, '$1-$2-$3');
  }
  // 02-xxx-xxxx (서울 2자리 지역번호, 7자리)
  if (/^02\d{7}$/.test(cleaned)) {
    return cleaned.replace(/(02)(\d{3})(\d{4})/, '$1-$2-$3');
  }
  // 0xx-xxx-xxxx (3자리 지역번호)
  if (/^0\d{2}\d{3}\d{4}$/.test(cleaned)) {
    return cleaned.replace(/(0\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  // 0xx-xxxx-xxxx (3자리 지역번호, 11자리)
  if (/^0\d{2}\d{4}\d{4}$/.test(cleaned)) {
    return cleaned.replace(/(0\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  // 010-xxxx-xxxx (휴대폰)
  if (/^01[016789]\d{7,8}$/.test(cleaned)) {
    if (cleaned.length === 11) {
      return cleaned.replace(/(01[016789])(\d{4})(\d{4})/, '$1-$2-$3');
    } else {
      return cleaned.replace(/(01[016789])(\d{3})(\d{4})/, '$1-$2-$3');
    }
  }
  // fallback: 그냥 숫자만
  return cleaned;
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
  const modalRef = useRef<HTMLDivElement>(null);

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
        phone: formatPhoneNumber(initialData.phone || ""),
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
    setFormData((prev) => {
      if (name === "companyId") {
        return { ...prev, [name]: value === "" ? "" : Number(value), role: prev.role };
      }
      if (name === "phone") {
        return { ...prev, phone: formatPhoneNumber(value), role: prev.role };
      }
      return {
        ...prev,
        [name]: value,
        role: name === "role" ? (value as "Manager" | "Member") : prev.role,
      };
    });
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

    if (formData.name.length < 2 || formData.name.length > 30) {
      alert("이름은 2자 이상 30자 이하로 입력해주세요.");
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
        const modals = document.querySelectorAll('.custom-modal-class');
        if (modals.length && modals[modals.length - 1] === modalRef.current) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <ModalOverlay ref={modalRef} className="custom-modal-class">
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
                    maxLength={50}
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
                    maxLength={50}
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
                    minLength={2}
                    maxLength={30}
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
                    maxLength={50}
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
                    placeholder="전화번호를 입력하세요 ('-'없이 입력)"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    type="tel"
                    inputMode="numeric"
                    maxLength={13}
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
