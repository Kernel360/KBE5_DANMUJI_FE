import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  width: 760px;
  max-width: 98vw;
  padding: 0;
  overflow: hidden;
  animation: fadeIn 0.2s;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 36px 12px 32px;
  border-bottom: 1px solid #f3f4f6;
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

export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.6rem;
  color: #bbb;
  cursor: pointer;
  transition: color 0.15s;
  &:hover {
    color: #f59e0b;
  }
`;

export const ModalBody = styled.div`
  padding: 0;
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0;
  min-height: 340px;
`;

export const InfoSection = styled.div`
  flex: 1.1;
  padding: 32px 28px 32px 36px;
  border-right: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const InfoRow = styled.div`
  display: flex;
  margin-bottom: 18px;
`;

export const InfoLabel = styled.div`
  width: 90px;
  color: #888;
  font-size: 1.04rem;
  font-weight: 500;
`;

export const InfoValue = styled.div`
  flex: 1;
  color: #222;
  font-size: 1.04rem;
  word-break: break-all;
  font-weight: 400;
`;

export const ApprovalsSection = styled.div`
  flex: 1.3;
  padding: 32px 36px 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const ApprovalCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-height: 320px;
  overflow-y: auto;
`;

export const ApprovalCard = styled.div`
  background: #fafbfc;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 18px 20px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ApprovalCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const ApprovalName = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 1.07rem;
`;

export const ApprovalStatusBadge = styled.div<{ color: string }>`
  display: inline-block;
  background: ${({ color }) => color || "#eee"};
  color: #fff;
  font-size: 0.89rem;
  font-weight: 600;
  border-radius: 7px;
  padding: 1.5px 8px 1.5px 8px;
  min-width: 36px;
  text-align: center;
`;

export const ApprovalCardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ApprovalMessage = styled.div`
  font-size: 0.99rem;
  color: #22223b;
  margin-bottom: 2px;
`;

export const ApprovalDate = styled.div`
  font-size: 0.97rem;
  color: #888;
`;

export const ApprovalActions = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ApprovalTextarea = styled.textarea`
  width: 100%;
  min-height: 44px;
  border-radius: 7px;
  border: 1px solid #e5e7eb;
  padding: 8px 10px;
  font-size: 1.01rem;
  margin-bottom: 2px;
  resize: vertical;
  background: #fff;
  color: #22223b;
`;

export const ApprovalButton = styled.button<{ disabled?: boolean }>`
  background: #10b981;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 7px 20px;
  font-weight: 600;
  font-size: 1.01rem;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  transition: background 0.15s;
  &:hover:not(:disabled) {
    background: #059669;
  }
`;

export const ApprovalButtonSecondary = styled.button`
  background: #f3f4f6;
  color: #ef4444;
  border: none;
  border-radius: 7px;
  padding: 7px 20px;
  font-weight: 600;
  font-size: 1.01rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: #fee2e2;
    color: #b91c1c;
  }
`;
