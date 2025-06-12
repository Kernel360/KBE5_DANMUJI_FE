import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserProfile } from "../Header/UserProfile";
import { MenuItem } from "./MenuItem";
import { MenuItemSide } from "./MenuItemSide";

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
import { FaFlagCheckered } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import { FaAlignLeft } from "react-icons/fa";
import { FaArchive } from "react-icons/fa";
import { FaComments } from "react-icons/fa";

import { useAuth } from "@/contexts/AuthContexts";

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
          icon={FaComments}
          text="게시글 목록"
          isActive={location.pathname === "/posts"}
          onClick={() => handleMenuItemClick("게시글 목록", "/posts")}
        />
        <div>
          <MenuItem
            icon={FaArchive}
            text="프로젝트 관리"
            isActive={location.pathname.startsWith("/projects")}
            onClick={() => {
              if (role === "ROLE_USER") {
                handleMenuItemClick("프로젝트 관리", "/projects/active");
              }
              if (role === "ROLE_ADMIN") {
                handleMenuItemClick("프로젝트 관리", "/projects");
              }
            }}
          />
          {role === "ROLE_USER" && (
            <ul style={{ listStyle: "none", paddingLeft: 36, margin: 0 }}>
              <li>
                <MenuItemSide
                  icon={FaPlay}
                  text="진행 중인 프로젝트"
                  isActive={location.pathname === "/projects/active"}
                  onClick={() =>
                    handleMenuItemClick(
                      "진행 중인 프로젝트",
                      "/projects/active"
                    )
                  }
                />
              </li>
              <li>
                <MenuItemSide
                  icon={FaFlagCheckered}
                  text="완료된 프로젝트"
                  isActive={location.pathname === "/projects/completed"}
                  onClick={() =>
                    handleMenuItemClick(
                      "완료된 프로젝트",
                      "/projects/completed"
                    )
                  }
                />
              </li>
              <li>
                <MenuItemSide
                  icon={FaAlignLeft}
                  text="모든 프로젝트"
                  isActive={location.pathname === "/projects/all"}
                  onClick={() =>
                    handleMenuItemClick("모든 프로젝트", "/projects/all")
                  }
                />
              </li>
            </ul>
          )}
        </div>
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
              isActive={location.pathname.startsWith("/member")}
              onClick={() => handleMenuItemClick("멤버 관리", "/members")}
            />
          </>
        )}
      </MainMenu>
    </SidebarContainer>
  );
};
