import React, { useState, useEffect, useRef } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import api from "@/api/axios";

export const ProfileDropdown: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async () => {
    try {
      await api.post("/api/auth/logout", null, {
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }
  };

  return (
    <DropdownContainer ref={dropdownRef}>
      <ProfileButton onClick={toggleDropdown} aria-haspopup="true" aria-expanded={isOpen}>
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
            <MenuItem onClick={logout}>로그아웃</MenuItem>
          </MenuList>
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};
