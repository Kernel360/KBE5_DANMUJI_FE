import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Layout,
    Main,
    Header,
    PageTitle,
    PageDesc,
    SearchBar,
    SearchInput,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    StatusBadge,
    Pagination,
    PaginationBtn
  } from './AdminMainPage.styled';

// API로부터 가져올 Project 타입 (필요 시 추가 필드 정의)
interface Project {
  id: number;
  name: string;
  status: string;
  statusColor: string;
  clientCompany: string;
  developerCompany: string;
  companyType: string;
  devManager: string;
  startDate: string;
  endDate: string;
}

export default function AdminProjectPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 통합 페칭 함수 (페이지네이션 포함)
  const fetchProjects = (keyword: string = "", pageNum: number = 1) => {
    const trimmed = keyword.trim();
    const url = trimmed
      ? `http://localhost:8080/api/projects/search?keyword=${encodeURIComponent(trimmed)}&page=${pageNum - 1}`
      : `http://localhost:8080/api/projects?page=${pageNum - 1}`;

    fetch(url)
      .then(res => res.json())
      .then((response: any) => {
        const payload = response.data ?? response;
        const list: Project[] = Array.isArray(payload.content)
          ? payload.content
          : [];
        setProjects(list);
        setTotalPages(payload.totalPages || 1);
      })
      .catch(err => console.error("Failed to load projects", err));
  };

  // 마운트 시 전체 로드
  useEffect(() => {
    fetchProjects(search, page);
    // eslint-disable-next-line
  }, [page]);

  // 검색 버튼 클릭 시
  const handleSearch = () => {
    setPage(1); // 검색 시 1페이지로 이동
    fetchProjects(search, 1);
  };

  // search가 빈 문자열로 바뀌면 자동으로 전체 로드
  useEffect(() => {
    if (search.trim() === "") {
      setPage(1);
      fetchProjects("", 1);
    }
    // eslint-disable-next-line
  }, [search]);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchProjects(search, newPage);
  };

  return (
    <Layout>
      <Main>
        <Header>
          <div>
            <PageTitle>프로젝트 관리</PageTitle>
            <PageDesc>프로젝트 관리 시스템의 주요 정보를 한눈에 확인하세요</PageDesc>
          </div>
        </Header>

        <SearchBar>
          <SearchInput
            placeholder="프로젝트명, 고객사 또는 담당자로 검색"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          <Button primary onClick={handleSearch}>검색</Button>
          <Button onClick={() => navigate('/projects/create')}>프로젝트 등록</Button>
        </SearchBar>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>프로젝트명</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>고객사</TableCell>
              <TableCell>개발사</TableCell>
              <TableCell>시작일</TableCell>
              <TableCell>종료예정일</TableCell>
              <TableCell>액션</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>
                  <StatusBadge color={p.statusColor}>{p.status}</StatusBadge>
                </TableCell>
                <TableCell>{p.clientCompany}</TableCell>
                <TableCell>{p.developerCompany}</TableCell>
                <TableCell>{p.startDate}</TableCell>
                <TableCell>{p.endDate}</TableCell>
                <TableCell>
                  <Button onClick={() => navigate(`/projects/${p.id}`)}>상세 보기</Button>
                  <Button primary onClick={() => navigate(`/projects/${p.id}/edit`)}>수정</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination>
          <PaginationBtn disabled={page === 1} onClick={() => handlePageChange(page - 1)}>«</PaginationBtn>
          {[...Array(totalPages)].map((_, idx) => (
            <PaginationBtn
              key={idx + 1}
              active={page === idx + 1}
              onClick={() => handlePageChange(idx + 1)}
            >
              {idx + 1}
            </PaginationBtn>
          ))}
          <PaginationBtn disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>»</PaginationBtn>
        </Pagination>
      </Main>
    </Layout>
  );
}