import React, { useEffect, useState, useRef } from "react";
import api from "@/api/axios";
import {
  FiX,
  FiUser,
  FiMail,
  FiCalendar,
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
} from "./MemberDetailModal.styled";
import { Button as ModalButton } from "../MemberEditModal/MemberEditModal.styled";
import MemberEditModal from "../MemberEditModal/MemberEditModal";
import { type Member } from "../../pages/MemberPage";
import { useNotification } from "@/features/Notification/NotificationContext";
import type { MemberFormData } from "../MemberEditModal/MemberEditModal";
import { formatDateOnly, formatTimeOnly } from "@/utils/dateUtils";

interface Company {
  id: number;
  name: string;
}

interface MemberDetailModalProps {
  open: boolean;
  onClose: () => void;
  memberId: number | null;
  onDeleted?: () => void; // 삭제 후 부모에서 fetchMembers 등 갱신용
}

const iconStyle = { color: "#fdb924", marginRight: 6 };

// 전화번호 포맷터 (MemberPage와 동일, 대표번호 포함)
const formatTelNo = (telNo: string) => {
  if (!telNo) return telNo;
  const cleaned = ("" + telNo).replace(/\D/g, "");
  // 대표번호(8자리) 15881588 -> 1588-1588
  if (/^1[0-9]{3}[0-9]{4}$/.test(cleaned)) {
    return cleaned.replace(/(\d{4})(\d{4})/, '$1-$2');
  }
  // 11자리(휴대폰) 01012345678 -> 010-1234-5678
  if (cleaned.length === 11) {
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
  }
  // 10자리(지역번호) 02, 031, 032 등
  if (cleaned.length === 10) {
    // 02로 시작하는 경우 (서울)
    if (cleaned.startsWith("02")) {
      const match = cleaned.match(/^(02)(\d{4})(\d{4})$/);
      if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
      }
    } else {
      // 그 외 3자리 지역번호
      const match = cleaned.match(/^([0-9]{3})([0-9]{3})([0-9]{4})$/);
      if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
      }
    }
  }
  // 9자리(서울) 02-123-4567
  if (cleaned.length === 9 && cleaned.startsWith("02")) {
    const match = cleaned.match(/^(02)(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
  }
  return telNo;
};

const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  open,
  onClose,
  memberId,
  onDeleted,
}) => {
  const [member, setMember] = useState<Member | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const { notify } = useNotification();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !memberId) return;
    setLoading(true);
    api
      .get(`/api/admin/${memberId}`)
      .then((res) => {
        setMember(res.data.data);
      })
      .catch((err) => {
        setError("회원 정보를 불러오지 못했습니다.");
        console.error("회원 정보 불러오기 실패:", err);
      })
      .finally(() => setLoading(false));
  }, [open, memberId]);

  useEffect(() => {
    if (!open) return;
    api
      .get("/api/companies/all")
      .then((res) => {
        setCompanies(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch((err) => {
        setCompanies([]);
        console.error("업체 목록을 불러오지 못했습니다:", err);
      });
  }, [open]);

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

  const handleEdit = async (data: MemberFormData) => {
    if (!memberId) return;
    setLoading(true);
    try {
      await api.put(`/api/admin/${memberId}`, data);
      notify("회원 정보가 성공적으로 수정되었습니다.", true);
      // 수정 후 상세 정보 갱신
      const res = await api.get(`/api/admin/${memberId}`);
      setMember(res.data.data);
      setEditOpen(false);
    } catch {
      notify("회원 정보 수정에 실패했습니다.", false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!member) return;
    if (!window.confirm("삭제하시겠습니까? (관리자에게 문의하여 복구할 수 있습니다.)")) return;
    try {
      await api.delete(`/api/admin/${member.id}`);
      notify("회원이 성공적으로 삭제되었습니다.", true);
      onClose();
      if (onDeleted) onDeleted();
    } catch {
      notify("회원 삭제에 실패했습니다.", false);
    }
  };

  if (!open) return null;

  return (
    <ModalOverlay ref={modalRef} className="custom-modal-class">
      <ModalPanel>
        <CloseButton onClick={onClose}>
          <FiX size={20} />
        </CloseButton>
        <ModalTitle>회원 상세 정보</ModalTitle>
        {loading ? (
          <div
            style={{ textAlign: "center", padding: "40px 0", color: "#888" }}
          >
            회원 정보를 불러오는 중...
          </div>
        ) : error ? (
          <div
            style={{ textAlign: "center", padding: "40px 0", color: "#ef4444" }}
          >
            {error}
          </div>
        ) : member ? (
          <>
            <Section>
              <SectionTitle>
                <FiUser size={16} style={iconStyle} /> 회원 정보
              </SectionTitle>
              <DetailItem>
                <DetailLabel>이름</DetailLabel>
                <DetailValue>{member.name}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>아이디</DetailLabel>
                <DetailValue>{member.username}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>직책</DetailLabel>
                <DetailValue>{member.position}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>소속 업체</DetailLabel>
                <DetailValue>
                  {companies.find((c) => c.id === member.companyId)?.name ||
                    "소속 없음"}
                </DetailValue>
              </DetailItem>
            </Section>
            <Section>
              <SectionTitle>
                <FiMail size={16} style={iconStyle} /> 연락처 정보
              </SectionTitle>
              <DetailItem>
                <DetailLabel>이메일</DetailLabel>
                <DetailValue>{member.email}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>연락처</DetailLabel>
                <DetailValue>{formatTelNo(member.phone)}</DetailValue>
              </DetailItem>
            </Section>
            <Section>
              <SectionTitle>
                <FiCalendar size={16} style={iconStyle} /> 가입 정보
              </SectionTitle>
              <DetailItem>
                <DetailLabel>가입일</DetailLabel>
                <DetailValue>
                  {member.createdAt ? formatDateOnly(member.createdAt) : "N/A"}
                  {member.createdAt && (
                    <span
                      style={{ marginLeft: 8, color: "#6b7280", fontSize: 12 }}
                    >
                      {formatTimeOnly(member.createdAt)}
                    </span>
                  )}
                </DetailValue>
              </DetailItem>
              {member.lastLoginAt && (
                <DetailItem>
                  <DetailLabel>최근 로그인</DetailLabel>
                  <DetailValue>
                    {new Date(member.lastLoginAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                    <span
                      style={{ marginLeft: 8, color: "#6b7280", fontSize: 12 }}
                    >
                      {new Date(member.lastLoginAt).toLocaleTimeString(
                        "ko-KR",
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </span>
                  </DetailValue>
                </DetailItem>
              )}
            </Section>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 32,
              }}
            >
              <ModalButton
                $variant="secondary"
                onClick={() => setEditOpen(true)}
              >
                <FiEdit3 style={{ color: "#fdb924" }} /> 수정
              </ModalButton>
              <ModalButton $variant="primary" onClick={handleDelete}>
                <FiTrash2 style={{ color: "#fff" }} /> 삭제
              </ModalButton>
            </div>
            {editOpen && (
              <MemberEditModal
                onClose={() => setEditOpen(false)}
                onEdit={handleEdit}
                initialData={member}
              />
            )}
          </>
        ) : (
          <div
            style={{ textAlign: "center", padding: "40px 0", color: "#888" }}
          >
            회원 정보를 찾을 수 없습니다.
          </div>
        )}
      </ModalPanel>
    </ModalOverlay>
  );
};

export default MemberDetailModal;
