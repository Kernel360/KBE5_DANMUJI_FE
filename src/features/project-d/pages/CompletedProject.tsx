import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
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
  description: string;
  clientCompany: string;
  developCompany: string;
  startDate: string;
  endDate: string;
  projectStatus: string;
  statusColor: string;
}

export default function UserProjectPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState<{
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  }>({ size: 10, number: 0, totalElements: 0, totalPages: 1 });
  const [userId, setUserId] = useState<number | null>(null);

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/api/users/me");
        if (response.data.data) {
          setUserId(response.data.data.id);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // 통합 페칭 함수 (페이지네이션 포함)
  const fetchProjects = async (keyword: string = "", pageNum: number = 0) => {
    if (!userId) return; // userId가 없으면 API 호출하지 않음

    try {
      const trimmed = keyword.trim();
      const url = trimmed
        ? `/api/projects/search?keyword=${encodeURIComponent(trimmed)}&page=${pageNum}`
        : `/api/projects/${userId}/twowaytest?page=${pageNum}`;

      const response = await api.get(url);
      const payload = response.data.data;
      const list: Project[] = Array.isArray(payload.content)
        ? payload.content.filter((project: Project) => project.projectStatus === 'COMPLETED')
        : [];
      setProjects(list);
      setPage({
        size: payload.page.size,
        number: payload.page.number,
        totalElements: payload.page.totalElements,
        totalPages: payload.page.totalPages
      });
      console.log("userId", userId);
      console.log("pagenumber", page.number);
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  };

  // userId가 설정되면 프로젝트 목록 가져오기
  useEffect(() => {
    if (userId) {
      fetchProjects(search, page.number);

    }
  }, [userId, page.number]);

  // 검색 버튼 클릭 시
  const handleSearch = () => {
    setPage({ ...page, number: 0 }); // 검색 시 1페이지로 이동
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
        {/* <Header>
          <div>
            <PageTitle>프로젝트 관리</PageTitle>
            <PageDesc>프로젝트 관리 시스템의 주요 정보를 한눈에 확인하세요</PageDesc>
          </div>
        </Header> */}

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', marginBottom: '20px' }}>
          <PageDesc>프로젝트 관리 시스템의 주요 정보를 한눈에 확인하세요</PageDesc>
        </div>
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
          <Button onClick={handleSearch}>검색</Button>
        </SearchBar>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>번호</TableCell>
              <TableCell>프로젝트명</TableCell>
              <TableCell>고객사</TableCell>
              <TableCell>개발사</TableCell>
              <TableCell>시작일</TableCell>
              <TableCell>종료예정일</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>액션</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((p, index) => (
              <TableRow key={p.id}>
                <TableCell>{index + 1 + page.number * page.size}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.clientCompany || "-"}</TableCell>
                <TableCell>{p.developCompany || "-"}</TableCell>
                <TableCell>{p.startDate}</TableCell>
                <TableCell>{p.endDate}</TableCell>
                <TableCell>
                  <StatusBadge color={p.statusColor}>{p.projectStatus}</StatusBadge>
                </TableCell>
                <TableCell>
                  <Button onClick={() => navigate(`/projects/${p.id}/detail`)}>상세 보기</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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