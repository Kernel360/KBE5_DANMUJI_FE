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
import { formatBizNo } from "../../pages/CompanyPage";
import MemberRegisterModal from "@/features/user/components/MemberRegisterModal/MemberRegisterModal";
import { useState, useEffect } from "react";
import api from "@/api/axios";

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
}

const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
  open,
  onClose,
  companyId,
}) => {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 4;
  const totalPages = Math.ceil(members.length / pageSize);
  const pagedMembers = members.slice(page * pageSize, (page + 1) * pageSize);
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    if (!open || !companyId) return;
    setLoading(true);
    setError(null);
    api.get(`/api/companies/${companyId}`)
      .then(res => {
        setCompany(res.data.data);
        return api.get(`/api/companies/${companyId}/userLists`);
      })
      .then(res => {
        setMembers(res.data.data || []);
      })
      .catch(err => {
        setError(err?.response?.data?.message || '구성원 정보를 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));
  }, [open, companyId]);

  useEffect(() => {
    setPage(0);
  }, [members]);

  if (!open || !company) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalPanel onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FiX size={20} />
        </CloseButton>
        <ModalTitle>{company.name}</ModalTitle>

        <Section>
          <SectionTitle>
            <FiHome size={16} />
            정보
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
            <DetailValue>{company.address}</DetailValue>
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
            <DetailValue>{company.tel}</DetailValue>
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
            {loading ? (
              <div style={{ color: '#888', padding: '8px 0' }}>구성원 정보를 불러오는 중...</div>
            ) : error ? (
              <div style={{ color: 'red', padding: '8px 0' }}>{error}</div>
            ) : members.length === 0 ? (
              <div style={{ color: '#888', padding: '8px 0' }}>구성원이 없습니다.</div>
            ) : (
              <>
                <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      <th style={{ textAlign: 'left', padding: '4px 8px' }}>회원</th>
                      <th style={{ textAlign: 'left', padding: '4px 8px' }}>이메일</th>
                      <th style={{ textAlign: 'left', padding: '4px 8px' }}>전화번호</th>
                      <th style={{ textAlign: 'left', padding: '4px 8px' }}>직책</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedMembers.map((member) => (
                      <tr key={member.username} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '4px 8px' }}>
                          {member.name} <span style={{ color: '#888', fontSize: 12 }}>({member.username})</span>
                        </td>
                        <td style={{ padding: '4px 8px' }}>{member.email}</td>
                        <td style={{ padding: '4px 8px' }}>{member.phone}</td>
                        <td style={{ padding: '4px 8px' }}>{member.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 12 }}>
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e5e7eb', background: page === 0 ? '#f3f4f6' : '#fff', color: '#374151', cursor: page === 0 ? 'not-allowed' : 'pointer' }}
                  >
                    이전
                  </button>
                  <span style={{ fontSize: 13, color: '#6b7280' }}>{page + 1} / {totalPages}</span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e5e7eb', background: page >= totalPages - 1 ? '#f3f4f6' : '#fff', color: '#374151', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer' }}
                  >
                    다음
                  </button>
                </div>
              </>
            )}
          </div>
        </Section>

        {registerOpen && (
          <MemberRegisterModal
            onClose={() => setRegisterOpen(false)}
            onRegister={() => setRegisterOpen(false)}
          />
        )}
      </ModalPanel>
    </ModalOverlay>
  );
};

export default CompanyDetailModal;
