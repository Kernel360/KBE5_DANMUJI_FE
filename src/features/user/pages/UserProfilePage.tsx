import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import {
  Container,
  Header,
  Title,
  Subtitle,
  Card,
  CardHeader,
  IconCircle,
  InfoGrid,
  InfoItem,
  Label,
  Value,
  EditButton,
  ActivityCard,
  ActivityRow,
  OnlineBadge,
} from "./styles/UserProfilePage.styled";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiCalendar,
  FiLogIn,
} from "react-icons/fi";
import { HiOfficeBuilding } from "react-icons/hi";
import { FiClock } from "react-icons/fi";
type UserInfo = {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  companyId: number;
  companyName: string;
};

export default function UserProfilePage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    try {
      const response = await api.get("/api/users/me");
      setUser(response.data.data);
      console.log(response)
    } catch (err) {
      setError("사용자 정보를 불러오는 데 실패했습니다.");
      console.error("유저 정보 요청 실패", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  const formatDateTime = (date: string) => {
    const d = new Date(date);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 
    ${d.getHours()} : ${d.getSeconds()}`;
  };

  if (error) return <Container>{error}</Container>;
  if (!user) return <Container>불러오는 중...</Container>;

  return (
    <Container>
      {/* <Header>
        <div>
          <Title>내 정보</Title>
          <Subtitle>개인정보 및 계정 설정을 확인하세요</Subtitle>
        </div>
        <EditButton>
          <FiEdit2 />
          수정
        </EditButton>
      </Header> */}

      <Card>
        <CardHeader>
          <IconCircle>
            <FiUser size={20} />
          </IconCircle>
          <div>
            <h3>내 정보</h3>
            <span>개인 및 회사 정보</span>
          </div>
        </CardHeader>
        <InfoGrid>
          <InfoItem>
            <Label>
              <FiUser /> 이름
            </Label>
            <Value>{user.name}</Value>
          </InfoItem>
          <InfoItem>
            <Label>
              <HiOfficeBuilding /> 회사
            </Label>
            <Value>{user.companyName}</Value>
          </InfoItem>
          <InfoItem>
            <Label>
              <FiBriefcase /> 직책
            </Label>
            <Value>{user.position}</Value>
          </InfoItem>
          <InfoItem>
            <Label>
              <FiMail /> 이메일
            </Label>
            <Value>{user.email}</Value>
          </InfoItem>
          <InfoItem>
            <Label>
              <FiPhone /> 연락처
            </Label>
            <Value>{user.phone}</Value>
          </InfoItem>
        </InfoGrid>
      </Card>

      <ActivityCard>
        <CardHeader>
          <IconCircle>
            <FiClock size={20} />
          </IconCircle>
          <div>
            <h3>활동 정보</h3>
            <span>계정 생성 및 로그인 기록</span>
          </div>
        </CardHeader>
        <ActivityRow>
          <Label>
            <FiCalendar /> 계정 생성일
          </Label>
          <Value>{formatDate(user.createdAt)}</Value>
        </ActivityRow>
        <ActivityRow>
          <Label>
            <FiLogIn /> 마지막 로그인
          </Label>
          <Value>
            {/* {user.online && <OnlineBadge>온라인</OnlineBadge>} */}
            {formatDateTime(user.lastLoginAt)}
          </Value>
        </ActivityRow>
      </ActivityCard>
    </Container>
  );
}
