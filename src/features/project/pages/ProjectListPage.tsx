import { useEffect, useState } from "react";
import {
  ProjectListContainer,
  Header,
  Title,
  Description,
  CardGrid,
  PaginationContainer,
  PaginationNav,
  PaginationButton,
  PaginationInfo,
} from "./ProjectListPage.styled";
import type { Project } from "../types/Types";
import ProjectFilterBar from "../components/List/ProjectFilterBar";
import ProjectCard from "../components/Card/ProjectCard";
import { getProjects, type ProjectResponse } from "../services/projectService";
import api from "@/api/axios";

type Member = {
  id: number;
  name: string;
  position: string;
};

type SelectedDevCompany = {
  company: { id: number; name: string };
  members: { id: number; name: string; position: string; type: 'manager' | 'member' }[];
};

type SelectedClientCompany = {
  company: { id: number; name: string };
  members: { id: number; name: string; position: string; type: 'manager' | 'member' }[];
};

const PAGE_SIZE = 8;

// 프로젝트 등록 모달 컴포넌트
function ProjectCreateModal({ open, onClose, fetchProjects }: { open: boolean; onClose: () => void; fetchProjects?: (page?: number) => void }) {
  const initialForm = {
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    devManagerId: "",
    clientManagerId: "",
    devUserId: "",
    clientUserId: "",
  };
  const [form, setForm] = useState(initialForm);
  const [showDevModal, setShowDevModal] = useState(false);
  const [selectedDevCompanies, setSelectedDevCompanies] = useState<SelectedDevCompany[]>([]);
  const [selectedClientCompanies, setSelectedClientCompanies] = useState<SelectedClientCompany[]>([]);
  const [showClientModal, setShowClientModal] = useState(false);
  const [editDevCompany, setEditDevCompany] = useState<{ id: number; name: string } | null>(null);
  const [editDevMembers, setEditDevMembers] = useState<{ id: number; name: string; position: string; type: 'manager' | 'member' }[]>([]);
  const [editClientCompany, setEditClientCompany] = useState<{ id: number; name: string } | null>(null);
  const [editClientMembers, setEditClientMembers] = useState<{ id: number; name: string; position: string; type: 'manager' | 'member' }[]>([]);

  // devManagerId, devUserId, clientManagerId, clientUserId 동기화
  useEffect(() => {
    const allDevMembers = selectedDevCompanies.flatMap(c => c.members);
    const allClientMembers = selectedClientCompanies.flatMap(c => c.members);
    setForm(f => ({
      ...f,
      devManagerId: allDevMembers.filter(m => m.type === 'manager').map(m => m.id).join(','),
      devUserId: allDevMembers.map(m => m.id).join(','),
      clientManagerId: allClientMembers.filter(m => m.type === 'manager').map(m => m.id).join(','),
      clientUserId: allClientMembers.map(m => m.id).join(','),
    }));
  }, [selectedDevCompanies, selectedClientCompanies]);

  useEffect(() => {
    const allDevMembers = selectedDevCompanies.flatMap(c => c.members);
    const allClientMembers = selectedClientCompanies.flatMap(c => c.members);
  }, [selectedDevCompanies, selectedClientCompanies]);

  // 개발사 추가 모달에서 선택된 회사/멤버 반영
  const handleDevModalDone = (company: any, members: any) => {
    setSelectedDevCompanies(prev => {
      // 이미 등록된 회사면 덮어쓰기, 아니면 추가
      const exists = prev.find(c => c.company.id === company.id);
      if (exists) {
        return prev.map(c => c.company.id === company.id ? { company, members } : c);
      } else {
        return [...prev, { company, members }];
      }
    });
    setShowDevModal(false);
  };

  // 고객사 추가 모달에서 선택된 회사/멤버 반영
  const handleClientModalDone = (company: any, members: any) => {
    setSelectedClientCompanies(prev => {
      const exists = prev.find(c => c.company.id === company.id);
      if (exists) {
        return prev.map(c => c.company.id === company.id ? { company, members } : c);
      } else {
        return [...prev, { company, members }];
      }
    });
    setShowClientModal(false);
  };

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = original; };
    }
  }, [open]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCreateProject = async () => {
    // 모든 필드 입력 체크
    if (!form.name || !form.description || !form.startDate || !form.endDate || selectedDevCompanies.length === 0 || selectedClientCompanies.length === 0) {
      alert('모든 필드를 입력하세요');
      return;
    }
    if (fetchProjects) {
      await handleCreateProjectOuter(form, onClose, fetchProjects);
    }
  };

  // 외부에서 전달된 handleCreateProjectOuter를 사용
  const handleCreateProjectOuter = async (
    form: any,
    onClose: any,
    fetchProjects: any
  ) => {
    try {
      const payload = {
        name: form.name,
        description: form.description,
        startDate: form.startDate,
        endDate: form.endDate,
        devManagerId: form.devManagerId
          ? form.devManagerId.split(',').map((s: any) => Number(s.trim())).filter(Boolean)
          : [],
        clientManagerId: form.clientManagerId
          ? form.clientManagerId.split(',').map((s: any) => Number(s.trim())).filter(Boolean)
          : [],
        devUserId: form.devUserId
          ? form.devUserId.split(',').map((s: any) => Number(s.trim())).filter(Boolean)
          : [],
        clientUserId: form.clientUserId
          ? form.clientUserId.split(',').map((s: any) => Number(s.trim())).filter(Boolean)
          : [],
      };
      await api.post('/api/projects', payload);
      if (fetchProjects) fetchProjects(0);
      onClose();
    } catch (e) {
      alert('프로젝트 생성에 실패했습니다.');
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setSelectedDevCompanies([]);
    setSelectedClientCompanies([]);
    setEditDevCompany(null);
    setEditDevMembers([]);
    setEditClientCompany(null);
    setEditClientMembers([]);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={handleOverlayClick}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 40,
          minWidth: 900,
          maxWidth: 1100,
          width: "90vw",
          maxHeight: 800,
          overflowY: "auto",
          boxShadow: "0 2px 32px rgba(0,0,0,0.18)",
          position: "relative",
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700 }}>새 프로젝트 생성</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ background: '#2563eb', color: '#fff', border: 0, borderRadius: 4, padding: '6px 16px', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}>회사생성</button>
            <button style={{ background: '#19c37d', color: '#fff', border: 0, borderRadius: 4, padding: '6px 16px', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}>멤버생성</button>
          </div>
        </div>
        <div style={{ color: "#888", marginBottom: 32 }}>새로운 프로젝트의 정보를 입력해주세요</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* 프로젝트명, 개요 */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>프로젝트명 *</div>
            <input
              style={{ width: "100%", padding: 12, borderRadius: 6, border: "1px solid #eee", marginBottom: 20 }}
              placeholder="프로젝트 이름을 입력하세요"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <div style={{ fontWeight: 600, marginBottom: 8 }}>개요 *</div>
            <textarea
              style={{ width: "100%", minHeight: 90, maxHeight: 300, padding: 12, borderRadius: 6, border: "1px solid #eee", resize: "none", overflowY: "auto" }}
              placeholder="프로젝트 개요를 상세히 입력하세요..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={4}
            />
          </div>
          {/* 프로젝트 기간 */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>프로젝트 기간 *</div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 4 }}>시작일 *</div>
                <div
                  style={{ width: "100%" }}
                  onClick={e => {
                    const input = (e.currentTarget.querySelector('input') as HTMLInputElement);
                    if (input) input.showPicker && input.showPicker();
                  }}
                >
                  <input
                    type="date"
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #eee" }}
                    value={form.startDate}
                    onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value, endDate: "" }))}
                  />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 4 }}>마감일 *</div>
                <div
                  style={{ width: "100%" }}
                  onClick={e => {
                    const input = (e.currentTarget.querySelector('input') as HTMLInputElement);
                    if (input) input.showPicker && input.showPicker();
                  }}
                >
                  <input
                    type="date"
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #eee" }}
                    value={form.endDate}
                    onChange={e => setForm({ ...form, endDate: e.target.value })}
                    min={form.startDate || undefined}
                    disabled={!form.startDate}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* 담당 정보 */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>담당 정보</div>
            <div style={{ display: "flex", gap: 24 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontWeight: 500 }}>개발사 선택 *</span>
                  <button style={{ marginLeft: 12, background: "#19c37d", color: "#fff", border: 0, borderRadius: 4, padding: "4px 12px", cursor: "pointer" }} onClick={() => setShowDevModal(true)}>+ 개발사 추가</button>
                </div>
                {/* 여러 개발사/멤버 표시 (이동) */}
                {selectedDevCompanies.map(({ company, members }) => (
                  <div key={company.id} style={{ marginBottom: 16, background: "#f4f6fa", borderRadius: 8, padding: 16, position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                      <div style={{ fontWeight: 600 }}>선택된 개발사: {company.name}</div>
                      <button
                        style={{ marginLeft: 8, background: '#eee', border: 0, color: '#222', fontSize: 14, borderRadius: 4, padding: '2px 10px', cursor: 'pointer' }}
                        onClick={() => {
                          setEditDevCompany(company);
                          setEditDevMembers(members);
                          setShowDevModal(true);
                        }}
                      >수정</button>
                      <button
                        style={{ marginLeft: 8, background: 'transparent', border: 0, color: '#888', fontSize: 18, cursor: 'pointer' }}
                        onClick={() => setSelectedDevCompanies(prev => prev.filter(c => c.company.id !== company.id))}
                        aria-label="삭제"
                      >×</button>
                    </div>
                    <div style={{ marginTop: 8, color: '#555', fontWeight: 500 }}>
                      선택된 멤버: {members.length}명
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontWeight: 500 }}>고객사 선택 *</span>
                  <button style={{ marginLeft: 12, background: "#2563eb", color: "#fff", border: 0, borderRadius: 4, padding: "4px 12px", cursor: "pointer" }} onClick={() => { setEditClientCompany(null); setEditClientMembers([]); setShowClientModal(true); }}>+ 고객사 추가</button>
                </div>
                {/* 여러 고객사/멤버 표시 (이동) */}
                {selectedClientCompanies.map(({ company, members }) => (
                  <div key={company.id} style={{ marginBottom: 16, background: "#eaf6ff", borderRadius: 8, padding: 16, position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                      <div style={{ fontWeight: 600 }}>선택된 고객사: {company.name}</div>
                      <button
                        style={{ marginLeft: 8, background: '#eee', border: 0, color: '#222', fontSize: 14, borderRadius: 4, padding: '2px 10px', cursor: 'pointer' }}
                        onClick={() => {
                          setEditClientCompany(company);
                          setEditClientMembers(members);
                          setShowClientModal(true);
                        }}
                      >수정</button>
                      <button
                        style={{ marginLeft: 8, background: 'transparent', border: 0, color: '#888', fontSize: 18, cursor: 'pointer' }}
                        onClick={() => setSelectedClientCompanies(prev => prev.filter(c => c.company.id !== company.id))}
                        aria-label="삭제"
                      >×</button>
                    </div>
                    <div style={{ marginTop: 8, color: '#555', fontWeight: 500 }}>
                      선택된 멤버: {members.length}명
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* 하단 버튼 */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 40 }}>
          <button
            style={{ padding: "10px 28px", borderRadius: 6, border: "1px solid #eee", background: "#fff", color: "#222", fontWeight: 500, fontSize: 16, cursor: "pointer" }}
            onClick={onClose}
          >
            취소
          </button>
          <button
            style={{ padding: "10px 28px", borderRadius: 6, border: 0, background: "#aaa", color: "#fff", fontWeight: 500, fontSize: 16, cursor: "pointer" }}
            onClick={handleReset}
          >
            초기화
          </button>
          <button
            style={{ padding: "10px 28px", borderRadius: 6, border: 0, background: "#4338ca", color: "#fff", fontWeight: 600, fontSize: 16, cursor: "pointer" }}
            onClick={handleCreateProject}
          >
            프로젝트 생성
          </button>
        </div>
        {/* 닫기 버튼 (오른쪽 상단) */}
        <button
          style={{ position: "absolute", top: 20, right: 20, background: "transparent", border: 0, fontSize: 24, cursor: "pointer" }}
          onClick={onClose}
          aria-label="닫기"
        >
          ×
        </button>
        {showDevModal && (
          <DevCompanySelectModal
            onClose={() => setShowDevModal(false)}
            onDone={handleDevModalDone}
            selectedCompany={editDevCompany}
            selectedMembers={editDevMembers}
            selectedDevCompanies={selectedDevCompanies}
            selectedClientCompanies={selectedClientCompanies}
          />
        )}
        {showClientModal && (
          <DevCompanySelectModal
            onClose={() => setShowClientModal(false)}
            onDone={handleClientModalDone}
            selectedCompany={editClientCompany}
            selectedMembers={editClientMembers}
            selectedDevCompanies={selectedDevCompanies}
            selectedClientCompanies={selectedClientCompanies}
          />
        )}
      </div>
    </div>
  );
}

function DevCompanySelectModal({ onClose, onDone, selectedCompany, selectedMembers, selectedDevCompanies = [], selectedClientCompanies = [] }: {
  onClose: () => void;
  onDone: (company: { id: number; name: string }, members: { id: number; name: string; position: string; type: 'manager' | 'member' }[]) => void;
  selectedCompany?: { id: number; name: string } | null;
  selectedMembers?: { id: number; name: string; position: string; type: 'manager' | 'member' }[];
  selectedDevCompanies?: { company: { id: number; name: string } }[];
  selectedClientCompanies?: { company: { id: number; name: string } }[];
}) {
  const [search, setSearch] = useState("");
  const [companies, setCompanies] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompanyState, setSelectedCompanyState] = useState(selectedCompany ?? null);
  const [members, setMembers] = useState<Member[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMembersState, setSelectedMembersState] = useState(selectedMembers ?? []);

  // 업체 검색
  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const params = search ? { name: search } : {};
        const res = await api.get("/api/companies/search", { params });
        const result = Array.isArray(res.data?.data?.content)
          ? res.data.data.content
          : Array.isArray(res.data?.content)
            ? res.data.content
            : Array.isArray(res.data)
              ? res.data
              : [];
        setCompanies(result.filter((c: any) => c && typeof c.id === 'number' && typeof c.name === 'string'));
        console.log("Companies 응답:", res.data, "최종:", result);
      } catch (e) {
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

// 업체 선택 시 멤버 불러오기
useEffect(() => {
  if (!selectedCompanyState) return;
  (async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/companies/${selectedCompanyState.id}/users`);

      // ✅ 수정: 배열 형태로 안전하게 추출
      const result = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data?.content)
          ? res.data.content
          : Array.isArray(res.data)
            ? res.data
            : [];

      setMembers(result); // ✅ 수정된 멤버 설정
    } catch (e) {
      setMembers([]); // ✅ 실패 시 빈 배열
    } finally {
      setLoading(false);
    }
  })();
}, [selectedCompanyState]);

  // 모달 외부 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // 멤버 필터링
  const filteredMembers = members.filter(m => m.name.includes(memberSearch));

  // 멤버 버튼 클릭 핸들러
  const handleMemberType = (member: Member, type: 'manager' | 'member') => {
    setSelectedMembersState(prev => {
      // 이미 선택된 멤버인지 확인
      const exists = prev.find(m => m.id === member.id);
      if (exists) {
        // 같은 타입이면 해제, 다른 타입이면 타입만 변경
        if (exists.type === type) {
          return prev.filter(m => m.id !== member.id);
        } else {
          return prev.map(m => m.id === member.id ? { ...m, type } : m);
        }
      } else {
        // 새로 추가
        return [...prev, { ...member, type }];
      }
    });
  };

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", zIndex: 2000,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}
      onClick={handleOverlayClick}
    >
      <div
        style={{ background: "#fff", borderRadius: 12, padding: 32, minWidth: 400, maxWidth: 500, width: "90vw", boxShadow: "0 2px 32px rgba(0,0,0,0.18)", position: "relative" }}
      >
        {/* ← 업체 다시 선택 버튼 상단 */}
        {selectedCompanyState && (
          <button style={{ marginBottom: 16, width: "100%", border: 0, borderRadius: 6, background: "#eee", color: "#222", padding: 10, fontWeight: 500, cursor: "pointer" }} onClick={() => setSelectedCompanyState(null)}>← 업체 다시 선택</button>
        )}
        <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>업체 선택</h3>
        {!selectedCompanyState ? (
          <>
            <div style={{ marginBottom: 16 }}>
              <input
                style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #eee" }}
                placeholder="업체명 검색"
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              {loading && <div style={{ textAlign: "center", color: "#888" }}>불러오는 중...</div>}
              {!loading && companies.length === 0 && <div style={{ textAlign: "center", color: "#aaa" }}>검색 결과 없음</div>}
              {companies
                .filter(c =>
                  !selectedDevCompanies.some(dev => dev.company.id === c.id) &&
                  !selectedClientCompanies.some(cli => cli.company.id === c.id)
                )
                .map(c => (
                  <div
                    key={c.id}
                    style={{ padding: 14, border: "1px solid #eee", borderRadius: 8, background: "#fafbfc", cursor: "pointer", fontWeight: 500, transition: "box-shadow 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                    onClick={() => setSelectedCompanyState(c)}
                  >
                    {c.name}
                  </div>
                ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 12, fontWeight: 600 }}>{selectedCompanyState.name}</div>
            <div style={{ margin: "12px 0 16px 0" }}>
              <input
                placeholder="멤버 이름 검색"
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
                style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #eee" }}
              />
            </div>
            <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
              {loading && <div style={{ textAlign: "center", color: "#888" }}>불러오는 중...</div>}
              {!loading && filteredMembers.length === 0 && <div style={{ textAlign: "center", color: "#aaa" }}>멤버 없음</div>}
              {filteredMembers.map(member => {
                const sel = selectedMembersState.find(m => m.id === member.id);
                return (
                  <div
                    key={member.id}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #eee", borderRadius: 8, padding: 14, background: "#fafbfc", transition: "box-shadow 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{member.name}</div>
                      <div style={{ color: "#888" }}>{member.position}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        style={{ border: 0, borderRadius: 4, background: sel?.type === 'manager' ? '#4338ca' : '#eee', color: sel?.type === 'manager' ? '#fff' : '#222', padding: "4px 12px", cursor: "pointer" }}
                        onClick={() => handleMemberType(member, 'manager')}
                      >담당자</button>
                      <button
                        style={{ border: 0, borderRadius: 4, background: sel?.type === 'member' ? '#19c37d' : '#eee', color: sel?.type === 'member' ? '#fff' : '#222', padding: "4px 12px", cursor: "pointer" }}
                        onClick={() => handleMemberType(member, 'member')}
                      >멤버</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              style={{ marginTop: 24, width: "100%", border: 0, borderRadius: 6, background: "#4338ca", color: "#fff", padding: 10, fontWeight: 500, cursor: "pointer" }}
              onClick={() => {
                if (selectedMembersState.length === 0) {
                  alert('한 명 이상 선택해야 합니다');
                  return;
                }
                onDone(selectedCompanyState, selectedMembersState);
              }}
            >등록</button>
          </>
        )}
        <button style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: 0, fontSize: 22, cursor: "pointer" }} onClick={onClose} aria-label="닫기">×</button>
      </div>
    </div>
  );
}

export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState({
    status: "",
    client: "",
    sort: "latest",
    startDate: "",
    endDate: "",
    keyword: "",
  });
  const [showCreateModal, setShowCreateModal] = useState(false);


  // 프로젝트 목록 가져오기
  const fetchProjects = async (page: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      // 기간 필터 추가
      const params: any = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      const response = await getProjects(page, PAGE_SIZE, params);

      if (response.data) {
        // 백엔드 응답을 기존 Project 타입으로 변환
        const convertedProjects: Project[] = response.data.content.map(
          (project: ProjectResponse) => {
            // 상태 매핑
            const statusMapping: Record<
              string,
              "IN_PROGRESS" | "COMPLETED" | "DELAYED" | "DUE_SOON"
            > = {
              IN_PROGRESS: "IN_PROGRESS",
              COMPLETED: "COMPLETED",
              DELAY: "DELAYED",
              DUE_SOON: "DUE_SOON",
            };

            return {
              id: project.id,
              name: project.name,
              client: project.clientCompany,
              clientManager: "담당자", // 백엔드에서 제공하지 않는 경우 기본값
              devManagers: "개발팀", // 백엔드에서 제공하지 않는 경우 기본값
              status: statusMapping[project.status] || "IN_PROGRESS",
              startDate: project.startDate,
              endDate: project.endDate,
              progress: project.progress,
              // 백엔드 API 응답 필드들
              description: project.description,
              clientCompany: project.clientCompany,
              developerCompany: project.developerCompany,
            };
          }
        );

        setProjects(convertedProjects);
        setFilteredProjects(convertedProjects);
        setTotalPages(response.data.page.totalPages);
        setTotalElements(response.data.page.totalElements);
      }
    } catch (err) {
      console.error("프로젝트 목록 불러오기 실패", err);
      setError("프로젝트 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(currentPage - 1); // 백엔드는 0-based pagination 사용
  }, [currentPage]);

  const handleInputChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleSearch = () => {
    const filtered = projects.filter((project) => {
      const matchesKeyword =
        project.name.includes(filters.keyword) ||
        project.client.includes(filters.keyword) ||
        project.clientManager.includes(filters.keyword) ||
        project.devManagers.includes(filters.keyword);

      const matchesStatus =
        !filters.status || project.status === filters.status;
      const matchesClient =
        !filters.client || project.client === filters.client;

      const startDate = new Date(project.startDate);
      const endDate = new Date(project.endDate);
      const filterStartDate = filters.startDate
        ? new Date(filters.startDate)
        : null;
      const filterEndDate = filters.endDate ? new Date(filters.endDate) : null;

      const matchesDate =
        (!filterStartDate || startDate >= filterStartDate) &&
        (!filterEndDate || endDate <= filterEndDate);

      return matchesKeyword && matchesStatus && matchesClient && matchesDate;
    });

    // 정렬 적용
    const sorted = [...filtered].sort((a, b) => {
      if (filters.sort === "latest") {
        return (
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      } else if (filters.sort === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    setFilteredProjects(sorted);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const handleReset = () => {
    setFilters({
      status: "",
      client: "",
      sort: "latest",
      startDate: "",
      endDate: "",
      keyword: "",
    });
    setFilteredProjects(projects);
    setCurrentPage(1); // 초기화 시 첫 페이지로 이동
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 페이지 번호 배열 생성 (최대 5개)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  if (loading) {
    return (
      <ProjectListContainer>
        <Header>
          <Title>프로젝트 목록</Title>
          <Description>
            프로젝트 관리 시스템의 주요 정보를 한눈에 확인하세요
          </Description>
        </Header>
        <div style={{ textAlign: "center", padding: "40px" }}>
          프로젝트 목록을 불러오는 중...
        </div>
      </ProjectListContainer>
    );
  }

  if (error) {
    return (
      <ProjectListContainer>
        <Header>
          <Title>프로젝트 목록</Title>
          <Description>
            프로젝트 관리 시스템의 주요 정보를 한눈에 확인하세요
          </Description>
        </Header>
        <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
          {error}
        </div>
      </ProjectListContainer>
    );
  }

  return (
    <ProjectListContainer>
      <Header>
        <Title>프로젝트 목록</Title>
        <Description>
          프로젝트 관리 시스템의 주요 정보를 한눈에 확인하세요
        </Description>
        <button
          style={{ marginLeft: "auto", padding: "8px 16px", fontSize: 16, borderRadius: 4, background: "#1976d2", color: "#fff", border: 0, cursor: "pointer" }}
          onClick={() => setShowCreateModal(true)}
        >
          프로젝트 등록
        </button>
      </Header>
      <ProjectFilterBar
        filters={filters}
        onInputChange={handleInputChange}
        onSearch={handleSearch}
        onReset={handleReset}
      />
      <CardGrid>
        {filteredProjects.length === 0 ? (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "40px",
              color: "#666",
            }}
          >
            프로젝트가 없습니다.
          </div>
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </CardGrid>
      {totalPages > 1 && (
        <PaginationContainer>
          <PaginationInfo>
            총 {totalElements}개의 프로젝트 중{" "}
            {(currentPage - 1) * PAGE_SIZE + 1}-
            {Math.min(currentPage * PAGE_SIZE, totalElements)}개 표시
          </PaginationInfo>
          <PaginationNav>
            <PaginationButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              이전
            </PaginationButton>
            {getPageNumbers().map((pageNum) => (
              <PaginationButton
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                $active={currentPage === pageNum}
              >
                {pageNum}
              </PaginationButton>
            ))}
            <PaginationButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              다음
            </PaginationButton>
          </PaginationNav>
        </PaginationContainer>
      )}
      <ProjectCreateModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        fetchProjects={fetchProjects}
      />
    </ProjectListContainer>
  );
}
