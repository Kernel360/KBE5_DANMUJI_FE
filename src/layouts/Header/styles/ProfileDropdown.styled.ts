import styled from "styled-components";

export const DropdownContainer = styled.div`
  position: relative;
`;

export const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  background: none;
  border: none;
  cursor: pointer;
  color: #111827;

  &:hover {
    background-color: #f3f4f6;
  }
`;

export const UserName = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

export const DropdownIcon = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 240px;
  z-index: 50;
`;

export const MenuList = styled.div`
  padding: 8px 0;
`;

export const MenuItem = styled.button`
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #f3f4f6;
  }
`;

export const Divider = styled.div`
  height: 1px;
  background-color: #e5e7eb;
  margin: 8px 0;
`;
