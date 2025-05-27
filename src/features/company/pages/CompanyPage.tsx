import { useState } from 'react';
import CompanyRegisterModal from '../components/CompanyRegisterModal';
import CompanyEditModal from '../components/CompanyEditModal';

const initialCompanies = [
  { id: 1, name: 'ABC 주식회사', reg: '123-45-67890', addr: '서울시 강남구 테헤란로 123', owner: '홍길동', email: 'abc@company.com', companyType: 'CLIENT', phone: '010-1234-5678' },
  { id: 2, name: 'DEF 테크놀로지', reg: '234-56-78901', addr: '경기도 성남시 분당구 판교로 456길잡수', owner: '김철수', email: 'def@company.com', companyType: 'AGENCY', phone: '010-2345-6789' },
  { id: 3, name: 'GHI 시스템즈', reg: '345-67-89012', addr: '서울시 영등포구 여의대로 789', owner: '박영희', email: 'ghi@company.com', companyType: 'CLIENT', phone: '010-3456-7890' },
];

export default function CompanyPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [companies, setCompanies] = useState(initialCompanies);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const filtered = companies.filter(c => c.name.includes(search));

  const handleRegister = (data: any) => {
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

  const handleEdit = (data: any) => {
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
    <div>
      <CompanyRegisterModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleRegister} />
      <CompanyEditModal open={editModalOpen} onClose={() => { setEditModalOpen(false); setEditData(null); }} onSave={handleEdit} initialData={editData} />
      <div className="mb-6">
        <div className="text-3xl font-extrabold text-gray-800 mb-1">회사 관리</div>
        <div className="text-gray-500 text-base">프로젝트 관리 시스템의 회사 정보를 한눈에 확인하세요</div>
      </div>
      <div className="flex items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="회사명 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64 text-sm focus:outline-none"
        />
        <button onClick={() => setModalOpen(true)} className="ml-auto bg-blue-500 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-600">회사 등록</button>
      </div>
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-2">번호</th>
              <th className="px-4 py-2">회사명</th>
              <th className="px-4 py-2">회사 구분</th>
              <th className="px-4 py-2">사업자등록번호</th>
              <th className="px-4 py-2">주소</th>
              <th className="px-4 py-2">사업자 명</th>
              <th className="px-4 py-2">이메일</th>
              <th className="px-4 py-2">연락처</th>
              <th className="px-4 py-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, idx) => (
              <tr key={c.id} className="border-b last:border-b-0">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.companyType === 'CLIENT' ? '고객사' : '개발사'}</td>
                <td className="px-4 py-2">{c.reg}</td>
                <td className="px-4 py-2">{c.addr}</td>
                <td className="px-4 py-2">{c.owner}</td>
                <td className="px-4 py-2">{c.email}</td>
                <td className="px-4 py-2">{c.phone}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => { setEditModalOpen(true); setEditData(c); }} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-300">수정</button>
                  <button className="bg-red-100 text-red-500 px-2 py-1 rounded text-xs hover:bg-red-200">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-6">
        <nav className="inline-flex -space-x-px">
          <button className="px-3 py-1 border rounded-l bg-white text-gray-500 hover:bg-gray-100" disabled>{'<'}</button>
          <button className="px-3 py-1 border-t border-b bg-blue-50 text-blue-600 font-bold">1</button>
          <button className="px-3 py-1 border rounded-r bg-white text-gray-500 hover:bg-gray-100" disabled>{'>'}</button>
        </nav>
      </div>
    </div>
  );
} 