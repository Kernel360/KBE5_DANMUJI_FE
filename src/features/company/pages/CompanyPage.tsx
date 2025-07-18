import axios from "axios";
import api from "@/api/axios";
import { useState, useEffect } from "react";
import { useNotification } from "@/features/Notification/NotificationContext";
import CompanyRegisterModal from "../components/CompanyRegisterModal";
import CompanyEditModal from "../components/CompanyEditModal";
import CompanyFilterBar from "../components/CompanyFilterBar";
import styled from "styled-components";
import { FiHome, FiUser, FiPhone, FiHash, FiCalendar } from "react-icons/fi";
import CompanyDetailModal from "../components/CompanyDetailModal/CompanyDetailModal";
import { formatDateOnly, formatTimeOnly } from "@/utils/dateUtils";

export interface Company {
  id: number;
  name: string;
  bizNo: number;
  zonecode: string;
  address: string;
  ceoName: string;
  email: string;
  bio: string;
  tel: string;
  createdAt?: string;
}

export interface CompanyFormData {
  name: string;
  reg1: string;
  reg2: string;
  reg3: string;
  zonecode: string;
  baseAddress: string;
  detailAddress: string;
  address: string;
  ceoName: string;
  email: string;
  bio: string;
  tel: string;
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
  margin-bottom: 10px;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
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
  gap: 1.2rem;
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
  ${({ $active }) =>
    $active &&
    `
      background: #fdb924;
      color: #fff;
    `}
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-size: 14px;
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 40px;
  color: #ef4444;
  font-size: 14px;
`;

const EmptyText = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-size: 14px;
`;

const ClickableTableRow = styled(TableRow)`
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f9fafb;
  }
`;

export interface FieldError {
  field: string;
  value: string;
  reason: string;
}

interface ErrorResponse {
  status: string;
  code: string;
  message: string;
  data?: {
    errors: FieldError[];
  };
}

export const formatBizNo = (bizNo: string) => {
  if (bizNo.length !== 10) return bizNo;
  return `${bizNo.slice(0, 3)}-${bizNo.slice(3, 5)}-${bizNo.slice(5)}`;
};

export const formatTelNo = (telNo: string) => {
  if (!telNo) return telNo;
  const cleaned = ("" + telNo).replace(/\D/g, "");
  // 대표번호(8자리) 15881588 -> 1588-1588
  if (/^1[0-9]{3}[0-9]{4}$/.test(cleaned)) {
    return cleaned.replace(/(\d{4})(\d{4})/, '$1-$2');
  }
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
      const match = cleaned.match(/^([0-9]{3})([0-9]{3})([0-9]{4})$/);
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

export default function CompanyPage() {
  const [filters, setFilters] = useState({
    sort: "latest",
    keyword: "",
    client: "",
    companyId: null,
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useNotification();
  const [page, setPage] = useState<{
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  } | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );

  const handlePageChange = (newPage: number) => {
    fetchCompanies(newPage, filters.sort);
  };

  // 10개씩 앞뒤로 가는 함수
  const handleJumpForward = () => {
    const totalPages = page?.totalPages ?? 0;
    const currentPage = page?.number ?? 0;
    const newPage = Math.min(currentPage + 10, totalPages - 1);
    handlePageChange(newPage);
  };

  const handleJumpBackward = () => {
    const currentPage = page?.number ?? 0;
    const newPage = Math.max(currentPage - 10, 0);
    handlePageChange(newPage);
  };

  const fetchCompanies = async (pageNumber: number = 0, sortKey?: string, keyword?: string) => {
    try {
      setLoading(true);
      const sort = sortKey || filters.sort;
      let sortParam = "createdAt,desc";
      if (sort === "name") sortParam = "name,asc";
      else if (sort === "ceo") sortParam = "ceoName,asc";
      else if (sort === "latest") sortParam = "createdAt,desc";

      // keyword가 있으면 검색 API, 없으면 전체 목록 API
      let response;
      if (keyword && keyword.trim() !== "") {
        response = await api.get(`/api/companies/search?name=${encodeURIComponent(keyword)}&page=${pageNumber}&sort=${sortParam}`);
      } else {
        response = await api.get(`/api/companies?page=${pageNumber}&sort=${sortParam}`);
      }
      const responseData = response.data;
      setCompanies(responseData.data.content);
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

  // 엔터로만 검색 실행
  const handleKeywordSearch = () => {
    fetchCompanies(0, filters.sort, filters.keyword);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    // 정렬 기준 변경 시 현재 검색 상태에 맞게 fetchCompanies 호출
    if (field === "sort") {
      fetchCompanies(0, value, filters.keyword);
    }
    // keyword 변경 시에는 fetchCompanies를 호출하지 않음 (엔터에서만 호출)
  };

  const handleClose = () => {
    setFieldErrors([]);
  };

  const handleResetFilters = () => {
    setFilters({
      sort: "latest",
      keyword: "",
      client: "",
      companyId: null,
    });
    fetchCompanies();
  };

  // 프론트 필터링 없이 API에서 받아온 companies만 사용
  const sortedCompanies = companies;

  // 페이지네이션 정보 계산
  const getPaginationInfo = () => {
    if (!page) return "";
    const start = page.number * page.size + 1;
    const end = Math.min((page.number + 1) * page.size, page.totalElements);
    return `총 ${page.totalElements}개의 업체 중 ${start}-${end}개 표시`;
  };

  const handleEdit = async (data: CompanyFormData) => {
    if (!editData) return;

    try {
      // Construct the bizNo from reg1, reg2, reg3
      const bizNoCombined = parseInt(
        `${data.reg1}${data.reg2}${data.reg3}`,
        10
      );

      const companyUpdateData = {
        name: data.name,
        bizNo: bizNoCombined,
        zonecode: data.zonecode,
        address: data.address,
        ceoName: data.ceoName,
        email: data.email,
        bio: data.bio,
        tel: data.tel.replace(/\D/g, ""),
      };

      // PUT 요청 보내기
      await api.put(`/api/companies/${editData.id}`, companyUpdateData);

      // 성공 시 상태 업데이트
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === editData.id
            ? {
                ...c,
                name: data.name || c.name,
                bizNo: bizNoCombined || c.bizNo,
                zonecode: data.zonecode || c.zonecode,
                address: data.address || c.address,
                ceoName: data.ceoName || c.ceoName,
                email: data.email || c.email,
                tel: data.tel || c.tel,
                bio: data.bio || c.bio,
              }
            : c
        )
      );

      // 모달 닫기
      setEditModalOpen(false);
      setEditData(null);
      notify("업체 정보가 성공적으로 수정되었습니다.");
      handleClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data as ErrorResponse | undefined;
        if (errorData?.data?.errors) {
          setFieldErrors(errorData.data.errors);
        } else {
          setError(
            errorData?.message || "업체 수정 중 알 수 없는 오류가 발생했습니다."
          );
        }
      } else {
        setError("업체 수정 중 알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const handleCompanyClick = (company: Company) => {
    setSelectedCompanyId(company.id);
    setDetailModalOpen(true);
  };

  return (
    <Container>
      <CompanyRegisterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onRegisterSuccess={fetchCompanies}
      />
      {editData && (
        <CompanyEditModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleEdit}
          initialData={editData}
          fieldErrors={fieldErrors}
          setFieldErrors={setFieldErrors}
        />
      )}
      <CompanyDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        companyId={selectedCompanyId}
        onUpdated={fetchCompanies}
      />
      <HeaderSection>
        <Title>업체 관리</Title>
        <Subtitle>
          프로젝트 관리 시스템의 업체 정보를 한눈에 확인하세요
        </Subtitle>
      </HeaderSection>

      <CompanyFilterBar
        filters={filters}
        onInputChange={handleFilterChange}
        onReset={handleResetFilters}
        onRegisterClick={() => setModalOpen(true)}
        onKeywordSearch={handleKeywordSearch}
      />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>업체명</TableHeader>
              <TableHeader>사업자등록번호</TableHeader>
              <TableHeader>대표자</TableHeader>
              <TableHeader style={{ padding: "8px 8px 8px 24px" }}>
                연락처
              </TableHeader>
              <TableHeader style={{ padding: "8px 8px" }}>생성일</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6}>
                  <LoadingText>로딩 중...</LoadingText>
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={6}>
                  <ErrorText>오류: {error}</ErrorText>
                </TableCell>
              </TableRow>
            )}
            {!loading && !error && sortedCompanies.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyText>데이터가 없습니다.</EmptyText>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              !error &&
              sortedCompanies.map((c) => (
                <ClickableTableRow
                  key={c.id}
                  onClick={() => handleCompanyClick(c)}
                >
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <FiHome size={14} style={{ color: "#8b5cf6" }} />
                      <span
                        style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:'150px',display:'block',fontSize:'14px',color:'#374151',fontWeight:'500'}}>
                        {c.name}
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
                    >
                      <FiHash size={14} style={{ color: "#6366f1" }} />
                      <span style={{ fontSize: "14px", color: "#374151" }}>
                        {formatBizNo(c.bizNo.toString())}
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
                    >
                      <FiUser size={14} style={{ color: "#3b82f6" }} />
                      <span
                        style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:'150px',display:'block',fontSize:'14px',color:'#374151',fontWeight:'500'}}>
                        {c.ceoName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell style={{ padding: "8px 0px 8px 24px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <FiPhone size={14} style={{ color: "#10b981" }} />
                      <span style={{ fontSize: "14px", color: "#374151" }}>
                        {formatTelNo(c.tel)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell style={{ padding: "8px 8px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                      }}
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
                          {c.createdAt ? formatDateOnly(c.createdAt) : "N/A"}
                        </span>
                        {c.createdAt && (
                          <span style={{ fontSize: "12px", color: "#6b7280" }}>
                            {formatTimeOnly(c.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </ClickableTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationContainer>
        <PaginationNav>
          {/* 첫 페이지로 이동 버튼 */}
          {page && page.number > 0 && (
            <PaginationButton onClick={() => handlePageChange(0)}>
              맨 처음
            </PaginationButton>
          )}

          {/* 10개씩 뒤로 가기 버튼 */}
          {page && page.number >= 10 && (
            <PaginationButton onClick={handleJumpBackward}>
              -10
            </PaginationButton>
          )}

          {/* 첫 페이지가 아니면 이전 버튼 렌더 */}
          {page && page.number > 0 && (
            <PaginationButton onClick={() => handlePageChange(page.number - 1)}>
              이전
            </PaginationButton>
          )}

          {/* 페이지 번호 버튼들을 동적으로 생성 */}
          {Array.from({ length: page?.totalPages ?? 0 }, (_, idx) =>
            idx === (page?.number ?? 0) ? (
              <PaginationButton key={idx} $active>
                {idx + 1}
              </PaginationButton>
            ) : (
              <PaginationButton key={idx} onClick={() => handlePageChange(idx)}>
                {idx + 1}
              </PaginationButton>
            )
          )}

          {/* 마지막 페이지가 아니면 다음 버튼 렌더 */}
          {page && page.number + 1 < (page?.totalPages ?? 0) && (
            <PaginationButton onClick={() => handlePageChange(page.number + 1)}>
              다음
            </PaginationButton>
          )}

          {/* 10개씩 앞으로 가기 버튼 */}
          {page && page.number + 10 < (page?.totalPages ?? 0) && (
            <PaginationButton onClick={handleJumpForward}>+10</PaginationButton>
          )}

          {/* 마지막 페이지로 이동 버튼 */}
          {page && page.number + 1 < (page?.totalPages ?? 0) && (
            <PaginationButton
              onClick={() => handlePageChange((page?.totalPages ?? 0) - 1)}
            >
              맨 마지막
            </PaginationButton>
          )}
        </PaginationNav>
        <PaginationInfo>{getPaginationInfo()}</PaginationInfo>
      </PaginationContainer>
    </Container>
  );
}
