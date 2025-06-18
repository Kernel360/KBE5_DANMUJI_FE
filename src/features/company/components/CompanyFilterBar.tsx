import React, { useState } from "react";
import { FiSearch, FiRotateCcw, FiPlus, FiHome } from "react-icons/fi";
import {
  FilterBar,
  FilterGroup,
  FilterLabel,
  Select,
  SearchInput,
  ActionButton,
  NewButton,
} from "./CompanyFilterBar.styled";

const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "name", label: "이름순" },
  { value: "ceo", label: "대표자순" },
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
          <button
            type="button"
            onClick={handleAddressModalOpen}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 14px",
              border: "2px solid #e5e7eb",
              borderRadius: 8,
              background: "#fff",
              color: "#374151",
              fontWeight: 400,
              fontSize: 14,
              cursor: "pointer",
              minWidth: 120,
              maxWidth: 160,
            }}
          >
            <FiHome size={16} />
            주소 검색
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
            <SearchInput
              type="text"
              placeholder="회사명, 대표자명, 이메일로 검색..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{ minWidth: 120, maxWidth: 320 }}
            />
            <ActionButton onClick={handleSearch}>
              <FiSearch size={16} />
              검색
            </ActionButton>
            <ActionButton onClick={handleResetFilters}>
              <FiRotateCcw size={16} />
              초기화
            </ActionButton>
          </div>
        </div>
      </div>
      {addressModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.18)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
              padding: 32,
              minWidth: 340,
              maxWidth: 420,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
              주소 검색
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input
                type="text"
                placeholder="도로명, 지번 등으로 검색"
                value={addressSearch}
                onChange={(e) => setAddressSearch(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  fontSize: 15,
                }}
              />
              <button
                onClick={handleAddressSearch}
                style={{
                  background: "#fdb924",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 18px",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                검색
              </button>
            </div>
            <div
              style={{ maxHeight: 180, overflowY: "auto", marginBottom: 16 }}
            >
              {addressResults.length === 0 && (
                <div
                  style={{ color: "#9ca3af", textAlign: "center", padding: 16 }}
                >
                  검색 결과가 없습니다.
                </div>
              )}
              {addressResults.map((addr) => (
                <div
                  key={addr}
                  onClick={() => handleAddressSelect(addr)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: selectedAddress === addr ? "#fdb92422" : "#fff",
                    color: selectedAddress === addr ? "#fdb924" : "#374151",
                    fontWeight: selectedAddress === addr ? 600 : 400,
                    cursor: "pointer",
                    marginBottom: 2,
                  }}
                >
                  {addr}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleAddressModalClose}
                style={{
                  background: "#f3f4f6",
                  color: "#374151",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 14px",
                  fontWeight: 500,
                  fontSize: 14,
                  marginRight: 6,
                  cursor: "pointer",
                }}
              >
                취소
              </button>
              <button
                onClick={handleAddressConfirm}
                style={{
                  background: "#fdb924",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 18px",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
                disabled={!selectedAddress}
              >
                선택
              </button>
            </div>
          </div>
        </div>
      )}
      {onRegisterClick && (
        <NewButton type="button" onClick={onRegisterClick}>
          <FiPlus size={18} />
          회사 등록
        </NewButton>
      )}
    </FilterBar>
  );
};

export default CompanyFilterBar;
