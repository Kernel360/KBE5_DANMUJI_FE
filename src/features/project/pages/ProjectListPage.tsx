import React, { useEffect, useState } from 'react';
import { ProjectListContainer, Header, Title, Description, CardGrid } from './ProjectListPage.styled';
import type { Project } from '../types/Types';
import ProjectFilterBar from '../components/List/ProjectFilterBar';
import ProjectCard from '../components/List/ProjectCard';

const mockProjects: Project[] = [
  {
    id: 1,
    name: 'ABC 기업 웹사이트 리뉴얼',
    client: 'ABC 주식회사',
    clientManager: '홍길동 외 2명',
    devManagers: '김개발 외 3명',
    status: 'IN_PROGRESS',
    priority: '긴급',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
  },
  {
    id: 2,
    name: 'ABC 기업 웹사이트 리뉴얼',
    client: 'ABC 주식회사',
    clientManager: '홍길동 외 2명',
    devManagers: '김개발 외 3명',
    status: 'IN_PROGRESS',
    priority: '긴급',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
  },
  {
    id: 3,
    name: 'ABC 기업 웹사이트 리뉴얼',
    client: 'ABC 주식회사',
    clientManager: '홍길동 외 2명',
    devManagers: '김개발 외 3명',
    status: 'DELAYED',
    priority: '긴급',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
  },
  {
    id: 4,
    name: 'ABC 기업 웹사이트 리뉴얼',
    client: 'ABC 주식회사',
    clientManager: '홍길동 외 2명',
    devManagers: '김개발 외 3명',
    status: 'COMPLETED',
    priority: '긴급',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
  },
];

export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    client: '',
    priority: '',
    sort: 'latest',
    startDate: '',
    endDate: '',
    keyword: '',
  });

  useEffect(() => {
    setProjects(mockProjects);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const filteredProjects = projects.filter((p) =>
    p.name.includes(filters.keyword) || p.client.includes(filters.keyword)
  );

  return (
    <ProjectListContainer>
      <Header>
        <Title>프로젝트 관리</Title>
        <Description>프로젝트 관리 시스템의 주요 정보를 한눈에 확인하세요</Description>
      </Header>
      <ProjectFilterBar filters={filters} onInputChange={handleInputChange} />
      <CardGrid>
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </CardGrid>
    </ProjectListContainer>
  );
}
