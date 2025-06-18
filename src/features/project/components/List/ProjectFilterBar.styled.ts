import styled from "styled-components";

export const FilterBar = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
  align-items: flex-end;
  position: relative;
  overflow: visible;
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
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
  transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    border 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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

export const DateInput = styled.input`
  padding: 8px 12px;
  font-size: 0.95rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  color: #111827;
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
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

export const SearchRight = styled.div`
  display: flex;
  gap: 10px;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
`;

export const TopActions = styled.div`
  display: flex;
  gap: 10px;
`;

export const ActionButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  height: 32px;
  background: ${({ $primary }) => ($primary ? "#fdb924" : "#f3f4f6")};
  color: ${({ $primary }) => ($primary ? "#fff" : "#374151")};
  border: ${({ $primary }) => ($primary ? "none" : "1px solid #d1d5db")};
  border-radius: 0.375rem;
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

export const StatusButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const StatusButton = styled.button<{ $active: boolean; $color: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${({ $active, $color }) => ($active ? `${$color}15` : "#ffffff")};
  color: ${({ $active, $color }) => ($active ? $color : "#374151")};
  border: 2px solid ${({ $active, $color }) => ($active ? $color : "#e5e7eb")};
  padding: 8px 12px;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: fit-content;
  white-space: nowrap;

  svg {
    flex-shrink: 0;
  }

  span {
    font-weight: 500;
  }

  &:hover {
    background: ${({ $active, $color }) =>
      $active ? `${$color}25` : "#f9fafb"};
    border-color: ${({ $active, $color }) => ($active ? $color : "#d1d5db")};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ $color }) => `${$color}20`};
  }
`;

export const DateRangeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const DatePickerWrapper = styled.div`
  position: relative;
  flex: 1;

  .react-datepicker-wrapper {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    margin-top: 4px;
  }

  .react-datepicker-popper {
    z-index: 1000;
  }
`;

export const DateButton = styled.button<{ $hasValue: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
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
  }

  span:first-of-type {
    font-weight: 600;
    min-width: 50px;
  }

  .date-value {
    margin-left: auto;
    font-size: 0.8rem;
    color: ${({ $hasValue }) => ($hasValue ? "#a16207" : "#9ca3af")};
    font-weight: 400;
    white-space: nowrap;
    word-break: keep-all;
    display: inline-block;
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

export const DateSeparator = styled.span`
  color: #6b7280;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0 4px;
  flex-shrink: 0;
`;

// DatePicker 커스터마이징을 위한 글로벌 스타일
export const DatePickerStyles = styled.div`
  .react-datepicker {
    font-family: inherit;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  .react-datepicker-popper {
    z-index: 1000 !important;
  }

  .react-datepicker-wrapper {
    position: absolute;
    z-index: 1000;
  }

  .react-datepicker__header {
    background-color: #f8fafc;
    border-bottom: 1px solid #e5e7eb;
    border-radius: 8px 8px 0 0;
  }

  .react-datepicker__current-month {
    color: #111827;
    font-weight: 600;
  }

  .react-datepicker__day-name {
    color: #6b7280;
    font-weight: 500;
  }

  .react-datepicker__day {
    color: #374151;
    border-radius: 4px;
    margin: 2px;

    &:hover {
      background-color: #fef3c7;
    }
  }

  .react-datepicker__day--selected {
    background-color: #fdb924;
    color: white;

    &:hover {
      background-color: #f59e0b;
    }
  }

  .react-datepicker__day--in-range {
    background-color: #fef3c7;
    color: #a16207;
  }

  .react-datepicker__day--keyboard-selected {
    background-color: #fdb924;
    color: white;
  }

  .react-datepicker__navigation {
    top: 8px;
  }

  .react-datepicker__navigation-icon::before {
    border-color: #a16207;
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
  background: ${({ $hasValue }) => ($hasValue ? "#fef3c7" : "#ffffff")};
  border: 2px solid
    ${({ $hasValue, $color }) => ($hasValue ? "#fdb924" : "#e5e7eb")};
  border-radius: 8px;
  color: ${({ $hasValue, $color }) => ($hasValue ? "#a16207" : "#374151")};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  min-width: 90px;

  svg {
    flex-shrink: 0;
    color: ${({ $hasValue, $color }) => ($hasValue ? "#fdb924" : "#6b7280")};
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
      $hasValue ? "#fef9c3" : "#f9fafb"};
    border-color: ${({ $hasValue, $color }) =>
      $hasValue ? "#fdb924" : "#d1d5db"};
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

export const SelectOption = styled.div<{ $isSelected: boolean }>`
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

// 고객사 선택 모달 스타일
export const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  opacity: ${({ $isOpen }) => ($isOpen ? "1" : "0")};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transition: all 0.3s ease;
`;

export const ClientModal = styled.div<{ $isOpen: boolean }>`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  transform: ${({ $isOpen }) => ($isOpen ? "scale(1)" : "scale(0.95)")};
  transition: all 0.3s ease;
`;

export const ModalHeader = styled.div`
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
`;

export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
`;

export const ModalSubtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

export const ModalBody = styled.div`
  padding: 20px 24px;
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

export const ModalSearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background: #ffffff;
  color: #374151;
  transition: all 0.1s ease;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
`;

export const ClientList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

export const ClientItem = styled.button<{ $isSelected: boolean }>`
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

export const ClientInfo = styled.div`
  flex: 1;
`;

export const ClientName = styled.div<{ $isSelected: boolean }>`
  font-size: 0.875rem;
  font-weight: ${({ $isSelected }) => ($isSelected ? "600" : "500")};
  color: ${({ $isSelected }) => ($isSelected ? "#ca8a04" : "#374151")};
  margin-bottom: 2px;
`;

export const ClientDescription = styled.div<{ $isSelected: boolean }>`
  font-size: 0.75rem;
  color: ${({ $isSelected }) => ($isSelected ? "#a16207" : "#6b7280")};
`;

export const CheckIcon = styled.div<{ $isSelected: boolean }>`
  color: ${({ $isSelected }) => ($isSelected ? "#fdb924" : "transparent")};
  margin-left: 12px;
`;

export const ModalFooter = styled.div`
  padding: 16px 24px 24px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

export const ModalButton = styled.button<{ $primary?: boolean }>`
  padding: 10px 20px;
  border: 2px solid ${({ $primary }) => ($primary ? "#fdb924" : "#d1d5db")};
  border-radius: 8px;
  background: ${({ $primary }) => ($primary ? "#fdb924" : "#ffffff")};
  color: ${({ $primary }) => ($primary ? "#ffffff" : "#374151")};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $primary }) => ($primary ? "#f59e0b" : "#f9fafb")};
    border-color: ${({ $primary }) => ($primary ? "#f59e0b" : "#9ca3af")};
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

export const NoResults = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
`;

export const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
`;

export const StatusDropdownContainer = styled.div`
  position: relative;
`;

export const StatusDropdownButton = styled.button<{
  $active: boolean;
  $color: string;
  $isOpen: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${({ $active, $color }) => ($active ? `${$color}15` : "#ffffff")};
  color: ${({ $active, $color }) => ($active ? $color : "#374151")};
  border: 2px solid ${({ $active, $color }) => ($active ? $color : "#e5e7eb")};
  padding: 8px 17px;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: fit-content;
  white-space: nowrap;

  svg {
    flex-shrink: 0;
    transition: transform 0.3s ease;
    transform: ${({ $isOpen }) =>
      $isOpen ? "rotate(180deg)" : "rotate(0deg)"};
  }

  span {
    font-weight: 500;
  }

  &:hover {
    background: ${({ $active, $color }) =>
      $active ? `${$color}25` : "#f9fafb"};
    border-color: ${({ $active, $color }) => ($active ? $color : "#d1d5db")};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ $color }) => `${$color}20`};
  }
`;

export const StatusDropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transform: ${({ $isOpen }) =>
    $isOpen ? "translateY(0)" : "translateY(-10px)"};
  transition: all 0.2s ease;
  margin-top: 4px;
`;

export const StatusDropdownItem = styled.button<{
  $active: boolean;
  $color: string;
}>`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 8px 12px;
  background: ${({ $active, $color }) =>
    $active ? `${$color}15` : "transparent"};
  color: ${({ $active, $color }) => ($active ? $color : "#374151")};
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: ${({ $active, $color }) =>
      $active ? `${$color}25` : "#f9fafb"};
  }

  &:first-child {
    border-radius: 6px 6px 0 0;
  }

  &:last-child {
    border-radius: 0 0 6px 6px;
  }
`;
