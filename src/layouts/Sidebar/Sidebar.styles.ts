import styled, { css } from "styled-components";

export const SidebarContainer = styled.div`
  width: 240px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: 20px 0;
`;

export const ProfileArea = styled.div`
  align-items: left;
  margin-left: 20px;
`;

export const LogoArea = styled.div`
  margin-bottom: 20px;
`;

export const Divider = styled.hr`
  width: 80%;
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 15px 0;
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

export const MenuItemContainer = styled.div<{ active?: boolean }>`
  padding: 12px 32px;
  font-size: 1rem;
  color: #888;
  cursor: pointer;
  border-left: 4px solid transparent;
  border-radius: 0 6px 6px 0;
  background: #fff;
  font-weight: 500;
  transition: background 0.2s, color 0.2s, border-left 0.2s;

  ${({ active }) =>
    active &&
    css`
      color: #ffb300;
      background: #fffbe6;
      border-left: 4px solid #ffb300;
      font-weight: 600;
    `}

  &:hover {
    background: #fffbe6;
    color: #ffb300;
  }
`;

export const MenuItemSideContainer = styled.div<{ $isActive: boolean }>`
  padding: 8px 24px;
  display: flex;
  margin-top: 4px;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: ${({ $isActive }) => ($isActive ? '#374151' : '#9ca3af')};
  background-color: ${({ $isActive }) => ($isActive ? '#fef3c7' : 'transparent')};
  border-radius: 4px;

  &:hover {
    background-color: #fef3c7;
    color: #111827;
  }
`;
