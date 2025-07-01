import { useNavigate } from "react-router-dom";
import * as S from "./styled/UserDashboardPage.styled";
import { useState } from "react";
import ProjectStatusSection from "./components/ProjectStatusSection";
import MentionedPostsSection from "./components/MentionedPostsSection";
import WarningProjectsSection from "./components/WarningProjectsSection";
import PriorityPostsSection from "./components/PriorityPostsSection";
import LatestPostsSection from "./components/LatestPostsSection";

const projectTabs = [
  {
    id: 1,
    name: "ERP 시스템 개발",
    description: "사내 ERP 시스템 고도화 프로젝트",
    startDate: "2024-04-01",
    endDate: "2024-08-31",
    status: "IN_PROGRESS",
    steps: [
      { id: 1, stepOrder: 1, name: "기획", projectStepStatus: "COMPLETED" },
      { id: 2, stepOrder: 2, name: "설계", projectStepStatus: "COMPLETED" },
      { id: 3, stepOrder: 3, name: "개발", projectStepStatus: "IN_PROGRESS" },
      { id: 4, stepOrder: 4, name: "테스트", projectStepStatus: "PENDING" },
    ],
    clientCompany: "ABC기업",
    developerCompany: "XYZ소프트",
    users: [
      {
        companyType: "CLIENT",
        clientCompany: "ABC기업",
        developerCompany: "XYZ소프트",
      },
    ],
  },
  {
    id: 2,
    name: "모바일 앱 리뉴얼",
    description: "모바일 앱 UI/UX 리뉴얼",
    startDate: "2024-05-10",
    endDate: "2024-09-15",
    status: "IN_PROGRESS",
    steps: [
      { id: 1, stepOrder: 1, name: "기획", projectStepStatus: "COMPLETED" },
      { id: 2, stepOrder: 2, name: "디자인", projectStepStatus: "COMPLETED" },
      { id: 3, stepOrder: 3, name: "개발", projectStepStatus: "IN_PROGRESS" },
      { id: 4, stepOrder: 4, name: "테스트", projectStepStatus: "PENDING" },
    ],
    clientCompany: "코드베이스",
    developerCompany: "XYZ소프트",
    users: [
      {
        companyType: "CLIENT",
        clientCompany: "코드베이스",
        developerCompany: "XYZ소프트",
      },
    ],
  },
  {
    id: 3,
    name: "API 통합 개발",
    description: "내부 시스템 API 통합 및 표준화",
    startDate: "2024-03-20",
    endDate: "2024-07-30",
    status: "IN_PROGRESS",
    steps: [
      { id: 1, stepOrder: 1, name: "기획", projectStepStatus: "COMPLETED" },
      { id: 2, stepOrder: 2, name: "개발", projectStepStatus: "COMPLETED" },
      { id: 3, stepOrder: 3, name: "테스트", projectStepStatus: "IN_PROGRESS" },
    ],
    clientCompany: "이노베이션",
    developerCompany: "XYZ소프트",
    users: [
      {
        companyType: "CLIENT",
        clientCompany: "이노베이션",
        developerCompany: "XYZ소프트",
      },
    ],
  },
  {
    id: 3,
    name: "API 통합 개발",
    description: "내부 시스템 API 통합 및 표준화",
    startDate: "2024-03-20",
    endDate: "2024-07-30",
    status: "IN_PROGRESS",
    steps: [
      { id: 1, stepOrder: 1, name: "기획", projectStepStatus: "COMPLETED" },
      { id: 2, stepOrder: 2, name: "개발", projectStepStatus: "COMPLETED" },
      { id: 3, stepOrder: 3, name: "테스트", projectStepStatus: "IN_PROGRESS" },
    ],
    clientCompany: "이노베이션",
    developerCompany: "XYZ소프트",
    users: [
      {
        companyType: "CLIENT",
        clientCompany: "이노베이션",
        developerCompany: "XYZ소프트",
      },
    ],
  },
  {
    id: 3,
    name: "API 통합 개발",
    description: "내부 시스템 API 통합 및 표준화",
    startDate: "2024-03-20",
    endDate: "2024-07-30",
    status: "IN_PROGRESS",
    steps: [
      { id: 1, stepOrder: 1, name: "기획", projectStepStatus: "COMPLETED" },
      { id: 2, stepOrder: 2, name: "개발", projectStepStatus: "COMPLETED" },
      { id: 3, stepOrder: 3, name: "테스트", projectStepStatus: "IN_PROGRESS" },
    ],
    clientCompany: "이노베이션",
    developerCompany: "XYZ소프트",
    users: [
      {
        companyType: "CLIENT",
        clientCompany: "이노베이션",
        developerCompany: "XYZ소프트",
      },
    ],
  },
  {
    id: 10,
    name: "웹사이트 리뉴얼",
    description: "기업 웹사이트 리뉴얼 프로젝트 (지연 예시)",
    startDate: "2024-03-01",
    endDate: "2024-04-15",
    status: "DELAYED",
    steps: [
      { id: 1, stepOrder: 1, name: "기획", projectStepStatus: "COMPLETED" },
      { id: 2, stepOrder: 2, name: "디자인", projectStepStatus: "COMPLETED" },
      { id: 3, stepOrder: 3, name: "개발", projectStepStatus: "IN_PROGRESS" },
      { id: 4, stepOrder: 4, name: "테스트", projectStepStatus: "PENDING" },
    ],
    clientCompany: "XYZ 회사",
    developerCompany: "웹에이전시",
    users: [
      {
        companyType: "CLIENT",
        clientCompany: "XYZ 회사",
        developerCompany: "웹에이전시",
      },
    ],
  },
  {
    id: 10,
    name: "웹사이트 리뉴얼",
    description: "기업 웹사이트 리뉴얼 프로젝트 (지연 예시)",
    startDate: "2024-03-01",
    endDate: "2024-04-15",
    status: "DELAYED",
    steps: [
      { id: 1, stepOrder: 1, name: "기획", projectStepStatus: "COMPLETED" },
      { id: 2, stepOrder: 2, name: "디자인", projectStepStatus: "COMPLETED" },
      { id: 3, stepOrder: 3, name: "개발", projectStepStatus: "IN_PROGRESS" },
      { id: 4, stepOrder: 4, name: "테스트", projectStepStatus: "PENDING" },
    ],
    clientCompany: "XYZ 회사",
    developerCompany: "웹에이전시",
    users: [
      {
        companyType: "CLIENT",
        clientCompany: "XYZ 회사",
        developerCompany: "웹에이전시",
      },
    ],
  },
  {
    id: 10,
    name: "웹사이트 리뉴얼",
    description: "기업 웹사이트 리뉴얼 프로젝트 (지연 예시)",
    startDate: "2024-03-01",
    endDate: "2024-04-15",
    status: "DELAYED",
    steps: [
      { id: 1, stepOrder: 1, name: "기획", projectStepStatus: "COMPLETED" },
      { id: 2, stepOrder: 2, name: "디자인", projectStepStatus: "COMPLETED" },
      { id: 3, stepOrder: 3, name: "개발", projectStepStatus: "IN_PROGRESS" },
      { id: 4, stepOrder: 4, name: "테스트", projectStepStatus: "PENDING" },
    ],
    clientCompany: "XYZ 회사",
    developerCompany: "웹에이전시",
    users: [
      {
        companyType: "CLIENT",
        clientCompany: "XYZ 회사",
        developerCompany: "웹에이전시",
      },
    ],
  },
  {
    id: 10,
    name: "웹사이트 리뉴얼",
    description: "기업 웹사이트 리뉴얼 프로젝트 (지연 예시)",
    startDate: "2024-03-01",
    endDate: "2024-04-15",
    status: "DELAYED",
    steps: [
      { id: 1, stepOrder: 1, name: "기획", projectStepStatus: "COMPLETED" },
      { id: 2, stepOrder: 2, name: "디자인", projectStepStatus: "COMPLETED" },
      { id: 3, stepOrder: 3, name: "개발", projectStepStatus: "IN_PROGRESS" },
      { id: 4, stepOrder: 4, name: "테스트", projectStepStatus: "PENDING" },
    ],
    clientCompany: "XYZ 회사",
    developerCompany: "웹에이전시",
    users: [
      {
        companyType: "CLIENT",
        clientCompany: "XYZ 회사",
        developerCompany: "웹에이전시",
      },
    ],
  },
];

function getProgressPercent(steps: { projectStepStatus: string }[]) {
  if (!steps || steps.length === 0) return 0;
  const completed = steps.filter(
    (s) => s.projectStepStatus === "COMPLETED"
  ).length;
  return Math.round((completed / steps.length) * 100);
}

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const [selectedWarningTab, setSelectedWarningTab] = useState<
    "DELAYED" | "DEADLINE"
  >("DELAYED");

  return (
    <S.Container>
      <S.MainContent>
        <S.DashboardHeader>
          <S.DashboardTitle>대시보드</S.DashboardTitle>
          <S.DashboardDescription>
            오늘의 프로젝트 현황과 주요 알림을 한눈에 확인하세요
          </S.DashboardDescription>
        </S.DashboardHeader>

        <S.LayoutGrid>
          <S.LeftColumn>
            <ProjectStatusSection
              projectTabs={projectTabs}
              getProgressPercent={getProgressPercent}
              navigate={navigate}
            />
            <LatestPostsSection />
            <PriorityPostsSection />
          </S.LeftColumn>

          <S.RightColumn>
            <WarningProjectsSection
              projectTabs={projectTabs}
              selectedWarningTab={selectedWarningTab}
              setSelectedWarningTab={setSelectedWarningTab}
            />
            <MentionedPostsSection />
          </S.RightColumn>
        </S.LayoutGrid>
      </S.MainContent>
    </S.Container>
  );
};

export default UserDashboardPage;
