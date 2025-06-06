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

export const ProfileDropdown: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키 포함
      });
      setIsOpen(false);
  
      if (res.ok) {
        localStorage.removeItem("accessToken");
        window.location.href = "/";
      } else {
        // 로그아웃 실패 로그
        const data = await res.json().catch(() => null);
        console.log(data.message);

        localStorage.removeItem("accessToken");
        window.location.href = "/";
      }
    } catch (err) {
      console.log("네트워크 오류가 발생했습니다.");
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
