import React from "react";
import {
  ProfileContainer,
  UserInfo,
  UserName,
  UserCompany,
  UserRole,
} from "./UserProfile.styled";
import { FaBuilding } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { IoPersonSharp } from "react-icons/io5";
import { RiUserSettingsLine } from "react-icons/ri";
import { FiUser } from "react-icons/fi";

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const { role } = useAuth();

  return (
    <ProfileContainer>
      <UserInfo>
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          {role === "ROLE_ADMIN" ? (
            <RiUserSettingsLine size={22} style={{ color: "#6b7280" }} />
          ) : (
            <FiUser size={22} style={{ color: "#6b7280" }} />
          )}
          <UserName>
            {user?.name ?? "이름 없음"}
            {user?.username && (
              <span
                style={{
                  fontSize: "0.8em",
                  color: "#9ca3af",
                  fontWeight: "normal",
                  marginLeft: "4px",
                }}
              >
                ({user.username})
              </span>
            )}
          </UserName>
        </div>
        {role === "ROLE_USER" && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                marginTop: "4px",
                color: "#6b7280",
              }}
            >
              <FaBuilding />{" "}
              <UserCompany> {user?.companyName ?? ""}, </UserCompany>
              <UserRole> {user?.position ?? ""} </UserRole>
            </div>
          </div>
        )}
      </UserInfo>
    </ProfileContainer>
  );
};
