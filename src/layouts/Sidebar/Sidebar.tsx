import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserProfile } from "../Header/UserProfile";
import { MenuItem } from "./MenuItem";
import {
  SidebarContainer,
  LogoArea,
  Divider,
  MainMenu,
} from "./Sidebar.styles";

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = React.useState("대시보드");

  const handleMenuItemClick = (menuItem: string, path: string) => {
    setActiveMenuItem(menuItem);
    navigate(path);
  };

  return (
    <SidebarContainer>
      <LogoArea>
        <img
          src="/assets/danmuji-logo.png"
          alt="Danmuji Logo"
          className="danmuji-logo"
        />
      </LogoArea>
      <Divider />
      <UserProfile
        name="이개발"
        company="XYZ 소프트웨어"
        role="개발자"
        initial="이"
      />
      <MainMenu>
        <MenuItem
          icon="dashboard"
          text="대시보드"
          isActive={location.pathname === "/dashboard"}
          onClick={() => handleMenuItemClick("대시보드", "/dashboard")}
        />
        <MenuItem
          icon="project"
          text="프로젝트 관리"
          isActive={location.pathname === "/projects"}
          onClick={() => handleMenuItemClick("프로젝트 관리", "/projects")}
        />
        <MenuItem
          icon="company"
          text="회사 관리"
          isActive={location.pathname === "/company"}
          onClick={() => handleMenuItemClick("회사 관리", "/company")}
        />
        <MenuItem
          icon="member"
          text="멤버 관리"
          isActive={location.pathname === "/members"}
          onClick={() => handleMenuItemClick("멤버 관리", "/members")}
        />
      </MainMenu>
    </SidebarContainer>
  );
};
