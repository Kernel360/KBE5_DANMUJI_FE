import { useEffect, useState } from "react";
import {
  ProjectListContainer,
  Header,
  Title,
  Description,
  CardGrid,
} from "./ProjectListPage.styled";
import type { Project } from "../types/Types";
import ProjectFilterBar from "../components/List/ProjectFilterBar";
import ProjectCard from "../components/Card/ProjectCard";

const PAGE_SIZE = 12;

const mockProjects: Project[] = [
  {
    id: 1,
    name: "ABC 기업 웹사이트 리뉴얼",
    client: "ABC 주식회사",
    clientManager: "홍길동 외 2명",
    devManagers: "김개발 외 3명",
    status: "IN_PROGRESS",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    progress: 20,
  },
  {
    id: 2,
    name: "ABC 기업 웹사이트 리뉴얼",
    client: "ABC 주식회사",
    clientManager: "홍길동 외 2명",
    devManagers: "김개발 외 3명",
    status: "IN_PROGRESS",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    progress: 40,
  },
  {
    id: 3,
    name: "ABC 기업 웹사이트 리뉴얼",
    client: "ABC 주식회사",
    clientManager: "홍길동 외 2명",
    devManagers: "김개발 외 3명",
    status: "DELAYED",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    progress: 65,
  },
  {
    id: 4,
    name: "ABC 기업 웹사이트 리뉴얼",
    client: "ABC 주식회사",
    clientManager: "홍길동 외 2명",
    devManagers: "김개발 외 3명",
    status: "COMPLETED",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    progress: 90,
  },
];

export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    client: "",
    sort: "latest",
    startDate: "",
    endDate: "",
    keyword: "",
  });

  useEffect(() => {
    setProjects(mockProjects);
    setFilteredProjects(mockProjects);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleSearch = () => {
    const filtered = projects.filter((project) => {
      const matchesKeyword =
        project.name.includes(filters.keyword) ||
        project.client.includes(filters.keyword) ||
        project.clientManager.includes(filters.keyword) ||
        project.devManagers.includes(filters.keyword);

      const matchesStatus =
        !filters.status || project.status === filters.status;
      const matchesClient =
        !filters.client || project.client === filters.client;

      const startDate = new Date(project.startDate);
      const endDate = new Date(project.endDate);
      const filterStartDate = filters.startDate
        ? new Date(filters.startDate)
        : null;
      const filterEndDate = filters.endDate ? new Date(filters.endDate) : null;

      const matchesDate =
        (!filterStartDate || startDate >= filterStartDate) &&
        (!filterEndDate || endDate <= filterEndDate);

      return matchesKeyword && matchesStatus && matchesClient && matchesDate;
    });

    // 정렬 적용
    const sorted = [...filtered].sort((a, b) => {
      if (filters.sort === "latest") {
        return (
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      } else if (filters.sort === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    setFilteredProjects(sorted);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const handleReset = () => {
    setFilters({
      status: "",
      client: "",
      sort: "latest",
      startDate: "",
      endDate: "",
      keyword: "",
    });
    setFilteredProjects(projects);
    setCurrentPage(1); // 초기화 시 첫 페이지로 이동
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 현재 페이지의 프로젝트만 가져오기
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(filteredProjects.length / PAGE_SIZE);

  // 페이지 번호 배열 생성 (최대 5개)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <ProjectListContainer>
      <Header>
        <Title>프로젝트 관리</Title>
        <Description>
          프로젝트 관리 시스템의 주요 정보를 한눈에 확인하세요
        </Description>
      </Header>
      <ProjectFilterBar
        filters={filters}
        onInputChange={handleInputChange}
        onSearch={handleSearch}
        onReset={handleReset}
      />
      <CardGrid>
        {paginatedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </CardGrid>
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginTop: "24px",
          }}
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: "8px 16px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              background: currentPage === 1 ? "#f3f4f6" : "#fff",
              color: currentPage === 1 ? "#9ca3af" : "#374151",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            이전
          </button>
          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              style={{
                padding: "8px 16px",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                background: currentPage === pageNum ? "#fbbf24" : "#fff",
                color: currentPage === pageNum ? "#fff" : "#374151",
                cursor: "pointer",
              }}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: "8px 16px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              background: currentPage === totalPages ? "#f3f4f6" : "#fff",
              color: currentPage === totalPages ? "#9ca3af" : "#374151",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            다음
          </button>
        </div>
      )}
    </ProjectListContainer>
  );
}
