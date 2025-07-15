import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalPanel = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  min-width: 480px;
  max-width: 600px;
  width: 96vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 32px rgba(0, 0, 0, 0.18);
  position: relative;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  padding-left: 14px;
  &::before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 1.2em;
    background: #fdb924;
    border-radius: 2px;
  }
`;

export const ModalDescription = styled.div`
  color: #888;
  margin-top: -20px;
  margin-bottom: 32px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 0.875rem;
  background: #ffffff;
  color: #374151;
  transition: border 0.2s;
  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.1);
  }
  &::placeholder {
    color: #9ca3af;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 90px;
  max-height: 300px;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 20px;
  margin-top: 10px;
  resize: none;
  overflow-y: auto;
  background: #ffffff;
  color: #374151;
  font-size: 0.875rem;
  transition: border 0.2s;
  margin-bottom: 18px;
  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.1);
  }
  &::placeholder {
    color: #9ca3af;
  }
`;

export const Button = styled.button<{
  $variant?: "primary" | "secondary" | "danger";
}>`
  padding: 10px 28px;
  border-radius: 6px;
  border: 0;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  background: ${({ $variant }) =>
    $variant === "primary"
      ? "#fdb924"
      : $variant === "secondary"
      ? "#aaa"
      : $variant === "danger"
      ? "#ef4444"
      : "#fff"};
  color: ${({ $variant }) =>
    $variant === "primary" || $variant === "secondary" || $variant === "danger"
      ? "#fff"
      : "#222"};
  border: ${({ $variant }) =>
    $variant === undefined ? "1px solid #eee" : "none"};
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${({ $variant }) =>
      $variant === "primary"
        ? "#3730a3"
        : $variant === "secondary"
        ? "#888"
        : $variant === "danger"
        ? "#dc2626"
        : "#f3f4f6"};
    color: #fff;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: 0;
  font-size: 24px;
  cursor: pointer;
  color: #888;
  &:hover {
    color: #ef4444;
  }
`;

export const DateButton = styled.button<{ $hasValue: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  margin-top: 10px;
  background: ${({ $hasValue }) => ($hasValue ? "#fef3c7" : "#ffffff")};
  border: 2px solid ${({ $hasValue }) => ($hasValue ? "#fdb924" : "#e5e7eb")};
  border-radius: 8px;
  color: ${({ $hasValue }) => ($hasValue ? "#a16207" : "#374151")};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  justify-content: space-between;

  svg {
    flex-shrink: 0;
    color: ${({ $hasValue }) => ($hasValue ? "#fdb924" : "#6b7280")};
  }

  &:hover {
    background: ${({ $hasValue }) => ($hasValue ? "#fef9c3" : "#f3f4f6")};
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

export const DatePickerWrapper = styled.div`
  position: relative;
  width: 100%;

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

  .react-datepicker__header {
    background-color: #f8fafc;
    border-bottom: 1px solid #e5e7eb;
    border-radius: 8px 8px 0 0;
  }

  .react-datepicker__day {
    color: #333;
    border-radius: 4px;
    transition: all 0.2s;
  }

  .react-datepicker__day:hover {
    background-color: #fef3c7 !important;
    color: #333;
  }

  .react-datepicker__day--selected {
    background-color: #fdb924 !important;
    color: white !important;
  }

  .react-datepicker__day--selected:hover {
    background-color: #fdb924 !important;
    color: white !important;
  }

  .react-datepicker__day--in-range {
    background-color: #fef3c7 !important;
    color: #333;
  }

  .react-datepicker__day--keyboard-selected {
    background-color: #fdb924 !important;
    color: white !important;
  }

  .react-datepicker__day--disabled {
    color: #ccc;
  }

  .react-datepicker__navigation {
    color: #666;
  }

  .react-datepicker__navigation:hover {
    color: #fdb924;
  }
`;

export const DateRow = styled.div`
  display: flex;
  gap: 16px;
`;

export const DateCol = styled.div`
  flex: 1;
`;

export const DateTilde = styled.span`
  align-self: center;
  font-weight: 600;
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 16px;
`;

export const FormLabel = styled.label`
  font-weight: 600;
  margin-bottom: 8px;
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 40px;
`;

export const CompanySection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CompanyCard = styled.div<{ $type: "dev" | "client" }>`
  margin-bottom: 4px;
  background: ${({ $type }) => ($type === "dev" ? "#f5fbff" : "#f6fff5")};
  border-radius: 8px;
  padding: 16px;
  position: relative;
  border: 1px solid #e5e7eb;
`;

export const CompanyCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  font-weight: 600;
`;

export const CompanyCardMembers = styled.div`
  margin-top: 8px;
  color: #555;
  font-weight: 500;
`;

export const SectionTitle = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
`;

export const FieldLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    color: #fdb924;
    flex-shrink: 0;
  }
`;

export const PeriodRow = styled.div`
  display: flex;
  gap: 16px;
`;

export const PeriodCol = styled.div`
  flex: 1;
`;

export const PeriodLabel = styled.div`
  margin-bottom: 4px;
`;

export const CompanyRow = styled.div`
  display: flex;
  gap: 24px;
`;

export const CompanyCardTitle = styled.div`
  font-weight: 600;
`;

export const DateSeparator = styled.span`
  color: #6b7280;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0 4px;
  flex-shrink: 0;
`;

export const CompanySectionLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 1px;

    border-radius: 0.5px;
  }
`;

export const AddCompanyButton = styled.button`
  padding: 0;
  border-radius: 5px;
  border: 1.2px solid #fdb924;
  background: #fff;
  color: #fdb924;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.18s;
  display: flex;
  align-items: center;
  gap: 0;
  margin-left: 6px;
  height: 14px;
  min-width: 10px;
  box-shadow: none;

  svg {
    color: #fdb924;
    transition: color 0.18s;
    font-size: 10px;
    min-width: 10px;
    min-height: 10px;
  }

  &:hover {
    background: #fdb924;
    color: #fff;
    border-color: #fdb924;
    svg {
      color: #fff;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.18);
  }
`;

export const DateLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  background: #ffffff;
  margin-bottom: 4px;
  display: block;
`;

export const EditButton = styled.button`
  padding: 6px 12px;
  border-radius: 4px;
  border: 2px solid #e5e7eb;
  background: #f9fafb;
  color: #374151;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;

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

export const DeleteButton = styled.button`
  padding: 6px 12px;
  border-radius: 4px;
  border: 2px solid #e5e7eb;
  background: #f9fafb;
  color: #374151;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;

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

export const ProjectCreateButton = styled.button`
  padding: 10px 28px;
  border-radius: 6px;
  border: 0;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(251, 191, 36, 0.2);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(251, 191, 36, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    color: #ffffff;
  }
`;

export const CancelButton = styled.button`
  padding: 10px 28px;
  border-radius: 6px;
  border: 0;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  border: 2px solid #e5e7eb;
  background: #ffffff;
  color: #374151;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
