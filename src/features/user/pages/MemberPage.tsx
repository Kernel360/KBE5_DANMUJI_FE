import api from "@/api/axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MemberRegisterModal from "../components/MemberRegisterModal/MemberRegisterModal";
import MemberEditModal from "../components/MemberEditModal/MemberEditModal";
import styled from "styled-components";
import { FiSearch, FiPlus, FiChevronDown, FiRotateCcw } from "react-icons/fi";

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
}

export interface MemberFormData {
  username: string;
  name: string;
  role: string;
  companyId: number;
  position: string;
  phone: string;
  email: string;
}

interface Company {
  id: number;
  name: string;
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
  gap: 20px;
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

const Select = styled.select`
  padding: 10px 14px;
  font-size: 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
  min-width: 140px;

  &:hover {
    border-color: #d1d5db;
    background-color: #f9fafb;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.1);
    background-color: #ffffff;
  }

  &:active {
    transform: translateY(0);
  }

  option {
    padding: 8px 12px;
    font-size: 0.875rem;
    background: #ffffff;
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

const ActionButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  height: 40px;
  background: ${({ $primary }) => ($primary ? "#fdb924" : "#f3f4f6")};
  color: ${({ $primary }) => ($primary ? "#fff" : "#374151")};
  border: ${({ $primary }) => ($primary ? "none" : "1px solid #d1d5db")};
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: none;

  &:hover {
    background: ${({ $primary }) => ($primary ? "#f59e0b" : "#e5e7eb")};
    color: ${({ $primary }) => ($primary ? "#fff" : "#111827")};
    border-color: #9ca3af;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
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

const TableContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  font-size: 14px;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const TableHeader = styled.th`
  padding: 12px 4px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  font-size: 13px;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f9fafb;
  }
`;

const TableCell = styled.td`
  padding: 10px 4px;
  text-align: left;
  color: #374151;
  vertical-align: middle;
  font-size: 14px;
`;

const MemberNameCell = styled(TableCell)`
  color: #374151;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    color: #3b82f6;
  }
`;

const DeleteButton = styled.button`
  background: #ffffff;
  color: #ef4444;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #fecaca;
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover {
    background: #ef4444;
    color: #ffffff;
    border-color: transparent;
  }
`;

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

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

export const formatTelNo = (telNo: string) => {
  if (!telNo) return telNo;
  const cleaned = ("" + telNo).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return telNo;
};

export default function MemberPage() {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);

  // 필터 상태 추가
  const [filters, setFilters] = useState({
    companyId: "",
    position: "",
    keyword: "",
  });

  const navigate = useNavigate();

  const fetchMembers = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call to fetch members
      const response = await api.get(`/api/admin/allUsers`);
      setMembers(response.data.data.content);
      console.log("Current members:", response.data.data.content);
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
      const response = await api.get("/api/companies/all"); // 충분한 크기로 모든 회사 데이터를 가져옴
      console.log("API Response for companies:", response.data);
      console.log("Companies content:", response.data.data);
      setCompanies(response.data.data);
      console.log("Current companies:", response.data.data);
    } catch (err: unknown) {
      console.error("Failed to fetch companies:", err);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchCompanies();
  }, []);

  const filtered = members.filter((m) => {
    const matchesKeyword =
      m.name.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      m.username.toLowerCase().includes(filters.keyword.toLowerCase());
    const matchesCompany =
      !filters.companyId || m.companyId === parseInt(filters.companyId);
    const matchesPosition =
      !filters.position || m.position === filters.position;

    return matchesKeyword && matchesCompany && matchesPosition;
  });

  const handleInputChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleSearch = () => {
    // 검색 로직은 이미 filtered에서 처리됨
  };

  const handleReset = () => {
    setFilters({
      companyId: "",
      position: "",
      keyword: "",
    });
    setSearch("");
  };

  // 고유한 직책 목록 추출
  const uniquePositions = [
    ...new Set(members.map((member) => member.position)),
  ].filter(Boolean);

  const handleEdit = async (data: MemberFormData) => {
    try {
      const memberToUpdate = {
        id: editData?.id,
        username: data.username,
        name: data.name,
        companyId: data.companyId,
        position: data.position,
        phone: data.phone,
        email: data.email,
      };
      // TODO: Replace with actual API call to update member
      await api.put(`/api/admin/${editData?.id}`, memberToUpdate);
      fetchMembers();
      alert("회원 정보가 성공적으로 수정되었습니다!");
      setEditModalOpen(false);
    } catch (error: unknown) {
      console.error("Error updating member:", error);
      alert("회원 정보 수정 중 오류가 발생했습니다.");
    }
  };

  const handleRegister = async (data: MemberFormData) => {
    try {
      const newMember = {
        ...data,
      };
      // API 호출
      const response = await api.post("/api/admin", newMember);

      // API 응답에서 username과 password 추출
      const { username, password } = response.data.data;

      // 텍스트 파일 생성 및 저장
      const fileContent = `Username: ${username}\nPassword: ${password}`;
      const blob = new Blob([fileContent], { type: "text/plain" });
      const fileUrl = URL.createObjectURL(blob);

      // 파일 다운로드 트리거
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = "member_credentials.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      fetchMembers();
      alert("회원 등록이 완료되었습니다!");
      setModalOpen(false);
    } catch (error: unknown) {
      console.error("Error registering member:", error);
      alert("회원 등록 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (memberId: number) => {
    if (window.confirm("정말로 이 회원을 삭제하시겠습니까?")) {
      try {
        // TODO: Replace with actual API call to delete member
        await api.delete(`/api/admin/${memberId}`);
        fetchMembers();
        alert("회원 삭제가 완료되었습니다!");
      } catch (error: unknown) {
        console.error("Error deleting member:", error);
        alert("회원 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleMemberClick = (member: Member) => {
    navigate(`/member/${member.id}`);
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
      </HeaderSection>
      <FilterBar>
        <FilterGroup>
          <FilterLabel>회사</FilterLabel>
          <Select
            value={filters.companyId}
            onChange={(e) => handleInputChange("companyId", e.target.value)}
          >
            <option value="">모든 회사</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </Select>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>직책</FilterLabel>
          <Select
            value={filters.position}
            onChange={(e) => handleInputChange("position", e.target.value)}
          >
            <option value="">모든 직책</option>
            {uniquePositions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </Select>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>이름</FilterLabel>
          <SearchInput
            type="text"
            placeholder="회원 이름 검색..."
            value={filters.keyword}
            onChange={(e) => handleInputChange("keyword", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </FilterGroup>
        <SearchRight>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
              onClick={handleReset}
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
          <NewButton onClick={() => setModalOpen(true)}>
            <FiPlus size={16} />
            회원 등록
          </NewButton>
        </SearchRight>
      </FilterBar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>이름</TableHeader>
              <TableHeader>아이디</TableHeader>
              <TableHeader>회사</TableHeader>
              <TableHeader>직책</TableHeader>
              <TableHeader>전화번호</TableHeader>
              <TableHeader>관리</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((member) => (
              <TableRow key={member.id}>
                <MemberNameCell onClick={() => handleMemberClick(member)}>
                  {member.name}
                </MemberNameCell>
                <TableCell>{member.username}</TableCell>
                <TableCell>
                  {(companies &&
                    companies.find((c) => c.id === member.companyId)?.name) ||
                    "N/A"}
                </TableCell>
                <TableCell>{member.position}</TableCell>
                <TableCell>{formatTelNo(member.phone)}</TableCell>
                <TableCell>
                  <ActionButtonGroup>
                    <ActionButton
                      onClick={() => {
                        setEditData(member);
                        setEditModalOpen(true);
                      }}
                    >
                      수정
                    </ActionButton>
                    <ActionButton
                      onClick={() => handleDelete(member.id)}
                      style={{
                        background: "#fee2e2",
                        color: "#ef4444",
                        border: "1px solid #fecaca",
                      }}
                    >
                      삭제
                    </ActionButton>
                  </ActionButtonGroup>
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
    </Container>
  );
}
