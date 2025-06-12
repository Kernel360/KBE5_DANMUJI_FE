import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { type Member, formatTelNo } from "../pages/MemberPage";
import MemberEditModal from '../components/MemberEditModal/MemberEditModal';
import { type MemberFormData } from '../pages/MemberPage';

interface Company {
  id: number;
  name: string;
}

// 전체 페이지 컨테이너
const PageContainer = styled.div`
  padding: 32px;
  background-color: #f9fafb;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// 메인 헤더 섹션 (회원 정보 타이틀 및 서브타이틀)
const PageHeaderSection = styled.div`
  margin-bottom: 20px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
`;

const PageSubtitle = styled.p`
  color: #6b7280;
  font-size: 14px;
`;

// 메인 콘텐츠 영역 (하얀색 카드)
const MainContentArea = styled.div`
  background-color: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  flex-grow: 1;
`;

// 프로필 헤더 (사용자 프로필 타이틀 및 버튼)
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
  align-items: center; /* 버튼 그룹 내 요소들을 수직 중앙 정렬 */
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
  background: #1f2937;
  color: #fff;
  &:hover {
    background: #374151;
  }
`;

const BackButton = styled(ActionButton)`
  background: #e5e7eb; /* 뒤로가기 버튼 색상 조정 */
  color: #374151;
  margin-right: 20px; /* 뒤로가기 버튼과 회원 삭제/수정 버튼 간 간격 */
  &:hover {
    background: #d1d5db;
  }
`;

// 사용자 프로필 섹션
const UserProfileSection = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 32px;
`;

const ProfileImagePlaceholder = styled.div`
  width: 100px;
  height: 100px;
  background-color: #e5e7eb;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  color: #9ca3af;
  font-weight: bold;
  margin-right: 32px;
  flex-shrink: 0;
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RoleTag = styled.span`
  background-color: #e0e7ff;
  color: #4338ca;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
`;

// 정보 섹션 그리드
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: #4b5563;
  width: 80px; /* 레이블 너비 고정 */
  flex-shrink: 0;
`;

const DetailValue = styled.span`
  color: #374151;
  flex-grow: 1;
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

  useEffect(() => {
    const fetchMemberDetail = async () => {
      if (!id) {
        setError("회원 ID가 누락되었습니다.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api.get(`/api/admin/${id}`); // Adjust API endpoint if necessary
        setMember(response.data.data);
      } catch (err: unknown) {
        let errorMessage = "회원 상세 정보를 가져오는 중 알 수 없는 오류가 발생했습니다.";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        console.error("회원 상세 정보 가져오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMemberDetail();
  }, [id]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/api/companies'); // 모든 회사를 가져오기 위해 size를 충분히 크게 설정
        setCompanies(response.data.data.content);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
        alert('회사 목록을 불러오는 데 실패했습니다.');
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
    if (member && window.confirm('정말로 이 회원을 삭제하시겠습니까?')) {
      try {
        await api.delete(`/api/admin/${member.id}`);
        alert("회원 삭제가 완료되었습니다!");
        navigate("/members");
      } catch (error: unknown) {
        console.error('Error deleting member:', error);
        alert("회원 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleUpdateMember = async (data: MemberFormData) => {
    try {
      const memberToUpdate = {
        id: member?.id,
        username: data.username,
        name: data.name,
        companyId: data.companyId,
        role: data.role,
        position: data.position,
        phone: data.phone,
        email: data.email,
      };
      await api.put(`/api/admin/${member?.id}`, memberToUpdate);
      alert("회원 정보가 성공적으로 수정되었습니다!");
      setEditModalOpen(false);
      const response = await api.get(`/api/admin/${member?.id}`);
      setMember(response.data.data);
    } catch (error: unknown) {
      console.error('Error updating member:', error);
      alert("회원 정보 수정 중 오류가 발생했습니다.");
    }
  };

  const handleResetPassword = () => {
    alert("비밀번호 초기화 버튼 클릭됨");
    // TODO: 비밀번호 초기화 로직 추가
  };

  if (loading) return <PageContainer>로딩 중...</PageContainer>;
  if (error) return <PageContainer>에러: {error}</PageContainer>;
  if (!member) return <PageContainer>회원 정보를 찾을 수 없습니다.</PageContainer>;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const formattedDate = `${year}년 ${month}월 ${day}일`;

  const hours = today.getHours();
  const minutes = today.getMinutes();
  const ampm = hours >= 12 ? '오후' : '오전';
  const formattedTime = `${ampm} ${hours % 12 || 12}:${minutes < 10 ? '0' + minutes : minutes}`;

  const companyName = companies.find(c => c.id === member.companyId)?.name || 'N/A';

  return (
    <PageContainer>
      <PageHeaderSection>
        <PageTitle>회원 상세 정보</PageTitle>
        <PageSubtitle>회원 정보 ({formattedDate} {formattedTime})</PageSubtitle>
      </PageHeaderSection>

      <MainContentArea>
        <ProfileHeader>
          <ProfileTitle>사용자 프로필</ProfileTitle>
          <ButtonGroup>
            <BackButton onClick={() => navigate("/members")}>뒤로가기</BackButton>
            <DeleteButton onClick={handleDeleteMember}>회원 삭제</DeleteButton>
            <EditButton onClick={handleEditMember}>회원 정보 수정</EditButton>
          </ButtonGroup>
        </ProfileHeader>

        <UserProfileSection>
          <ProfileImagePlaceholder>{member.name.charAt(0)}</ProfileImagePlaceholder>
          <ProfileDetails>
            <ProfileTitle>{member.name}</ProfileTitle>
            <RoleTag>{member.role}</RoleTag>
            <ResetPasswordLink onClick={handleResetPassword}>비밀번호 초기화</ResetPasswordLink>
          </ProfileDetails>
        </UserProfileSection>

        <InfoGrid>
          <InfoColumn>
            <SectionTitle>기본 정보</SectionTitle>
            <DetailItem>
              <DetailLabel>이름:</DetailLabel>
              <DetailValue>{member.name}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>회사:</DetailLabel>
              <DetailValue>{companyName}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>직책:</DetailLabel>
              <DetailValue>{member.position}</DetailValue>
            </DetailItem>
          </InfoColumn>

          <InfoColumn>
            <SectionTitle>연락처 정보</SectionTitle>
            <DetailItem>
              <DetailLabel>이메일:</DetailLabel>
              <DetailValue>{member.email}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>연락처:</DetailLabel>
              <DetailValue>{formatTelNo(member.phone)}</DetailValue>
            </DetailItem>
          </InfoColumn>

          <InfoColumn>
            <SectionTitle>계정 정보</SectionTitle>
            <DetailItem>
              <DetailLabel>아이디:</DetailLabel>
              <DetailValue>{member.username}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>등록일:</DetailLabel>
              <DetailValue>{new Date(member.createdAt).toLocaleDateString()}</DetailValue>
            </DetailItem>
          </InfoColumn>
        </InfoGrid>
      </MainContentArea>
      {editModalOpen && editData && (
        <MemberEditModal
          onClose={() => setEditModalOpen(false)}
          onEdit={handleUpdateMember}
          initialData={editData}
        />
      )}
    </PageContainer>
  );
};

export default MemberDetailPage; 