import React, { useState } from "react";
import { UserProfile } from "./UserProfile";
import {
  DropdownContainer,
  ProfileButton,
  UserName,
  DropdownIcon,
  DropdownMenu,
  MenuList,
  MenuItem,
  Divider,
} from "./ProfileDropdown.styled";

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
