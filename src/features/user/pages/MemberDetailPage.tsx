import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { type Member, formatTelNo } from "../pages/MemberPage";
import MemberEditModal from "../components/MemberEditModal/MemberEditModal";
import { showErrorToast, showSuccessToast } from "@/utils/errorHandler";
import { FiUser, FiMail, FiPhone, FiBriefcase, FiTag } from "react-icons/fi";

interface Company {
  id: number;
  name: string;
}

interface MemberUpdateFormData {
  username: string;
  name: string;
  role: string;
  companyId?: number;
  position: string;
  phone: string;
  email: string;
}

// 스타일 컴포넌트들 (CompanyDetailPage와 유사하게)
const PageContainer = styled.div`
  padding: 32px;
  background-color: #f9fafb;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PageHeaderSection = styled.div`
  margin-bottom: 0px;
`;

const PageTitle = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
  display: flex;
  align-items: center;

  &::before {
    content: "";
    display: inline-block;
    width: 4px;
    height: 1.4rem;
    background-color: #fdb924;
    margin-right: 12px;
    border-radius: 2px;
  }
`;

const PageSubtitle = styled.p`
  color: #6b7280;
  font-size: 14px;
  padding-left: 16px;
`;

const MainContentArea = styled.div`
  background-color: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  flex-grow: 1;
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const ProfileTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const DeleteButton = styled(ActionButton)`
  background: #fee2e2;
  color: #ef4444;
  &:hover {
    background: #fecaca;
  }
`;

const EditButton = styled(ActionButton)`
  background: #f9fafb;
  color: #374151;
  border: 2px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(107, 114, 128, 0.2);

  &:hover {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    border-color: #fef3c7;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(251, 191, 36, 0.3);
    color: #fff;
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(251, 191, 36, 0.2);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.2);
  }
`;

const BackButton = styled(ActionButton)`
  background: #e5e7eb;
  color: #374151;
  &:hover {
    background: #d1d5db;
  }
`;

const MemberHeader = styled.div`
  padding: 24px;
  background-color: #fdfbf5;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #fdecc8;
`;

const MemberName = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const MemberInfo = styled.p`
  font-size: 15px;
  color: #6b7280;
  padding-left: 40px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
`;

const InfoCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
  }
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 0;
`;

const DetailIcon = styled.div`
  color: #9ca3af;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: #4b5563;
  width: 120px;
  flex-shrink: 0;
`;

const DetailValue = styled.span`
  color: #374151;
  flex-grow: 1;
  word-break: break-all;
`;

const ResetPasswordLink = styled.a`
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const MemberDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<Member | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);

  const fetchMemberDetail = useCallback(async () => {
    if (!id) {
      setError("회원 ID가 누락되었습니다.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/${id}`);
      setMember(response.data.data);
    } catch (err: unknown) {
      let errorMessage = "회원 정보를 가져오는 중 오류가 발생했습니다.";
      if (err instanceof Error) errorMessage = err.message;
      setError(errorMessage);
      console.error("회원 정보 가져오기 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMemberDetail();
  }, [fetchMemberDetail]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get("/api/companies?size=1000"); // Fetch all companies
        setCompanies(response.data.data.content);
      } catch (error) {
        console.error("회사 목록을 불러오는 데 실패했습니다.:", error);
      }
    };
    fetchCompanies();
  }, []);

  const handleEditMember = () => {
    if (member) {
      setEditData(member);
      setEditModalOpen(true);
    }
  };

  const handleDeleteMember = async () => {
    if (!member) return;
    if (window.confirm("정말 이 회원을 삭제하시겠습니까?")) {
      try {
        await api.delete(`/api/admin/${member.id}`);
        showSuccessToast("회원이 성공적으로 삭제되었습니다.");
        navigate("/members");
      } catch (error) {
        showErrorToast("회원 삭제에 실패했습니다.");
        console.error("삭제 실패:", error);
      }
    }
  };

  const handleUpdateMember = async (data: MemberUpdateFormData) => {
    if (!editData) return;
    try {
      await api.put(`/api/admin/${editData.id}`, {
        ...data,
        phone: data.phone.replace(/\D/g, ""),
      });
      setEditModalOpen(false);
      setEditData(null);
      showSuccessToast("회원 정보가 성공적으로 수정되었습니다.");
      fetchMemberDetail(); // Re-fetch data
    } catch {
      showErrorToast("회원 정보 수정에 실패했습니다.");
    }
  };

  const handleResetPassword = () => {
    // 비밀번호 재설정 로직 (미구현)
    alert("비밀번호 재설정 기능은 현재 준비 중입니다.");
  };

  if (loading) return <PageContainer>로딩 중...</PageContainer>;
  if (error) return <PageContainer>오류: {error}</PageContainer>;
  if (!member) return <PageContainer>회원을 찾을 수 없습니다.</PageContainer>;

  const companyName =
    companies.find((c) => c.id === member.companyId)?.name || "소속 없음";

  return (
    <PageContainer>
      {editModalOpen && editData && (
        <MemberEditModal
          onClose={() => setEditModalOpen(false)}
          onEdit={handleUpdateMember}
          initialData={editData}
        />
      )}
      <PageHeaderSection>
        <PageTitle>회원 상세 정보</PageTitle>
        <PageSubtitle>해당 회원의 상세 정보를 한 눈에 확인하세요</PageSubtitle>
      </PageHeaderSection>

      <MainContentArea>
        <ProfileHeader>
          <ProfileTitle>회원 프로필</ProfileTitle>
          <ButtonGroup>
            <BackButton onClick={() => navigate(-1)}>뒤로가기</BackButton>
            <DeleteButton onClick={handleDeleteMember}>회원 삭제</DeleteButton>
            <EditButton onClick={handleEditMember}>회원 정보 수정</EditButton>
          </ButtonGroup>
        </ProfileHeader>

        <MemberHeader>
          <MemberName>
            <FiUser size={26} />
            {member.name}
          </MemberName>
          <MemberInfo>
            {companyName} / {member.position}
          </MemberInfo>
        </MemberHeader>

        <InfoGrid>
          <InfoCard>
            <CardTitle>기본 정보</CardTitle>
            <DetailItem>
              <DetailIcon>
                <FiBriefcase size={18} />
              </DetailIcon>
              <DetailLabel>소속 업체</DetailLabel>
              <DetailValue>{companyName}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailIcon>
                <FiTag size={18} />
              </DetailIcon>
              <DetailLabel>직책</DetailLabel>
              <DetailValue>{member.position}</DetailValue>
            </DetailItem>
          </InfoCard>
          <InfoCard>
            <CardTitle>연락처 정보</CardTitle>
            <DetailItem>
              <DetailIcon>
                <FiMail size={18} />
              </DetailIcon>
              <DetailLabel>이메일</DetailLabel>
              <DetailValue>{member.email}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailIcon>
                <FiPhone size={18} />
              </DetailIcon>
              <DetailLabel>연락처</DetailLabel>
              <DetailValue>{formatTelNo(member.phone)}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>비밀번호 재설정</DetailLabel>
              <DetailValue>
                <ResetPasswordLink onClick={handleResetPassword}>
                  재설정 링크 보내기
                </ResetPasswordLink>
              </DetailValue>
            </DetailItem>
          </InfoCard>
        </InfoGrid>
      </MainContentArea>
    </PageContainer>
  );
};

export default MemberDetailPage;
