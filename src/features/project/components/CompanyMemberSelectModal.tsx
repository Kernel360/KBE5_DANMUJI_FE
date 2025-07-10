import React, { useState, useEffect, useRef } from "react";
import { IoPeopleOutline, IoClose } from "react-icons/io5";
import { FiSearch, FiHome, FiRotateCcw} from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";
import api from "@/api/axios";
import CompanyRegisterModal from "@/features/company/components/CompanyRegisterModal/CompanyRegisterModal";
import MemberRegisterModal from "@/features/user/components/MemberRegisterModal/MemberRegisterModal";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  HeaderButtons,
  PrimaryButton,
  SuccessButton,
  SearchContainer,
  SearchInput,
  SearchButton,
  CompanyList,
  CompanyItem,
  PaginationContainer,
  PaginationButton,
  PaginationText,
  SelectedCompanyHeader,
  SelectedCompanyName,
  BackButton,
  MemberSearchInput,
  MemberList,
  MemberItem,
  MemberInfo,
  MemberAvatar,
  MemberDetails,
  MemberName,
  MemberPosition,
  MemberButtons,
  ManagerButton,
  MemberButton,
  RegisterButton,
  CloseButton,
  LoadingText,
  EmptyText,
} from "./CompanyMemberSelectModal.styled";

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
  const companyListRef = useRef<HTMLDivElement>(null);

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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setTimeout(() => {
      companyListRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle> <FiHome size={18} color="#fdb924" />업체 선택</ModalTitle>
          <HeaderButtons>
            <PrimaryButton onClick={() => setCompanyModalOpen(true)}>
              업체 등록
            </PrimaryButton>
            <SuccessButton onClick={() => setMemberModalOpen(true)}>
              멤버 등록
            </SuccessButton>
          </HeaderButtons>
        </ModalHeader>

        {!selectedCompanyState ? (
          <>
            {/* ✅ 검색 input + 버튼 */}
            <SearchContainer>
              <SearchInput
                placeholder="업체명 검색..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                autoFocus
                onKeyDown={e => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <SearchButton onClick={handleSearch}>
              <FiSearch size={16} />검색
              </SearchButton>
            </SearchContainer>

            {/* ✅ 업체 목록 */}
            <CompanyList ref={companyListRef}>
              {loading && <LoadingText>불러오는 중...</LoadingText>}
              {!loading && companies.length === 0 && <EmptyText>검색 결과 없음</EmptyText>}
              {companies
                .filter(
                  (c) =>
                    !selectedDevCompanies.some((dev) => dev.company.id === c.id) &&
                    !selectedClientCompanies.some((cli) => cli.company.id === c.id)
                )
                .map((c) => (
                  <CompanyItem
                    key={c.id}
                    onClick={() => setSelectedCompanyState(c)}
                  >
                    <span>{c.name}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#666', fontSize: '14px' }}>
                      (<IoPeopleOutline />
                      : {c.userCount}명)
                    </span>
                  </CompanyItem>
                ))}
              {!loading && companies.length > 0 && (
                // ✅ 페이지네이션
                <PaginationContainer>
                  <PaginationButton
                    disabled={page === 0}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    ◀ 이전
                  </PaginationButton>
                  <PaginationText>{page + 1} / {totalPages}</PaginationText>
                  <PaginationButton
                    disabled={page + 1 >= totalPages}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    다음 ▶
                  </PaginationButton>
                </PaginationContainer>
              )}
            </CompanyList>
          </>
        ) : (
          <>
            <SelectedCompanyHeader>
              <SelectedCompanyName>
                {selectedCompanyState.name}
              </SelectedCompanyName>
              <BackButton
                onClick={() => {
                  setSelectedCompanyState(null);
                  setMembers([]);
                  setSelectedMembersState([]);
                }}
              >
                <FiRotateCcw />
                업체 변경
              </BackButton>
            </SelectedCompanyHeader>
            <MemberSearchInput
              placeholder="멤버 이름 검색..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
            />
            <MemberList>
              {loading && <LoadingText>불러오는 중...</LoadingText>}
              {!loading && filteredMembers.length === 0 && <EmptyText>멤버 없음</EmptyText>}
              {filteredMembers.map((member) => {
                const sel = selectedMembersState.find((m) => m.id === member.id);
                return (
                  <MemberItem key={member.id}>
                    <MemberInfo>
                      <MemberAvatar>{member.name.charAt(0)}</MemberAvatar>
                      <MemberDetails>
                        <MemberName>{member.name}</MemberName>
                        <MemberPosition>{member.position}</MemberPosition>
                      </MemberDetails>
                    </MemberInfo>
                    <MemberButtons>
                      <ManagerButton
                        selected={sel?.type === "manager"}
                        onClick={() => handleMemberType(member, "manager")}
                      >
                        담당자
                      </ManagerButton>
                      <MemberButton
                        selected={sel?.type === "member"}
                        onClick={() => handleMemberType(member, "member")}
                      >
                        멤버
                      </MemberButton>
                    </MemberButtons>
                  </MemberItem>
                );
              })}
            </MemberList>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <RegisterButton
                onClick={() => {
                  if (selectedMembersState.length === 0) {
                    alert("한 명 이상 선택해야 합니다");
                    return;
                  }
                  onDone(selectedCompanyState, selectedMembersState);
                }}
              >
                <FaUserPlus />
                등록
              </RegisterButton>
            </div>
          </>
        )}
        <CloseButton onClick={onClose} aria-label="닫기">
          <IoClose size={23} />
        </CloseButton>
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
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CompanyMemberSelectModal;