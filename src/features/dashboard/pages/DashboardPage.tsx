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

const Card = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  background-color: ${(props) => props.$color};
`;

const IconContainer = styled.div<{ $iconColor: string }>`
  border-radius: 9999px;
  padding: 0.75rem;
  background-color: rgba(255, 255, 255, 0.8);
  ${(props) => props.$iconColor && `background-color: ${props.$iconColor};`}
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

const summary = [
  {
    label: "전체 회사",
    value: 12,
    icon: "/src/assets/company.svg",
    color: "bg-yellow-100",
    iconColor: "text-yellow-500",
  },
  {
    label: "전체 회원",
    value: 34,
    icon: "/src/assets/member.svg",
    color: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    label: "전체 프로젝트",
    value: 7,
    icon: "/src/assets/project.svg",
    color: "bg-green-100",
    iconColor: "text-green-500",
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
          <Card key={card.label} $color={card.color}>
            <IconContainer $iconColor={card.iconColor}>
              <Icon src={card.icon} alt="" />
            </IconContainer>
            <CardContent>
              <CardValue>{card.value}</CardValue>
              <CardLabel>{card.label}</CardLabel>
            </CardContent>
          </Card>
        ))}
      </CardGrid>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-bold text-lg mb-4">최근 등록된 회사</div>
          <ul className="divide-y">
            {recentCompanies.map((c, i) => (
              <li key={i} className="py-2 flex justify-between text-sm">
                <span>{c.name}</span>
                <span className="text-gray-400">{c.date}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-bold text-lg mb-4">최근 등록된 회원</div>
          <ul className="divide-y">
            {recentMembers.map((m, i) => (
              <li key={i} className="py-2 flex justify-between text-sm">
                <span>{m.name}</span>
                <span className="text-gray-400">{m.date}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-bold text-lg mb-4">최근 등록된 프로젝트</div>
          <ul className="divide-y">
            {recentProjects.map((p, i) => (
              <li key={i} className="py-2 flex justify-between text-sm">
                <span>{p.name}</span>
                <span className="text-gray-400">{p.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardContainer>
  );
}
