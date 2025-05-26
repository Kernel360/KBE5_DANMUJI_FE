import { NavLink } from 'react-router-dom';

const menu = [
  { name: '대시보드', path: '/dashboard', icon: '/src/assets/dashboard.svg' },
  { name: '회사 관리', path: '/company', icon: '/src/assets/company.svg' },
  { name: '회원 관리', path: '/members', icon: '/src/assets/member.svg' },
  { name: '프로젝트 관리', path: '/projects', icon: '/src/assets/project.svg' },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-white shadow h-full flex flex-col">
      <div className="flex flex-col items-center gap-2 p-4 pt-6 pb-2">
        <img src="/src/assets/danmuji-logo.png" alt="Danmuji Logo" className="h-12 w-auto mb-2" />
        <div className="flex flex-col items-center mt-4 mb-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 mb-1">김</div>
          <div className="text-sm font-semibold text-gray-800">김관리자</div>
          <div className="text-xs text-gray-400">관리자</div>
        </div>
      </div>
      <nav className="flex-1 flex flex-col gap-2 p-4">
        {menu.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded font-medium ${
                isActive ? 'bg-[#FFC10A] text-white' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <img src={item.icon} alt="" className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
} 