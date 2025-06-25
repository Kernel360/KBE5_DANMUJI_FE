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
import ProjectCreateModal from "../components/ProjectCreateModal";
import { getProjects, type ProjectResponse } from "../services/projectService";
import api from "@/api/axios";

type Member = {
  id: number;
  name: string;
  position: string;
};

type SelectedDevCompany = {
  company: { id: number; name: string };
  members: { id: number; name: string; position: string; type: 'manager' | 'member' }[];
};

type SelectedClientCompany = {
  company: { id: number; name: string };
  members: { id: number; name: string; position: string; type: 'manager' | 'member' }[];
};

const PAGE_SIZE = 8;

export default function ProjectListPage() {
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
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 프로젝트 목록 가져오기 (초기 로딩용)
  const fetchProjects = async (page: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProjects(page, PAGE_SIZE);

      if (response.data) {
        console.log("API Response:", response.data);
        console.log("Projects content:", response.data.content);
        
        // 백엔드 응답을 기존 Project 타입으로 변환
        const convertedProjects: Project[] = response.data.content.map(
          (project: ProjectResponse) => {
            console.log("Individual project:", project);
            
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

            const convertedProject = {
              id: project.projectId,
              name: project.name,
              client: project.assignClientCompanies[0]?.companyName || "고객사 미지정",
              clientManager: "담당자",
              devManagers: "개발팀",
              status: statusMapping[project.projectStatus] || "IN_PROGRESS",
              startDate: project.startDate,
              endDate: project.endDate,
              progress: project.progress
            };
            
            console.log("Converted project:", convertedProject);
            return convertedProject;
          }
        );

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

  // 프로젝트 검색/필터링 (검색용)
  const searchProjects = async (page: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      // 검색 파라미터 구성
      const searchParams: any = {};
      if (filters.keyword) searchParams.keyword = filters.keyword;
      if (filters.status) searchParams.status = filters.status;
      if (filters.client) searchParams.client = filters.client;
      if (filters.startDate) searchParams.startDate = filters.startDate;
      if (filters.endDate) searchParams.endDate = filters.endDate;
      if (filters.sort) searchParams.sort = filters.sort;

      const response = await api.get("/api/projects/search", {
        params: {
          page,
          size: PAGE_SIZE,
          ...searchParams,
        },
      });

      if (response.data?.data) {
        const convertedProjects: Project[] = response.data.data.content.map(
          (project: ProjectResponse) => {
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
              id: project.projectId,
              name: project.name,
              client: project.assignClientCompanies[0]?.companyName || "고객사 미지정",
              clientManager: "담당자",
              devManagers: "개발팀",
              status: statusMapping[project.projectStatus] || "IN_PROGRESS",
              startDate: project.startDate,
              endDate: project.endDate,
              progress: project.progress
            };
          }
        );

        setFilteredProjects(convertedProjects);
        setTotalPages(response.data.data.page.totalPages);
        setTotalElements(response.data.data.page.totalElements);
      }
    } catch (err) {
      console.error("프로젝트 검색 실패", err);
      setError("프로젝트 검색에 실패했습니다.");
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
    // 검색 조건이 있으면 검색 API 사용, 없으면 초기 로딩
    const hasSearchConditions = filters.keyword || filters.status || filters.client || filters.startDate || filters.endDate;
    
    if (hasSearchConditions) {
      searchProjects(0); // 검색 시 첫 페이지부터
    } else {
      fetchProjects(0); // 검색 조건 없으면 초기 로딩
    }
    setCurrentPage(1);
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
    fetchProjects(0); // 초기화 시 기본 API 사용
    setCurrentPage(1);
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
        <button
          style={{ marginLeft: "auto", padding: "8px 16px", fontSize: 16, borderRadius: 4, background: "#1976d2", color: "#fff", border: 0, cursor: "pointer" }}
          onClick={() => setShowCreateModal(true)}
        >
          프로젝트 등록
        </button>
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
      <ProjectCreateModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        fetchProjects={fetchProjects}
      />
    </ProjectListContainer>
  );
}
