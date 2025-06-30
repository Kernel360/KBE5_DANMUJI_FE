import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import {
  type Company,
  formatBizNo,
  formatTelNo,
  type FieldError,
} from "./CompanyPage";
import CompanyEditModal from "../components/CompanyEditModal";
import { type CompanyFormData } from "./CompanyPage";
import { showErrorToast, showSuccessToast } from "@/utils/errorHandler";
import { FiUser, FiBriefcase, FiMapPin, FiMail, FiPhone } from "react-icons/fi";
import MemberRegisterModal from "@/features/user/components/MemberRegisterModal/MemberRegisterModal";

const PageContainer = styled.div`
  padding: 32px;
  background-color: #f9fafb;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PageHeaderSection = styled.div`
  margin-bottom: 0px; /* Adjusted */
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
  color: #bdbdbd;
  font-size: 0.9rem;
  margin-top: 6.6px;
  margin-bottom: 18px;
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
  transition: background 0.2s;
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
  transition: all 0.25s ease;

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

const CompanyHeader = styled.div`
  padding: 24px;
  background-color: #fdfbf5;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #fdecc8;
`;

const CompanyName = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const CompanyBio = styled.p`
  font-size: 15px;
  color: #6b7280;
  padding-left: 40px; /* Align with company name text, after icon */
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

const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<Company | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const [, setErrorMessage] = useState<string | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const fetchCompanyDetail = useCallback(async () => {
    if (!id) {
      setError("업체 ID가 누락되었습니다.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await api.get(`/api/companies/${id}`);
      setCompany(response.data.data);
    } catch (err: unknown) {
      let message =
        "업체 상세 정보를 가져오는 중 알 수 없는 오류가 발생했습니다.";
      if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      console.error("업체 상세 정보 가져오기 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCompanyDetail();
  }, [fetchCompanyDetail]);

  const handleEdit = () => {
    if (company) {
      setEditData(company);
      setEditModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (!company) return;
    if (window.confirm("정말 이 업체를 삭제하시겠습니까?")) {
      try {
        await api.delete(`/api/companies/${company.id}`);
        showSuccessToast("업체가 성공적으로 삭제되었습니다.");
        navigate("/company");
      } catch (error) {
        showErrorToast("업체 삭제에 실패했습니다.");
        console.error("삭제 실패:", error);
      }
    }
  };

  const handleUpdate = async (data: CompanyFormData) => {
    if (!editData) return;
    try {
      const bizNoCombined = parseInt(
        `${data.reg1}${data.reg2}${data.reg3}`,
        10
      );
      const companyUpdateData = {
        name: data.name,
        bizNo: bizNoCombined,
        address: data.address,
        ceoName: data.ceoName,
        email: data.email,
        bio: data.bio,
        tel: data.tel,
      };
      await api.put(`/api/companies/${editData.id}`, companyUpdateData);
      setEditModalOpen(false);
      setEditData(null);
      showSuccessToast("업체 정보가 성공적으로 수정되었습니다.");
      fetchCompanyDetail();
    } catch {
      showErrorToast("업체 정보 수정에 실패했습니다.");
    }
  };

  // 더미 구성원 데이터
  const dummyMembers = [
    { id: 1, name: '홍길동', position: '팀장' },
    { id: 2, name: '김철수', position: '개발자' },
    { id: 3, name: '이영희', position: '디자이너' },
  ];

  if (loading) return <PageContainer>로딩 중...</PageContainer>;
  if (error) return <PageContainer>오류: {error}</PageContainer>;
  if (!company) return <PageContainer>업체를 찾을 수 없습니다.</PageContainer>;

  return (
    <PageContainer>
      {editData && (
        <CompanyEditModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleUpdate}
          initialData={editData}
          fieldErrors={fieldErrors}
          setFieldErrors={setFieldErrors}
          setErrorMessage={setErrorMessage}
        />
      )}
      <PageHeaderSection>
        <PageTitle>업체 상세 정보</PageTitle>
        <PageSubtitle>
          프로젝트 관리 시스템의 업체 정보를 한눈에 확인하세요
        </PageSubtitle>
      </PageHeaderSection>

      <MainContentArea>
        <ProfileHeader>
          <ProfileTitle>업체 프로필</ProfileTitle>
          <ButtonGroup>
            <BackButton onClick={() => navigate(-1)}>뒤로가기</BackButton>
            <DeleteButton onClick={handleDelete}>업체 삭제</DeleteButton>
            <EditButton onClick={handleEdit}>업체 정보 수정</EditButton>
          </ButtonGroup>
        </ProfileHeader>

        <CompanyHeader>
          <CompanyName>
            <FiBriefcase size={26} />
            {company.name}
          </CompanyName>
          {company.bio && <CompanyBio>{company.bio}</CompanyBio>}
        </CompanyHeader>

        <InfoGrid>
          <InfoCard>
            <CardTitle>기본 정보</CardTitle>
            <DetailItem>
              <DetailIcon>
                <FiUser size={18} />
              </DetailIcon>
              <DetailLabel>대표자명</DetailLabel>
              <DetailValue>{company.ceoName}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailIcon>
                <FiBriefcase size={18} />
              </DetailIcon>
              <DetailLabel>사업자등록번호</DetailLabel>
              <DetailValue>{formatBizNo(company.bizNo.toString())}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailIcon>
                <FiMapPin size={18} />
              </DetailIcon>
              <DetailLabel>주소</DetailLabel>
              <DetailValue>{company.address}</DetailValue>
            </DetailItem>
          </InfoCard>
          <InfoCard>
            <CardTitle>연락처 정보</CardTitle>
            <DetailItem>
              <DetailIcon>
                <FiMail size={18} />
              </DetailIcon>
              <DetailLabel>이메일</DetailLabel>
              <DetailValue>{company.email}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailIcon>
                <FiPhone size={18} style={{ color: "#10b981" }} />
              </DetailIcon>
              <DetailLabel>연락처</DetailLabel>
              <DetailValue>{formatTelNo(company.tel)}</DetailValue>
            </DetailItem>
          </InfoCard>
        </InfoGrid>
        <InfoCard style={{ marginTop: 32, position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <CardTitle style={{ marginBottom: 0, borderBottom: 'none' }}>회사 구성원</CardTitle>
              <button
                style={{
                  background: '#fdb924', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600, cursor: 'pointer', fontSize: 14
                }}
                onClick={() => setRegisterModalOpen(true)}
              >
                회원 등록
              </button>
            </div>
            <div style={{ borderBottom: '1px solid #f3f4f6', margin: '12px 0 16px 0' }} />
          </div>
          {dummyMembers.length > 0 ? (
            dummyMembers.map(member => (
              <DetailItem key={member.id}>
                <DetailIcon>
                  <FiUser size={18} />
                </DetailIcon>
                <DetailLabel>{member.name}</DetailLabel>
                <DetailValue>{member.position}</DetailValue>
              </DetailItem>
            ))
          ) : (
            <div style={{ color: '#888', padding: '8px 0' }}>구성원이 없습니다.</div>
          )}
        </InfoCard>
        {registerModalOpen && (
          <MemberRegisterModal
            onClose={() => setRegisterModalOpen(false)}
            onRegister={() => setRegisterModalOpen(false)}
          />
        )}
      </MainContentArea>
    </PageContainer>
  );
};

export default CompanyDetailPage;
