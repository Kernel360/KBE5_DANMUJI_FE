import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Layout,
    Sidebar,
    Logo,
    Menu,
    MenuItem,
    UserProfile,
    Main,
    Header,
    PageTitle,
    PageDesc,
    SearchBar,
    SearchInput,
    Button,
    CardGrid,
    ProjectCard,
    CardTitle,
    StatusBadge,
    CardRow,
    CardLabel,
    CardActions,
    CardButton,
    Pagination,
    PaginationBtn
  } from './AdminMainPage.styled';


// API로부터 가져올 Project 타입 (필요 시 추가 필드 정의)
interface Project {
  id: number;
  name: string;
  status: string;
  statusColor: string;
  client: string;
  clientManager: string;
  devManager: string;
  start: string;
  end: string;
}

export default function AdminProjectPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(1);

   // 1) 통합 페칭 함수
   const fetchProjects = (keyword: string = "") => {
    const trimmed = keyword.trim();
    const url = trimmed
      ? `http://localhost:8080/api/projects/search?keyword=${encodeURIComponent(trimmed)}`
      : "http://localhost:8080/api/projects";

    fetch(url)
      .then(res => res.json())
      .then((response: any) => {
        const payload = response.data ?? response;
        const list: Project[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.content)
            ? payload.content
            : [];
        setProjects(list);
      })
      .catch(err => console.error("Failed to load projects", err));
  };

  // 2) 마운트 시 전체 로드
  useEffect(() => {
    fetchProjects();
  }, []);

  // 3) 검색 버튼 클릭 시
  const handleSearch = () => {
    fetchProjects(search);
  };

  // 4) search가 빈 문자열로 바뀌면 자동으로 전체 로드
  useEffect(() => {
    if (search.trim() === "") {
      fetchProjects();
    }
  }, [search]);


  return (
    <Layout>
      <Sidebar>
        <Logo>Danmuji</Logo>
        <Menu>
          <MenuItem>대시보드</MenuItem>
          <MenuItem>회사 관리</MenuItem>
          <MenuItem active>프로젝트 관리</MenuItem>
          <MenuItem>회원 관리</MenuItem>
        </Menu>
        <UserProfile>
          김관리자<br /><span style={{fontSize:'0.9em',color:'#1f2937'}}>관리자</span>
        </UserProfile>
      </Sidebar>
      <Main>
        <Header>
          <div>
            <PageTitle>프로젝트 관리</PageTitle>
            <PageDesc>프로젝트 관리 시스템의 주요 정보를 한눈에 확인하세요</PageDesc>
          </div>
          <div>🔔 <b>김관리자</b> ▼</div>
        </Header>

        <SearchBar>
          <SearchInput
            placeholder="프로젝트명, 고객사 또는 담당자로 검색"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Button primary onClick={handleSearch}>검색</Button>
          <Button onClick={() => navigate('/projects/create')}>프로젝트 등록</Button>
        </SearchBar>

        <CardGrid>
          {projects.map((p) => (
            <ProjectCard key={p.id}>
              <CardTitle>{p.name}</CardTitle>
              <StatusBadge color={p.statusColor}>{p.status}</StatusBadge>
              <CardRow><CardLabel>고객사</CardLabel>{p.client}</CardRow>
              <CardRow><CardLabel>고객 담당자</CardLabel>{p.clientManager}</CardRow>
              <CardRow><CardLabel>개발 담당자</CardLabel>{p.devManager}</CardRow>
              <CardRow><CardLabel>시작일</CardLabel>{p.start}</CardRow>
              <CardRow><CardLabel>종료예정일</CardLabel>{p.end}</CardRow>
              <CardActions>
                <CardButton onClick={() => navigate(`/projects/${p.id}`)}>상세 보기</CardButton>
                <CardButton primary onClick={() => navigate(`/projects/${p.id}/edit`)}>수정</CardButton>
              </CardActions>
            </ProjectCard>
          ))}
        </CardGrid>

        <Pagination>
          <PaginationBtn disabled={page===1} onClick={()=>setPage(page-1)}>«</PaginationBtn>
          {/* 페이지네이션 로직 필요 시 추가 구현 */}
          <PaginationBtn onClick={()=>navigate(`/projects?page=${page+1}`)}>»</PaginationBtn>
        </Pagination>
      </Main>
    </Layout>
  );
}