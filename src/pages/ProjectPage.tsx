<<<<<<< HEAD
import { useState } from 'react';
import ProjectRegisterModal from '../components/ProjectRegisterModal';
import ProjectEditModal from '../components/ProjectEditModal';

interface Project {
  id: number;
  name: string;
  client: string;
  clientManagers?: { value: string; label: string }[];
  dev: string;
  devManagers?: { value: string; label: string }[];
  start: string;
  end: string;
  status: string;
}

const initialProjects: Project[] = [
  { id: 1, name: '신규 웹사이트 구축', client: 'ABC', clientManagers: [{ value: 'hong', label: '홍길동' }], dev: 'DEF', devManagers: [{ value: 'kim', label: '김철수' }], start: '2024-06-01', end: '2024-08-31', status: '진행중' },
  { id: 2, name: '모바일 앱 개발', client: 'DEF', clientManagers: [{ value: 'kim', label: '김철수' }], dev: 'GHI', devManagers: [{ value: 'park', label: '박영희' }], start: '2024-05-15', end: '2024-07-30', status: '대기' },
  { id: 3, name: 'ERP 시스템 개선', client: 'GHI', clientManagers: [{ value: 'park', label: '박영희' }], dev: 'ABC', devManagers: [{ value: 'hong', label: '홍길동' }], start: '2024-04-01', end: '2024-06-30', status: '완료' },
];

interface MemberOption {
  value: string;
  label: string;
}

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
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [page, setPage] = useState(1);
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
    setSelectedProject(project);
    setEditModalOpen(true);
  };

  const handleEditSave = (data: RegisterData) => {
    if (!selectedProject) return;
    setProjects(projects.map(p =>
      p.id === selectedProject.id
        ? { ...p, ...data }
        : p
    ));
    setEditModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="text-3xl font-extrabold text-gray-800 mb-1">프로젝트 관리</div>
        <div className="text-gray-500 text-base">프로젝트 현황을 한눈에 확인하고 관리할 수 있습니다</div>
      </div>
      <div className="flex items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="프로젝트명 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64 text-sm focus:outline-none"
        />
        <button
          className="ml-auto bg-blue-500 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-600"
          onClick={() => setModalOpen(true)}
        >
          프로젝트 등록
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-2">번호</th>
              <th className="px-4 py-2">프로젝트명</th>
              <th className="px-4 py-2">고객사</th>
              <th className="px-4 py-2">고객사 담당자</th>
              <th className="px-4 py-2">개발사</th>
              <th className="px-4 py-2">개발사 담당자</th>
              <th className="px-4 py-2">시작일</th>
              <th className="px-4 py-2">종료일</th>
              <th className="px-4 py-2">상태</th>
              <th className="px-4 py-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p: Project, idx: number) => (
              <tr key={p.id} className="border-b last:border-b-0">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.client}</td>
                <td className="px-4 py-2">{p.clientManagers?.map(m => m.label).join(', ')}</td>
                <td className="px-4 py-2">{p.dev}</td>
                <td className="px-4 py-2">{p.devManagers?.map(m => m.label).join(', ')}</td>
                <td className="px-4 py-2">{p.start}</td>
                <td className="px-4 py-2">{p.end}</td>
                <td className="px-4 py-2">
                  <span className={
                    p.status === '진행중' ? 'text-green-600 font-bold' :
                    p.status === '대기' ? 'text-yellow-600 font-bold' :
                    'text-gray-400 font-bold'
                  }>{p.status}</span>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-300" onClick={() => handleEdit(p)}>수정</button>
                  <button className="bg-red-100 text-red-500 px-2 py-1 rounded text-xs hover:bg-red-200">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-6">
        <nav className="inline-flex -space-x-px">
          <button className="px-3 py-1 border rounded-l bg-white text-gray-500 hover:bg-gray-100" disabled>{'<'}</button>
          <button className="px-3 py-1 border-t border-b bg-blue-50 text-blue-600 font-bold">1</button>
          <button className="px-3 py-1 border rounded-r bg-white text-gray-500 hover:bg-gray-100" disabled>{'>'}</button>
        </nav>
      </div>
      <ProjectRegisterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleRegister}
      />
      <ProjectEditModal
        open={editModalOpen}
        onClose={() => { setEditModalOpen(false); setSelectedProject(null); }}
        onSave={handleEditSave}
        project={selectedProject || {
          name: '', client: '', clientManagers: [], dev: '', devManagers: [], start: '', end: '', status: '진행중'
        }}
      />
    </div>
  );
=======
export default function ProjectPage() {
  return <div>프로젝트 관리 페이지</div>;
>>>>>>> b97c2b31261b3c0b870a1107fb1cf2bce356a3be
} 