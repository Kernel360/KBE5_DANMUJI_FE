import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserProfile } from "../Header/UserProfile";
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
import { MdDashboard } from "react-icons/md";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { HiUsers } from "react-icons/hi2";
import { FaArchive } from "react-icons/fa";
import { FiHelpCircle } from "react-icons/fi";
import { FaHistory } from "react-icons/fa";

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
      <ProfileArea>
        <UserProfile />
      </ProfileArea>
      <Divider />
      <MainMenu>
        <MenuItem
          icon={MdDashboard}
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
              isActive={location.pathname === "/company"}
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
              text="변경 이력"
              isActive={location.pathname === "/activity-log"}
              onClick={() => handleMenuItemClick("변경 이력", "/activity-log")}
            />
            <MenuItem
              icon={FiHelpCircle}
              text="문의 목록"
              isActive={location.pathname === "/contact-admin"}
              onClick={() => handleMenuItemClick("문의 목록", "/contact-admin")}
            />
          </>
        ) : (
          <MenuItem
            icon={FiHelpCircle}
            text="관리자에게 문의하기"
            isActive={location.pathname === "/contact-admin"}
            onClick={() =>
              handleMenuItemClick("관리자에게 문의하기", "/contact-admin")
            }
          />
        )}
      </MainMenu>
    </SidebarContainer>
  );
};
