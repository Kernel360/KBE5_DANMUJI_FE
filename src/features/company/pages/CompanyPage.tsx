import axios from "axios";
import api from "@/api/axios";
import { useState, useEffect } from 'react';
import CompanyRegisterModal from '../components/CompanyRegisterModal';
import CompanyEditModal from '../components/CompanyEditModal';
import CompanyDetailModal from '../components/CompanyDetailModal/CompanyDetailModal';
import styled from 'styled-components';

export interface Company {
  id: number;
  name: string;
  bizNo: number;
  address: string;
  ceoName: string;
  email: string;
  bio: string;
  tel: string;
}

export interface CompanyFormData {
  name: string;
  reg1: string;
  reg2: string;
  reg3: string;
  address: string;
  ceoName: string;
  email: string;
  bio: string;
  tel: string;
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
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
`;
const PaginationNav = styled.nav``;
const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  background-color: white;
  color: #374151;
  &:hover {
    background-color: #f3f4f6;
  }
  &:first-child {
    border-top-left-radius: 0.375rem;
    border-bottom-left-radius: 0.375rem;
  }
  &:last-child {
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
const CurrentPageButton = styled(PaginationButton)`
  background: #3b82f6;
  color: #fff;
  border-radius: 0.375rem;
  font-weight: 600;
  border: none;
  cursor: not-allowed;
  z-index: 10;
  &:hover {
    background: #3b82f6;
  }
`;

export const formatBizNo = (bizNo: string) => {
  if (bizNo.length !== 10) return bizNo;
  return `${bizNo.slice(0, 3)}-${bizNo.slice(3, 5)}-${bizNo.slice(5)}`;
};

export default function CompanyPage() {
  const [search, setSearch] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<{
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  } | null>(null);
  const [isCompanyDetailModalOpen, setIsCompanyDetailModalOpen] = useState(false);
  const [selectedCompanyForDetail, setSelectedCompanyForDetail] = useState<Company | null>(null);

  const handlePageChange = (newPage: number) => {
    fetchCompanies(newPage);
  };

  const fetchCompanies = async (pageNumber: number = 0) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/companies?page=${pageNumber}`);
      const responseData = response.data;
      setCompanies(responseData.data.content);  // 여기서 한 번만 data 접근
      setPage(responseData.data.page);
    } catch (err: unknown) {
      let errorMessage = "An unknown error occurred";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error("Failed to fetch companies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filtered = companies.filter(c => c.name.includes(search));

  const handleSearch = () => {
    // 예시: axios 또는 fetch로 API 호출
    api.get(`/api/company/search?name=${encodeURIComponent(search)}`)
      .then(res => {
        setCompanies(res.data.data);
      })
      .catch(err => {
        console.error('검색 오류:', err);
      });
  };
  
  const handleEdit = async (data: CompanyFormData) => {
    if (!editData) return;

    try {
      // Construct the bizNo from reg1, reg2, reg3
      const bizNoCombined = parseInt(`${data.reg1}${data.reg2}${data.reg3}`, 10);

      const companyUpdateData = {
        name: data.name,
        bizNo: bizNoCombined,
        address: data.address,
        ceoName: data.ceoName,
        email: data.email,
        bio: data.bio,
        tel: data.tel,
      };

      // PUT 요청 보내기
      await api.put(`/api/companies/${editData.id}`, companyUpdateData);

      // 성공 시 상태 업데이트
      setCompanies(prev => prev.map(c =>
        c.id === editData.id
          ? {
              ...c,
              name: data.name || c.name,
              bizNo: bizNoCombined || c.bizNo,
              address: data.address || c.address,
              ceoName: data.ceoName || c.ceoName,
              email: data.email || c.email,
              tel: data.tel || c.tel,
              bio: data.bio || c.bio,
            }
          : c
      ));

      // 모달 닫기
      setEditModalOpen(false);
      setEditData(null);
      alert("회사 정보가 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("회사 정보 수정 실패:", error);
      alert("회사 정보 수정에 실패했습니다.");
    }
  };

  const handleDelete = async (companyId: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/api/companies/${companyId}`);
      alert("삭제되었습니다.");
      // 회사 목록을 다시 불러오거나, 상태에서 제거
      fetchCompanies();
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  const handleCompanyClick = (company: Company) => {
    setSelectedCompanyForDetail(company);
    setIsCompanyDetailModalOpen(true);
  };

  return (
    <Container>
      <CompanyRegisterModal open={modalOpen} onClose={() => setModalOpen(false)} onRegisterSuccess={fetchCompanies} />
      {editData && (
        <CompanyEditModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleEdit}
          initialData={editData}
        />
      )}
      <CompanyDetailModal
        open={isCompanyDetailModalOpen}
        onClose={() => setIsCompanyDetailModalOpen(false)}
        company={selectedCompanyForDetail}
      />
      <HeaderSection>
        <Title>회사 관리</Title>
        <Subtitle>프로젝트 관리 시스템의 회사 정보를 한눈에 확인하세요</Subtitle>
      </HeaderSection>
      <SearchSection>
        <SearchInput
          type="text"
          placeholder="회사명 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
        <RegisterButton onClick={() => setModalOpen(true)}>회사 등록</RegisterButton>
      </SearchSection>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>번호</TableHeader>
              <TableHeader>회사명</TableHeader>
              <TableHeader>사업자등록번호</TableHeader>
              <TableHeader>주소</TableHeader>
              <TableHeader>사업자 명</TableHeader>
              <TableHeader>이메일</TableHeader>
              <TableHeader>연락처</TableHeader>
              <TableHeader>관리</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow><TableCell colSpan={9}>로딩 중...</TableCell></TableRow>
            )}
            {error && (
              <TableRow><TableCell colSpan={9} style={{ color: 'red' }}>오류: {error}</TableCell></TableRow>
            )}
            {!loading && !error && filtered.length === 0 && (
              <TableRow><TableCell colSpan={9}>데이터가 없습니다.</TableCell></TableRow>
            )}
            {!loading && !error && filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell
                  onClick={() => handleCompanyClick(c)}
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  {c.name}
                </TableCell>
                <TableCell>{formatBizNo(c.bizNo.toString())}</TableCell>
                <TableCell>{c.address}</TableCell>
                <TableCell>{c.ceoName}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.tel}</TableCell>
                <TableCell>
                  <ActionButton onClick={() => { setEditModalOpen(true); setEditData(c); }}>수정</ActionButton>
                  <DeleteButton onClick={() => handleDelete(c.id)}>삭제</DeleteButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationContainer>
        <PaginationNav>
          <PaginationButton
            disabled={!page || page.number === 0}
            onClick={() => page && handlePageChange(page.number - 1)}
          >
            {'<'}
          </PaginationButton>

          {/* 페이지 번호 버튼들을 동적으로 생성 */}
          {Array.from({ length: page?.totalPages ?? 0 }, (_, idx) => (
            idx === (page?.number ?? 0) ? (
              <CurrentPageButton key={idx}>{idx + 1}</CurrentPageButton>
            ) : (
              <PaginationButton key={idx} onClick={() => handlePageChange(idx)}>
                {idx + 1}
              </PaginationButton>
            )
          ))}

          <PaginationButton
            disabled={!page || page.number + 1 >= (page?.totalPages ?? 0)}
            onClick={() => page && handlePageChange(page.number + 1)}
          >
            {'>'}
          </PaginationButton>
        </PaginationNav>
      </PaginationContainer>
    </Container>
  );
} 