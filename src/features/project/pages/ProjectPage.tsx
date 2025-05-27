import { useState } from "react";
import ProjectRegisterModal from "../components/ProjectRegisterModal";
import ProjectEditModal from "../components/ProjectEditModal";
import styled from "styled-components";

const PageContainer = styled.div``;

const Header = styled.div`
  margin-bottom: 1.5rem; /* mb-6 */
`;

const Title = styled.div`
  font-size: 1.875rem; /* text-3xl */
  font-weight: 800; /* font-extrabold */
  color: #1f2937; /* text-gray-800 */
  margin-bottom: 0.25rem; /* mb-1 */
`;

const Description = styled.div`
  color: #6b7280; /* text-gray-500 */
  font-size: 1rem; /* text-base */
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem; /* mb-4 */
  gap: 0.5rem; /* gap-2 */
`;

const SearchInput = styled.input`
  border: 1px solid #d1d5db; /* border */
  border-radius: 0.25rem; /* rounded */
  padding: 0.5rem 0.75rem; /* px-3 py-2 */
  width: 16rem; /* w-64 */
  font-size: 0.875rem; /* text-sm */

  &:focus {
    outline: none;
  }
`;

const RegisterButton = styled.button`
  margin-left: auto; /* ml-auto */
  background-color: #3b82f6; /* bg-blue-500 */
  color: white; /* text-white */
  padding: 0.5rem 1rem; /* px-4 py-2 */
  border-radius: 0.25rem; /* rounded */
  font-size: 0.875rem; /* text-sm */
  font-weight: 600; /* font-semibold */
  cursor: pointer;

  &:hover {
    background-color: #2563eb; /* hover:bg-blue-600 */
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); /* shadow */
  background-color: white; /* bg-white */
`;

const Table = styled.table`
  min-width: 100%;
  font-size: 0.875rem; /* text-sm */
  text-align: left;
`;

const TableHead = styled.thead`
  background-color: #f9fafb; /* bg-gray-50 */
  border-bottom: 1px solid #e5e7eb; /* border-b */
`;

const TableHeader = styled.th`
  padding: 0.5rem 1rem; /* px-4 py-2 */
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb; /* border-b */

  &:last-child {
    border-bottom: none; /* last:border-b-0 */
  }
`;

const TableCell = styled.td`
  padding: 0.5rem 1rem; /* px-4 py-2 */
`;

const StatusSpan = styled.span<{ $status: string }>`
  font-weight: 700; /* font-bold */
  ${(props) => {
    if (props.$status === "진행중")
      return "color: #10b981; /* text-green-600 */";
    if (props.$status === "대기")
      return "color: #f59e0b; /* text-yellow-600 */";
    return "color: #9ca3af; /* text-gray-400 */";
  }}
`;

const ActionCell = styled(TableCell)`
  display: flex;
  gap: 0.5rem; /* gap-2 */
`;

const ActionButton = styled.button<{ $variant?: "edit" | "delete" }>`
  padding: 0.25rem 0.5rem; /* px-2 py-1 */
  border-radius: 0.25rem; /* rounded */
  font-size: 0.75rem; /* text-xs */
  cursor: pointer;

  ${(props) =>
    props.$variant === "delete"
      ? `
    background-color: #fee2e2; /* bg-red-100 */
    color: #ef4444; /* text-red-500 */

    &:hover {
      background-color: #fecaca; /* hover:bg-red-200 */
    }
  `
      : `
    background-color: #e5e7eb; /* bg-gray-200 */
    color: #374151; /* text-gray-700 */

    &:hover {
      background-color: #d1d5db; /* hover:bg-gray-300 */
    }
  `}
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center; /* justify-center */
  margin-top: 1.5rem; /* mt-6 */
`;

const PaginationNav = styled.nav`
  display: inline-flex;
  -space-x-px: 0;
`;

const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 0.25rem 0.75rem; /* px-3 py-1 */
  border: 1px solid #d1d5db; /* border */
  background-color: white; /* bg-white */
  color: #6b7280; /* text-gray-500 */
  cursor: pointer;

  &:hover {
    background-color: #f9fafb; /* hover:bg-gray-100 */
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:first-child {
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
  }

  &:last-child {
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }

  ${(props) =>
    props.$active &&
    `
    background-color: #eff6ff; /* bg-blue-50 */
    color: #2563eb; /* text-blue-600 */
    font-weight: 700; /* font-bold */
    border-color: #2563eb; /* border-blue-600 */
    z-index: 1; /* Ensure active button is on top of borders */
  `}
`;

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
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = projects.filter((p: Project) => p.name.includes(search));

  const handleRegister = (data: RegisterData) => {
    setProjects([
      ...projects,
      {
        id: projects.length + 1,
        name: data.name,
        client: data.client,
        clientManagers: data.clientManagers,
        dev: data.dev,
        devManagers: data.devManagers,
        start: data.start,
        end: data.end,
        status: data.status,
      },
    ]);
    setModalOpen(false);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject({
      ...project,
      clientManagers: project.clientManagers || [],
      devManagers: project.devManagers || [],
    });
    setEditModalOpen(true);
  };

  const handleEditSave = (data: RegisterData) => {
    if (!selectedProject) return;
    setProjects(
      projects.map((p) => (p.id === selectedProject.id ? { ...p, ...data } : p))
    );
    setEditModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <PageContainer>
      <Header>
        <Title>프로젝트 관리</Title>
        <Description>
          프로젝트 현황을 한눈에 확인하고 관리할 수 있습니다
        </Description>
      </Header>
      <Toolbar>
        <SearchInput
          type="text"
          placeholder="프로젝트명 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <RegisterButton onClick={() => setModalOpen(true)}>
          프로젝트 등록
        </RegisterButton>
      </Toolbar>
      <TableContainer>
        <Table>
          <TableHead>
            <tr>
              <TableHeader>번호</TableHeader>
              <TableHeader>프로젝트명</TableHeader>
              <TableHeader>고객사</TableHeader>
              <TableHeader>고객사 담당자</TableHeader>
              <TableHeader>개발사</TableHeader>
              <TableHeader>개발사 담당자</TableHeader>
              <TableHeader>시작일</TableHeader>
              <TableHeader>종료일</TableHeader>
              <TableHeader>상태</TableHeader>
              <TableHeader>관리</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {filtered.map((p: Project, idx: number) => (
              <TableRow key={p.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.client}</TableCell>
                <TableCell>
                  {p.clientManagers?.map((m) => m.label).join(", ")}
                </TableCell>
                <TableCell>{p.dev}</TableCell>
                <TableCell>
                  {p.devManagers?.map((m) => m.label).join(", ")}
                </TableCell>
                <TableCell>{p.start}</TableCell>
                <TableCell>{p.end}</TableCell>
                <TableCell>
                  <StatusSpan $status={p.status}>{p.status}</StatusSpan>
                </TableCell>
                <ActionCell>
                  <ActionButton $variant="edit" onClick={() => handleEdit(p)}>
                    수정
                  </ActionButton>
                  <ActionButton $variant="delete">삭제</ActionButton>
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
          <PaginationButton disabled>{">"}</PaginationButton>
        </PaginationNav>
      </PaginationContainer>
      <ProjectRegisterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleRegister}
      />
      <ProjectEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleEditSave}
        project={selectedProject!}
      />
    </PageContainer>
  );
}
