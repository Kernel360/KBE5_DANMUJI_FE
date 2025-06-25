import styled from "styled-components";

export const FilterBar = styled.div`
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

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 90px;
  position: relative;
`;

export const FilterLabel = styled.label`
  font-size: 0.92rem;
  color: #374151;
  font-weight: 500;
`;

export const Select = styled.select`
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

export const SearchInput = styled.input`
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

export const SearchButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: #fdb924;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #f59e0b;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

export const NewButton = styled.button`
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

export const SearchRight = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

export const ActionButton = styled.button<{ $primary?: boolean }>`
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

export const SelectButton = styled.button<{
  $hasValue: boolean;
  $color?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 120px;
  width: 100%;
  max-width: 180px;
  padding: 8px 12px;
  background: ${({ $hasValue, $color }) =>
    $hasValue ? `${$color}15` : "#ffffff"};
  border: 2px solid
    ${({ $hasValue, $color }) => ($hasValue ? $color || "#fdb924" : "#e5e7eb")};
  border-radius: 8px;
  color: ${({ $hasValue, $color }) =>
    $hasValue ? $color || "#a16207" : "#374151"};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  min-width: 90px;

  svg {
    flex-shrink: 0;
    color: ${({ $hasValue, $color }) =>
      $hasValue ? $color || "#fdb924" : "#6b7280"};
    transition: transform 0.2s ease;
  }

  &.open svg:first-child {
    transform: rotate(180deg);
  }

  .select-value {
    flex: 1;
    font-weight: ${({ $hasValue }) => ($hasValue ? "600" : "500")};
  }

  &:hover {
    background: ${({ $hasValue, $color }) =>
      $hasValue ? `${$color}25` : "#f9fafb"};
    border-color: ${({ $hasValue, $color }) =>
      $hasValue ? $color || "#fdb924" : "#d1d5db"};
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

export const SelectDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  min-width: 120px;
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  z-index: 10;
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
`;

export const SelectOption = styled.div<{ $isSelected: boolean }>`
  padding: 10px 14px;
  font-size: 0.875rem;
  color: ${({ $isSelected }) => ($isSelected ? "#3b82f6" : "#374151")};
  background: ${({ $isSelected }) => ($isSelected ? "#f0f9ff" : "#fff")};
  font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
`;

export const CompanyList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

export const CompanyItem = styled.button<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  background: ${({ $isSelected }) => ($isSelected ? "#fefce8" : "transparent")};
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ $isSelected }) => ($isSelected ? "#fef9c3" : "#f9fafb")};
  }

  &:focus {
    outline: none;
    background: ${({ $isSelected }) => ($isSelected ? "#fef9c3" : "#f3f4f6")};
  }
`;

export const CompanyInfo = styled.div`
  flex: 1;
`;

export const CompanyName = styled.div<{ $isSelected: boolean }>`
  font-size: 0.875rem;
  font-weight: ${({ $isSelected }) => ($isSelected ? "600" : "500")};
  color: ${({ $isSelected }) => ($isSelected ? "#ca8a04" : "#374151")};
  margin-bottom: 2px;
`;

export const CompanyDescription = styled.div<{ $isSelected: boolean }>`
  font-size: 0.75rem;
  color: ${({ $isSelected }) => ($isSelected ? "#a16207" : "#6b7280")};
`;
