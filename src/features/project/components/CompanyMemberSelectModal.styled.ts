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
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 2px 32px rgba(0, 0, 0, 0.18);
  position: relative;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const ModalTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 0;
`;

export const HeaderButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const PrimaryButton = styled.button`
  background: #2563eb;
  color: #fff;
  border: 0;
  border-radius: 4px;
  padding: 6px 16px;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s;

  &:hover {
    background: #1d4ed8;
  }
`;

export const SuccessButton = styled(PrimaryButton)`
  background: #19c37d;

  &:hover {
    background: #16a362;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #eee;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #2563eb;
  }
`;

export const SearchButton = styled(PrimaryButton)`
  margin-left: 8px;
  padding: 10px 26px;
  min-width: 100px;
`;

export const CompanyList = styled.div`
  max-height: 300px;
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
    border-color: #2563eb;
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
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #eee;
  margin: 12px 0 16px 0;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #2563eb;
  }
`;

export const MemberList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  background: #2563eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
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
  background: ${props => props.selected ? "#4338ca" : "#eee"};
  color: ${props => props.selected ? "#fff" : "#222"};
  padding: 4px 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: ${props => props.selected ? "#3730a3" : "#ddd"};
  }
`;

export const MemberButton = styled(ManagerButton)<{ selected?: boolean }>`
  background: ${props => props.selected ? "#19c37d" : "#eee"};
  color: ${props => props.selected ? "#fff" : "#222"};

  &:hover {
    background: ${props => props.selected ? "#16a362" : "#ddd"};
  }
`;

export const RegisterButton = styled.button`
  margin-top: 24px;
  width: 100%;
  border: 0;
  border-radius: 6px;
  background: #4338ca;
  color: #fff;
  padding: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: #3730a3;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
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