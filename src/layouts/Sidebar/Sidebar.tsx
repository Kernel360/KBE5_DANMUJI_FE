import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserProfile } from "../Header/UserProfile";
import { MenuItem } from "./MenuItem";

import {
  SidebarContainer,
  LogoArea,
  Divider,
  MainMenu
} from "./Sidebar.styles";
import styled from "styled-components";

// Import necessary icons from react-icons
import { MdDashboard } from "react-icons/md";
import { FaProjectDiagram } from "react-icons/fa";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { HiUsers } from "react-icons/hi2";

import { useAuth } from "@/contexts/AuthContexts";

import danmujiLogo from '../../assets/danmuji_logo.png';

const LogoImage = styled.img`
  height: 48px;
  width: auto;
  display: block;
`;

export const Sidebar: React.FC = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuItemClick = (menuItem: string, path: string) => {
    navigate(path);
  };

  return (
    <SidebarContainer>
      <LogoArea onClick={() => handleMenuItemClick("홈", "/dashboard")}>
        <LogoImage src={danmujiLogo} alt="Danmuji Logo" />
      </LogoArea>
      <Divider />
      <UserProfile
        name="이개발"
        company="XYZ 소프트웨어"
        role="개발자"
      />
      <MainMenu>
        <MenuItem
          icon={MdDashboard}
          text="대시보드"
          isActive={location.pathname === "/dashboard"}
          onClick={() => handleMenuItemClick("대시보드", "/dashboard")}
        />
        <MenuItem
          icon={FaProjectDiagram}
          text="프로젝트 관리"
          isActive={location.pathname === "/projects"}
          onClick={() => handleMenuItemClick("프로젝트 관리", "/projects")}
        />
                {/* 관리자 전용 메뉴 */}
        {role === "ROLE_ADMIN" && (
          <>
            <MenuItem
              icon={HiBuildingOffice2}
              text="회사 관리"
              isActive={location.pathname === "/company"}
              onClick={() => handleMenuItemClick("회사 관리", "/company")}
            />
            <MenuItem
              icon={HiUsers}
              text="멤버 관리"
              isActive={location.pathname === "/members"}
              onClick={() => handleMenuItemClick("멤버 관리", "/members")}
            />
          </>
        )}
      </MainMenu>
    </SidebarContainer>
  );
};
