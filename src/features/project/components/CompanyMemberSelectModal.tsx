import React, { useState, useEffect, useRef } from "react";
import { FiHome, FiUser, FiUsers, FiBriefcase } from "react-icons/fi";
import api from "@/api/axios";
import CompanyRegisterModal from "@/features/company/components/CompanyRegisterModal/CompanyRegisterModal";
import MemberRegisterModal from "@/features/user/components/MemberRegisterModal/MemberRegisterModal";
import { ModalTitle, Button as ModalButton } from "./ProjectCreateModal.styled";
import { CompanyItem } from "./CompanyMemberSelectModal.styled";

type Member = {
  id: number;
  name: string;
  position: string;
};

export type Company = { id: number; name: string; userCount: number };

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
  const [selectedCompanyState, setSelectedCompanyState] =
    useState<Company | null>(selectedCompany ?? null);
  const [members, setMembers] = useState<Member[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMembersState, setSelectedMembersState] = useState<
    SelectedMember[]
  >(selectedMembers ?? []);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // 업체 목록 강제 새로고침용
  const [memberRefreshKey, setMemberRefreshKey] = useState(0); // 멤버 목록 강제 새로고침용
  const companyListRef = useRef<HTMLDivElement>(null);

  // ✅ 검색 버튼 or Enter 입력 시 호출되는 함수
  const handleSearch = () => {
    setPage(0); // 페이지 초기화
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
            (c) => c && typeof c.id === "number" && typeof c.name === "string"
          )
        );

        // ✅ 페이지네이션 정확히 설정
        const pageInfo = data?.page;
        setTotalPages(
          typeof pageInfo?.totalPages === "number" ? pageInfo.totalPages : 1
        );
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
        const res = await api.get(
          `/api/companies/${selectedCompanyState.id}/users`
        );
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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setTimeout(() => {
      companyListRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  };

  // 동기화: props가 바뀔 때마다 내부 state도 갱신
  useEffect(() => {
    setSelectedCompanyState(selectedCompany ?? null);
  }, [selectedCompany]);
  useEffect(() => {
    setSelectedMembersState(selectedMembers ?? []);
  }, [selectedMembers]);

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
          borderRadius: 16,
          padding: 32,
          minWidth: 340,
          maxWidth: 400,
          width: "96vw",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 2px 32px rgba(0,0,0,0.18)",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <ModalTitle style={{ fontSize: 20, paddingLeft: 10, minHeight: 0 }}>
            업체 선택
          </ModalTitle>
          <div style={{ display: "flex", gap: 6 }}>
            <ModalButton
              $variant="primary"
              style={{
                padding: "4px 12px",
                fontSize: 14,
                height: 32,
                minWidth: 0,
              }}
              onClick={() => setCompanyModalOpen(true)}
            >
              업체 등록
            </ModalButton>
            <ModalButton
              $variant="secondary"
              style={{
                padding: "4px 12px",
                fontSize: 14,
                height: 32,
                minWidth: 0,
              }}
              onClick={() => setMemberModalOpen(true)}
            >
              멤버 생성
            </ModalButton>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: 22,
                cursor: "pointer",
                color: "#888",
                marginLeft: 6,
                lineHeight: 1,
                borderRadius: 8,
                padding: 2,
                transition: "color 0.18s",
              }}
              title="닫기"
            >
              ×
            </button>
          </div>
        </div>

        {!selectedCompanyState ? (
          <>
            {/* ✅ 검색 input + 버튼 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <input
                style={{
                  width: "82%",
                  maxWidth: 600,
                  minWidth: 120,
                  padding: 10,
                  borderRadius: 6,
                  border: "1.5px solid #e5e7eb",
                  fontSize: 15,
                  background: "#fafbfc",
                  color: "#222",
                  marginBottom: 0,
                  transition: "border 0.18s, box-shadow 0.18s",
                }}
                placeholder="업체명 검색"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <ModalButton
                $variant="primary"
                style={{
                  marginLeft: 8,
                  padding: "4px 12px",
                  fontSize: 14,
                  height: 32,
                  minWidth: 0,
                }}
                onClick={handleSearch}
              >
                검색
              </ModalButton>
            </div>

            {/* ✅ 업체 목록 */}
            <div
              style={{
                maxHeight: 300,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {loading && (
                <div style={{ textAlign: "center", color: "#888" }}>
                  불러오는 중...
                </div>
              )}
              {!loading && companies.length === 0 && (
                <div style={{ textAlign: "center", color: "#aaa" }}>
                  검색 결과 없음
                </div>
              )}
              {companies
                .filter((c: Company) =>
                  !selectedDevCompanies.some(
                    (dev) => dev.company.id === c.id
                  ) &&
                  !selectedClientCompanies.some(
                    (cli) => cli.company.id === c.id
                  )
                )
                .map((c: Company) => (
                  <CompanyItem
                    key={c.id}
                    style={{
                      padding: 14,
                      border: "1px solid #eee",
                      borderRadius: 8,
                      background: "#fafbfc",
                      cursor: "pointer",
                      fontWeight: 500,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      transition: "background 0.18s",
                    }}
                    onClick={() => setSelectedCompanyState(c)}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#f3f4f6")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "#fafbfc")
                    }
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 7 }}
                    >
                      <FiHome
                        size={16}
                        style={{ color: "#fdb924", marginRight: 4 }}
                      />
                      {c.name}
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        color: "#888",
                        fontWeight: 400,
                        fontSize: 14,
                      }}
                    >
                      <FiUser size={15} style={{ marginRight: 2 }} />
                      회원수: {c.userCount}
                    </span>
                  </CompanyItem>
                ))}
              {!loading && companies.length > 0 && (
                // ✅ 페이지네이션
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 12,
                  }}
                >
                  <button
                    style={{
                      background: "#eee",
                      border: 0,
                      borderRadius: 4,
                      padding: "4px 12px",
                      fontWeight: 500,
                      fontSize: 14,
                      cursor: page === 0 ? "not-allowed" : "pointer",
                      color: page === 0 ? "#bbb" : "#222",
                    }}
                    disabled={page === 0}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    이전
                  </button>
                  <span style={{ fontWeight: 500, fontSize: 15 }}>
                    {page + 1} / {totalPages}
                  </span>
                  <button
                    style={{
                      background: "#eee",
                      border: 0,
                      borderRadius: 4,
                      padding: "4px 12px",
                      fontWeight: 500,
                      fontSize: 14,
                      cursor:
                        page + 1 >= totalPages ? "not-allowed" : "pointer",
                      color: page + 1 >= totalPages ? "#bbb" : "#222",
                    }}
                    disabled={page + 1 >= totalPages}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    다음 ▶
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
                background: "#f9fafb",
                borderRadius: 10,
                padding: "14px 18px 14px 18px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontWeight: 600,
                  fontSize: 17,
                }}
              >
                <FiHome
                  size={16}
                  style={{ color: "#fdb924", marginRight: 4 }}
                />
                {selectedCompanyState.name}
              </span>
              <ModalButton
                $variant="secondary"
                style={{
                  padding: "4px 12px",
                  fontSize: 14,
                  height: 32,
                  minWidth: 0,
                  marginLeft: 8,
                }}
                onClick={() => {
                  setSelectedCompanyState(null);
                  setMembers([]);
                  setSelectedMembersState([]);
                }}
              >
                업체 다시 선택
              </ModalButton>
            </div>
            <div style={{ margin: "12px 0 16px 0" }}>
              <input
                placeholder="멤버 이름 검색"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #eee",
                  background: "#fff",
                  color: "#222",
                  fontSize: 15,
                  transition: "border 0.18s, box-shadow 0.18s",
                }}
              />
            </div>
            <div
              style={{
                maxHeight: 300,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {loading && (
                <div style={{ textAlign: "center", color: "#888" }}>
                  불러오는 중...
                </div>
              )}
              {!loading && filteredMembers.length === 0 && (
                <div style={{ textAlign: "center", color: "#aaa" }}>
                  멤버 없음
                </div>
              )}
              {filteredMembers.map((member) => {
                const sel = selectedMembersState.find(
                  (m) => m.id === member.id
                );
                // 개발자/고객사 구분 아이콘
                let roleIcon = (
                  <FiUser
                    size={16}
                    style={{ color: "#6b7280", marginRight: 6 }}
                  />
                );
                if (member.position?.includes("개발")) {
                  roleIcon = (
                    <FiUsers
                      size={16}
                      style={{ color: "#3b82f6", marginRight: 6 }}
                    />
                  );
                } else if (
                  member.position?.includes("고객") ||
                  member.position?.includes("클라이언트") ||
                  member.position?.toLowerCase().includes("client")
                ) {
                  roleIcon = (
                    <FiBriefcase
                      size={16}
                      style={{ color: "#f59e0b", marginRight: 6 }}
                    />
                  );
                }
                return (
                  <div
                    key={member.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: "1px solid #eee",
                      borderRadius: 8,
                      padding: 14,
                      background: "#fafbfc",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      {roleIcon}
                      <div>
                        <div style={{ fontWeight: 600 }}>{member.name}</div>
                        <div style={{ color: "#888", fontSize: 14 }}>
                          {member.position}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        style={{
                          border: 0,
                          borderRadius: 4,
                          background:
                            sel?.type === "manager" ? "#4338ca" : "#eee",
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
                          background:
                            sel?.type === "member" ? "#19c37d" : "#eee",
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
            <ModalButton
              $variant="primary"
              style={{
                marginTop: 24,
                width: "100%",
                fontSize: 16,
                padding: 10,
                borderRadius: 6,
              }}
              onClick={() => {
                if (selectedMembersState.length === 0) {
                  alert("한 명 이상 선택해야 합니다");
                  return;
                }
                onDone(selectedCompanyState, selectedMembersState);
              }}
            >
              등록
            </ModalButton>
          </>
        )}
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
                setRefreshKey((k) => k + 1); // 회사 목록 강제 새로고침
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
