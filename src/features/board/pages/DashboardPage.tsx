import React from "react";
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
} from "./DashboardPage.styled";
import { AiOutlineSearch } from "react-icons/ai";
import { useState } from "react";

interface Project {
  id: number;
  name: string;
  company: string;
  status: string;
  stage: string;
  startDate: string;
  endDate: string;
  progress: number;
}

// Mock Data (추후 API 연동 필요)
const mockProjects: Project[] = [
  {
    id: 1,
    name: "프로젝트 1",
    company: "고객사 A",
    status: "진행 중",
    stage: "설계",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    progress: 60,
  },
  {
    id: 2,
    name: "프로젝트 2",
    company: "개발사 B",
    status: "완료",
    stage: "완료",
    startDate: "2022-05-15",
    endDate: "2022-11-30",
    progress: 100,
  },
  // ... more mock data
];

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("ko-KR", options);
};

export default function DashboardPage() {
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const filteredProjects = mockProjects.filter((project) => {
    const matchesFilter = filter === "all" || project.stage === filter;
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination logic (simple example)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (post: any) => {
    // TODO: Implement edit functionality
    console.log("Edit:", post);
  };

  const handleDelete = (post: any) => {
    // TODO: Implement delete functionality
    console.log("Delete:", post);
  };

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
          $active={filter === "요구분석"}
          onClick={() => setFilter("요구분석")}
        >
          요구분석
        </TopFilterOption>
        <TopFilterOption
          $active={filter === "설계"}
          onClick={() => setFilter("설계")}
        >
          설계
        </TopFilterOption>
        <TopFilterOption
          $active={filter === "진행"}
          onClick={() => setFilter("진행")}
        >
          진행
        </TopFilterOption>
        <TopFilterOption
          $active={filter === "완료"}
          onClick={() => setFilter("완료")}
        >
          완료
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
        {/* TODO: 프로젝트 추가 버튼 */}
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
              <TableHeader $align="center">진행률</TableHeader>
              {/* TODO: 작업 항목 추가 */}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <span>{project.name}</span>
                  {/* TODO: Link to project detail page */}
                </TableCell>
                <TableCell>
                  <span>{project.company}</span>
                </TableCell>
                <TableCell $align="center">{project.status}</TableCell>
                <TableCell $align="center">
                  <StageBadge $stage={project.stage}>
                    {project.stage}
                  </StageBadge>
                </TableCell>
                <TableCell $align="center">
                  {formatDate(project.startDate)}
                </TableCell>
                <TableCell $align="center">
                  {formatDate(project.endDate)}
                </TableCell>
                <TableCell $align="center">{project.progress}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationContainer>
        <PaginationNav>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationButton
              key={index + 1}
              $active={currentPage === index + 1}
              onClick={() => handlePageChange(index + 1)}
              disabled={currentPage === index + 1}
            >
              {index + 1}
            </PaginationButton>
          ))}
        </PaginationNav>
      </PaginationContainer>
    </PageContainer>
  );
}
