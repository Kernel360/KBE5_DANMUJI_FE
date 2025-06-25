import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Container,
  Card,
  CardHeader,
  IconCircle,
  InfoGrid,
  InfoItem,
  Label,
  Value,
  ActivityCard,
  ActivityRow,
  EditButton,
} from "./styled/UserProfilePage.styled";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiCalendar,
  FiLogIn,
  FiClock,
} from "react-icons/fi";
import { HiOfficeBuilding } from "react-icons/hi";
import ChangePasswordModal from "@/features/user/pages/profile/components/ChangePasswordModal";

export default function UserProfilePage() {
  const { user, refreshUser } = useAuth();
  const [openChangePassword, setOpenChangePassword] = useState(false);

  useEffect(() => {
    if (!user) refreshUser();
  }, [user, refreshUser]);

  if (!user) return <Container>불러오는 중...</Container>;
  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric" }).format(new Date(date));


  const formatDateTime = (date: string) => {
    const d = new Date(date);
    const kstDate = new Date(d.getTime() + 9 * 60 * 60 * 1000);
    return `${kstDate.getFullYear()}년 ${kstDate.getMonth() + 1}월 ${kstDate.getDate()}일 `
      + `${kstDate.getHours()}시 ${kstDate.getMinutes()}분`;
  };

  return (
    <Container>
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
          <div style={{ textAlign: "right" }}>
            <EditButton type="button" onClick={() => setOpenChangePassword(true)}>
              비밀번호 변경
            </EditButton>
          </div>
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
          <Value>{user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "정보 없음"}</Value>
        </ActivityRow>
      </ActivityCard>
      <ChangePasswordModal open={openChangePassword} onClose={() => setOpenChangePassword(false)} />
    </Container>
  );
}
