import { useState } from 'react';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';

export default function Topbar() {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="flex items-center justify-end h-16 px-8 bg-white border-b relative">
      <input
        type="text"
        placeholder="검색"
        className="border rounded px-3 py-1 mr-4 focus:outline-none"
      />
      <div className="mr-4 font-semibold">김관리자</div>
      <div className="relative mr-4">
        <button onClick={() => setShowProfile(v => !v)} className="px-2 py-1 rounded hover:bg-gray-100">
          ▼
        </button>
        {showProfile && <ProfileDropdown />}
      </div>
      <div className="relative">
        <button onClick={() => setShowNotif(v => !v)} className="px-2 py-1 rounded hover:bg-gray-100">
          🔔
        </button>
        {showNotif && <NotificationDropdown />}
      </div>
    </header>
  );
} 