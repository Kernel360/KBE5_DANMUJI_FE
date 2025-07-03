import React from "react";
import {
  FiX,
  FiHome,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHash,
  FiFileText,
  FiEdit3,
  FiTrash2,
} from "react-icons/fi";
import {
  ModalOverlay,
  ModalPanel,
  CloseButton,
  ModalTitle,
  Section,
  SectionTitle,
  DetailItem,
  DetailLabel,
  DetailValue,
  DetailIcon,
} from "./CompanyDetailModal.styled";
import type { Company } from "../../pages/CompanyPage";
import { formatBizNo, formatTelNo } from "../../pages/CompanyPage";
import MemberRegisterModal from "@/features/user/components/MemberRegisterModal/MemberRegisterModal";
import { useState, useEffect, useRef } from "react";
import api from "@/api/axios";
import CompanyEditModal from "../CompanyEditModal/CompanyEditModal";
import type { FieldError } from "../../pages/CompanyPage";
import type { CompanyFormData } from "../../pages/CompanyPage";
import axios from "axios";
import { useNotification } from "@/features/Notification/NotificationContext";
import { Button as ModalButton } from "@/features/user/components/MemberEditModal/MemberEditModal.styled";
import type { MemberData } from "@/features/user/components/MemberRegisterModal/MemberRegisterModal";

interface CompanyMember {
  username: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  createdAt: string;
}

interface CompanyDetailModalProps {
  open: boolean;
  onClose: () => void;
  companyId: number | null;
  onUpdated?: () => void;
}

const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
  open,
  onClose,
  companyId,
  onUpdated,
}) => {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const pageSize = 4;
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const { notify } = useNotification();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !companyId) return;
    setLoading(true);
    api.get(`/api/companies/${companyId}`)
      .then(res => {
        setCompany(res.data.data);
        return api.get(`/api/companies/${companyId}/userLists`, {
          params: { page, size: pageSize }
        });
      })
      .then(res => {
        const pageData = res.data.data;
        setMembers(pageData.content || []);
        setTotalPages((pageData.page && pageData.page.totalPages) || 1);
      })
      .catch(err => {
        console.error('구성원 정보를 불러오지 못했습니다.', err);
      })
      .finally(() => setLoading(false));
  }, [open, companyId, refreshKey, page]);

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

  const handleDelete = async () => {
    if (!company) return;
    if (window.confirm("정말 이 업체를 삭제하시겠습니까?")) {
      try {
        await api.delete(`/api/companies/${company.id}`);
        notify("업체가 성공적으로 삭제되었습니다.", true);
        onClose();
        if (onUpdated) onUpdated();
      } catch {
        notify("업체 삭제에 실패했습니다.", false);
      }
    }
  };

  const handleEditSave = async (data: CompanyFormData): Promise<void> => {
    if (!company) return;
    try {
      const bizNoCombined = parseInt(`${data.reg1}${data.reg2}${data.reg3}`, 10);
      const companyUpdateData = {
        name: data.name,
        bizNo: bizNoCombined,
        zonecode: data.zonecode,
        address: data.address,
        ceoName: data.ceoName,
        email: data.email,
        bio: data.bio,
        tel: data.tel.replace(/\D/g, ""),
      };
      await api.put(`/api/companies/${company.id}`, companyUpdateData);
      notify("업체 정보가 성공적으로 수정되었습니다.", true);
      setEditModalOpen(false);
      if (onUpdated) onUpdated();
      setRefreshKey((k) => k + 1);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data;
        if (errorData?.data?.errors) {
          setFieldErrors(errorData.data.errors);
          return;
        }
      }
      notify("업체 정보 수정에 실패했습니다.", false);
      throw err;
    }
  };

  const handleMemberRegister = async (memberData: MemberData) => {
    try {
      const response = await api.post("/api/admin", memberData);
      const { username, password } = response.data.data || {};
      if (username && password) {
        const fileContent = `Username: ${username}\nPassword: ${password}`;
        const blob = new Blob([fileContent], { type: "text/plain" });
        const fileUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "member_credentials.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      notify("회원이 성공적으로 등록되었습니다.", true);
      setRegisterOpen(false);
      setRefreshKey((k) => k + 1); // 구성원 목록 새로고침
      setCompany(null); // 업체 정보도 새로고침 (useEffect 재실행)
    } catch {
      notify("회원 등록에 실패했습니다.", false);
    }
  };

  if (!open || !company) return null;

  return (
    <ModalOverlay ref={modalRef} className="custom-modal-class">
      <ModalPanel>
        <CloseButton onClick={onClose}>
          <FiX size={20} />
        </CloseButton>
        <ModalTitle>{company.name}</ModalTitle>

        <Section>
          <SectionTitle>
            <FiHome size={16} /> 정보
          </SectionTitle>
          <DetailItem>
            <DetailIcon>
              <FiHash size={14} />
            </DetailIcon>
            <DetailLabel>사업자등록번호:</DetailLabel>
            <DetailValue>{formatBizNo(company.bizNo.toString())}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailIcon>
              <FiUser size={14} />
            </DetailIcon>
            <DetailLabel>대표자명:</DetailLabel>
            <DetailValue>{company.ceoName}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailIcon>
              <FiMapPin size={14} />
            </DetailIcon>
            <DetailLabel>주소:</DetailLabel>
            <DetailValue>{company.zonecode ? `(${company.zonecode}) ` : ''}{company.address}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailIcon>
              <FiMail size={14} />
            </DetailIcon>
            <DetailLabel>이메일:</DetailLabel>
            <DetailValue>{company.email}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailIcon>
              <FiPhone size={14} style={{ color: "#10b981" }} />
            </DetailIcon>
            <DetailLabel>연락처:</DetailLabel>
            <DetailValue>{formatTelNo(company.tel)}</DetailValue>
          </DetailItem>
        </Section>

        <Section>
          <SectionTitle>
            <FiFileText size={16} />
            업체 소개
          </SectionTitle>
          <DetailItem>
            <DetailValue>{company.bio || "N/A"}</DetailValue>
          </DetailItem>
        </Section>

        <Section>
          <SectionTitle>
            <FiUser size={16} />
            구성원
            <button
              style={{
                marginLeft: "auto",
                fontSize: 13,
                background: "#fbbf24",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "4px 12px",
                cursor: "pointer",
              }}
              onClick={() => setRegisterOpen(true)}
              type="button"
            >
              회원 등록
            </button>
          </SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            <div style={{ position: 'relative' }}>
              <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    <th style={{ width: 120, textAlign: 'left', padding: '4px 8px' }}>회원</th>
                    <th style={{ width: 180, textAlign: 'left', padding: '4px 8px' }}>이메일</th>
                    <th style={{ width: 120, textAlign: 'left', padding: '4px 8px' }}>전화번호</th>
                    <th style={{ width: 80, textAlign: 'left', padding: '4px 8px' }}>직책</th>
                  </tr>
                </thead>
                <tbody>
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ color: '#888', padding: '8px 0', textAlign: 'center' }}>구성원이 없습니다.</td>
                    </tr>
                  ) : (
                    members.map((member) => (
                      <tr key={member.username} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ width: 120, padding: '4px 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {member.name} <span style={{ color: '#888', fontSize: 12 }}>({member.username})</span>
                        </td>
                        <td style={{ width: 180, padding: '4px 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.email}</td>
                        <td style={{ width: 120, padding: '4px 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{formatTelNo(member.phone)}</td>
                        <td style={{ width: 80, padding: '4px 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.position}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {loading && (
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(255,255,255,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1
                }}>
                  <div style={{
                    width: 32, height: 32, border: '4px solid #f3f3f3',
                    borderTop: '4px solid #fbbf24', borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 12 }}>
              {/* 이전 버튼: 첫 페이지(0)에서는 숨김 */}
              {page > 0 && (
                <button
                  onClick={() => setPage((p) => p - 1)}
                  style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', cursor: 'pointer' }}
                >
                  이전
                </button>
              )}
              <span style={{ fontSize: 13, color: '#6b7280' }}>{page + 1} / {totalPages}</span>
              {/* 다음 버튼: 마지막 페이지에서는 숨김 */}
              {page < totalPages - 1 && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', cursor: 'pointer' }}
                >
                  다음
                </button>
              )}
            </div>
          </div>
        </Section>

        {/* 버튼 그룹: 모달 하단 오른쪽 정렬, MemberDetailModal과 동일하게 */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 32 }}>
          <ModalButton $variant="secondary" onClick={() => setEditModalOpen(true)}>
            <FiEdit3 style={{ color: "#fdb924" }} /> 수정
          </ModalButton>
          <ModalButton $variant="primary" onClick={handleDelete}>
            <FiTrash2 style={{ color: "#fff" }} /> 삭제
          </ModalButton>
        </div>

        {registerOpen && (
          <MemberRegisterModal
            onClose={() => setRegisterOpen(false)}
            onRegister={handleMemberRegister}
            initialCompanyId={company.id}
          />
        )}

        {editModalOpen && company && (
          <CompanyEditModal
            open={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
            }}
            onSave={handleEditSave}
            initialData={company}
            fieldErrors={fieldErrors}
            setFieldErrors={setFieldErrors}
          />
        )}
      </ModalPanel>
    </ModalOverlay>
  );
};

export default CompanyDetailModal;
