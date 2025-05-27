import React from "react";
import styled from "styled-components";
import type { UserProfileProps } from "./Header.types";

const ProfileContainer = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #fdb924;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

const UserCompany = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const UserRole = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

export const UserProfile: React.FC<UserProfileProps> = ({
  name,
  company,
  role,
  initial,
}) => {
  return (
    <ProfileContainer>
      <Avatar>{initial}</Avatar>
      <UserInfo>
        <UserName>{name}</UserName>
        <UserCompany>{company}</UserCompany>
        <UserRole>{role}</UserRole>
      </UserInfo>
    </ProfileContainer>
  );
};
