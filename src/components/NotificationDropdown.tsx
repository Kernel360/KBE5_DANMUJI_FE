export default function NotificationDropdown() {
  const notifications = [
    '새로운 프로젝트가 등록되었습니다.',
    '회원 가입 요청이 있습니다.',
  ];
  return (
    <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow z-10">
      <div className="p-2 font-bold border-b">알림</div>
      {notifications.length === 0 ? (
        <div className="p-4 text-gray-400">알림이 없습니다.</div>
      ) : (
        notifications.map((msg, i) => (
          <div key={i} className="px-4 py-2 border-b last:border-b-0 hover:bg-gray-50">
            {msg}
          </div>
        ))
      )}
    </div>
  );
} 