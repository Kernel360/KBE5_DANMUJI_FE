import styled from "styled-components";

export const SidebarContainer = styled.aside`
  width: 240px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  padding-top: 56px;
  box-shadow: 1px 0 0 0 #e5e7eb;
`;

export const LogoArea = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 8px;

  .danmuji-logo {
    max-width: 100%;
    height: auto;
  }
`;

export const Divider = styled.div`
  height: 1px;
  background-color: #e5e7eb;
  margin: 12px 0;
`;

export const MainMenu = styled.nav`
  flex-grow: 1;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
