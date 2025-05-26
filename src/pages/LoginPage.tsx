import React, { useState } from 'react';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 처리 로직
    alert(`로그인 시도: ${id}`);
  };

  const handleForgotPassword = () => {
    // 비밀번호 찾기 페이지 이동
    window.location.href = '/forgot-password';
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <div className="flex flex-1 items-center justify-center py-16">
        <div className="w-[900px] h-[520px] bg-white rounded-2xl shadow-xl flex overflow-hidden">
          {/* Left Panel */}
          <div className="w-[380px] bg-[#FFC10A] flex flex-col justify-center px-12">
            <div className="mb-2 text-white font-bold text-2xl mt-2">단계별 무리없는 지원 시스템</div>
            <div className="mb-8 text-white text-base font-medium">Project Management System</div>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                {/* 체크 아이콘 */}
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  {/* <CheckIcon className="w-4 h-4 text-white" /> */}
                  <span className="text-lg">✔️</span>
                </div>
                <span className="text-white text-sm">효율적인 프로젝트 관리 시스템</span>
              </div>
              <div className="flex items-center gap-3">
                {/* 유저 아이콘 */}
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  {/* <UserIcon className="w-4 h-4 text-white" /> */}
                  <span className="text-lg">👤</span>
                </div>
                <span className="text-white text-sm">팀 협업 및 커뮤니케이션 향상</span>
              </div>
              <div className="flex items-center gap-3">
                {/* 차트 아이콘 */}
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  {/* <ChartIcon className="w-4 h-4 text-white" /> */}
                  <span className="text-lg">📊</span>
                </div>
                <span className="text-white text-sm">실시간 데이터 분석 및 보고서</span>
              </div>
            </div>
          </div>
          {/* Right Panel */}
          <div className="flex-1 flex flex-col items-center justify-center px-12 py-8">
            {/* 로고 */}
            <div className="flex items-center justify-center mb-6">
              {/* <DanmujiLogo className="w-10 h-10 text-[#FFC10A] mr-2" /> */}
              <span className="w-10 h-10 mr-2 text-4xl">🥒</span>
              <span className="text-[#FFC10A] text-2xl font-bold">Danmuji</span>
            </div>
            <div className="text-lg font-black text-gray-800 mb-6 text-center">로그인</div>
            <form className="w-full flex flex-col gap-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
                <input
                  type="text"
                  className="w-full h-12 rounded-md bg-gray-100 px-4 text-base outline-none focus:ring-2 focus:ring-[#FFC10A]"
                  placeholder="아이디를 입력하세요"
                  value={id}
                  onChange={e => setId(e.target.value)}
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">비밀번호</label>
                  <button type="button" className="text-xs text-[#FFC10A] hover:underline" onClick={handleForgotPassword}>
                    비밀번호를 잊으셨나요?
                  </button>
                </div>
                <input
                  type="password"
                  className="w-full h-12 rounded-md bg-gray-100 px-4 text-base outline-none focus:ring-2 focus:ring-[#FFC10A]"
                  placeholder="비밀번호를 입력하세요"
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full h-12 rounded-md bg-[#FFC10A] text-white font-bold text-base mt-2 hover:bg-yellow-400 transition"
              >
                로그인
              </button>
            </form>
            <div className="flex items-center gap-2 mt-6 text-gray-400 text-xs">
              {/* <LockIcon className="w-4 h-4" /> */}
              <span className="text-base">🔒</span>
              Secure, encrypted connection
            </div>
          </div>
        </div>
      </div>
      <footer className="w-full text-center text-gray-400 text-xs py-8">
        © 2025 Back2Basics. All rights reserved.
      </footer>
    </div>
  );
} 