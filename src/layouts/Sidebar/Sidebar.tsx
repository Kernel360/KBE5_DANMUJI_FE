import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserProfile } from "@/layouts/Header/profile/UserProfile";
import { MenuItem } from "./MenuItem";

import {
  SidebarContainer,
  LogoArea,
  Divider,
  MainMenu,
  ProfileArea,
} from "./Sidebar.styles";
import styled from "styled-components";

// Import necessary icons from react-icons
import { HiBuildingOffice2 } from "react-icons/hi2";
import { HiUsers } from "react-icons/hi2";
import { FaArchive } from "react-icons/fa";
import { FiHelpCircle } from "react-icons/fi";
import { FaHistory } from "react-icons/fa";
import { IoHome } from "react-icons/io5";

import { useAuth } from "@/hooks/useAuth";

const LogoImage = styled.img`
  height: 48px;
  width: auto;
  display: block;
`;

export const Sidebar: React.FC = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuItemClick = (_menuItem: string, path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <SidebarContainer>
      <LogoArea onClick={() => handleMenuItemClick("홈", "/dashboard")}>
        <LogoImage src="/danmuji_logo.png" alt="Danmuji Logo" />
      </LogoArea>
      <Divider />
      <ProfileArea onClick={() => handleMenuItemClick("프로필", "/my")}>
        <UserProfile />
      </ProfileArea>
      <Divider />
      <MainMenu>
        <MenuItem
          icon={IoHome}
          text="대시보드"
          isActive={location.pathname === "/dashboard"}
          onClick={() => handleMenuItemClick("대시보드", "/dashboard")}
        />
        <MenuItem
          icon={FaArchive}
          text="프로젝트 목록"
          isActive={location.pathname.startsWith("/projects")}
          onClick={() => handleMenuItemClick("프로젝트 목록", "/projects")}
        />
        {role === "ROLE_ADMIN" ? (
          <>
            <MenuItem
              icon={HiBuildingOffice2}
              text="회사 관리"
              isActive={location.pathname.startsWith("/company")}
              onClick={() => handleMenuItemClick("회사 관리", "/company")}
            />
            <MenuItem
              icon={HiUsers}
              text="회원 관리"
              isActive={location.pathname.startsWith("/member")}
              onClick={() => handleMenuItemClick("회원 관리", "/members")}
            />
            <MenuItem
              icon={FaHistory}
              text="이력 관리"
              isActive={location.pathname === "/activity-log"}
              onClick={() => handleMenuItemClick("이력 관리", "/activity-log")}
            />
            <MenuItem
              icon={FiHelpCircle}
              text="문의사항 관리"
              isActive={location.pathname.startsWith("/inquiry")}
              onClick={() => handleMenuItemClick("문의사항 관리", "/inquiry")}
            />
          </>
        ) : (
          <MenuItem
            icon={FiHelpCircle}
            text="관리자에게 문의하기"
            isActive={location.pathname === "/my-inquiry"}
            onClick={() =>
              handleMenuItemClick("관리자에게 문의하기", "/my-inquiry")
            }
          />
        )}
      </MainMenu>
    </SidebarContainer>
  );
};
