import React from "react";
import { useLocation } from "react-router-dom";
import { NotificationDropdown } from "../Header/NotificationDropdown";
import { ProfileDropdown } from "../Header/ProfileDropdown";
import {
  TopbarContainer,
  PageTitle,
  UserInfo,
  CompanyName,
  UserDropdown,
} from "./Topbar.styles";

export const Topbar: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "대시보드";
      case "/projects":
        return "프로젝트 관리";
      case "/company":
        return "회사 관리";
      case "/members":
        return "멤버 관리";
      default:
        return "대시보드";
    }
  };

  return (
    <TopbarContainer>
      <PageTitle>{getPageTitle()}</PageTitle>
      <UserInfo>
        <CompanyName>XYZ 소프트웨어</CompanyName>
        <UserDropdown>
          <ProfileDropdown />
        </UserDropdown>
        <NotificationDropdown />
      </UserInfo>
    </TopbarContainer>
  );
};
