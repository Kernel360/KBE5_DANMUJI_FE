import styled from "styled-components";

export const TopbarContainer = styled.header`
  height: 56px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const CompanyName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
`;

export const UserDropdown = styled.div`
  position: relative;
`;
