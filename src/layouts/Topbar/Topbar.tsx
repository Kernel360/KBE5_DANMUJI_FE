import React from "react";
import { useLocation } from "react-router-dom";
import NotificationDropdown from "../Header/NotificationDropdown";
import { ProfileDropdown } from "../Header/ProfileDropdown";

import {
  TopbarContainer,
  PageTitle,
  UserInfo,
  UserDropdown,
} from "./Topbar.styles";

import type { Notification } from "@/layouts/Topbar/Topbar.types";

interface TopbarProps {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  error: string | null;
}

export const Topbar: React.FC<TopbarProps> = ({
  notifications,
  markAsRead,
  error,
}) => {
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
      <PageTitle> </PageTitle>
      <UserInfo>
        <UserDropdown>
          <ProfileDropdown />
        </UserDropdown>
        <NotificationDropdown
          notifications={notifications}
          markAsRead={markAsRead}
          error={error}
        />
      </UserInfo>
    </TopbarContainer>
  );
};
