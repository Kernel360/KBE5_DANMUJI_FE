import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api/axios";
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
  CurrentPageButton,
} from "./AdminProjectPage.styled";

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

export default function UserProjectPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState({
    size: 10,
    number: 0,
    totalElements: 0,
    totalPages: 1,
  });

  const { user, refreshUser } = useAuth();

  useEffect(() => {
    if (!user) refreshUser();
  }, [user, refreshUser]);

  const fetchProjects = useCallback(
    async (keyword: string, pageNum: number) => {
      if (!user?.id) return;

      const trimmed = keyword.trim();
      const url = trimmed
        ? `/api/projects/search?keyword=${encodeURIComponent(trimmed)}&page=${pageNum}`
        : `/api/projects/${user.id}/user?page=${pageNum}`;

      try {
        const response = await api.get(url);
        const payload = response.data.data;

        setProjects(Array.isArray(payload.content) ? payload.content : []);
        setPage({
          size: payload.page.size,
          number: payload.page.number,
          totalElements: payload.page.totalElements,
          totalPages: payload.page.totalPages,
        });
      } catch (err) {
        console.error("Failed to load user projects", err);
      }
    },
    [user?.id]
  );

  // 프로젝트 목록 가져오기
  useEffect(() => {
    if (user?.id) {
      fetchProjects(search, page.number);
    }
  }, [user?.id, page.number, search, fetchProjects]);

  const handleSearch = () => {
    setPage((prev) => ({ ...prev, number: 0 }));
  };

  const handlePageChange = (newPage: number) => {
    setPage((prev) => ({ ...prev, number: newPage }));
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
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          <Button primary onClick={handleSearch}>
            검색
          </Button>
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
                <TableCell>{index + 1 + page.number * page.size}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>
                  <StatusBadge color={p.statusColor}>{p.status}</StatusBadge>
                </TableCell>
                <TableCell>{p.clientCompany || "미지정"}</TableCell>
                <TableCell>{p.developerCompany || "미지정"}</TableCell>
                <TableCell>{p.startDate}</TableCell>
                <TableCell>{p.endDate}</TableCell>
                <TableCell>
                  <Button onClick={() => navigate(`/projects/${p.id}/detail`)}>
                    상세 보기
                  </Button>
                  <Button primary onClick={() => navigate(`/projects/${p.id}/edit`)}>
                    수정
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <PaginationContainer>
          <PaginationNav>
            <PaginationButton
              disabled={page.number === 0}
              onClick={() => handlePageChange(page.number - 1)}
            >
              {"<"}
            </PaginationButton>

            {Array.from({ length: page.totalPages }, (_, i) =>
              i === page.number ? (
                <CurrentPageButton key={i}>{i + 1}</CurrentPageButton>
              ) : (
                <PaginationButton key={i} onClick={() => handlePageChange(i)}>
                  {i + 1}
                </PaginationButton>
              )
            )}

            <PaginationButton
              disabled={page.number + 1 >= page.totalPages}
              onClick={() => handlePageChange(page.number + 1)}
            >
              {">"}
            </PaginationButton>
          </PaginationNav>
        </PaginationContainer>
      </Main>
    </Layout>
  );
}
