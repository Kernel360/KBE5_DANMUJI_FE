import styled from 'styled-components';
import { FaCheckCircle } from 'react-icons/fa';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: #fff;
  padding: 40px 32px 32px 32px;
  border-radius: 18px;
  width: 100%;
  max-width: 480px;
  max-height: 92vh;
  box-shadow: 0 8px 32px rgba(0,0,0,0.13), 0 1.5px 6px rgba(0,0,0,0.07);
  overflow-y: auto;
  @media (max-width: 600px) {
    padding: 20px 8px 16px 8px;
    max-width: 98vw;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
`;

export const ModalTitle = styled.h2`
  font-size: 1.55rem;
  font-weight: 800;
  color: #22223b;
  letter-spacing: -0.5px;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.7rem;
  cursor: pointer;
  color: #bdbdbd;
  padding: 4px;
  transition: color 0.18s;
  &:hover {
    color: #f59e0b;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Label = styled.label`
  font-size: 15px;
  font-weight: 600;
  color: #444;
  margin-bottom: 2px;
`;

export const Input = styled.input`
  padding: 10px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  background: #fafbfc;
  transition: border 0.18s, box-shadow 0.18s;
  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.13);
    background: #fffbe8;
  }
`;

export const TextArea = styled.textarea`
  padding: 10px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  min-height: 110px;
  resize: vertical;
  background: #fafbfc;
  color: #333;
  transition: border 0.18s, box-shadow 0.18s;
  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.13);
    background: #fffbe8;
  }
  &::placeholder {
    color: #bdbdbd;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 14px;
  justify-content: flex-end;
  margin-top: 24px;
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 22px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.18s;
  box-shadow: 0 1.5px 6px rgba(253, 185, 36, 0.07);
  ${({ variant }) =>
    variant === 'primary'
      ? `
        background-color: #fdb924;
        color: #fff;
        &:hover {
          background-color: #f59e0b;
          box-shadow: 0 2.5px 12px rgba(253, 185, 36, 0.13);
        }
      `
      : `
        background-color: #f3f4f6;
        color: #374151;
        &:hover {
          background-color: #e5e7eb;
        }
      `}
`;

export const UserListWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CheckCircle = styled.span<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ selected }) => (selected ? '#fdb924' : '#e5e7eb')};
  color: ${({ selected }) => (selected ? '#fff' : '#bbb')};
  font-size: 1.1rem;
  margin-right: 10px;
  transition: background 0.18s, color 0.18s;
`;

export const UserCard = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  background: ${({ selected }) => (selected ? '#fffbe8' : '#f9fafb')};
  border: 1.5px solid ${({ selected }) => (selected ? '#fdb924' : '#e5e7eb')};
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 15px;
  font-weight: 500;
  color: #22223b;
  box-shadow: 0 1.5px 6px rgba(0,0,0,0.04);
  transition: background 0.18s, border 0.18s, box-shadow 0.18s;
  cursor: pointer;
  &:hover {
    background: #fffbe8;
    border-color: #fdb924;
    box-shadow: 0 2.5px 12px rgba(253, 185, 36, 0.13);
  }
`;

export const UserName = styled.span`
  font-weight: 600;
  color: #22223b;
`;

export const UserUsername = styled.span`
  color: #888;
  font-size: 0.97rem;
`;

export const UserRole = styled.span`
  color: #bbb;
  font-size: 0.97rem;
`;

export const CompanySection = styled.div`
  margin-top: 18px;
  margin-bottom: 8px;
`;

export const CompanyNameHeader = styled.div`
  font-size: 1.08rem;
  font-weight: 800;
  color: #f59e0b;
  margin-bottom: 8px;
  margin-top: 8px;
  letter-spacing: -0.5px;
  padding-left: 2px;
`; 