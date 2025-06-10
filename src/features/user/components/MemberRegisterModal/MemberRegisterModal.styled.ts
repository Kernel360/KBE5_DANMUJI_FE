import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
`;

export const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: 420px;
  padding: 2rem;
  position: relative;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #9ca3af;
  font-size: 1.25rem;
  cursor: pointer;

  &:hover {
    color: #4b5563;
  }
`;

export const Title = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormGroup = styled.div``;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

export const Input = styled.input`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.1);
  }
`;

export const Select = styled.select`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.1);
  }
`; 