import { useNavigate } from "react-router-dom";
import * as S from "./styled/UserDashboardPage.styled";
import {
  MdOutlineViewHeadline,
  MdAccessTime,
  MdWarning,
  MdAssignment,
} from "react-icons/md";
import { useState } from "react";

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
  const [selectedTab, setSelectedTab] = useState(0);

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
            {/* 프로젝트 진행률(탭/카드) */}
            <S.Section>
              <S.ProgressSectionTitleRow>
                <S.SectionTitle color="#1abc7b">
                  진행중인 프로젝트
                </S.SectionTitle>
                <S.ViewAllButton onClick={() => navigate("/projects")}>
                  전체 보기
                  <S.ViewAllButtonIcon>
                    <MdOutlineViewHeadline />
                  </S.ViewAllButtonIcon>
                </S.ViewAllButton>
              </S.ProgressSectionTitleRow>
              {/* 탭 버튼 */}
              <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                {projectTabs.map((project, idx) => (
                  <button
                    key={project.name}
                    onClick={() => setSelectedTab(idx)}
                    style={{
                      padding: "6px 16px",
                      borderRadius: 999,
                      border: "none",
                      background: selectedTab === idx ? "#1abc7b" : "#e6f9f0",
                      color: selectedTab === idx ? "#fff" : "#1abc7b",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "0.97rem",
                      transition: "background 0.2s, color 0.2s",
                    }}
                  >
                    {project.name}
                  </button>
                ))}
              </div>
              {/* 선택된 프로젝트 정보 */}
              <S.ProjectCard>
                <S.ProjectHeaderRow>
                  <S.ProjectTitle>{projectTabs[selectedTab].name}</S.ProjectTitle>
                  <S.StatusBadge status={projectTabs[selectedTab].status}>
                    {projectTabs[selectedTab].status === "COMPLETED" && "완료"}
                    {projectTabs[selectedTab].status === "IN_PROGRESS" &&
                      "진행중"}
                    {projectTabs[selectedTab].status === "DELAYED" && "지연"}
                    {projectTabs[selectedTab].status !== "COMPLETED" &&
                      projectTabs[selectedTab].status !== "IN_PROGRESS" &&
                      projectTabs[selectedTab].status !== "DELAYED" &&
                      projectTabs[selectedTab].status}
                  </S.StatusBadge>
                </S.ProjectHeaderRow>
                <div
                  style={{
                    color: "#8b95a1",
                    fontSize: "0.97rem",
                    marginBottom: 2,
                  }}
                >
                  {projectTabs[selectedTab].description}
                </div>
                <S.ProjectMeta>
                  <div>
                    시작일:{" "}
                    <span style={{ color: "#222", fontWeight: 500 }}>
                      {projectTabs[selectedTab].startDate}
                    </span>
                  </div>
                  <div>
                    마감일:{" "}
                    <span style={{ color: "#222", fontWeight: 500 }}>
                      {projectTabs[selectedTab].endDate}
                    </span>
                  </div>
                </S.ProjectMeta>
                <S.CompanyRow>
                  <div>
                    고객사:{" "}
                    <S.CompanyName>
                      {projectTabs[selectedTab].clientCompany}
                    </S.CompanyName>
                  </div>
                  <div>
                    개발사:{" "}
                    <S.CompanyName>
                      {projectTabs[selectedTab].developerCompany}
                    </S.CompanyName>
                  </div>
                </S.CompanyRow>
                <S.Divider />
                <S.ProgressItem>
                  <S.ProgressLabel>진행률</S.ProgressLabel>
                  <S.ProgressPercent>
                    {getProgressPercent(projectTabs[selectedTab].steps)}%
                  </S.ProgressPercent>
                  <S.ProgressBarWrap>
                    <S.ProgressBar
                      percent={getProgressPercent(
                        projectTabs[selectedTab].steps
                      )}
                    />
                  </S.ProgressBarWrap>
                </S.ProgressItem>
              </S.ProjectCard>
            </S.Section>

            {/* 언급된 게시글 */}
            <S.MentionedSection>
              <S.SectionTitle>언급된 게시글</S.SectionTitle>
              <S.MentionedCard color="yellow">
                <S.MentionedTitle>UI/UX 피드백 요청</S.MentionedTitle>
                <S.MentionedDesc>
                  @김개발님, 메인 페이지 레이아웃에 대한 의견 부탁드립니다.
                </S.MentionedDesc>
                <S.MentionedMeta>
                  <MdAccessTime /> 2시간 전
                </S.MentionedMeta>
              </S.MentionedCard>
              <S.MentionedCard color="blue">
                <S.MentionedTitle>코드 리뷰 완료</S.MentionedTitle>
                <S.MentionedDesc>
                  @김개발님이 작성한 컴포넌트 리뷰가 완료되었습니다.
                </S.MentionedDesc>
                <S.MentionedMeta>
                  <MdAccessTime /> 5시간 전
                </S.MentionedMeta>
              </S.MentionedCard>
            </S.MentionedSection>
          </S.LeftColumn>

          <S.RightColumn>
            {/* 우선순위 높은 게시글 */}
            <S.PrioritySection>
              <S.SectionTitle color="#e74c3c">
                우선순위 높은 게시글
              </S.SectionTitle>
              <S.PriorityCard>
                <S.PriorityHeader>
                  <S.PriorityLabel>
                    <MdWarning style={{ marginRight: 6 }} />
                    긴급 버그 수정 요청
                  </S.PriorityLabel>
                  <S.PriorityTag>긴급</S.PriorityTag>
                </S.PriorityHeader>
                <S.PriorityDesc>
                  최신 모듈에서 오류가 발생하고 있습니다. 즉시 확인
                  부탁드립니다.
                </S.PriorityDesc>
                <S.PriorityMeta>
                  <span>
                    <MdAccessTime /> 30분 전
                  </span>
                  <span>
                    <MdAssignment /> 5
                  </span>
                </S.PriorityMeta>
              </S.PriorityCard>
              <S.PriorityCard>
                <S.PriorityHeader>
                  <S.PriorityLabel>
                    <MdWarning style={{ marginRight: 6 }} />
                    클라이언트 승인 대기
                  </S.PriorityLabel>
                  <S.PriorityTag type="yellow">보류</S.PriorityTag>
                </S.PriorityHeader>
                <S.PriorityDesc>
                  최종 디자인안에 대한 클라이언트 피드백이 필요합니다.
                </S.PriorityDesc>
                <S.PriorityMeta>
                  <span>
                    <MdAccessTime /> 1시간 전
                  </span>
                  <span>
                    <MdAssignment /> 3
                  </span>
                </S.PriorityMeta>
              </S.PriorityCard>
            </S.PrioritySection>

            {/* 최신 게시글 */}
            <S.LatestSection>
              <S.SectionTitle>진행 중인 프로젝트 최신 게시글</S.SectionTitle>
              <S.LatestCard>
                <S.LatestTitle>디자인 시스템 업데이트</S.LatestTitle>
                <S.LatestDesc>새로운 컴포넌트가 추가되었습니다.</S.LatestDesc>
                <S.LatestMeta>
                  <S.LatestTag color="blue">모바일 앱 리뉴얼</S.LatestTag>
                  <span>
                    <MdAccessTime /> 1시간 전
                  </span>
                </S.LatestMeta>
              </S.LatestCard>
              <S.LatestCard>
                <S.LatestTitle>테스트 결과 공유</S.LatestTitle>
                <S.LatestDesc>QA 테스트가 완료되었습니다.</S.LatestDesc>
                <S.LatestMeta>
                  <S.LatestTag color="yellow">웹사이트 개편</S.LatestTag>
                  <span>
                    <MdAccessTime /> 3시간 전
                  </span>
                </S.LatestMeta>
              </S.LatestCard>
              <S.LatestCard>
                <S.LatestTitle>API 문서 업데이트</S.LatestTitle>
                <S.LatestDesc>새로운 엔드포인트가 추가되었습니다.</S.LatestDesc>
                <S.LatestMeta>
                  <S.LatestTag color="green">API 통합 개발</S.LatestTag>
                  <span>
                    <MdAccessTime /> 5시간 전
                  </span>
                </S.LatestMeta>
              </S.LatestCard>
            </S.LatestSection>
          </S.RightColumn>
        </S.LayoutGrid>
      </S.MainContent>
    </S.Container>
  );
};

export default UserDashboardPage;
