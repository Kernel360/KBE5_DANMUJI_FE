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
              borderRadius: 16,
              boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
              padding: 36,
              minWidth: 480,
              maxWidth: 540,
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 6 }}>
              고객사 선택
            </div>
            <div style={{ color: "#6b7280", fontSize: 15, marginBottom: 18 }}>
              프로젝트를 진행할 고객사를 선택해주세요
            </div>
            <input
              type="text"
              placeholder="고객사명 또는 설명으로 검색..."
              value={addressSearch}
              onChange={(e) => setAddressSearch(e.target.value)}
              style={{
                padding: "12px 16px",
                border: "1.5px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 15,
                marginBottom: 18,
                outline: "none",
                background: "#fff",
              }}
            />
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 10,
                border: "1.5px solid #e5e7eb",
                overflow: "hidden",
                marginBottom: 24,
              }}
            >
              <div
                onClick={() => handleAddressSelect("전체 회사")}
                style={{
                  padding: "16px 18px 8px 18px",
                  background:
                    selectedAddress === "전체 회사" ? "#f1f5ff" : "#f8fafc",
                  color:
                    selectedAddress === "전체 회사" ? "#2563eb" : "#2563eb",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                  borderBottom: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                전체 회사
                {selectedAddress === "전체 회사" && (
                  <span
                    style={{
                      marginLeft: "auto",
                      color: "#2563eb",
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
              <div
                style={{
                  color: "#9ca3af",
                  fontSize: 13,
                  padding: "0 18px 10px 18px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                모든 회사
              </div>
              {/* 실제 고객사 리스트 렌더링 */}
              {["ABC 주식회사", "XYZ 기업", "DEF 그룹", "GHI 테크"].map(
                (name, idx) => (
                  <div
                    key={name}
                    onClick={() => handleAddressSelect(name)}
                    style={{
                      padding: "14px 18px 6px 18px",
                      background:
                        selectedAddress === name ? "#f1f5ff" : "#f8fafc",
                      color: selectedAddress === name ? "#2563eb" : "#222",
                      fontWeight: selectedAddress === name ? 700 : 500,
                      fontSize: 16,
                      cursor: "pointer",
                      borderBottom: idx !== 3 ? "1px solid #e5e7eb" : undefined,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <span>{name}</span>
                    <span
                      style={{
                        color: "#9ca3af",
                        fontWeight: 400,
                        fontSize: 13,
                        marginTop: 2,
                      }}
                    >
                      {name === "ABC 주식회사"
                        ? "IT 솔루션 전문 기업"
                        : name === "XYZ 기업"
                        ? "제조업 전문 기업"
                        : name === "DEF 그룹"
                        ? "금융 서비스 기업"
                        : "스타트업 기술 기업"}
                    </span>
                    {selectedAddress === name && (
                      <span
                        style={{
                          position: "absolute",
                          right: 24,
                          color: "#2563eb",
                          fontWeight: 700,
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
            >
              <button
                onClick={handleAddressModalClose}
                style={{
                  background: "#f3f4f6",
                  color: "#374151",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 28px",
                  fontWeight: 500,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                취소
              </button>
              <button
                onClick={handleAddressConfirm}
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 28px",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: selectedAddress ? "pointer" : "not-allowed",
                  opacity: selectedAddress ? 1 : 0.5,
                }}
                disabled={!selectedAddress}
              >
                선택 완료
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
