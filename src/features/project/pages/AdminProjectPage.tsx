import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
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
    PaginationContainer,
    PaginationNav,
    PaginationButton,
    CurrentPageButton
  } from './AdminProjectPage.styled';

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
  // 초기 page 상태에 size, number, totalElements, totalPages 모두 정의
  const [page, setPage] = useState<{
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  }>({ size: 10, number: 0, totalElements: 0, totalPages: 1 });

  // 통합 페칭 함수 (페이지네이션 포함)
  const fetchProjects = async(keyword: string = "", pageNum: number = 0) => {
    const trimmed = keyword.trim();
    const url = trimmed
      ? `/api/projects/search?keyword=${encodeURIComponent(trimmed)}&page=${pageNum}`
      : `/api/projects?page=${pageNum}`;

    try {
      const response = await api.get(url);
      // ApiResponse.data 아래에 { content: Project[], page: PageMeta }
      const payload = response.data.data;
      // 실제 리스트
      const list: Project[] = Array.isArray(payload.content)
        ? payload.content
        : [];
      setProjects(list);
      console.log(list);
      // 페이징 메타 전체를 반영
      setPage({
        size: payload.page.size,
        number: payload.page.number,
        totalElements: payload.page.totalElements,
        totalPages: payload.page.totalPages
      });
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  };

  // 마운트 시 전체 로드
  useEffect(() => {
    fetchProjects(search, page.number);
  }, [page.number]); // page.number가 바뀔 때마다 호출

  // 검색 버튼 클릭 시
  const handleSearch = () => {
    // 검색 시 페이지 번호를 0으로 초기화
    setPage(prev => ({ ...prev, number: 0 }));
    fetchProjects(search, 0);
  };

  // search가 빈 문자열로 바뀌면 자동으로 전체 로드
  useEffect(() => {
    if (search.trim() === "") {
      setPage({ ...page, number: 0 });
      fetchProjects("", 0);
    }
  }, [search]);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setPage({ ...page, number: newPage });
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
            placeholder="프로젝트명으로 검색"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          <Button onClick={handleSearch}>검색</Button>
          <Button onClick={() => navigate('/projects/create')}>프로젝트 등록</Button>
        </SearchBar>

        {projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', fontSize: '1.2rem' }}>
            프로젝트가 없습니다.
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>번호</TableCell>
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
              {projects.map((p, index) => (
                <TableRow key={p.id}>
                  <TableCell>{index + 1 + page.number * page.size}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>
                    <StatusBadge color={p.statusColor}>{p.status}</StatusBadge>
                  </TableCell>
                  <TableCell>{p.clientCompany || "-"}</TableCell>
                  <TableCell>{p.developerCompany || "-"}</TableCell>
                  <TableCell>{p.startDate}</TableCell>
                  <TableCell>{p.endDate}</TableCell>
                  <TableCell>
                    <Button onClick={() => navigate(`/projects/${p.id}/detail`)}>상세 보기</Button>
                    <Button onClick={() => navigate(`/projects/${p.id}/edit`)}>수정</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* 페이지네이션 */}
        <PaginationContainer>
          <PaginationNav>
            <PaginationButton
              disabled={page.number === 0}
              onClick={() => handlePageChange(page.number - 1)}
            >
              {'<'}
            </PaginationButton>

            {Array.from({ length: page.totalPages }, (_, idx) => (
              idx === page.number ? (
                <CurrentPageButton key={idx}>{idx + 1}</CurrentPageButton>
              ) : (
                <PaginationButton key={idx} onClick={() => handlePageChange(idx)}>
                  {idx + 1}
                </PaginationButton>
              )
            ))}

            <PaginationButton
              disabled={page.number + 1 >= page.totalPages}
              onClick={() => handlePageChange(page.number + 1)}
            >
              {'>'}
            </PaginationButton>
          </PaginationNav>
        </PaginationContainer>
      </Main>
    </Layout>
  );
}