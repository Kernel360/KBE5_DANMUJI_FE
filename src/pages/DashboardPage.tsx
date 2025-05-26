<<<<<<< HEAD
const summary = [
  { label: '전체 회사', value: 12, icon: '/src/assets/company.svg', color: 'bg-yellow-100', iconColor: 'text-yellow-500' },
  { label: '전체 회원', value: 34, icon: '/src/assets/member.svg', color: 'bg-blue-100', iconColor: 'text-blue-500' },
  { label: '전체 프로젝트', value: 7, icon: '/src/assets/project.svg', color: 'bg-green-100', iconColor: 'text-green-500' },
];

const recentCompanies = [
  { name: 'ABC 주식회사', date: '2024-06-01' },
  { name: 'DEF 테크놀로지', date: '2024-05-28' },
];
const recentMembers = [
  { name: '홍길동', date: '2024-06-02' },
  { name: '김철수', date: '2024-05-30' },
];
const recentProjects = [
  { name: '신규 웹사이트 구축', date: '2024-06-03' },
  { name: '모바일 앱 개발', date: '2024-05-29' },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="text-3xl font-extrabold text-gray-800 mb-1">대시보드</div>
        <div className="text-gray-500 text-base">관리자용 프로젝트 관리 시스템 현황을 한눈에 확인하세요</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {summary.map(card => (
          <div key={card.label} className={`flex items-center gap-4 p-6 rounded-xl shadow ${card.color}`}>
            <div className={`rounded-full p-3 ${card.iconColor} bg-white/80`}>
              <img src={card.icon} alt="" className="h-7 w-7" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{card.value}</div>
              <div className="text-sm text-gray-600 font-medium mt-1">{card.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-bold text-lg mb-4">최근 등록된 회사</div>
          <ul className="divide-y">
            {recentCompanies.map((c, i) => (
              <li key={i} className="py-2 flex justify-between text-sm">
                <span>{c.name}</span>
                <span className="text-gray-400">{c.date}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-bold text-lg mb-4">최근 등록된 회원</div>
          <ul className="divide-y">
            {recentMembers.map((m, i) => (
              <li key={i} className="py-2 flex justify-between text-sm">
                <span>{m.name}</span>
                <span className="text-gray-400">{m.date}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-bold text-lg mb-4">최근 등록된 프로젝트</div>
          <ul className="divide-y">
            {recentProjects.map((p, i) => (
              <li key={i} className="py-2 flex justify-between text-sm">
                <span>{p.name}</span>
                <span className="text-gray-400">{p.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
=======
export default function DashboardPage() {
  return <div>대시보드 페이지</div>;
>>>>>>> b97c2b31261b3c0b870a1107fb1cf2bce356a3be
} 