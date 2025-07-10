import React, { useState, useEffect } from "react";
import api from "@/api/axios";
import CompanyRegisterModal from "@/features/company/components/CompanyRegisterModal/CompanyRegisterModal";
import MemberRegisterModal from "@/features/user/components/MemberRegisterModal/MemberRegisterModal";

type Member = {
  id: number;
  name: string;
  position: string;
};

type Company = { id: number; name: string, userCount: number };

type SelectedMember = {
  id: number;
  name: string;
  position: string;
  type: "manager" | "member";
};

interface CompanyMemberSelectModalProps {
  onClose: () => void;
  onDone: (company: Company, members: SelectedMember[]) => void;
  selectedCompany?: Company | null;
  selectedMembers?: SelectedMember[];
  selectedDevCompanies?: { company: Company }[];
  selectedClientCompanies?: { company: Company }[];
}

const CompanyMemberSelectModal: React.FC<CompanyMemberSelectModalProps> = ({
  onClose,
  onDone,
  selectedCompany,
  selectedMembers,
  selectedDevCompanies = [],
  selectedClientCompanies = [],
}) => {
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState(""); // 실제 API 파라미터용 검색어
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompanyState, setSelectedCompanyState] = useState<Company | null>(selectedCompany ?? null);
  const [members, setMembers] = useState<Member[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMembersState, setSelectedMembersState] = useState<SelectedMember[]>(selectedMembers ?? []);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // 업체 목록 강제 새로고침용
  const [memberRefreshKey, setMemberRefreshKey] = useState(0); // 멤버 목록 강제 새로고침용

  // ✅ 검색 버튼 or Enter 입력 시 호출되는 함수
  const handleSearch = () => {
    setPage(0);          // 페이지 초기화
    setSearch(inputValue); // API 요청용 검색어 업데이트
  };

  // ✅ 업체 검색 API 호출
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const params: any = { page, size: 10 };
        if (search) params.name = search;
  
        const res = await api.get("/api/companies/search", { params });
  
        const data = res.data?.data;
        const result = Array.isArray(data?.content) ? data.content : [];
  
        // ✅ content 설정
        setCompanies(
          result.filter(
            (c: any) => c && typeof c.id === "number" && typeof c.name === "string"
          )
        );
  
        // ✅ 페이지네이션 정확히 설정
        const pageInfo = data?.page;
        setTotalPages(typeof pageInfo?.totalPages === "number" ? pageInfo.totalPages : 1);
      } catch (e) {
        setCompanies([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCompanies();
  }, [search, page, refreshKey]); // search나 page가 바뀔 때마다 재호출

  // ✅ 검색창 비우면 전체 검색 + 페이지 초기화
  useEffect(() => {
    if (inputValue === "") {
      setPage(0);
      setSearch("");
    }
  }, [inputValue]);

  // ✅ 업체 선택 시 멤버 목록 불러오기
  useEffect(() => {
    if (!selectedCompanyState) return;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/companies/${selectedCompanyState.id}/users`);
        const result = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data?.content)
          ? res.data.content
          : Array.isArray(res.data)
          ? res.data
          : [];
        setMembers(result);
      } catch (e) {
        setMembers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedCompanyState, memberRefreshKey]);

  // 멤버 검색 필터링
  const filteredMembers = members.filter((m) => m.name.includes(memberSearch));

  // 멤버 버튼 클릭 핸들러
  const handleMemberType = (member: Member, type: "manager" | "member") => {
    setSelectedMembersState((prev) => {
      const exists = prev.find((m) => m.id === member.id);
      if (exists) {
        if (exists.type === type) {
          return prev.filter((m) => m.id !== member.id);
        } else {
          return prev.map((m) => (m.id === member.id ? { ...m, type } : m));
        }
      } else {
        return [...prev, { ...member, type }];
      }
    });
  };

  // 모달 외부 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
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
        zIndex: 2000,
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
          padding: 32,
          minWidth: 400,
          maxWidth: 500,
          width: "90vw",
          boxShadow: "0 2px 32px rgba(0,0,0,0.18)",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 0 }}>업체 선택</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ background: "#2563eb", color: "#fff", border: 0, borderRadius: 4, padding: "6px 16px", fontWeight: 500, fontSize: 15, cursor: "pointer" }}
              onClick={() => setCompanyModalOpen(true)}>
              업체 등록
            </button>
            <button style={{ background: "#19c37d", color: "#fff", border: 0, borderRadius: 4, padding: "6px 16px", fontWeight: 500, fontSize: 15, cursor: "pointer" }}
              onClick={() => setMemberModalOpen(true)}>
              멤버 생성
            </button>
          </div>
        </div>

        {!selectedCompanyState ? (
          <>
            {/* ✅ 검색 input + 버튼 */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
              <input
                style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #eee", fontSize: 15 }}
                placeholder="업체명 검색"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                autoFocus
                onKeyDown={e => {
                  if (e.key === "Enter") handleSearch(); // 🔍 Enter 검색
                }}
              />
              <button
                style={{ marginLeft: 8, background: "#2563eb", color: "#fff", border: 0, borderRadius: 4, padding: "6px 16px", fontWeight: 500, fontSize: 15, cursor: "pointer" }}
                onClick={handleSearch} // 🔍 버튼 검색
              >
                검색
              </button>
            </div>

            {/* ✅ 업체 목록 */}
            <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              {loading && <div style={{ textAlign: "center", color: "#888" }}>불러오는 중...</div>}
              {!loading && companies.length === 0 && <div style={{ textAlign: "center", color: "#aaa" }}>검색 결과 없음</div>}
              {companies
                .filter(
                  (c) =>
                    !selectedDevCompanies.some((dev) => dev.company.id === c.id) &&
                    !selectedClientCompanies.some((cli) => cli.company.id === c.id)
                )
                .map((c) => (
                  <div
                    key={c.id}
                    style={{
                      padding: 14,
                      border: "1px solid #eee",
                      borderRadius: 8,
                      background: "#fafbfc",
                      cursor: "pointer",
                      fontWeight: 500,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                    onClick={() => setSelectedCompanyState(c)}
                  >
                    {c.name} (회원수: {c.userCount})
                  </div>
                ))}
              {!loading && companies.length > 0 && (
                // ✅ 페이지네이션
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 12 }}>
                  <button
                    style={{ background: "#eee", border: 0, borderRadius: 4, padding: "4px 12px", fontWeight: 500, fontSize: 14, cursor: page === 0 ? "not-allowed" : "pointer", color: page === 0 ? "#bbb" : "#222" }}
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                  >
                    이전
                  </button>
                  <span style={{ fontWeight: 500, fontSize: 15 }}>{page + 1} / {totalPages}</span>
                  <button
                    style={{ background: "#eee", border: 0, borderRadius: 4, padding: "4px 12px", fontWeight: 500, fontSize: 14, cursor: page + 1 >= totalPages ? "not-allowed" : "pointer", color: page + 1 >= totalPages ? "#bbb" : "#222" }}
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    다음
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontWeight: 600 }}>{selectedCompanyState.name}</div>
              <button
                style={{
                  background: '#eee',
                  color: '#222',
                  border: 0,
                  borderRadius: 4,
                  padding: '4px 12px',
                  fontWeight: 500,
                  fontSize: 14,
                  cursor: 'pointer',
                  marginLeft: 8,
                }}
                onClick={() => {
                  setSelectedCompanyState(null);
                  setMembers([]);
                  setSelectedMembersState([]);
                }}
              >
                업체 다시 선택
              </button>
            </div>
            <div style={{ margin: "12px 0 16px 0" }}>
              <input
                placeholder="멤버 이름 검색"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #eee" }}
              />
            </div>
            <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
              {loading && <div style={{ textAlign: "center", color: "#888" }}>불러오는 중...</div>}
              {!loading && filteredMembers.length === 0 && <div style={{ textAlign: "center", color: "#aaa" }}>멤버 없음</div>}
              {filteredMembers.map((member) => {
                const sel = selectedMembersState.find((m) => m.id === member.id);
                return (
                  <div key={member.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #eee", borderRadius: 8, padding: 14, background: "#fafbfc" }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{member.name}</div>
                      <div style={{ color: "#888" }}>{member.position}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        style={{
                          border: 0,
                          borderRadius: 4,
                          background: sel?.type === "manager" ? "#4338ca" : "#eee",
                          color: sel?.type === "manager" ? "#fff" : "#222",
                          padding: "4px 12px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleMemberType(member, "manager")}
                      >
                        담당자
                      </button>
                      <button
                        style={{
                          border: 0,
                          borderRadius: 4,
                          background: sel?.type === "member" ? "#19c37d" : "#eee",
                          color: sel?.type === "member" ? "#fff" : "#222",
                          padding: "4px 12px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleMemberType(member, "member")}
                      >
                        멤버
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              style={{ marginTop: 24, width: "100%", border: 0, borderRadius: 6, background: "#4338ca", color: "#fff", padding: 10, fontWeight: 500, cursor: "pointer" }}
              onClick={() => {
                if (selectedMembersState.length === 0) {
                  alert("한 명 이상 선택해야 합니다");
                  return;
                }
                onDone(selectedCompanyState, selectedMembersState);
              }}
            >
              등록
            </button>
          </>
        )}
        <button
          style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: 0, fontSize: 22, cursor: "pointer" }}
          onClick={onClose}
          aria-label="닫기"
        >
          ×
        </button>
        {companyModalOpen && (
          <CompanyRegisterModal
            open={companyModalOpen}
            onClose={() => setCompanyModalOpen(false)}
            onRegisterSuccess={() => {
              setCompanyModalOpen(false);
              setInputValue("");
              setSearch("");
              setRefreshKey((k) => k + 1); // 강제 새로고침
            }}
          />
        )}
        {memberModalOpen && (
          <MemberRegisterModal
            onClose={() => setMemberModalOpen(false)}
            onRegister={async (memberData) => {
              try {
                const response = await api.post("/api/admin", memberData);
                // 파일 저장 로직 추가
                const { username, password } = response.data.data || {};
                if (username && password) {
                  const fileContent = `Username: ${username}\nPassword: ${password}`;
                  const blob = new Blob([fileContent], { type: "text/plain" });
                  const fileUrl = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = fileUrl;
                  link.download = "member_credentials.txt";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
                setMemberModalOpen(false);
                setMemberRefreshKey((k) => k + 1); // 멤버 목록 강제 새로고침
                alert("멤버가 성공적으로 등록되었습니다.");
              } catch (e) {
                alert("멤버 등록에 실패했습니다.");
              }
            }}
            initialCompanyId={selectedCompanyState?.id}
          />
        )}
      </div>
    </div>
  );
};

export default CompanyMemberSelectModal;