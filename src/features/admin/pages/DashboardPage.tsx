import React from "react";
import {
  DashboardContainer,
  Header,
  Title,
  Description,
  CardGrid,
  Card,
  IconContainer,
  Icon,
  CardContent,
  CardValue,
  CardLabel,
  RecentActivityContainer,
  RecentActivityCard,
  RecentActivityTitle,
  RecentActivityList,
  RecentActivityItem,
  RecentActivityDate,
} from "./DashboardPage.styled";

const summary = [
  {
    label: "전체 회사",
    value: 12,
    icon: "/src/assets/company.svg",
    color: "#fef3c7",
    iconColor: "#f59e0b",
  },
  {
    label: "전체 회원",
    value: 34,
    icon: "/src/assets/member.svg",
    color: "#dbeafe",
    iconColor: "#3b82f6",
  },
  {
    label: "전체 프로젝트",
    value: 7,
    icon: "/src/assets/project.svg",
    color: "#dcfce7",
    iconColor: "#22c55e",
  },
];

const recentCompanies = [
  { name: "ABC 주식회사", date: "2024-06-01" },
  { name: "DEF 테크놀로지", date: "2024-05-28" },
];
const recentMembers = [
  { name: "홍길동", date: "2024-06-02" },
  { name: "김철수", date: "2024-05-30" },
];
const recentProjects = [
  { name: "신규 웹사이트 구축", date: "2024-06-03" },
  { name: "모바일 앱 개발", date: "2024-05-29" },
];

export default function DashboardPage() {
  return (
    <DashboardContainer>
      <Header>
        <Title>대시보드</Title>
        <Description>
          관리자용 프로젝트 관리 시스템 현황을 한눈에 확인하세요
        </Description>
      </Header>
      <CardGrid>
        {summary.map((card) => (
          <Card key={card.label} $bgcolor={card.color}>
            <IconContainer $iconbgcolor={card.iconColor}>
              <Icon src={card.icon} alt="" />
            </IconContainer>
            <CardContent>
              <CardValue>{card.value}</CardValue>
              <CardLabel>{card.label}</CardLabel>
            </CardContent>
          </Card>
        ))}
      </CardGrid>
      <RecentActivityContainer>
        <RecentActivityCard>
          <RecentActivityTitle>최근 등록된 회사</RecentActivityTitle>
          <RecentActivityList>
            {recentCompanies.map((c, i) => (
              <RecentActivityItem key={i}>
                <span>{c.name}</span>
                <RecentActivityDate>{c.date}</RecentActivityDate>
              </RecentActivityItem>
            ))}
          </RecentActivityList>
        </RecentActivityCard>
        <RecentActivityCard>
          <RecentActivityTitle>최근 등록된 회원</RecentActivityTitle>
          <RecentActivityList>
            {recentMembers.map((m, i) => (
              <RecentActivityItem key={i}>
                <span>{m.name}</span>
                <RecentActivityDate>{m.date}</RecentActivityDate>
              </RecentActivityItem>
            ))}
          </RecentActivityList>
        </RecentActivityCard>
        <RecentActivityCard>
          <RecentActivityTitle>최근 등록된 프로젝트</RecentActivityTitle>
          <RecentActivityList>
            {recentProjects.map((p, i) => (
              <RecentActivityItem key={i}>
                <span>{p.name}</span>
                <RecentActivityDate>{p.date}</RecentActivityDate>
              </RecentActivityItem>
            ))}
          </RecentActivityList>
        </RecentActivityCard>
      </RecentActivityContainer>
    </DashboardContainer>
  );
}
