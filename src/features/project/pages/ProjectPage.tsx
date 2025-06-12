import { useState } from "react";
import ProjectRegisterModal from "../components/ProjectRegisterModal";
import ProjectEditModal from "../components/ProjectEditModal";
import ProjectPostDetailModal from "../components/Post/DetailModal/ProjectPostDetailModal";
import {
  PageContainer,
  Header,
  Title,
  Description,
  Toolbar,
  SearchInput,
  RegisterButton,
  TableContainer,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  StatusSpan,
  ActionCell,
  ActionButton,
  PaginationContainer,
  PaginationNav,
  PaginationButton,
} from "./ProjectPage.styled";

interface MemberOption {
  value: string;
  label: string;
}

interface Project {
  id: number;
  name: string;
  client: string;
  clientManagers: MemberOption[];
  dev: string;
  devManagers: MemberOption[];
  start: string;
  end: string;
  status: string;
}

const initialProjects: Project[] = [
  {
    id: 1,
    name: "신규 웹사이트 구축",
    client: "ABC",
    clientManagers: [{ value: "hong", label: "홍길동" }],
    dev: "DEF",
    devManagers: [{ value: "kim", label: "김철수" }],
    start: "2024-06-01",
    end: "2024-08-31",
    status: "진행중",
  },
  {
    id: 2,
    name: "모바일 앱 개발",
    client: "DEF",
    clientManagers: [{ value: "kim", label: "김철수" }],
    dev: "GHI",
    devManagers: [{ value: "park", label: "박영희" }],
    start: "2024-05-15",
    end: "2024-07-30",
    status: "대기",
  },
  {
    id: 3,
    name: "ERP 시스템 개선",
    client: "GHI",
    clientManagers: [{ value: "park", label: "박영희" }],
    dev: "ABC",
    devManagers: [{ value: "hong", label: "홍길동" }],
    start: "2024-04-01",
    end: "2024-06-30",
    status: "완료",
  },
];

interface RegisterData {
  name: string;
  client: string;
  clientManagers: MemberOption[];
  dev: string;
  devManagers: MemberOption[];
  start: string;
  end: string;
  status: string;
}

export default function ProjectPage() {
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isPostDetailModalOpen, setIsPostDetailModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRegisterClick = () => {
    setIsRegisterModalOpen(true);
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleRegister = (data: RegisterData) => {
    // Dummy registration logic
    console.log("Registering project:", data);
    const newProject: Project = {
      id: projects.length + 1, // Simple ID generation
      ...data,
    };
    setProjects([...projects, newProject]);
    handleCloseRegisterModal();
  };

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProject(null);
  };

  const handleEditSave = (data: RegisterData) => {
    // Dummy edit save logic
    console.log("Saving edited project:", data);
    setProjects(
      projects.map((project) =>
        project.id === selectedProject?.id ? { ...project, ...data } : project
      )
    );
    handleCloseEditModal();
  };

  const handleDeleteClick = (id: number) => {
    // Dummy delete logic
    console.log("Deleting project with id:", id);
    setProjects(projects.filter((project) => project.id !== id));
  };

  // Handler to open the post detail modal
  const handlePostClick = (postId: number) => {
    setSelectedPostId(postId);
    setIsPostDetailModalOpen(true);
  };

  // Handler to close the post detail modal
  const handleClosePostDetailModal = () => {
    setIsPostDetailModalOpen(false);
    setSelectedPostId(null);
  };

  return (
    <PageContainer>
      <Header>
        <Title>프로젝트 관리</Title>
        <Description>프로젝트 목록을 확인하고 관리합니다.</Description>
      </Header>
      <Toolbar>
        <SearchInput
          type="text"
          placeholder="프로젝트 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <RegisterButton onClick={handleRegisterClick}>
          프로젝트 등록
        </RegisterButton>
      </Toolbar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>프로젝트명</TableHeader>
              <TableHeader>고객사</TableHeader>
              <TableHeader>고객사 담당자</TableHeader>
              <TableHeader>개발사</TableHeader>
              <TableHeader>개발사 담당자</TableHeader>
              <TableHeader>시작일</TableHeader>
              <TableHeader>종료일</TableHeader>
              <TableHeader>상태</TableHeader>
              <TableHeader>액션</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.id}</TableCell>
                {/* Make project name clickable to open post detail modal */}
                <TableCell
                  onClick={() => handlePostClick(project.id)}
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  {project.name}
                </TableCell>
                <TableCell>{project.client}</TableCell>
                <TableCell>
                  {project.clientManagers
                    .map((manager) => manager.label)
                    .join(", ")}
                </TableCell>
                <TableCell>{project.dev}</TableCell>
                <TableCell>
                  {project.devManagers
                    .map((manager) => manager.label)
                    .join(", ")}
                </TableCell>
                <TableCell>{project.start}</TableCell>
                <TableCell>{project.end}</TableCell>
                <TableCell>
                  <StatusSpan $status={project.status}>
                    {project.status}
                  </StatusSpan>
                </TableCell>
                <ActionCell>
                  <ActionButton
                    $variant="edit"
                    onClick={() => handleEditClick(project)}
                  >
                    수정
                  </ActionButton>
                  <ActionButton
                    $variant="delete"
                    onClick={() => handleDeleteClick(project.id)}
                  >
                    삭제
                  </ActionButton>
                </ActionCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationContainer>
        <PaginationNav>
          <PaginationButton disabled>{"<"}</PaginationButton>
          <PaginationButton $active>1</PaginationButton>
          <PaginationButton>{"2"}</PaginationButton>
          <PaginationButton>{"3"}</PaginationButton>
          <PaginationButton>{">"}</PaginationButton>
        </PaginationNav>
      </PaginationContainer>
      {isRegisterModalOpen && (
        <ProjectRegisterModal
          open={isRegisterModalOpen}
          onClose={handleCloseRegisterModal}
          onRegister={handleRegister}
        />
      )}
      {isEditModalOpen && selectedProject && (
        <ProjectEditModal
          open={isEditModalOpen}
          project={selectedProject}
          onClose={handleCloseEditModal}
          onSave={handleEditSave}
        />
      )}

      {/* Render the ProjectPostDetailModal */}
      {isPostDetailModalOpen && (
        <ProjectPostDetailModal
          open={isPostDetailModalOpen}
          onClose={handleClosePostDetailModal}
          postId={selectedPostId}
        />
      )}
    </PageContainer>
  );
}
