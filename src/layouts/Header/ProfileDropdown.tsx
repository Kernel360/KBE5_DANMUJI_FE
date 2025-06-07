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
import { useAuth } from "@/contexts/AuthContexts";
import api from "@/api/axios";

export const ProfileDropdown: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

const handleLogout = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await api.post("/api/auth/logout", null, {
      withCredentials: true, // 쿠키 포함
    });

    setIsOpen(false);
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  } catch (error: any) {
    console.error("로그아웃 실패:", error?.response?.data?.message || error);
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  }
};

  return (
    <DropdownContainer>
      <ProfileButton onClick={toggleDropdown}>
        <UserName>{user?.name ?? ""}</UserName>
        <DropdownIcon>▼</DropdownIcon>
      </ProfileButton>
      {isOpen && (
        <DropdownMenu>
          <UserProfile />
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
