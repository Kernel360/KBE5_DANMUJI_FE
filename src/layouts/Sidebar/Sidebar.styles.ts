import styled from "styled-components";

export const SidebarContainer = styled.div`
  width: 240px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
`;

export const LogoArea = styled.div`
  margin-bottom: 20px;
`;

export const Divider = styled.hr`
  width: 80%;
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 20px 0;
`;

export const MainMenu = styled.nav`
  width: 100%;
  flex-grow: 1;
  padding: 0 10px;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 5px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const LogoImage = styled.img`
  /* Add specific styles for the logo if needed, otherwise remove this comment */
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
