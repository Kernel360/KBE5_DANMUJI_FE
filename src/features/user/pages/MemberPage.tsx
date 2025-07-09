import api from "@/api/axios";
import { useState, useEffect } from "react";
import MemberDetailModal from "../components/MemberDetailModal/MemberDetailModal";
import styled from "styled-components";
import {
  FiSearch,
  FiPlus,
  FiChevronDown,
  FiRotateCcw,
  FiHome,
  FiUsers,
  FiUser,
  FiPhone,
  FiCalendar,
} from "react-icons/fi";
import { LuUserRoundCog, LuUserRoundCheck } from "react-icons/lu";
import MemberRegisterModal from "../components/MemberRegisterModal/MemberRegisterModal";
import { formatDateOnly, formatTimeOnly } from "@/utils/dateUtils";
import { useNotification } from "@/features/Notification/NotificationContext";

export interface Member {
  id: number;
  username: string;
  name: string;
  role: string;
  companyId: number;
  position: string;
  phone: string;
  email: string;
  createdAt: string;
  lastLoginAt?: string;
}

interface Company {
  id: number;
  name: string;
}

interface MemberData {
  username: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  companyId?: number;
}

// styled-components
const Container = styled.div`
  padding: 32px 32px;
  background-color: #f9fafb;
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: -7px;
  padding-left: 16px;
  position: relative;
  color: #111827;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 1.4rem;
    background: #fdb924;
    border-radius: 2px;
  }
`;

const Subtitle = styled.p`
  color: #bdbdbd;
  font-size: 0.9rem;
  margin-bottom: 18px;
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  align-items: flex-end;
  position: relative;
  overflow: visible;
  justify-content: space-between;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 90px;
  position: relative;
`;

const FilterLabel = styled.label`
  font-size: 0.92rem;
  color: #374151;
  font-weight: 500;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 120px;
  max-width: 320px;
  padding: 10px 16px;
  font-size: 14px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background-color: #ffffff;
  color: #374151;
  transition: all 0.1s ease;
  outline: none;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #fdb924;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.1);
  }

  &:hover {
    border-color: #d1d5db;
  }
`;

const SelectButton = styled.button<{
  $hasValue: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 140px;
  padding: 8px 12px;
  background: ${({ $hasValue }) => ($hasValue ? "#fef3c7" : "#ffffff")};
  border: 2px solid ${({ $hasValue }) => ($hasValue ? "#fdb924" : "#e5e7eb")};
  border-radius: 8px;
  color: ${({ $hasValue }) => ($hasValue ? "#a16207" : "#374151")};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  svg {
    flex-shrink: 0;
    color: ${({ $hasValue }) => ($hasValue ? "#fdb924" : "#6b7280")};
    transition: transform 0.2s ease;
  }

  &.open svg:first-child {
    transform: rotate(180deg);
  }

  .select-value {
    flex: 1;
    font-weight: ${({ $hasValue }) => ($hasValue ? "600" : "500")};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    background: ${({ $hasValue }) => ($hasValue ? "#fef9c3" : "#f9fafb")};
    border-color: ${({ $hasValue }) => ($hasValue ? "#fdb924" : "#d1d5db")};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SelectDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 1000;
  margin-top: 4px;
  opacity: ${({ $isOpen }) => ($isOpen ? "1" : "0")};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transform: ${({ $isOpen }) =>
    $isOpen ? "translateY(0)" : "translateY(-8px)"};
  transition: all 0.2s ease;
  max-height: 200px;
  overflow-y: auto;
`;

const SelectOption = styled.div<{ $isSelected: boolean }>`
  padding: 10px 14px;
  font-size: 0.875rem;
  color: ${({ $isSelected }) => ($isSelected ? "#2563eb" : "#374151")};
  background: ${({ $isSelected }) => ($isSelected ? "#f0f9ff" : "#fff")};
  font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const SearchRight = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

const TableContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const TableHead = styled.thead`
  background-color: #f9fafb;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 12px 16px;
  color: #374151;
  font-weight: 600;
  font-size: 13px;
  border-bottom: 1px solid #e5e7eb;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:hover {
    background-color: #fefdf4;
    transition: background-color 0.2s ease;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  color: #374151;
  vertical-align: middle;
  text-align: left;
`;

// const MemberNameCell = styled(TableCell)`
//   color: #374151;
//   font-weight: 500;
//   cursor: pointer;
//   transition: color 0.2s ease;

//   &:hover {
//     color: #3b82f6;
//   }
// `;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #6b7280;
  font-size: 0.9rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #ef4444;
  font-size: 0.9rem;
`;

const NewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: #f9fafb;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.25s, border 0.25s, box-shadow 0.25s;
  box-shadow: 0 2px 4px rgba(107, 114, 128, 0.2);

  &:hover {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    border-color: #fef3c7;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(251, 191, 36, 0.3);
    color: #fff;
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(251, 191, 36, 0.2);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.2);
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;
  gap: 0.7rem;
`;

const PaginationInfo = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 0.825rem;
  margin-top: 0.75rem;
  margin-bottom: 0.1rem;
`;

const PaginationNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 0.32rem 0.6rem;
  border: none;
  background: transparent;
  color: ${({ $active }) => ($active ? "#fff" : "#111827")};
  border-radius: 1.2rem;
  font-size: 0.75rem;
  font-weight: 500;
  box-shadow: none;
  cursor: pointer;
  outline: none;
  min-width: 28px;
  min-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  ${({ $active }) =>
    $active &&
    `
      background: #fdb924;
      color: #fff;
    `}

  &:hover {
    background-color: ${({ $active }) => ($active ? "#fdb924" : "#e5e7eb")};
  }
`;

export const formatTelNo = (telNo: string) => {
  if (!telNo) return telNo;
  const cleaned = ("" + telNo).replace(/\D/g, "");
  // 11자리(휴대폰) 01012345678 -> 010-1234-5678
  if (cleaned.length === 11) {
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
  }
  // 10자리(지역번호) 02, 031, 032 등
  if (cleaned.length === 10) {
    // 02로 시작하는 경우 (서울)
    if (cleaned.startsWith("02")) {
      const match = cleaned.match(/^(02)(\d{4})(\d{4})$/);
      if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
      }
    } else {
      // 그 외 3자리 지역번호
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
      }
    }
  }
  // 9자리(서울) 02-123-4567
  if (cleaned.length === 9 && cleaned.startsWith("02")) {
    const match = cleaned.match(/^(02)(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
  }
  return telNo;
};

export default function MemberPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyError, setCompanyError] = useState<string | null>(null);

  // 드롭다운 상태 관리
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [positionDropdownOpen, setPositionDropdownOpen] = useState(false);

  // 페이지네이션 상태 추가
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalMembers, setTotalMembers] = useState(0);

  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const { notify } = useNotification();

  // 전체 직책 목록 상태 추가
  const [allPositions, setAllPositions] = useState<string[]>([]);
  // 선택된 직책 상태 추가
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  // 선택된 업체 상태 추가
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  // 검색어 상태 추가
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // 전체 직책 목록 불러오기
  const fetchAllPositions = async () => {
    try {
      const response = await api.get("/api/admin/positions");
      if (Array.isArray(response.data.data)) {
        setAllPositions(response.data.data.map((item: { position: string }) => item.position));
      } else {
        setAllPositions([]);
      }
    } catch {
      setAllPositions([]);
    }
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      // 서버 페이징 구조에 맞게 page, size 파라미터로 요청
      const response = await api.get("/api/admin/allUsers", {
        params: { page: currentPage, size: pageSize },
      });
      const pageData = response.data.data.page;
      setMembers(Array.isArray(response.data.data.content) ? response.data.data.content : []);
      setTotalMembers(pageData?.totalElements ?? 0);
      // console.log("Current members:", response.data.data.content);
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

  const fetchCompanies = async () => {
    try {
      const response = await api.get("/api/companies/name");
      if (Array.isArray(response.data.data)) {
        setCompanies(response.data.data.map((item: { companyId: number, companyName: string }) => ({
          id: item.companyId,
          name: item.companyName
        })));
      } else {
        setCompanies([]);
      }
      setCompanyError(null);
    } catch (err: unknown) {
      setCompanies([]); // 업체가 없을 때도 빈 배열로
      setCompanyError(
        "업체를 불러오지 못했습니다. 업체가 등록되어 있지 않을 수 있습니다."
      );
      console.error("Failed to fetch companies:", err);
    }
  };

  // 필터링된 회원 목록 불러오기
  const fetchFilteredMembers = async (page = 0) => {
    try {
      setLoading(true);
      setError(null);
      // 쿼리 파라미터 타입 명확화
      const params: {
        page: number;
        size: number;
        companyId?: number;
        position?: string;
        name?: string;
      } = { page, size: pageSize };
      if (selectedCompanyId !== null) params.companyId = selectedCompanyId;
      if (selectedPosition) params.position = selectedPosition;
      if (searchKeyword) params.name = searchKeyword;
      const response = await api.get("/api/admin/filtering", { params });
      const pageData = response.data.data.page;
      setMembers(Array.isArray(response.data.data.content) ? response.data.data.content : []);
      setTotalMembers(pageData?.totalElements ?? 0);
    } catch (err: unknown) {
      let errorMessage = "An unknown error occurred";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setMembers([]);
      setTotalMembers(0);
      console.error("Failed to fetch filtered members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchAllPositions(); // 직책 목록도 함께 불러오기
  }, []);

  // 페이지 변경 시 회원 목록 새로고침
  useEffect(() => {
    if (searchKeyword || selectedCompanyId !== null || selectedPosition) {
      fetchFilteredMembers(currentPage);
    } else {
      fetchMembers();
    }
  }, [currentPage, pageSize]);

  // 필터링된 회원 목록
  // 서버에서 이미 페이징된 데이터만 오므로, filtered는 members 그대로 사용
  const filtered = members;

  // 필터링된 결과에 대한 totalMembers 업데이트
  // (서버에서 totalElements로 관리하므로 필요 없음)
  // useEffect(() => {
  //   setTotalMembers(filtered.length);
  //   setCurrentPage(0); // 필터 변경 시 첫 페이지로 이동
  // }, [filtered.length]);

  // 이름 클릭 시 모달 오픈
  const handleMemberClick = (member: Member) => {
    setSelectedMemberId(member.id);
    setModalOpen(true);
  };

  // 페이지네이션 함수들
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // 10개씩 앞뒤로 가는 함수
  const handleJumpForward = () => {
    const totalPages = Math.ceil(totalMembers / pageSize);
    const newPage = Math.min(currentPage + 10, totalPages - 1);
    handlePageChange(newPage);
  };

  const handleJumpBackward = () => {
    const newPage = Math.max(currentPage - 10, 0);
    handlePageChange(newPage);
  };

  const getPaginationInfo = () => {
    const start = currentPage * pageSize + 1;
    const end = Math.min((currentPage + 1) * pageSize, totalMembers);
    return `총 ${totalMembers}명의 회원 중 ${start}-${end}명 표시`;
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(totalMembers / pageSize);
    const pages = [];

    // 현재 페이지 주변의 페이지들 표시
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    // 첫 페이지
    if (startPage > 0) {
      pages.push(
        <PaginationButton key="first" onClick={() => handlePageChange(0)}>
          처음
        </PaginationButton>
      );
      if (startPage > 1) {
        pages.push(<span key="dots1">...</span>);
      }
    }

    // 페이지 번호들
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationButton
          key={i}
          $active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i + 1}
        </PaginationButton>
      );
    }

    // 마지막 페이지
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pages.push(<span key="dots2">...</span>);
      }
      pages.push(
        <PaginationButton
          key="last"
          onClick={() => handlePageChange(totalPages - 1)}
        >
          마지막
        </PaginationButton>
      );
    }

    return pages;
  };

  // 회원 등록 핸들러
  const handleRegister = async (memberData: MemberData) => {
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
      await fetchMembers();
      await fetchCompanies();
      await fetchAllPositions(); // 회원 등록 후 회사/직책 목록도 새로고침
      setRegisterModalOpen(false);
      notify("회원이 성공적으로 등록되었습니다.", true);
    } catch {
      notify("회원 등록에 실패했습니다.", false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedMemberId(null);
    fetchMembers();
  };

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    setCurrentPage(0);
    fetchFilteredMembers(0);
  };

  if (loading)
    return (
      <Container>
        <HeaderSection>
          <Title>회원 관리</Title>
          <Subtitle>
            프로젝트 관리 시스템의 회원 정보를 한눈에 확인하세요.
          </Subtitle>
        </HeaderSection>
        <LoadingContainer>회원 목록을 불러오는 중...</LoadingContainer>
      </Container>
    );

  if (error)
    return (
      <Container>
        <HeaderSection>
          <Title>회원 관리</Title>
          <Subtitle>
            프로젝트 관리 시스템의 회원 정보를 한눈에 확인하세요.
          </Subtitle>
        </HeaderSection>
        <ErrorContainer>에러: {error}</ErrorContainer>
      </Container>
    );

  return (
    <Container>
      <HeaderSection>
        <Title>회원 관리</Title>
        <Subtitle>
          프로젝트 관리 시스템의 회원 정보를 한눈에 확인하세요.
        </Subtitle>
        {companyError && (
          <div style={{ color: "#ef4444", marginBottom: "12px" }}>
            {companyError}
          </div>
        )}
      </HeaderSection>
      <FilterBar>
        <FilterGroup>
          <FilterLabel>업체</FilterLabel>
          <SelectButton
            $hasValue={false}
            onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
            className={companyDropdownOpen ? "open" : ""}
          >
            <FiHome size={16} />
            <span className="select-value">
              {selectedCompanyId === null
                ? "모든 업체"
                : (companies.find((c) => c.id === selectedCompanyId)?.name || "")}
            </span>
            <FiChevronDown size={16} />
          </SelectButton>
          <SelectDropdown $isOpen={companyDropdownOpen}>
            <SelectOption
              $isSelected={false}
              onClick={() => {
                setSelectedCompanyId(null);
                setCompanyDropdownOpen(false);
              }}
            >
              모든 업체
            </SelectOption>
            {Array.isArray(companies) && companies.length === 0 ? (
              <SelectOption $isSelected={false} style={{ color: "#bdbdbd" }}>
                등록된 업체가 없습니다
              </SelectOption>
            ) : (
              (Array.isArray(companies) ? companies : []).map((company) => (
                <SelectOption
                  key={company.id}
                  $isSelected={false}
                  onClick={() => {
                    setSelectedCompanyId(company.id);
                    setCompanyDropdownOpen(false);
                  }}
                >
                  {company.name}
                </SelectOption>
              ))
            )}
          </SelectDropdown>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>직책</FilterLabel>
          <SelectButton
            $hasValue={false}
            onClick={() => setPositionDropdownOpen(!positionDropdownOpen)}
            className={positionDropdownOpen ? "open" : ""}
          >
            <FiUsers size={16} />
            <span className="select-value">
              {selectedPosition || "모든 직책"}
            </span>
            <FiChevronDown size={16} />
          </SelectButton>
          <SelectDropdown $isOpen={positionDropdownOpen}>
            <SelectOption
              $isSelected={false}
              onClick={() => {
                setSelectedPosition("");
                setPositionDropdownOpen(false);
              }}
            >
              모든 직책
            </SelectOption>
            {allPositions.map((position) => (
              <SelectOption
                key={position}
                $isSelected={false}
                onClick={() => {
                  setSelectedPosition(position);
                  setPositionDropdownOpen(false);
                }}
              >
                {position}
              </SelectOption>
            ))}
          </SelectDropdown>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>이름</FilterLabel>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <SearchInput
              type="text"
              placeholder="회원 이름 검색..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // 검색 버튼 클릭과 동일하게 처리할 수 있음
                }
              }}
            />
            <NewButton
              style={{
                minWidth: "auto",
                padding: "10px",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={handleSearch}
            >
              <FiSearch size={16} />
            </NewButton>
            <NewButton
              onClick={() => {
                setSelectedCompanyId(null);
                setSelectedPosition("");
                setSearchKeyword("");
                setCurrentPage(0);
                fetchMembers();
              }}
              style={{
                minWidth: "auto",
                padding: "10px",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiRotateCcw size={16} />
            </NewButton>
          </div>
        </FilterGroup>
        <SearchRight>
          <NewButton onClick={() => setRegisterModalOpen(true)}>
            <FiPlus size={16} />
            회원 등록
          </NewButton>
        </SearchRight>
      </FilterBar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>회원</TableHeader>
              <TableHeader>업체</TableHeader>
              <TableHeader>직책</TableHeader>
              <TableHeader>연락처</TableHeader>
              <TableHeader>가입일</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleMemberClick(member)}
                    >
                      {member.position === "admin" ||
                      member.position === "시스템 관리자" ? (
                        <LuUserRoundCog
                          size={14}
                          style={{ color: "#8b5cf6" }}
                        />
                      ) : member.position === "팀장" ? (
                        <LuUserRoundCheck
                          size={14}
                          style={{ color: "#3b82f6" }}
                        />
                      ) : member.position === "developer" ||
                        member.position === "개발자" ||
                        member.position === "백엔드 개발자" ||
                        member.position === "프론트엔드 개발자" ? (
                        <FiUser size={14} style={{ color: "#3b82f6" }} />
                      ) : member.position === "client" ||
                        member.position === "고객" ? (
                        <FiUser size={14} style={{ color: "#10b981" }} />
                      ) : (
                        <FiUser size={14} style={{ color: "#6b7280" }} />
                      )}
                      <span style={{ fontWeight: "500" }}>{member.name}</span>
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>
                        ({member.username})
                      </span>
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>
                        (
                        {member.position === "admin" ||
                        member.position === "시스템 관리자"
                          ? "관리자"
                          : member.position === "developer" ||
                            member.position === "개발자" ||
                            member.position === "백엔드 개발자" ||
                            member.position === "프론트엔드 개발자"
                          ? "개발사 직원"
                          : member.position === "client" ||
                            member.position === "고객"
                          ? "고객사 직원"
                          : "사용자"}
                        )
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleMemberClick(member)}
                    >
                      <FiHome size={14} style={{ color: "#8b5cf6" }} />
                      <span style={{ fontWeight: "500" }}>
                        {(companies &&
                          companies.find((c) => c.id === member.companyId)
                            ?.name) ||
                          "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleMemberClick(member)}
                    >
                      {member.position === "admin" ||
                      member.position === "시스템 관리자" ? (
                        <LuUserRoundCog
                          size={14}
                          style={{ color: "#8b5cf6" }}
                        />
                      ) : member.position === "팀장" ? (
                        <LuUserRoundCheck
                          size={14}
                          style={{ color: "#3b82f6" }}
                        />
                      ) : member.position === "developer" ||
                        member.position === "개발자" ||
                        member.position === "백엔드 개발자" ||
                        member.position === "프론트엔드 개발자" ? (
                        <FiUser size={14} style={{ color: "#3b82f6" }} />
                      ) : member.position === "client" ||
                        member.position === "고객" ? (
                        <FiUser size={14} style={{ color: "#10b981" }} />
                      ) : (
                        <FiUser size={14} style={{ color: "#6b7280" }} />
                      )}
                      <span style={{ fontWeight: "500" }}>
                        {member.position}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleMemberClick(member)}
                    >
                      <FiPhone size={14} style={{ color: "#10b981" }} />
                      <span style={{ fontSize: "14px", color: "#374151" }}>
                        {formatTelNo(member.phone)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleMemberClick(member)}
                    >
                      <FiCalendar size={14} style={{ color: "#8b5cf6" }} />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span style={{ fontSize: "14px", color: "#374151" }}>
                          {member.createdAt
                            ? formatDateOnly(member.createdAt)
                            : "N/A"}
                        </span>
                        {member.createdAt && (
                          <span style={{ fontSize: "12px", color: "#6b7280" }}>
                            {formatTimeOnly(member.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <PaginationContainer>
        <PaginationNav>
          {/* 첫 페이지로 이동 버튼 */}
          {currentPage > 0 && (
            <PaginationButton onClick={() => handlePageChange(0)}>
              맨 처음
            </PaginationButton>
          )}

          {/* 10개씩 뒤로 가기 버튼 */}
          {currentPage >= 10 && (
            <PaginationButton onClick={handleJumpBackward}>
              -10
            </PaginationButton>
          )}

          <PaginationButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            style={{ opacity: currentPage === 0 ? 0.5 : 1 }}
          >
            이전
          </PaginationButton>
          {renderPagination()}
          <PaginationButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= Math.ceil(totalMembers / pageSize) - 1}
            style={{
              opacity:
                currentPage >= Math.ceil(totalMembers / pageSize) - 1 ? 0.5 : 1,
            }}
          >
            다음
          </PaginationButton>

          {/* 10개씩 앞으로 가기 버튼 */}
          {currentPage + 10 < Math.ceil(totalMembers / pageSize) && (
            <PaginationButton onClick={handleJumpForward}>+10</PaginationButton>
          )}

          {/* 마지막 페이지로 이동 버튼 */}
          {currentPage < Math.ceil(totalMembers / pageSize) - 1 && (
            <PaginationButton
              onClick={() =>
                handlePageChange(Math.ceil(totalMembers / pageSize) - 1)
              }
            >
              맨 마지막
            </PaginationButton>
          )}
        </PaginationNav>
        <PaginationInfo>{getPaginationInfo()}</PaginationInfo>
      </PaginationContainer>

      {modalOpen && (
        <MemberDetailModal
          open={modalOpen}
          onClose={handleModalClose}
          memberId={selectedMemberId}
          onDeleted={() => {
            // 현재 페이지의 유저가 1명이고 2페이지 이상이면 한 페이지 앞으로 이동
            if (
              filtered.slice(
                currentPage * pageSize,
                (currentPage + 1) * pageSize
              ).length === 1 &&
              currentPage > 0
            ) {
              setCurrentPage(currentPage - 1);
            } else {
              fetchMembers();
            }
            setModalOpen(false);
            setSelectedMemberId(null);
          }}
        />
      )}

      {/* 회원 등록 모달 */}
      {registerModalOpen && (
        <MemberRegisterModal
          onClose={() => setRegisterModalOpen(false)}
          onRegister={handleRegister}
        />
      )}
    </Container>
  );
}
