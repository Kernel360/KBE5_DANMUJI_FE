import React from "react";
import styled from "styled-components";

const DashboardContainer = styled.div``;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.div`
  font-size: 1.875rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const Description = styled.div`
  color: #6b7280;
  font-size: 1rem;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.div<{ $bgcolor: string }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  background-color: ${(props) => props.$bgcolor};
`;

const IconContainer = styled.div<{ $iconbgcolor: string }>`
  border-radius: 9999px;
  padding: 0.75rem;
  background-color: white;
  color: ${(props) => props.$iconbgcolor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.img`
  height: 1.75rem;
  width: 1.75rem;
`;

const CardContent = styled.div``;

const CardValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
`;

const CardLabel = styled.div`
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
  margin-top: 0.25rem;
`;

const RecentActivityContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const RecentActivityCard = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
`;

const RecentActivityTitle = styled.div`
  font-weight: 700;
  font-size: 1.125rem;
  margin-bottom: 1rem;
`;

const RecentActivityList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  dividing-line: 1px solid #e5e7eb;
`;

const RecentActivityItem = styled.li`
  padding: 0.5rem 0;
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  border-bottom: 1px solid #e5e7eb; /* divide-y */

  &:last-child {
    border-bottom: none;
  }
`;

const RecentActivityDate = styled.span`
  color: #9ca3af;
`;

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
