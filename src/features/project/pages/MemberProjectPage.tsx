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

// API로부터 가져올 Project 타입
interface Project {
  id: number;
  name: string;
  description: string;
  clientCompany: string;
  developCompany: string;
  startDate: string;
  endDate: string;
  projectStatus: string;
}

export default function MemberProjectPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [page, setPage] = useState<{
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  }>({ size: 10, number: 0, totalElements: 0, totalPages: 1 });

  // 사용자 ID 가져오기
  const fetchUserId = async () => {
    try {
      const response = await api.get('/api/users/me');
      setUserId(response.data.data.id);
    } catch (err) {
      console.error("Failed to load user ID", err);
    }
  };

  // 프로젝트 목록 가져오기
  const fetchProjects = async (keyword: string = "", pageNum: number = 0) => {
    if (!userId) return;

    const trimmed = keyword.trim();
    const url = `/api/projects/${userId}/twowaytest?page=${pageNum}`;

    try {
      const response = await api.get(url);
      const payload = response.data.data;
      const list: Project[] = Array.isArray(payload.content)
        ? payload.content
        : [];
      setProjects(list);
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

  // 프로젝트 상태 변경
  const handleStatusChange = async (projectId: number) => {
    try {
      await api.put(`/api/projects/${projectId}/status`);
      // 상태 변경 후 프로젝트 목록 새로고침
      fetchProjects(search, page.number);
    } catch (err) {
      console.error("Failed to change project status:", err);
      alert("프로젝트 상태 변경에 실패했습니다.");
    }
  };

  // 마운트 시 사용자 ID와 프로젝트 로드
  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchProjects(search, page.number);
    }
  }, [userId, page.number]);

  // 검색 버튼 클릭 시
  const handleSearch = () => {
    setPage(prev => ({ ...prev, number: 0 }));
    fetchProjects(search, 0);
  };

  // search가 빈 문자열로 바뀌면 자동으로 전체 로드
  useEffect(() => {
    if (search.trim() === "" && userId) {
      setPage({ ...page, number: 0 });
      fetchProjects("", 0);
    }
  }, [search, userId]);

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
            <PageTitle>내 프로젝트</PageTitle>
            <PageDesc>내가 참여한 프로젝트 목록을 확인하세요</PageDesc>
          </div>
        </Header> */}

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', marginBottom: '20px' }}>
          <PageDesc>프로젝트 관리 시스템의 주요 정보를 한눈에 확인하세요</PageDesc>
        </div>
        
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
                <TableCell>설명</TableCell>
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
                  <TableCell>{p.description}</TableCell>
                  <TableCell>{p.clientCompany || "-"}</TableCell>
                  <TableCell>{p.developCompany || "-"}</TableCell>
                  <TableCell>{p.startDate}</TableCell>
                  <TableCell>{p.endDate}</TableCell>
                  <TableCell>
                    <StatusBadge color={p.projectStatus === 'ACTIVE' ? 'green' : 'gray'}>
                      {p.projectStatus}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => navigate(`/projects/${p.id}/detail`)}>상세 보기</Button>
                    <Button
                      onClick={() => handleStatusChange(p.id)}
                      style={{ marginLeft: '8px' }}
                    >
                      상태 변경
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

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