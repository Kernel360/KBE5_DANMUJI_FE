import styled, { keyframes } from "styled-components";

// Fade-in animation for modal
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(24px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.28);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: #fff;
  padding: 32px 28px 28px 28px;
  border-radius: 1.25rem; /* rounded-2xl */
  max-width: 480px;
  width: 100%;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18), 0 1.5px 6px rgba(0, 0, 0, 0.07);
  animation: ${fadeIn} 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 80vh;
  min-height: 320px;
  overflow-y: auto;
  @media (max-width: 600px) {
    padding: 18px 4vw 16px 4vw;
    max-width: 98vw;
    max-height: 92vh;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
`;

export const ModalTitle = styled.div`
  font-size: 1.22rem;
  font-weight: 500;
  position: relative;
  padding-left: 16px;
  &::before {
    content: "";
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

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.7rem;
  cursor: pointer;
  color: #bdbdbd;
  padding: 2px 4px;
  margin-left: 12px;
  transition: color 0.18s;
  line-height: 1;
  &:hover {
    color: #f59e0b; /* yellow-500 */
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Label = styled.label`
  font-size: 1.05rem;
  font-weight: 600;
  color: #374151; /* gray-700 */
  margin-bottom: 4px;
`;

export const Input = styled.input`
  padding: 13px 16px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1.05rem;
  background: #fafbfc;
  color: #22223b;
  transition: border 0.18s, box-shadow 0.18s;
  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.13);
    background: #fffbe8;
  }
`;

export const TextArea = styled.textarea`
  padding: 13px 16px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  font-family: inherit;
  line-height: 1.6;
  min-height: 4.5em;
  background: #fafbfc;
  color: #22223b;
  resize: vertical;
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

export const UserListWrap = styled.div`
  margin-top: -10px;
  margin-bottom: 0;
  padding: 0;
`;

export const CompanySection = styled.div`
  margin-bottom: 20px;
`;

export const CompanyNameHeader = styled.div`
  font-size: 1.08rem;
  font-weight: 800;
  color: #f59e0b;
  margin-bottom: 10px;
  margin-top: 8px;
  letter-spacing: -0.5px;
  padding-left: 2px;
`;

export const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f3f4f6;
  color: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  margin-right: 16px;
  flex-shrink: 0;
  border: 1.5px solid #fdb92422;
`;

export const UserCard = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  background: ${({ selected }) => (selected ? "#fffbe8" : "#fff")};
  border: 2px solid ${({ selected }) => (selected ? "#fdb924" : "#e5e7eb")};
  border-radius: 14px;
  padding: 12px 18px;
  min-height: 48px;
  box-shadow: ${({ selected }) =>
    selected
      ? "0 2px 8px rgba(253,185,36,0.08)"
      : "0 1px 4px rgba(0,0,0,0.03)"};
  transition: background 0.18s, border 0.18s, box-shadow 0.18s;
  cursor: pointer;
  user-select: none;
  gap: 16px;
  &:hover {
    background: #f9fafb;
    border-color: #fdb924;
    box-shadow: 0 2.5px 12px rgba(253, 185, 36, 0.1);
  }
`;

export const UserInfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
`;

export const UserName = styled.span`
  font-weight: 700;
  color: #22223b;
  font-size: 1.07em;
  letter-spacing: -0.2px;
`;

export const UserUsername = styled.span`
  color: #bdbdbd;
  font-size: 0.97em;
  font-weight: 500;
  margin-top: 1px;
`;

export const CheckCircle = styled.span<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ selected }) => (selected ? "#fdb924" : "#e5e7eb")};
  color: ${({ selected }) => (selected ? "#fff" : "#bbb")};
  font-size: 1.05rem;
  margin-right: 12px;
  flex-shrink: 0;
  transition: background 0.18s, color 0.18s;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 3px;
`;

export const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  flex: 1 1 0;
  min-width: 0;
  padding: 8px 0;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.18s;
  box-shadow: 0 1.5px 6px rgba(253, 185, 36, 0.07);
  ${({ variant }) =>
    variant === "primary"
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
