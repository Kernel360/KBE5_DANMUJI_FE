import React, { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiRotateCcw,
  FiPlus,
  FiHome,
  FiChevronDown,
  FiCheck,
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

const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "name", label: "이름순" },
  { value: "ceo", label: "대표자순" },
];

const CLIENT_OPTIONS = [
  { value: "all", label: "전체 고객사", description: "모든 고객사" },
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
  const modalRef = useRef<HTMLDivElement>(null);

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
    return option ? option.label : "전체 고객사";
  };

  const filteredClients = CLIENT_OPTIONS.filter(
    (client) =>
      client.label.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
      client.description.toLowerCase().includes(clientSearchTerm.toLowerCase())
  );

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

  return (
    <FilterBar>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
        <FilterGroup style={{ marginBottom: 0 }}>
          <FilterLabel>정렬</FilterLabel>
          <Select
            value={filters.sort}
            onChange={(e) => onInputChange("sort", e.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FilterGroup>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <FilterLabel style={{ marginBottom: 6 }}>주소 검색</FilterLabel>
          <ModalOverlay
            $isOpen={addressModalOpen}
            onClick={handleAddressModalClose}
          >
            <ClientModal
              $isOpen={addressModalOpen}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>고객사 선택</ModalTitle>
                <ModalSubtitle>
                  프로젝트를 진행할 고객사를 선택해주세요
                </ModalSubtitle>
              </ModalHeader>
              <ModalBody>
                <SearchInputWrapper>
                  <SearchIcon>
                    <FiSearch size={16} />
                  </SearchIcon>
                  <ModalSearchInput
                    placeholder="고객사명 또는 설명으로 검색..."
                    value={addressSearch}
                    onChange={(e) => setAddressSearch(e.target.value)}
                    autoFocus
                  />
                </SearchInputWrapper>
                <ClientList>
                  {addressResults.length > 0 ? (
                    addressResults.map((addr) => (
                      <ClientItem
                        key={addr}
                        $isSelected={selectedAddress === addr}
                        onClick={() => handleAddressSelect(addr)}
                      >
                        <ClientInfo>
                          <ClientName $isSelected={selectedAddress === addr}>
                            {addr}
                          </ClientName>
                          <ClientDescription>
                            {addr.split(" ").slice(1).join(" ")}
                          </ClientDescription>
                        </ClientInfo>
                        <CheckIcon $isSelected={selectedAddress === addr}>
                          <FiCheck size={16} />
                        </CheckIcon>
                      </ClientItem>
                    ))
                  ) : addressSearch ? (
                    <NoResults>
                      검색 결과가 없습니다.
                      <br />
                      다른 검색어를 입력해보세요.
                    </NoResults>
                  ) : (
                    <EmptyState>고객사 목록을 불러오는 중...</EmptyState>
                  )}
                </ClientList>
              </ModalBody>
              <ModalFooter>
                <ModalButton onClick={handleAddressModalClose}>
                  취소
                </ModalButton>
                <ModalButton $primary onClick={handleAddressConfirm}>
                  선택 완료
                </ModalButton>
              </ModalFooter>
            </ClientModal>
          </ModalOverlay>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
            <FilterGroup>
              <FilterLabel>고객사</FilterLabel>
              <SelectButton
                type="button"
                onClick={handleClientModalOpen}
                $hasValue={!!filters.client}
                style={{ paddingLeft: 10, paddingRight: 10, minWidth: 90 }}
              >
                <FiHome size={16} />
                <span className="select-value">
                  {getClientLabel(filters.client)}
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
      <ModalOverlay $isOpen={clientModalOpen} onClick={handleClientModalClose}>
        <ClientModal
          $isOpen={clientModalOpen}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader>
            <ModalTitle>고객사 선택</ModalTitle>
            <ModalSubtitle>
              프로젝트를 진행할 고객사를 선택해주세요
            </ModalSubtitle>
          </ModalHeader>
          <ModalBody>
            <SearchInputWrapper>
              <SearchIcon>
                <FiSearch size={16} />
              </SearchIcon>
              <ModalSearchInput
                placeholder="고객사명 또는 설명으로 검색..."
                value={clientSearchTerm}
                onChange={(e) => setClientSearchTerm(e.target.value)}
                autoFocus
              />
            </SearchInputWrapper>
            <ClientList>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <ClientItem
                    key={client.value}
                    $isSelected={selectedClient === client.value}
                    onClick={() => handleClientSelect(client.value)}
                  >
                    <ClientInfo>
                      <ClientName $isSelected={selectedClient === client.value}>
                        {client.label}
                      </ClientName>
                      <ClientDescription>
                        {client.description}
                      </ClientDescription>
                    </ClientInfo>
                    <CheckIcon $isSelected={selectedClient === client.value}>
                      <FiCheck size={16} />
                    </CheckIcon>
                  </ClientItem>
                ))
              ) : clientSearchTerm ? (
                <NoResults>
                  검색 결과가 없습니다.
                  <br />
                  다른 검색어를 입력해보세요.
                </NoResults>
              ) : (
                <EmptyState>고객사 목록을 불러오는 중...</EmptyState>
              )}
            </ClientList>
          </ModalBody>
          <ModalFooter>
            <ModalButton onClick={handleClientModalClose}>취소</ModalButton>
            <ModalButton $primary onClick={handleClientConfirm}>
              선택 완료
            </ModalButton>
          </ModalFooter>
        </ClientModal>
      </ModalOverlay>
    </FilterBar>
  );
};

export default CompanyFilterBar;
