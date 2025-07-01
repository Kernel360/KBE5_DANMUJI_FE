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
  max-height: 800px;
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
    $variant === 'primary' ? '#4338ca' :
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