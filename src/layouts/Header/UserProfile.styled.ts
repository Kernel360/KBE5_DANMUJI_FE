import styled from "styled-components";

export const ProfileContainer = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Avatar = styled.div`
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

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

export const UserCompany = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

export const UserRole = styled.div`
  font-size: 12px;
  color: #6b7280;
`;
