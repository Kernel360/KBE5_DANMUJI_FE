import React, { useState, useEffect } from "react";
import api from "@/api/axios";
import {
  DashboardContainer,
  Header,
  Title,
  Description,
  CardGrid,
  Card,
  CardContent,
  CardValue,
  CardLabel,
  RecentActivityContainer,
  RecentActivityCard,
  RecentActivityTitle,
  RecentActivityList,
  RecentActivityItem,
  RecentActivityDate,
  TwoColumnSection,
} from "./DashboardPage.styled";

// Define interfaces for new data types
interface RecentPost {
  id: number;
  title: string;
  createdAt: string;
}

interface RecentCompany {
  id: number;
  name: string;
  createdAt: string;
}

interface RecentProject {
  id: number;
  name: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [companyCount, setCompanyCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0); // New state for member count
  const [totalProjectCount, setTotalProjectCount] = useState(0); // New state for total projects
  const [inProgressProjectCount, setInProgressProjectCount] = useState(0); // New state for in-progress projects
  const [completedProjectCount, setCompletedProjectCount] = useState(0); // New state for completed projects
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]); // New state for recent posts
  const [recentCompanies, setRecentCompanies] = useState<RecentCompany[]>([]); // Make dynamic
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]); // Make dynamic

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Company Count
        const companyResponse = await api.get('/api/companies/all');
        setCompanyCount(companyResponse.data.data.length);

        // Fetch Member Count
        const memberResponse = await api.get('/api/admin/allUsers'); // Assuming this returns all users, similar to MemberPage.tsx
        setMemberCount(memberResponse.data.data.page.totalElements);

        // Fetch Project Counts
        // Assuming /api/projects/counts returns { total: number, inProgress: number, completed: number }
        const projectCountsResponse = await api.get('/api/projects/all'); 

        type Item = {
          status: 'IN_PROGRESS' | 'COMPLETED';
        };
        const content = projectCountsResponse.data.data as Item[];

        const total = content.length;
        const inProgressCount = content.filter(p => p.status === 'IN_PROGRESS').length;
        const completedCount = content.filter(p => p.status === 'COMPLETED').length;

        setTotalProjectCount(total);
        setInProgressProjectCount(inProgressCount);
        setCompletedProjectCount(completedCount);

        // Fetch Recent Posts
        // Assuming /api/boards/recent returns { data: { content: [{ id, title, createdAt }] } }
        const postsResponse = await api.get('/api/posts/recent-posts'); 
        setRecentPosts(postsResponse.data.data);

        // Fetch Recent Companies
        // Assuming /api/companies/recent returns { data: { content: [{ id, name, createdAt }] } }
        const recentCompaniesResponse = await api.get('/api/companies/recent-companies'); 
        setRecentCompanies(recentCompaniesResponse.data.data);

        // Fetch Recent Projects
        // Assuming /api/projects/recent returns { data: { content: [{ id, name, createdAt }] } }
        const recentProjectsResponse = await api.get('/api/projects/recent-projects'); 
        setRecentProjects(recentProjectsResponse.data.data);

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardContainer>
      <Header>
        <Title>대시보드</Title>
        <Description>
          관리자용 프로젝트 관리 시스템 현황을 한눈에 확인하세요
        </Description>
      </Header>

      {/* 관리 현황 섹션 */}
      <TwoColumnSection>
        <RecentActivityCard>
          <RecentActivityTitle style={{ marginBottom: '16px' }}>회원 및 회사 통계</RecentActivityTitle>
          <CardGrid>
            <Card $bgcolor={"white"}>
              <CardContent>
                <CardValue>{companyCount}</CardValue>
                <CardLabel>전체 회사</CardLabel>
              </CardContent>
            </Card>
            <Card $bgcolor={"white"}>
              <CardContent>
                <CardValue>{memberCount}</CardValue>
                <CardLabel>전체 회원</CardLabel>
              </CardContent>
            </Card>
          </CardGrid>
        </RecentActivityCard>

        {/* 프로젝트 현황 섹션 */}
        <RecentActivityCard>
          <RecentActivityTitle style={{ marginBottom: '16px' }}>프로젝트 통계</RecentActivityTitle>
          <CardGrid>
            <Card $bgcolor={"white"}>
              <CardContent>
                <CardValue>{totalProjectCount}</CardValue>
                <CardLabel>전체 프로젝트</CardLabel>
              </CardContent>
            </Card>
            <Card $bgcolor={"white"}>
              <CardContent>
                <CardValue>{inProgressProjectCount}</CardValue>
                <CardLabel>진행 중 프로젝트</CardLabel>
              </CardContent>
            </Card>
            <Card $bgcolor={"white"}>
              <CardContent>
                <CardValue>{completedProjectCount}</CardValue>
                <CardLabel>완료 프로젝트</CardLabel>
              </CardContent>
            </Card>
          </CardGrid>
        </RecentActivityCard>
      </TwoColumnSection>

      {/* 최근 활동 섹션 (RecentActivityContainer) */}
      <RecentActivityContainer>
        {/* 최근 등록된 게시물 */}
        <RecentActivityCard>
          <RecentActivityTitle>최근 등록된 게시물</RecentActivityTitle>
          <RecentActivityList>
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <RecentActivityItem key={post.id}>
                  <span>{post.title}</span>
                  <RecentActivityDate>{new Date(post.createdAt).toLocaleDateString()}</RecentActivityDate>
                </RecentActivityItem>
              ))
            ) : (
              <RecentActivityItem>
                <span>게시물이 없습니다.</span>
              </RecentActivityItem>
            )}
          </RecentActivityList>
        </RecentActivityCard>

        {/* 최근 등록된 회사 */}
        <RecentActivityCard>
          <RecentActivityTitle>최근 등록된 회사</RecentActivityTitle>
          <RecentActivityList>
            {recentCompanies.length > 0 ? (
              recentCompanies.map((company) => (
                <RecentActivityItem key={company.id}>
                  <span>{company.name}</span>
                  <RecentActivityDate>{new Date(company.createdAt).toLocaleDateString()}</RecentActivityDate>
                </RecentActivityItem>
              ))
            ) : (
              <RecentActivityItem>
                <span>회사가 없습니다.</span>
              </RecentActivityItem>
            )}
          </RecentActivityList>
        </RecentActivityCard>

        {/* 최근 등록된 프로젝트 */}
        <RecentActivityCard>
          <RecentActivityTitle>최근 등록된 프로젝트</RecentActivityTitle>
          <RecentActivityList>
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <RecentActivityItem key={project.id}>
                  <span>{project.name}</span>
                  <RecentActivityDate>{new Date(project.createdAt).toLocaleDateString()}</RecentActivityDate>
                </RecentActivityItem>
              ))
            ) : (
              <RecentActivityItem>
                <span>프로젝트가 없습니다.</span>
              </RecentActivityItem>
            )}
          </RecentActivityList>
        </RecentActivityCard>
      </RecentActivityContainer>
    </DashboardContainer>
  );
}
