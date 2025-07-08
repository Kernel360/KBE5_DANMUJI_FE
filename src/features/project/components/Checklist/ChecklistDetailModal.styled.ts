import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContainer = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  width: 420px;
  max-width: 95vw;
  padding: 0;
  overflow: hidden;
  animation: fadeIn 0.2s;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px 12px 24px;
  border-bottom: 1px solid #f3f4f6;
`;

export const ModalTitle = styled.div`
  font-size: 1.18rem;
  font-weight: 700;
`;

export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #bbb;
  cursor: pointer;
  transition: color 0.15s;
  &:hover { color: #f59e0b; }
`;

export const ModalBody = styled.div`
  padding: 24px 28px 28px 28px;
`;

export const InfoRow = styled.div`
  display: flex;
  margin-bottom: 12px;
`;

export const InfoLabel = styled.div`
  width: 80px;
  color: #888;
  font-size: 1rem;
  font-weight: 500;
`;

export const InfoValue = styled.div`
  flex: 1;
  color: #222;
  font-size: 1rem;
  word-break: break-all;
`;

export const ApprovalsSection = styled.div`
  margin-top: 24px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
`;

export const ApprovalItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  padding: 8px 0;
`;

export const ApprovalName = styled.div`
  font-weight: 600;
  color: #333;
`;

export const ApprovalStatus = styled.div`
  font-size: 0.98rem;
  color: #f59e0b;
  font-weight: 500;
`;

export const ApprovalMessage = styled.div`
  font-size: 0.97rem;
  color: #6366f1;
`;

export const ApprovalDate = styled.div`
  font-size: 0.95rem;
  color: #888;
`; 