import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import api from "@/api/axios";
import {
  Layout,
  Main,
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
  const [page, setPage] = useState({
    size: 10,
    number: 0,
    totalElements: 0,
    totalPages: 1,
  });

  const { user, refreshUser } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    if (!user) {
      refreshUser();
    }
  }, [user, refreshUser]);

  const fetchProjects = useCallback(
    async (keyword = "", pageNum = 0) => {
      if (!userId) return;

      try {
        const trimmed = keyword.trim();
        const url = trimmed
          ? `/api/projects/search?keyword=${encodeURIComponent(trimmed)}&page=${pageNum}`
          : `/api/projects/${userId}/twowaytest?page=${pageNum}`;

        const response = await api.get(url);
        const payload = response.data.data;

        const list: Project[] = Array.isArray(payload.content) ? payload.content : [];

        setProjects(list);
        setPage({
          size: payload.page.size,
          number: payload.page.number,
          totalElements: payload.page.totalElements,
          totalPages: payload.page.totalPages,
        });
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    },
    [userId]
  );

  useEffect(() => {
    if (userId) {
      fetchProjects(search, page.number);
    }
  }, [userId, page.number, search, fetchProjects]);

  useEffect(() => {
    if (search.trim() === "") {
      setPage((prev) => ({ ...prev, number: 0 }));
      fetchProjects("", 0);
    }
  }, [search, fetchProjects]);

  const handleSearch = () => {
    setPage((prev) => ({ ...prev, number: 0 }));
    fetchProjects(search, 0);
  };

  const handlePageChange = (newPage: number) => {
    setPage((prev) => ({ ...prev, number: newPage }));
  };

  return (
    <Layout>
      <Main>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <PageDesc>프로젝트 관리 시스템의 주요 정보를 한눈에 확인하세요</PageDesc>
        </div>

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
                  <Button onClick={() => navigate(`/projects/${p.id}/detail`)}>
                    상세 보기
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

            {Array.from({ length: page.totalPages }, (_, idx) =>
              idx === page.number ? (
                <CurrentPageButton key={idx}>{idx + 1}</CurrentPageButton>
              ) : (
                <PaginationButton key={idx} onClick={() => handlePageChange(idx)}>
                  {idx + 1}
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
