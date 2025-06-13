import React, { useState, useEffect } from "react";
import {
  PageContainer,
  Header,
  Title,
  Description,
  TopFilters,
  TopFilterOption,
  Toolbar,
  FilterSelect,
  SearchContainer,
  SearchInput,
  SearchIcon,
  TableContainer,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  StageBadge,
  PaginationContainer,
  PaginationNav,
  PaginationButton,
  LoadingContainer,
  ErrorContainer,
} from "./DashboardPage.styled";
import { AiOutlineSearch } from "react-icons/ai";
import api from "@/api/axios";
import { useAuth } from "@/hooks/useAuth";

interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  clientCompany: string;
  developerCompany: string;
  steps: {
    id: number;
    name: string;
    stepOrder: number;
    projectStepStatus: string;
  }[];
}

interface ProjectResponse {
  content: Project[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      if (!user?.id) {
        setError('사용자 정보를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get<ProjectResponse>(`/api/projects/${user.id}/user`, {
          params: {
            page: currentPage,
            size: itemsPerPage,
            sort: 'createdAt,desc'
          }
        });
        
        if (isMounted) {
          if (response.data && Array.isArray(response.data.content)) {
            setProjects(response.data.content);
            setTotalPages(response.data.totalPages);
          } else {
            setError('데이터 형식이 올바르지 않습니다.');
          }
        }
      } catch (err) {
        console.error('프로젝트 데이터를 불러오는데 실패했습니다:', err);
        if (isMounted) {
          setError('프로젝트 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [user?.id, currentPage, itemsPerPage]);

  const filteredProjects = React.useMemo(() => {
    if (!projects) return [];
    return projects.filter((project) => {
      if (!project) return false;
      const matchesFilter = filter === "all" || project.status === filter;
      const matchesSearch =
        project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.clientCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.developerCompany?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [projects, filter, searchTerm]);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(dateString).toLocaleDateString("ko-KR", options);
    } catch (err) {
      console.error('날짜 형식 변환 실패:', err);
      return '-';
    }
  };

  const getStatusBadge = (status: string) => {
    if (!status) return <StageBadge $stage="#6b7280">-</StageBadge>;
    
    const statusMap: Record<string, { label: string; color: string }> = {
      'IN_PROGRESS': { label: '진행중', color: '#3b82f6' },
      'COMPLETED': { label: '완료', color: '#10b981' },
      'PENDING': { label: '대기중', color: '#f59e0b' },
    };
    
    const { label, color } = statusMap[status] || { label: status, color: '#6b7280' };
    return <StageBadge $stage={color}>{label}</StageBadge>;
  };

  if (loading) {
    return (
      <LoadingContainer>
        <div>데이터를 불러오는 중입니다...</div>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <div>{error}</div>
        <button onClick={() => window.location.reload()}>새로고침</button>
      </ErrorContainer>
    );
  }

  if (!filteredProjects.length) {
    return (
      <PageContainer>
        <Header>
          <Title>대시보드</Title>
          <Description>프로젝트 현황을 한 눈에 확인하세요.</Description>
        </Header>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          표시할 프로젝트가 없습니다.
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>대시보드</Title>
        <Description>프로젝트 현황을 한 눈에 확인하세요.</Description>
      </Header>
      <TopFilters>
        필터:{" "}
        <TopFilterOption
          $active={filter === "all"}
          onClick={() => setFilter("all")}
        >
          전체
        </TopFilterOption>
        <TopFilterOption
          $active={filter === "IN_PROGRESS"}
          onClick={() => setFilter("IN_PROGRESS")}
        >
          진행중
        </TopFilterOption>
        <TopFilterOption
          $active={filter === "COMPLETED"}
          onClick={() => setFilter("COMPLETED")}
        >
          완료
        </TopFilterOption>
        <TopFilterOption
          $active={filter === "PENDING"}
          onClick={() => setFilter("PENDING")}
        >
          대기중
        </TopFilterOption>
      </TopFilters>
      <Toolbar>
        <FilterSelect onChange={(e) => setItemsPerPage(Number(e.target.value))}>
          <option value={10}>10개씩 보기</option>
          <option value={20}>20개씩 보기</option>
          <option value={50}>50개씩 보기</option>
        </FilterSelect>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="프로젝트명 또는 고객사 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon />
        </SearchContainer>
      </Toolbar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>프로젝트명</TableHeader>
              <TableHeader>고객사 / 개발사</TableHeader>
              <TableHeader $align="center">진행 상태</TableHeader>
              <TableHeader $align="center">단계</TableHeader>
              <TableHeader $align="center">시작일</TableHeader>
              <TableHeader $align="center">종료일</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <span>{project.name}</span>
                </TableCell>
                <TableCell>
                  <span>{project.clientCompany} / {project.developerCompany}</span>
                </TableCell>
                <TableCell $align="center">
                  {getStatusBadge(project.status)}
                </TableCell>
                <TableCell $align="center">
                  {project.steps[0]?.name || '-'}
                </TableCell>
                <TableCell $align="center">
                  {formatDate(project.startDate)}
                </TableCell>
                <TableCell $align="center">
                  {formatDate(project.endDate)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationContainer>
        <PaginationNav>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationButton
              key={index}
              $active={currentPage === index}
              onClick={() => handlePageChange(index)}
              disabled={currentPage === index}
            >
              {index + 1}
            </PaginationButton>
          ))}
        </PaginationNav>
      </PaginationContainer>
    </PageContainer>
  );
}
