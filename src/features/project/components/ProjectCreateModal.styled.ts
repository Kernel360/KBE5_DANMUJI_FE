import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalPanel = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  min-width: 900px;
  max-width: 1100px;
  width: 90vw;
  max-height: 900px;
  overflow-y: auto;
  box-shadow: 0 2px 32px rgba(0,0,0,0.18);
  position: relative;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const ModalTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #4338ca;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ModalDescription = styled.div`
  color: #888;
  margin-bottom: 32px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #eee;
  margin-bottom: 20px;
  font-size: 1rem;
  background: #f9fafb;
  color: #222;
  transition: border 0.2s;
  &:focus {
    border-color: #4338ca;
    outline: none;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 90px;
  max-height: 300px;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #eee;
  resize: none;
  overflow-y: auto;
  background: #f9fafb;
  color: #222;
  font-size: 1rem;
  transition: border 0.2s;
  &:focus {
    border-color: #4338ca;
    outline: none;
  }
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 10px 28px;
  border-radius: 6px;
  border: 0;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  background: ${({ $variant }) =>
    $variant === 'primary' ? '#fdb924' :
    $variant === 'secondary' ? '#aaa' :
    $variant === 'danger' ? '#ef4444' : '#fff'};
  color: ${({ $variant }) =>
    $variant === 'primary' || $variant === 'secondary' || $variant === 'danger' ? '#fff' : '#222'};
  border: ${({ $variant }) => $variant === undefined ? '1px solid #eee' : 'none'};
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${({ $variant }) =>
      $variant === 'primary' ? '#3730a3' :
      $variant === 'secondary' ? '#888' :
      $variant === 'danger' ? '#dc2626' : '#f3f4f6'};
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
  background: ${({ $hasValue }) => ($hasValue ? "#fef3c7" : "#f9fafb")};
  border: 2px solid ${({ $hasValue }) => ($hasValue ? "#fdb924" : "#e5e7eb")};
  border-radius: 8px;
  color: ${({ $hasValue }) => ($hasValue ? "#a16207" : "#374151")};
  font-size: 1rem;
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

  .react-datepicker__day--selected {
    background-color: #fdb924;
    color: white;
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

export const CompanySection = styled.div`  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CompanyCard = styled.div<{ $type: 'dev' | 'client' }>`
  margin-bottom: 8px;
  background: ${({ $type }) => $type === 'dev' ? '#f4f6fa' : '#eaf6ff'};
  border-radius: 8px;
  padding: 16px;
  position: relative;
`;

export const CompanyCardHeader = styled.div`
  display: flex;
  align-items: center;
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
  font-weight: 600;
  margin-bottom: 8px;
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
