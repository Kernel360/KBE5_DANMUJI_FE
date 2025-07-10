import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/layouts/Header/profile/UserProfile";
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
  const navigate = useNavigate(); 

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
            <MenuItem onClick={() => {toggleDropdown(); navigate("/my")}}>
              프로필
            </MenuItem>
            <Divider />
            <MenuItem onClick={logout}>로그아웃</MenuItem>
          </MenuList>
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};
