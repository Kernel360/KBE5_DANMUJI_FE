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
import { getProjects, searchProjects as searchProjectsApi, type ProjectResponse } from "../services/projectService";
import { SubmitButton } from "@/features/board/components/Post/styles/PostFormModal.styled";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
const PAGE_SIZE = 8;

export default function ProjectListPage() {
  const { role } = useAuth();
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState({
    projectStatus: "",
    sort: "latest",
    startDate: "",
    endDate: "",
    keyword: "",
    category: "",
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  // 프로젝트 목록 가져오기 (초기 로딩용)
  const fetchProjects = async (page: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProjects(page, PAGE_SIZE);

      if (response.data) {

        // 백엔드 응답을 기존 Project 타입으로 변환
        const convertedProjects: Project[] = response.data.content.map(
          (project: ProjectResponse) => {
            // 상태 매핑
            const statusMapping: Record<
              string,
              "IN_PROGRESS" | "COMPLETED" | "DELAY" | "DUE_SOON"
            > = {
              IN_PROGRESS: "IN_PROGRESS",
              COMPLETED: "COMPLETED",
              DELAY: "DELAY",
              DUE_SOON: "DUE_SOON",
            };

            // 회사명 표시 함수
            const getCompanyDisplay = (
              companies: { companyName: string }[] = []
            ) => {
              if (
                !companies ||
                !Array.isArray(companies) ||
                companies.length === 0
              )
                return "미지정";
              if (companies.length === 1)
                return companies[0]?.companyName || "미지정";
              return `${companies[0]?.companyName || "미지정"} 외 ${
                companies.length - 1
              }`;
            };

            const convertedProject = {
              id: project.projectId,
              name: project.name,
              clientCompanies: getCompanyDisplay(project.assignClientCompanies),
              devCompanies: getCompanyDisplay(project.assignDevCompanies),
              projectStatus: statusMapping[project.projectStatus],
              startDate: project.startDate,
              endDate: project.endDate,
              progress: project.progress,
            };

            return convertedProject;
          }
        );

        setFilteredProjects(convertedProjects);
        setTotalPages(response.data.page.totalPages);
        setTotalElements(response.data.page.totalElements);
      }
    } catch (err) {
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
      const searchParams: any = {
        ...filters,
        page,
        size: PAGE_SIZE,
      };
      // 빈 값은 params에서 제거
      Object.keys(searchParams).forEach(
        (key) => (searchParams[key] === "" || searchParams[key] === undefined) && delete searchParams[key]
      );

      // 실제 API로 보내는 params 콘솔 출력
      console.log("[API 요청]", searchParams);
      const response = await searchProjectsApi(searchParams);

      if (response.data) {
        const convertedProjects: Project[] = response.data.content.map(
          (project: ProjectResponse) => {
            // 상태 매핑
            const statusMapping: Record<
              string,
              "IN_PROGRESS" | "COMPLETED" | "DELAY" | "DUE_SOON"
            > = {
              IN_PROGRESS: "IN_PROGRESS",
              COMPLETED: "COMPLETED",
              DELAY: "DELAY",
              DUE_SOON: "DUE_SOON",
            };

            // 회사명 표시 함수
            const getCompanyDisplay = (
              companies: { companyName: string }[] = []
            ) => {
              if (
                !companies ||
                !Array.isArray(companies) ||
                companies.length === 0
              )
                return "미지정";
              if (companies.length === 1)
                return companies[0]?.companyName || "미지정";
              return `${companies[0]?.companyName || "미지정"} 외 ${
                companies.length - 1
              }`;
            };

            const convertedProject = {
              id: project.projectId,
              name: project.name,
              clientCompanies: getCompanyDisplay(project.assignClientCompanies),
              devCompanies: getCompanyDisplay(project.assignDevCompanies),
              projectStatus: statusMapping[project.projectStatus],
              startDate: project.startDate,
              endDate: project.endDate,
              progress: project.progress,
            };

            return convertedProject;
          }
        );

        setFilteredProjects(convertedProjects);
        setTotalPages(response.data.page.totalPages);
        setTotalElements(response.data.page.totalElements);
      }
    } catch (err) {
      setError("프로젝트 검색에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 페이지 변경 시 필터 조건에 따라 fetchProjects 또는 searchProjects 호출
  useEffect(() => {
    const hasSearchConditions =
      filters.keyword ||
      filters.projectStatus ||
      filters.startDate ||
      filters.endDate ||
      filters.category;
    if (hasSearchConditions) {
      searchProjects(currentPage - 1);
    } else {
      fetchProjects(currentPage - 1);
    }
  }, [currentPage]);

  const handleInputChange = (field: string, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [field]: value };

      // 시작일 변경 로직에서 바로 endDate도 세팅
      if (
        field === "startDate" &&
        newFilters.endDate &&
        value > newFilters.endDate
      ) {
        newFilters.endDate = "";
      }
      // 필터 선택 시 콘솔 출력
      console.log("[필터 선택]", field, value, "전체 필터:", newFilters);
      return newFilters;
    });
  };

  const handleSearch = () => {
    // 검색 조건이 있으면 검색 API 사용, 없으면 초기 로딩
    const hasSearchConditions =
      filters.keyword ||
      filters.projectStatus ||
      filters.startDate ||
      filters.endDate ||
      filters.category;

    // 검색 버튼 클릭 시 현재 필터 콘솔 출력
    console.log("[검색 버튼 클릭] 현재 필터:", filters);
    if (hasSearchConditions) {
      searchProjects(0); // 검색 시 첫 페이지부터
    } else {
      fetchProjects(0); // 검색 조건 없으면 초기 로딩
    }
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({
      projectStatus: "",
      sort: "latest",
      startDate: "",
      endDate: "",
      keyword: "",
      category: "nameProject",
    });
    fetchProjects(0); // 초기화 시 기본 API 사용
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 페이지 번호 배열 생성 (최대 5개)
  const getPageNumbers = () => {
    const pageNumbers: (number | null)[] = [];
    const maxPages = 5;

    if (totalPages <= maxPages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      // 남은 공간을 null로 채워 5개 너비 유지
      while (pageNumbers.length < maxPages) {
        pageNumbers.push(null);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
      let endPage = startPage + maxPages - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = endPage - maxPages + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
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
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div>
          <Title>프로젝트 목록</Title>
          <Description>
            프로젝트 관리 시스템의 주요 정보를 한눈에 확인하세요
          </Description>
        </div>
        {role === "ROLE_ADMIN" && (
          <SubmitButton
            style={{ minWidth: 140, fontSize: 16, marginLeft: "auto" }}
            onClick={() => setShowCreateModal(true)}
          >
            프로젝트 등록
          </SubmitButton>
        )}
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
            {getPageNumbers().map((pageNum, index) =>
              pageNum !== null ? (
                <PaginationButton
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  $active={currentPage === pageNum}
                >
                  {pageNum}
                </PaginationButton>
              ) : (
                <PaginationButton
                  key={`empty-${index}`}
                  disabled
                  style={{ visibility: "hidden", cursor: "default" }}
                />
              )
            )}
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
