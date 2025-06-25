import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const ModalContent = styled.div`
  background: #fff;
  border-radius: 1rem;
  padding: 2rem 2rem 1.5rem 2rem;
  min-width: 350px;
  max-width: 90vw;
  box-shadow: 0 2px 16px rgba(0,0,0,0.15);
  position: relative;
`;
export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;
export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`;
export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
`;
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;
export const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;
export const Input = styled.input`
  width: 100%;
  padding: 0.6rem 0.9rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  &:focus {
    outline: 2px solid #FDB924;
    border-color: #FDB924;
  }
`;
export const Button = styled.button`
  background: #FDB924;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  margin-top: 0.5rem;
  cursor: pointer;
  &:hover {
    background: #fbbf24;
  }
`;
