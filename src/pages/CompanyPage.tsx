import { useState } from 'react';
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

const initialCompanies: Company[] = [
  { id: 1, name: 'ABC 주식회사', reg: '123-45-67890', addr: '서울시 강남구 테헤란로 123', owner: '홍길동', email: 'abc@company.com', companyType: 'CLIENT', phone: '010-1234-5678' },
  { id: 2, name: 'DEF 테크놀로지', reg: '234-56-78901', addr: '경기도 성남시 분당구 판교로 456길잡수', owner: '김철수', email: 'def@company.com', companyType: 'AGENCY', phone: '010-2345-6789' },
  { id: 3, name: 'GHI 시스템즈', reg: '345-67-89012', addr: '서울시 영등포구 여의대로 789', owner: '박영희', email: 'ghi@company.com', companyType: 'CLIENT', phone: '010-3456-7890' },
];

export default function CompanyPage() {
  const [search, setSearch] = useState('');
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<Company | null>(null);

  const filtered = companies.filter(c => c.name.includes(search));

  const handleRegister = (data: CompanyFormData) => {
    const reg = `${data.reg1}-${data.reg2}-${data.reg3}`;
    setCompanies(prev => [
      ...prev,
      {
        id: prev.length + 1,
        name: data.name,
        reg,
        addr: data.addr,
        owner: data.owner,
        email: data.email,
        companyType: data.companyType,
        phone: data.phone,
      },
    ]);
    setModalOpen(false);
  };

  const handleEdit = (data: CompanyFormData) => {
    if (!editData) return;
    const reg = `${data.reg1}-${data.reg2}-${data.reg3}`;
    setCompanies(prev => prev.map(c =>
      c.id === editData.id
        ? { ...c, name: data.name, reg, addr: data.addr, owner: data.owner, email: data.email, companyType: data.companyType, phone: data.phone }
        : c
    ));
    setEditModalOpen(false);
    setEditData(null);
  };

  return (
    <Container>
      <CompanyRegisterModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleRegister} />
      <CompanyEditModal open={editModalOpen} onClose={() => { setEditModalOpen(false); setEditData(null); }} onSave={handleEdit} initialData={editData} />
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
            {filtered.map((c, idx) => (
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
  border: 1px solid #d1d5db;
  background: #fff;
  color: #6b7280;
  border-radius: 0.375rem 0 0 0.375rem;
  cursor: pointer;
  &:disabled {
    color: #9ca3af;
    background: #fff;
    cursor: not-allowed;
  }
`;
const CurrentPageButton = styled.button`
  padding: 0.25rem 0.75rem;
  border-top: 1px solid #3b82f6;
  border-bottom: 1px solid #3b82f6;
  background: #eff6ff;
  color: #2563eb;
  font-weight: 700;
  border-left: none;
  border-right: none;
`; 