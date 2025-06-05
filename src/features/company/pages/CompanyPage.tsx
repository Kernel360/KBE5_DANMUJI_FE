import { useState, useEffect } from 'react';
import CompanyRegisterModal from '../components/CompanyRegisterModal';
import CompanyEditModal from '../components/CompanyEditModal';
import styled from 'styled-components';

export interface Company {
  id: number;
  name: string;
  reg: string;
  addr: string;
  owner: string;
  email: string;
  companyType: 'CLIENT' | 'AGENCY';
  phone: string;
}

export interface CompanyFormData {
  name: string;
  reg1: string;
  reg2: string;
  reg3: string;
  addr: string;
  owner: string;
  email: string;
  companyType: 'CLIENT' | 'AGENCY';
  phone: string;
}

// styled-components
const Container = styled.div`
  width: 100%;
  padding: 0 0 32px 0;
`;
const HeaderSection = styled.div`
  margin-bottom: 1.5rem;
`;
const Title = styled.div`
  font-size: 1.875rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;
const Subtitle = styled.div`
  color: #6b7280;
  font-size: 1rem;
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
const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06);
  background: #fff;
`;
const StyledTable = styled.table`
  min-width: 100%;
  font-size: 0.875rem;
  text-align: left;
  border-collapse: separate;
  border-spacing: 0;
`;
const Th = styled.th`
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.5rem 1rem;
  font-weight: 600;
`;
const Tr = styled.tr`
  border-bottom: 1px solid #e5e7eb;
  &:last-child {
    border-bottom: none;
  }
`;
const Td = styled.td`
  padding: 0.5rem 1rem;
`;
const ActionButton = styled.button`
  background: #e5e7eb;
  color: #374151;
  padding: 0.25rem 0.5rem;
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
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #fecaca;
  }
`;
const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
`;
const PageButton = styled.button`
  padding: 0.25rem 0.75rem;
`;
const CurrentPageButton = styled.button`
  padding: 0.25rem 0.75rem;
  background: #3b82f6;
  color: #fff;
  border-radius: 0.375rem;
  font-weight: 600;
  border: none;
  cursor: not-allowed;
`;

export default function CompanyPage() {
  const [search, setSearch] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/companies');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Company[] = await response.json();
        setCompanies(data);
      } catch (err: unknown) {
        let errorMessage = "An unknown error occurred";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        console.error("Failed to fetch companies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filtered = companies.filter(c => c.name.includes(search));

  const handleRegister = (data: { [key: string]: string }) => {
    const reg = `${data.reg1 || ''}-${data.reg2 || ''}-${data.reg3 || ''}`;
    setCompanies(prev => [
      ...prev,
      {
        id: prev.length > 0 ? prev[prev.length - 1].id + 1 : 1,
        name: data.name || '',
        reg,
        addr: data.addr || '',
        owner: data.owner || '',
        email: data.email || '',
        companyType: data.companyType as 'CLIENT' | 'AGENCY',
        phone: data.phone || '',
      },
    ]);
    setModalOpen(false);
  };

  const handleEdit = (data: CompanyData) => {
    if (!editData) return;
    setCompanies(prev => prev.map(c =>
      c.id === editData.id
        ? { ...c, name: data.name || c.name, reg: data.reg || c.reg, addr: data.addr || c.addr, owner: data.owner || c.owner, email: data.email || c.email, companyType: data.companyType || c.companyType, phone: data.phone || c.phone }
        : c
    ));
    setEditModalOpen(false);
    setEditData(null);
  };

  return (
    <Container>
      <CompanyRegisterModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleRegister} />
      {editData && (
        <CompanyEditModal open={editModalOpen} onClose={() => { setEditModalOpen(false); setEditData(null); }} onSave={handleEdit} initialData={editData} />
      )}
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
        />
        <RegisterButton onClick={() => setModalOpen(true)}>회사 등록</RegisterButton>
      </SearchSection>
      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <Th>번호</Th>
              <Th>회사명</Th>
              <Th>회사 구분</Th>
              <Th>사업자등록번호</Th>
              <Th>주소</Th>
              <Th>사업자 명</Th>
              <Th>이메일</Th>
              <Th>연락처</Th>
              <Th>관리</Th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <Tr><Td colSpan={9}>로딩 중...</Td></Tr>
            )}
            {error && (
              <Tr><Td colSpan={9} style={{ color: 'red' }}>오류: {error}</Td></Tr>
            )}
            {!loading && !error && filtered.length === 0 && (
              <Tr><Td colSpan={9}>데이터가 없습니다.</Td></Tr>
            )}
            {!loading && !error && filtered.map((c, idx) => (
              <Tr key={c.id}>
                <Td>{idx + 1}</Td>
                <Td>{c.name}</Td>
                <Td>{c.companyType === 'CLIENT' ? '고객사' : '개발사'}</Td>
                <Td>{c.reg}</Td>
                <Td>{c.addr}</Td>
                <Td>{c.owner}</Td>
                <Td>{c.email}</Td>
                <Td>{c.phone}</Td>
                <Td>
                  <ActionButton onClick={() => { setEditModalOpen(true); setEditData(c); }}>수정</ActionButton>
                  <DeleteButton>삭제</DeleteButton>
                </Td>
              </Tr>
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>
      <PaginationWrapper>
        <nav>
          <PageButton disabled>{'<'}</PageButton>
          <CurrentPageButton>1</CurrentPageButton>
          <PageButton disabled>{'>'}</PageButton>
        </nav>
      </PaginationWrapper>
    </Container>
  );
} 