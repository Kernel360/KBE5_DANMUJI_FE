import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(253, 185, 36, 0.1);
  width: 600px;
  padding: 24px;
  position: relative;
  animation: modalSlideIn 0.2s ease-out;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  line-height: 1;

  &:hover {
    color: #374151;
  }
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1e293b;

  svg {
    color: #fdb924;
  }
`;

export const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &:nth-child(1),
  &:nth-child(2),
  &:nth-child(7) {
    grid-column: 1 / -1;
  }
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

export const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.1);
  }
`;

export const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.1);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  ${(props) =>
    props.$variant === "primary"
      ? `
    background-color: #fdb924;
    color: white;

    &:hover {
      background-color: #f59e0b;
    }
  `
      : `
    background-color: #f3f4f6;
    color: #4b5563;

    &:hover {
      background-color: #e5e7eb;
    }
  `}
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 0.25rem;
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;

  input[type="radio"] {
    accent-color: #fdb924;
  }
`;
