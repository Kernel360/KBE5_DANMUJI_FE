import React, { useEffect, useState } from 'react';
import { ProjectListContainer, Header, Title, Description, SearchBarContainer, SearchInput, SearchButton, RegisterButton, CardGrid, ProjectCard, CardHeader, CardTitle, CardStatus, CardBody, CardInfo, CardFooter, DetailButton, ManagerButton, PaginationContainer, PaginationButton } from './ProjectListPage.styled';
import type { Project } from '../types/Types';

const mockProjects: Project[] = [
  {
    id: 1,
    name: 'ABC 기업 웹사이트 리뉴얼',
    client: 'ABC 주식회사',
    clientManager: '홍길동 외 2명',
    devManagers: '김개발 외 3명',
    status: '진행중',
    startDate: '2023-05-10',
    endDate: '2023-08-15',
  },
  {
    id: 2,
    name: 'XYZ 쇼핑몰 구축',
    client: 'XYZ 쇼핑',
    clientManager: '이고객',
    devManagers: '김개발 외 2명',
    status: '지연',
    startDate: '2023-04-01',
    endDate: '2023-07-01',
  },
  {
    id: 3,
    name: 'DEF 모바일 앱 개발',
    client: 'DEF 기업',
    clientManager: '박고객 외 1명',
    devManagers: '이개발 외 2명',
    status: '완료',
    startDate: '2023-01-15',
    endDate: '2023-06-30',
  },
  {
    id: 4,
    name: 'GHI 기업 ERP 시스템',
    client: 'GHI 기업',
    clientManager: '최고객',
    devManagers: '이개발 외 2명',
    status: '대기',
    startDate: '2023-08-01',
    endDate: '2023-12-31',
  },
];

const statusColor = {
  '진행중': '#2563eb',
  '지연': '#dc2626',
  '완료': '#059669',
  '대기': '#f59e42',
};

export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // TODO: Replace with real API call
  useEffect(() => {
    setProjects(mockProjects);
  }, []);

  const handleSearch = () => {
    setProjects(
      mockProjects.filter(
        (p) =>
          p.name.includes(search) ||
          p.client.includes(search) ||
          p.clientManager.includes(search)
      )
    );
  };

  return (
    <ProjectListContainer>
      <Header>
        <Title>프로젝트 관리</Title>
        <Description>프로젝트 관리 시스템의 주요 정보를 한눈에 확인하세요</Description>
      </Header>
      <SearchBarContainer>
        <SearchInput
          placeholder="프로젝트명, 고객사 또는 담당자로 검색"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
        <SearchButton onClick={handleSearch}>검색</SearchButton>
        <RegisterButton>프로젝트 등록</RegisterButton>
      </SearchBarContainer>
      <CardGrid>
        {projects.map(project => (
          <ProjectCard key={project.id}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardStatus style={{ background: statusColor[project.status] }}>{project.status}</CardStatus>
            </CardHeader>
            <CardBody>
              <CardInfo>
                <div>고객사</div>
                <div>{project.client}</div>
              </CardInfo>
              <CardInfo>
                <div>고객 담당자</div>
                <div>{project.clientManager}</div>
              </CardInfo>
              <CardInfo>
                <div>개발 담당자</div>
                <div>{project.devManagers}</div>
              </CardInfo>
              <CardInfo>
                <div>시작일</div>
                <div>{project.startDate}</div>
              </CardInfo>
              <CardInfo>
                <div>종료 예정일</div>
                <div>{project.endDate}</div>
              </CardInfo>
            </CardBody>
            <CardFooter>
              <DetailButton>상세 보기</DetailButton>
              <ManagerButton>담당자 관리</ManagerButton>
            </CardFooter>
          </ProjectCard>
        ))}
      </CardGrid>
      <PaginationContainer>
        <PaginationButton disabled={page === 1} onClick={() => setPage(page - 1)}>
          이전
        </PaginationButton>
        <PaginationButton $active={page === 1}>1</PaginationButton>
        <PaginationButton $active={page === 2}>2</PaginationButton>
        <PaginationButton onClick={() => setPage(page + 1)}>
          다음
        </PaginationButton>
      </PaginationContainer>
    </ProjectListContainer>
  );
} 