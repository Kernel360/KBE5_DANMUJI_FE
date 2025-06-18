import React, { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiRotateCcw,
  FiPlus,
  FiHome,
  FiChevronDown,
  FiCheck,
  FiArrowUp,
} from "react-icons/fi";
import {
  FilterBar,
  FilterGroup,
  FilterLabel,
  Select,
  SearchInput,
  ActionButton,
  NewButton,
  SelectButton,
  SelectDropdown,
  SelectOption,
  CompanyList,
  CompanyItem,
  CompanyInfo,
  CompanyName,
  CompanyDescription,
} from "./CompanyFilterBar.styled";
import {
  ModalOverlay,
  ClientModal,
  ModalHeader,
  ModalTitle,
  ModalSubtitle,
  ModalBody,
  SearchInputWrapper,
  SearchIcon,
  ModalSearchInput,
  ClientList,
  ClientItem,
  ClientInfo,
  ClientName,
  ClientDescription,
  CheckIcon,
  ModalFooter,
  ModalButton,
  NoResults,
  EmptyState,
} from "@/features/project/components/List/ProjectFilterBar.styled";
import api from "@/api/axios";

const SORT_OPTIONS = [
  { value: "latest", label: "최근 등록 순" },
  { value: "name", label: "이름순" },
];

const CLIENT_OPTIONS = [
  { value: "all", label: "회사 검색", description: "모든 회사" },
  { value: "abc", label: "ABC 주식회사", description: "IT 솔루션 전문 기업" },
  { value: "xyz", label: "XYZ 기업", description: "제조업 전문 기업" },
  { value: "def", label: "DEF 그룹", description: "금융 서비스 기업" },
  { value: "ghi", label: "GHI 테크", description: "스타트업 기술 기업" },
  { value: "jkl", label: "JKL 시스템", description: "시스템 통합 전문" },
  { value: "mno", label: "MNO 솔루션", description: "클라우드 솔루션 기업" },
  { value: "pqr", label: "PQR 인더스트리", description: "중공업 전문 기업" },
];

interface CompanyFilterBarProps {
  filters: {
    sort: string;
    keyword: string;
    client: string;
    companyId: number | null;
  };
  onInputChange: (field: string, value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onRegisterClick?: () => void;
}

const CompanyFilterBar: React.FC<CompanyFilterBarProps> = ({
  filters,
  onInputChange,
  onSearch,
  onReset,
  onRegisterClick,
}) => {
  const [keyword, setKeyword] = useState(filters.keyword);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressSearch, setAddressSearch] = useState("");
  const [addressResults, setAddressResults] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState(filters.client || "");
  const [selectedCompany, setSelectedCompany] = useState<number | null>(
    filters.companyId
  );
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [companySearchTerm, setCompanySearchTerm] = useState("");
  const [companies, setCompanies] = useState<any[]>([]);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [companyError, setCompanyError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    onInputChange("keyword", keyword);
    onSearch();
  };

  const handleResetFilters = () => {
    setKeyword("");
    onReset();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleAddressModalOpen = () => {
    setAddressSearch("");
    setAddressResults([]);
    setSelectedAddress("");
    setAddressModalOpen(true);
  };

  const handleAddressModalClose = () => {
    setAddressModalOpen(false);
  };

  const handleAddressSearch = () => {
    // 임시: 검색어 포함하는 주소 리스트 반환
    const dummy = [
      "서울특별시 강남구 테헤란로 123",
      "서울특별시 강남구 역삼동 456",
      "경기도 성남시 분당구 판교로 789",
      "부산광역시 해운대구 센텀중앙로 101",
    ];
    setAddressResults(dummy.filter((addr) => addr.includes(addressSearch)));
  };

  const handleAddressSelect = (addr: string) => {
    setSelectedAddress(addr);
  };

  const handleAddressConfirm = () => {
    onInputChange("address", selectedAddress);
    setAddressModalOpen(false);
  };

  const handleClientModalOpen = () => {
    setSelectedClient(filters.client || "");
    setClientSearchTerm("");
    setClientModalOpen(true);
  };

  const handleClientModalClose = () => {
    setClientModalOpen(false);
    setClientSearchTerm("");
  };

  const handleClientSelect = (value: string) => {
    setSelectedClient(value);
  };

  const handleClientConfirm = () => {
    onInputChange("client", selectedClient);
    setClientModalOpen(false);
  };

  const getClientLabel = (value: string) => {
    const option = CLIENT_OPTIONS.find((opt) => opt.value === value);
    return option ? option.label : "회사 검색";
  };

  const filteredClients = CLIENT_OPTIONS.filter(
    (client) =>
      client.label.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
      client.description.toLowerCase().includes(clientSearchTerm.toLowerCase())
  );

  // 회사 목록 불러오기
  useEffect(() => {
    if (!companyModalOpen) return;
    setCompanyLoading(true);
    setCompanyError(null);
    api
      .get("/api/companies?page=0&size=1000")
      .then((res) => {
        setCompanies(res.data.data.content || []);
      })
      .catch(() => {
        setCompanyError("회사 목록을 불러오지 못했습니다.");
      })
      .finally(() => setCompanyLoading(false));
  }, [companyModalOpen]);

  // 검색어로 필터링
  const filteredCompanies = companies.filter((company) => {
    if (!companySearchTerm) return true;
    const bizNo = String(company.bizNo).replace(/-/g, "");
    return bizNo.includes(companySearchTerm.replace(/-/g, ""));
  });

  const handleCompanyModalOpen = () => {
    setCompanySearchTerm("");
    setSelectedCompany(filters.companyId);
    setCompanyModalOpen(true);
  };

  const handleCompanyModalClose = () => {
    setCompanyModalOpen(false);
  };

  const handleCompanySelect = (id: number) => {
    setSelectedCompany(id);
  };

  const handleCompanyConfirm = () => {
    if (selectedCompany !== null) {
      onInputChange("companyId", selectedCompany);
    }
    setCompanyModalOpen(false);
  };

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!addressModalOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAddressModalOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [addressModalOpen]);

  // 바깥 클릭 시 모달 닫기
  useEffect(() => {
    if (!addressModalOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setAddressModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [addressModalOpen]);

  const handleSortDropdownToggle = () => {
    setSortDropdownOpen((prev) => !prev);
  };

  const handleSortSelect = (value: string) => {
    onInputChange("sort", value);
    setSortDropdownOpen(false);
  };

  const getSortLabel = (value: string) => {
    const option = SORT_OPTIONS.find((opt) => opt.value === value);
    return option ? option.label : "최근 등록 순";
  };

  const getSortColor = (value: string) => {
    switch (value) {
      case "latest":
        return "#f59e0b"; // 주황
      case "name":
        return "#3b82f6"; // 파랑
      default:
        return "#6b7280"; // 회색
    }
  };

  // 정렬 드롭다운 ESC/바깥 클릭 닫기
  useEffect(() => {
    if (!sortDropdownOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSortDropdownOpen(false);
    };
    const handleClick = (e: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(e.target as Node)
      ) {
        setSortDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    document.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [sortDropdownOpen]);

  // 회사검색 모달 ESC/바깥 클릭 닫기
  useEffect(() => {
    if (!companyModalOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCompanyModalOpen(false);
    };
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setCompanyModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    document.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [companyModalOpen]);

  return (
    <FilterBar>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
        <FilterGroup style={{ marginBottom: 0 }}>
          <FilterLabel>정렬</FilterLabel>
          <div style={{ position: "relative" }} ref={sortDropdownRef}>
            <SelectButton
              type="button"
              onClick={handleSortDropdownToggle}
              $hasValue={!!filters.sort}
              $color={getSortColor(filters.sort)}
              className={sortDropdownOpen ? "open" : ""}
              style={{ paddingLeft: 10, paddingRight: 10, minWidth: 90 }}
            >
              <FiArrowUp size={16} />
              <span className="select-value">{getSortLabel(filters.sort)}</span>
              <FiChevronDown size={16} />
            </SelectButton>
            <SelectDropdown $isOpen={sortDropdownOpen}>
              {SORT_OPTIONS.map((option) => (
                <SelectOption
                  key={option.value}
                  $isSelected={filters.sort === option.value}
                  onClick={() => handleSortSelect(option.value)}
                >
                  {option.label}
                </SelectOption>
              ))}
            </SelectDropdown>
          </div>
        </FilterGroup>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        ></div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
            <FilterGroup>
              <FilterLabel>회사 검색</FilterLabel>
              <SelectButton
                type="button"
                onClick={handleCompanyModalOpen}
                $hasValue={!!filters.companyId}
                style={{ paddingLeft: 10, paddingRight: 10, minWidth: 90 }}
              >
                <FiHome size={16} />
                <span className="select-value">
                  {companies.find((c) => c.id === filters.companyId)?.name ||
                    "회사 검색"}
                </span>
                <FiChevronDown size={16} />
              </SelectButton>
            </FilterGroup>
          </div>
        </div>
      </div>
      {onRegisterClick && (
        <NewButton type="button" onClick={onRegisterClick}>
          <FiPlus size={18} />
          회사 등록
        </NewButton>
      )}
      <ModalOverlay
        $isOpen={companyModalOpen}
        onClick={handleCompanyModalClose}
      >
        <ClientModal
          $isOpen={companyModalOpen}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader>
            <ModalTitle>회사 검색</ModalTitle>
            <ModalSubtitle>
              검색할 회사의 이름 또는 사업자 등록 번호를 입력해주세요
            </ModalSubtitle>
          </ModalHeader>
          <ModalBody>
            <SearchInputWrapper>
              <SearchIcon>
                <FiSearch size={16} />
              </SearchIcon>
              <ModalSearchInput
                placeholder="회사명 또는 사업자등록번호를 구분자 ' - ' 없이 입력..."
                value={companySearchTerm}
                onChange={(e) => setCompanySearchTerm(e.target.value)}
                autoFocus
              />
            </SearchInputWrapper>
            <CompanyList>
              {companyLoading ? (
                <EmptyState>회사 목록을 불러오는 중...</EmptyState>
              ) : companyError ? (
                <NoResults>{companyError}</NoResults>
              ) : filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <CompanyItem
                    key={company.id}
                    $isSelected={selectedCompany === company.id}
                    onClick={() => handleCompanySelect(company.id)}
                  >
                    <CompanyInfo>
                      <CompanyName $isSelected={selectedCompany === company.id}>
                        {company.name}
                      </CompanyName>
                      <CompanyDescription
                        $isSelected={selectedCompany === company.id}
                      >
                        사업자등록번호: {company.bizNo}
                        <br />
                        대표자: {company.ceoName}
                      </CompanyDescription>
                    </CompanyInfo>
                    <CheckIcon $isSelected={selectedCompany === company.id}>
                      <FiCheck size={16} />
                    </CheckIcon>
                  </CompanyItem>
                ))
              ) : companySearchTerm ? (
                <NoResults>
                  검색 결과가 없습니다.
                  <br />
                  올바르게 입력했는지 확인해보세요.
                </NoResults>
              ) : (
                <EmptyState>회사 목록을 불러오는 중...</EmptyState>
              )}
            </CompanyList>
          </ModalBody>
          <ModalFooter>
            <ModalButton onClick={handleCompanyModalClose}>취소</ModalButton>
            <ModalButton
              $primary
              onClick={handleCompanyConfirm}
              disabled={selectedCompany === null}
            >
              선택 완료
            </ModalButton>
          </ModalFooter>
        </ClientModal>
      </ModalOverlay>
    </FilterBar>
  );
};

export default CompanyFilterBar;
