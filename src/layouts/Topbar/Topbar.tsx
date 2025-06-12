import React from "react";
import { useLocation } from "react-router-dom";
import { NotificationDropdown } from "../Header/NotificationDropdown";
import { ProfileDropdown } from "../Header/ProfileDropdown";
import {
  TopbarContainer,
  PageTitle,
  UserInfo,
  UserDropdown,
} from "./Topbar.styles";

export const Topbar: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === "/members") {
      return "멤버 관리";
    } else if (location.pathname.startsWith("/member/")) {
      return "회원 정보";
    } else if (location.pathname === "/dashboard") {
      return "대시보드";
    } else if (location.pathname === "/projects") {
      return "프로젝트 관리";
    } else if (location.pathname === "/company") {
      return "회사 관리";
    } else {
      return "대시보드";
    }
  };

  return (
    <TopbarContainer>
      <PageTitle>{getPageTitle()}</PageTitle>
      <UserInfo>
        <UserDropdown>
          <ProfileDropdown />
        </UserDropdown>
        <NotificationDropdown />
      </UserInfo>
    </TopbarContainer>
  );
};
