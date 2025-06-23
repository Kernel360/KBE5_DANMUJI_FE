import React, { useState, useEffect } from "react";
import api from "@/api/axios";
import {
  DashboardContainer,
  Header,
  Title,
  Description,
  RecentActivityContainer,
  RecentActivityCard,
  RecentActivityTitle,
  RecentActivityList,
  RecentActivityItem,
  RecentActivityDate,
} from "./DashboardPage.styled";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaUserFriends, FaBuilding, FaFolderOpen } from 'react-icons/fa';

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
  const [memberCount, setMemberCount] = useState(0);
  const [totalProjectCount, setTotalProjectCount] = useState(0);
  const [inProgressProjectCount, setInProgressProjectCount] = useState(0);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [recentCompanies, setRecentCompanies] = useState<RecentCompany[]>([]);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);

  // 차트용 임시 데이터
  const projectStatusData = [
    { name: '진행중', value: 10 },
    { name: '완료', value: 5 },
    { name: '지연', value: 2 },
    { name: '임박', value: 1 },
  ];
  const inquiryPieData = [
    { name: '답변 대기', value: 45 },
    { name: '답변 완료', value: 88 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Company Count
        const companyResponse = await api.get('/api/companies/all');
        const companies = companyResponse.data?.data || [];
        setCompanyCount(companies.length);
  
        // Fetch Member Count
        const memberResponse = await api.get('/api/admin/allUsers');
        const members = memberResponse.data?.data?.page?.totalElements || 0;
        setMemberCount(members);
  
        // Fetch Project Counts
        const projectCountsResponse = await api.get('/api/projects/all');
        const content = projectCountsResponse.data?.data || [];
        const total = content.length;
        const inProgressCount = content.filter((p: { status: string; }) => p.status === 'IN_PROGRESS').length;
  
        setTotalProjectCount(total);
        setInProgressProjectCount(inProgressCount);
  
        // Fetch Recent Posts
        const postsResponse = await api.get('/api/posts/recent-posts');
        setRecentPosts(postsResponse.data?.data || []);
  
        // Fetch Recent Companies
        const recentCompaniesResponse = await api.get('/api/companies/recent-companies');
        setRecentCompanies(recentCompaniesResponse.data?.data || []);
  
        // Fetch Recent Projects
        const recentProjectsResponse = await api.get('/api/projects/recent-projects');
        setRecentProjects(recentProjectsResponse.data?.data || []);
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

      {/* 와이어프레임 스타일: 통계/차트 카드 분리 */}
      {/* 1행: 통계 카드 3개 한 줄 */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 24, marginBottom: 32 }}>
        {/* 회원 통계 카드 - 이미지 스타일 */}
        <RecentActivityCard style={{ flex: 1, padding: '24px 24px 18px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 32, color: '#4F8CFF', background: '#EAF3FF', borderRadius: '12px', padding: 10, marginRight: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaUserFriends />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#222' }}>총 회원 수</div>
              <div style={{ fontSize: 13, color: '#888' }}>전체 가입 회원</div>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ fontSize: 32, fontWeight: 700, color: '#4F8CFF' }}>{memberCount}</div>
          </div>
          <div style={{ marginTop: 8 }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, color: '#888' }}>활성 사용자</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#1DB954' }}>9,234</div>
            </div>
          </div>
        </RecentActivityCard>
        {/* 회사 통계 카드 - 회원 통계와 동일 스타일 */}
        <RecentActivityCard style={{ flex: 1, padding: '24px 24px 18px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 32, color: '#34C759', background: '#E6F9ED', borderRadius: '12px', padding: 10, marginRight: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaBuilding />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#222' }}>총 회사 수</div>
              <div style={{ fontSize: 13, color: '#888' }}>전체 등록 회사</div>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ fontSize: 32, fontWeight: 700, color: '#34C759' }}>{companyCount}</div>
          </div>
          <div style={{ marginTop: 8 }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, color: '#888' }}>활성 회사</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#34C759' }}>1,222</div>
            </div>
          </div>
        </RecentActivityCard>
        {/* 프로젝트 통계 카드 - 회원 통계와 동일 스타일 */}
        <RecentActivityCard style={{ flex: 1, padding: '24px 24px 18px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 32, color: '#FF9500', background: '#FFF6E6', borderRadius: '12px', padding: 10, marginRight: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaFolderOpen />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#222' }}>총 프로젝트 수</div>
              <div style={{ fontSize: 13, color: '#888' }}>전체 등록 프로젝트</div>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ fontSize: 32, fontWeight: 700, color: '#FF9500' }}>{totalProjectCount}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 13, color: '#888' }}>활성 프로젝트</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#FF9500' }}>7</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 13, color: '#888' }}>진행 중 프로젝트</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#4F8CFF' }}>{inProgressProjectCount}</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 13, color: '#888' }}>완료 프로젝트</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#34C759' }}>5</div>
            </div>
          </div>
        </RecentActivityCard>
      </div>

      {/* 2행: 차트 카드 2개 한 줄 */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 24, marginBottom: 32 }}>
        {/* 프로젝트 상태 분포 차트 카드 */}
        <RecentActivityCard style={{ flex: 1 }}>
          <RecentActivityTitle style={{ marginBottom: '16px' }}>프로젝트 상태 분포</RecentActivityTitle>
          <div style={{ width: '100%', minWidth: 250, maxWidth: 400, height: 320, margin: '0 auto' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  label
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </RecentActivityCard>
        {/* 문의 처리 추이 차트 카드 */}
        <RecentActivityCard style={{ flex: 1 }}>
          <RecentActivityTitle style={{ marginBottom: '16px' }}>문의 처리 추이</RecentActivityTitle>
          <div style={{ width: '100%', minWidth: 250, maxWidth: 400, height: 320, margin: '0 auto' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inquiryPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  label
                >
                  {inquiryPieData.map((entry, index) => (
                    <Cell key={`cell-inquiry-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </RecentActivityCard>
      </div>

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
