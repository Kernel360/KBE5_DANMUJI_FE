import { useEffect, useState } from "react";
import {
  ProjectListContainer,
  Header,
  Title,
  Description,
  CardGrid,
  PaginationContainer,
  PaginationNav,
  PaginationButton,
  PaginationInfo,
} from "./ProjectListPage.styled";
import type { Project } from "../types/Types";
import ProjectFilterBar from "../components/List/ProjectFilterBar";
import ProjectCard from "../components/Card/ProjectCard";
import { getProjects, type ProjectResponse } from "../services/projectService";

const PAGE_SIZE = 8;

export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState({
    status: "",
    client: "",
    sort: "latest",
    startDate: "",
    endDate: "",
    keyword: "",
  });

  // 프로젝트 목록 가져오기
  const fetchProjects = async (page: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProjects(page, PAGE_SIZE);

      if (response.data) {
        // 백엔드 응답을 기존 Project 타입으로 변환
        const convertedProjects: Project[] = response.data.content.map(
          (project: ProjectResponse) => {
            // 진행률 계산 (완료된 스텝 수 / 전체 스텝 수)
            const totalSteps = project.steps.length;
            const completedSteps = project.steps.filter(
              (step) => step.projectStepStatus === "COMPLETED"
            ).length;
            const progress =
              totalSteps > 0
                ? Math.round((completedSteps / totalSteps) * 100)
                : 0;

            // 상태 매핑
            const statusMapping: Record<
              string,
              "IN_PROGRESS" | "COMPLETED" | "DELAYED" | "DUE_SOON"
            > = {
              IN_PROGRESS: "IN_PROGRESS",
              COMPLETED: "COMPLETED",
              DELAY: "DELAYED",
              DUE_SOON: "DUE_SOON",
            };

            return {
              id: project.id,
              name: project.name,
              client: project.clientCompany,
              clientManager: "담당자", // 백엔드에서 제공하지 않는 경우 기본값
              devManagers: "개발팀", // 백엔드에서 제공하지 않는 경우 기본값
              status: statusMapping[project.status] || "IN_PROGRESS",
              startDate: project.startDate,
              endDate: project.endDate,
              progress: progress,
              // 백엔드 API 응답 필드들
              description: project.description,
              clientCompany: project.clientCompany,
              developerCompany: project.developerCompany,
            };
          }
        );

        setProjects(convertedProjects);
        setFilteredProjects(convertedProjects);
        setTotalPages(response.data.page.totalPages);
        setTotalElements(response.data.page.totalElements);
      }
    } catch (err) {
      console.error("프로젝트 목록 불러오기 실패", err);
      setError("프로젝트 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(currentPage - 1); // 백엔드는 0-based pagination 사용
  }, [currentPage]);

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

  if (loading) {
    return (
      <ProjectListContainer>
        <Header>
          <Title>프로젝트 목록</Title>
          <Description>
            프로젝트 관리 시스템의 주요 정보를 한눈에 확인하세요
          </Description>
        </Header>
        <div style={{ textAlign: "center", padding: "40px" }}>
          프로젝트 목록을 불러오는 중...
        </div>
      </ProjectListContainer>
    );
  }

  if (error) {
    return (
      <ProjectListContainer>
        <Header>
          <Title>프로젝트 목록</Title>
          <Description>
            프로젝트 관리 시스템의 주요 정보를 한눈에 확인하세요
          </Description>
        </Header>
        <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
          {error}
        </div>
      </ProjectListContainer>
    );
  }

  return (
    <ProjectListContainer>
      <Header>
        <Title>프로젝트 목록</Title>
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
        {filteredProjects.length === 0 ? (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "40px",
              color: "#666",
            }}
          >
            프로젝트가 없습니다.
          </div>
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </CardGrid>
      {totalPages > 1 && (
        <PaginationContainer>
          <PaginationInfo>
            총 {totalElements}개의 프로젝트 중{" "}
            {(currentPage - 1) * PAGE_SIZE + 1}-
            {Math.min(currentPage * PAGE_SIZE, totalElements)}개 표시
          </PaginationInfo>
          <PaginationNav>
            <PaginationButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              이전
            </PaginationButton>
            {getPageNumbers().map((pageNum) => (
              <PaginationButton
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                $active={currentPage === pageNum}
              >
                {pageNum}
              </PaginationButton>
            ))}
            <PaginationButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              다음
            </PaginationButton>
          </PaginationNav>
        </PaginationContainer>
      )}
    </ProjectListContainer>
  );
}
