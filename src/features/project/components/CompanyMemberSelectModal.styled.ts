import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  min-width: 600px;
  max-width: 700px;
  width: 90vw;
  height: 600px;
  min-height: 600px;
  max-height: 600px;
  overflow-y: auto;
  box-shadow: 0 2px 32px rgba(0, 0, 0, 0.18);
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const ModalTitle = styled.h3`
  margin-bottom: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;

  display: flex;
  align-items: center;
  gap: 8px;
`;

export const HeaderButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const PrimaryButton = styled.button`
  background: #f9fafb;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid #e5e7eb;
  border-radius: 6px;

  padding: 6px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s;

  &:hover {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    border-color: #fef3c7;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(251, 191, 36, 0.3);
    color: #fff;
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(251, 191, 36, 0.2);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.2);
  }
`;

export const SuccessButton = styled(PrimaryButton)`
  background: #f9fafb;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid #e5e7eb;
  border-radius: 6px;

  padding: 6px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s;

  &:hover {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    border-color: #fef3c7;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(251, 191, 36, 0.3);
    color: #fff;
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(251, 191, 36, 0.2);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.2);
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  
  margin-bottom: 16px;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 10px 16px;
  font-size: 14px;
  border-radius: 6px;
  border: 2px solid #e5e7eb;
   background-color: #ffffff;
  color: #374151;

  outline: none;
  transition: border-color 0.2s;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #fdb924;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.1);
  }

  &:hover {
    border-color: #d1d5db;
  }
`;

export const SearchButton = styled(PrimaryButton)`
  margin-left: 8px;
  padding: 10px 24px;
  min-width: 100px;
  background: #f9fafb;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 6px;

  &:hover {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    border-color: #fef3c7;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(251, 191, 36, 0.3);
    color: #fff;
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(251, 191, 36, 0.2);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.2);
  }
`;

export const CompanyList = styled.div`
  max-height: 500px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CompanyItem = styled.div`
  padding: 14px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafbfc;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f1f5f9;
    color: #fdb924;
    transform: translateY(-1px);
  }
`;

export const CompanyIcon = styled.div`
  width: 24px;
  height: 24px;
  background: #2563eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
`;

export const PaginationButton = styled.button<{ disabled?: boolean }>`
  background: #eee;
  border: 0;
  border-radius: 4px;
  padding: 4px 12px;
  font-weight: 500;
  font-size: 14px;
  cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
  color: ${props => props.disabled ? "#bbb" : "#222"};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #ddd;
  }
`;

export const PaginationText = styled.span`
  font-weight: 500;
  font-size: 15px;
`;

export const SelectedCompanyHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const SelectedCompanyName = styled.div`
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const BackButton = styled.button`
  background: #eee;
  color: #222;
  border: 0;
  border-radius: 4px;
  padding: 4px 12px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  margin-left: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background-color 0.2s;

  &:hover {
    background: #ddd;
  }
`;

export const MemberSearchInput = styled.input`
  margin: 12px 0 16px 0;
  width: 100%;
  padding: 10px 16px;
  font-size: 14px;
  border-radius: 6px;
  border: 2px solid #e5e7eb;
   background-color: #ffffff;
  color: #374151;

  outline: none;
  transition: border-color 0.2s;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #fdb924;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.1);
  }

  &:hover {
    border-color: #d1d5db;
  }
`;

export const MemberList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1 1 auto;
`;

export const MemberItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 14px;
  background: #fafbfc;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
  }
`;

export const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const MemberAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: #fdb924;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 15px;
`;

export const MemberDetails = styled.div``;

export const MemberName = styled.div`
  font-weight: 600;
`;

export const MemberPosition = styled.div`
  color: #888;
  font-size: 14px;
`;

export const MemberButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const ManagerButton = styled.button<{ selected?: boolean }>`
  border: 0;
  border-radius: 4px;
  background: ${props => props.selected ? "#fdb924" : "#eee"};
  color: ${props => props.selected ? "#fff" : "#222"};
  padding: 4px 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: ${props => props.selected ? "#fdb924" : "#ddd"};
  }
`;

export const MemberButton = styled(ManagerButton)<{ selected?: boolean }>`
  background: ${props => props.selected ? "#fdb924" : "#eee"};
  color: ${props => props.selected ? "#fff" : "#222"};

  &:hover {
    background: ${props => props.selected ? "#fdb924" : "#ddd"};
  }
`;

export const RegisterButton = styled.button`
  margin-top: 28px;
  width: 100%;
  border: 0;
  border-radius: 6px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 8px 0;
  cursor: pointer;
  transition: background-color 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 120px;
  max-width: 180px;
  align-self: stretch;

  &:hover {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(251, 191, 36, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    color: #ffffff;
    vertical-align: middle;
    margin-bottom: 1px;
    font-size: 1.1em;
    display: inline-block;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 32px;
  background: transparent;
  border: 0;
  font-size: 22px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;

  &:hover {
    color: #333;
  }
`;

export const LoadingText = styled.div`
  text-align: center;
  color: #888;
`;

export const EmptyText = styled.div`
  text-align: center;
  color: #aaa;
`; 