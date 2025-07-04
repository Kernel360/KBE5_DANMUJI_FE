import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  status: string;
  statusColor: string;
  clientCompany: string;
  developerCompany: string;
  companyType: string;
  devManager: string;
  startDate: string;
  endDate: string;
}


// memberProjectPage로 대체 할 듯.
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
  const fetchProjects = async (keyword = "", pageNum = 0) => {
    if (userId === null) return;
    const trimmed = keyword.trim();
    const url = trimmed
      ? `/api/projects/search?keyword=${encodeURIComponent(trimmed)}&page=${pageNum}`
      : `/api/projects/${userId}/user?page=${pageNum}`;

    try {
      const response = await api.get(url);
      const payload = response.data.data;

      // 프로젝트 리스트 설정
      setProjects(Array.isArray(payload.content) ? payload.content : []);

      // 페이지 메타 전체 설정
      setPage({
        size: payload.page.size,
        number: payload.page.number,
        totalElements: payload.page.totalElements,
        totalPages: payload.page.totalPages,
      });
    } catch (err) {
      console.error("Failed to load user projects", err);
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
        </SearchBar>

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
                <TableCell>{index + 1}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>
                  <StatusBadge color={p.statusColor}>{p.status}</StatusBadge>
                </TableCell>
                <TableCell>{p.clientCompany || "미지정"}</TableCell>
                <TableCell>{p.developerCompany || "미지정"}</TableCell>
                <TableCell>{p.startDate}</TableCell>
                <TableCell>{p.endDate}</TableCell>
                <TableCell>
                  <Button onClick={() => navigate(`/projects/${p.id}/detail`)}>상세 보기</Button>
                  <Button primary onClick={() => navigate(`/projects/${p.id}/edit`)}>수정</Button>
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

            {Array.from({ length: page.totalPages }, (_, i) => (
              i === page.number ? (
                <CurrentPageButton key={i}>{i + 1}</CurrentPageButton>
              ) : (
                <PaginationButton key={i} onClick={() => handlePageChange(i)}>
                  {i + 1}
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