import axios from 'axios';
import { useState, useEffect } from 'react';
import MemberRegisterModal from '../components/MemberRegisterModal/MemberRegisterModal';
import MemberEditModal from '../components/MemberEditModal/MemberEditModal';
import MemberDetailModal from '../components/MemberDetailModal/MemberDetailModal';
import styled from 'styled-components';

export interface Member {
  id: number;
  username: string;
  name: string;
  role: string;
  company: string;
  position: string;
  phone: string;
}

export interface MemberFormData {
  username: string;
  name: string;
  role: string;
  company: string;
  position: string;
  phone: string;
}

// styled-components
const Container = styled.div`
  padding: 32px;
  background-color: #f9fafb;
`;
const HeaderSection = styled.div`
  margin-bottom: 32px;
`;
const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
`;
const Subtitle = styled.p`
  color: #6b7280;
  font-size: 14px;
`;
const SearchSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;
const SearchInput = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  width: 16rem;
  font-size: 0.875rem;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px #3b82f633;
  }
`;
const RegisterButton = styled.button`
  margin-left: auto;
  background: #3b82f6;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #2563eb;
  }
`;
const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  background-color: white;
`;
const Table = styled.table`
  min-width: 100%;
  font-size: 14px;
  border-collapse: collapse;
`;
const TableHead = styled.thead`
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;
const TableHeader = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #4b5563;
  white-space: nowrap;
`;
const TableBody = styled.tbody``;
const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
  &:last-child {
    border-bottom: none;
  }
`;
const TableCell = styled.td`
  padding: 12px 16px;
  text-align: left;
  color: #374151;
  vertical-align: middle;
`;
const ActionButton = styled.button`
  background: #e5e7eb;
  color: #374151;
  padding: 6px 12px;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  border: none;
  cursor: pointer;
  margin-right: 0.25rem;
  transition: background 0.2s;
  &:hover {
    background: #d1d5db;
  }
`;
const DeleteButton = styled.button`
  background: #fee2e2;
  color: #ef4444;
  padding: 6px 12px;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #fecaca;
  }
`;

export const formatTelNo = (telNo: string) => {
  if (!telNo) return telNo;
  const cleaned = ('' + telNo).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return telNo;
};

export default function MemberPage() {
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMemberDetailModalOpen, setIsMemberDetailModalOpen] = useState(false);
  const [selectedMemberForDetail, setSelectedMemberForDetail] = useState<Member | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call to fetch members
      const response = await axios.get(`/api/admin/allUsers`);
      setMembers(response.data.data.content);
    } catch (err: unknown) {
      let errorMessage = "An unknown error occurred";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error("Failed to fetch members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filtered = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  const handleSearch = () => {
    fetchMembers();
  };
  
  const handleEdit = async (data: MemberFormData) => {
    try {
      const memberToUpdate = {
        id: editData?.id,
        username: data.username,
        name: data.name,
        company: data.company,
        position: data.position,
        tel: data.phone,
      };
      // TODO: Replace with actual API call to update member
      await axios.put(`/api/members/${editData?.id}`, memberToUpdate);
      fetchMembers();
      alert("회원 정보가 성공적으로 수정되었습니다!");
      setEditModalOpen(false);
    } catch (error: unknown) {
      console.error('Error updating member:', error);
      alert("회원 정보 수정 중 오류가 발생했습니다.");
    }
  };

  const handleRegister = async (data: MemberFormData) => {
    try {
      const newMember = {
        ...data,
      };
      // TODO: Replace with actual API call to register member
      await axios.post('/api/members', newMember);
      fetchMembers();
      alert("회원 등록이 완료되었습니다!");
      setModalOpen(false);
    } catch (error: unknown) {
      console.error('Error registering member:', error);
      alert("회원 등록 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (memberId: number) => {
    if (window.confirm('정말로 이 회원을 삭제하시겠습니까?')) {
      try {
        // TODO: Replace with actual API call to delete member
        await axios.delete(`/api/admin/${memberId}`);
        fetchMembers();
        alert("회원 삭제가 완료되었습니다!");
      } catch (error: unknown) {
        console.error('Error deleting member:', error);
        alert("회원 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleMemberClick = (member: Member) => {
    setSelectedMemberForDetail(member);
    setIsMemberDetailModalOpen(true);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <Container>
      <HeaderSection>
        <Title>회원 관리</Title>
        <Subtitle>프로젝트 관리 시스템의 회원 정보를 한눈에 확인하세요.</Subtitle>
      </HeaderSection>
      <SearchSection>
        <SearchInput
          type="text"
          placeholder="회원 이름 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <RegisterButton onClick={() => setModalOpen(true)}>
          회원 등록
        </RegisterButton>
      </SearchSection>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>아이디</TableHeader>
              <TableHeader>이름</TableHeader>
              <TableHeader>회사</TableHeader>
              <TableHeader>권한</TableHeader>
              <TableHeader>직책</TableHeader>
              <TableHeader>전화번호</TableHeader>
              <TableHeader>관리</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((member) => (
              <TableRow key={member.id}>
                <TableCell
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleMemberClick(member)}
                >
                  {member.name}
                </TableCell>
                <TableCell>{member.username}</TableCell>
                <TableCell>{member.company}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.position}</TableCell>
                <TableCell>{formatTelNo(member.phone)}</TableCell>
                <TableCell>
                  <ActionButton
                    onClick={() => {
                      setEditData(member);
                      setEditModalOpen(true);
                    }}
                  >
                    수정
                  </ActionButton>
                  <DeleteButton onClick={() => handleDelete(member.id)}>
                    삭제
                  </DeleteButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {modalOpen && (
        <MemberRegisterModal
          onClose={() => setModalOpen(false)}
          onRegister={handleRegister}
        />
      )}

      {editModalOpen && editData && (
        <MemberEditModal
          onClose={() => setEditModalOpen(false)}
          onEdit={handleEdit}
          initialData={editData}
        />
      )}

      {isMemberDetailModalOpen && selectedMemberForDetail && (
        <MemberDetailModal
          onClose={() => setIsMemberDetailModalOpen(false)}
          member={selectedMemberForDetail}
        />
      )}
    </Container>
  );
} 