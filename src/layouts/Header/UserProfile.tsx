import React from "react";
import {
  ProfileContainer,
  UserInfo,
  UserName,
  UserCompany,
  UserRole,
} from "./UserProfile.styled";
import { useAuth } from "@/contexts/AuthContexts";

export const UserProfile: React.FC = () => {
  const { user } = useAuth();

  return (
    <ProfileContainer>
      <UserInfo>
        <UserName>{user?.name ?? ""}</UserName>
        <UserCompany>{user?.companyName ?? ""}</UserCompany>
        <UserRole>{user?.position ?? ""}</UserRole>
      </UserInfo>
    </ProfileContainer>
  );
};
