import React from "react";
import type { UserProfileProps } from "./Header.types";
import {
  ProfileContainer,
  UserInfo,
  UserName,
  UserCompany,
  UserRole,
} from "./UserProfile.styled";

export const UserProfile: React.FC<UserProfileProps> = ({
  name,
  company,
  role,
}) => {
  return (
    <ProfileContainer>
      <UserInfo>
        <UserName>{name}</UserName>
        <UserCompany>{company}</UserCompany>
        <UserRole>{role}</UserRole>
      </UserInfo>
    </ProfileContainer>
  );
};
