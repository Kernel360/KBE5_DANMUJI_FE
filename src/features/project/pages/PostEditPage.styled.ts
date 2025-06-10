import styled from "styled-components";

export const PageContainer = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background-color: #f9fafb;
`;

export const MainContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

export const EditForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const FormTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 2rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #111827;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.1);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #111827;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.1);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  background-color: #f9fafb;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  padding-right: 2.5rem;

  &:hover {
    border-color: #9ca3af;
    background-color: #f3f4f6;
  }

  &:focus {
    outline: none;
    border-color: #fdb924;
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.1);
  }

  /* 선택된 옵션 스타일 */
  option {
    font-weight: 500;
    padding: 0.5rem;
  }

  /* 선택된 값이 있을 때 스타일 */
  &:not([value=""]) {
    background-color: #fef3c7;
    border-color: #fdb924;
    color: #92400e;
    font-weight: 600;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

export const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #fdb924;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e6a720;
  }

  &:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }
`;

export const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;
