import React, { useState } from "react";
import styled from "styled-components";
import { UserProfile } from "./UserProfile";

const DropdownContainer = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
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

const UserName = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const DropdownIcon = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const DropdownMenu = styled.div`
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

const MenuList = styled.div`
  padding: 8px 0;
`;

const MenuItem = styled.button`
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

const Divider = styled.div`
  height: 1px;
  background-color: #e5e7eb;
  margin: 8px 0;
`;

export const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // 로그아웃 로직 구현
    console.log("Logout clicked");
  };

  return (
    <DropdownContainer>
      <ProfileButton onClick={toggleDropdown}>
        <UserName>이개발</UserName>
        <DropdownIcon>▼</DropdownIcon>
      </ProfileButton>
      {isOpen && (
        <DropdownMenu>
          <UserProfile
            name="이개발"
            company="XYZ 소프트웨어"
            role="개발자"
            initial="이"
          />
          <Divider />
          <MenuList>
            <MenuItem onClick={() => console.log("Profile clicked")}>
              프로필 설정
            </MenuItem>
            <MenuItem onClick={() => console.log("Settings clicked")}>
              계정 설정
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
          </MenuList>
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};
