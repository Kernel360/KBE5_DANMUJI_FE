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
  gap: 8px;
`;

export const MenuItemContainer = styled.div<{ $isActive: boolean }>`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: ${({ $isActive }) => ($isActive ? '#fff' : '#6b7280')};
  background-color: ${({ $isActive }) => ($isActive ? '#FFC10A' : 'transparent')};
  border-radius: 6px;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background-color: ${({ $isActive }) => ($isActive ? '#FFC10A' : '#f3f4f6')};
    color: #111827;
  }

  svg {
    color: ${({ $isActive }) => ($isActive ? '#fff' : '#6b7280')};
    transition: color 0.2s;
  }
`;
