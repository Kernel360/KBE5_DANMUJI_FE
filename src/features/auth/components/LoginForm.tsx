import React, { useState } from 'react';

const LoginForm: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Login logic
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="userId" className="block text-sm text-gray-600">아이디</label>
        <input
          id="userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full px-4 py-3 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="아이디를 입력하세요"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="password" className="block text-sm text-gray-600">비밀번호</label>
          <a href="#" className="text-sm text-yellow-500 hover:text-yellow-600">비밀번호를 잊으셨나요?</a>
        </div>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="비밀번호를 입력하세요"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-yellow-400 text-white py-3 rounded-md hover:bg-yellow-500 transition duration-300 cursor-pointer"
      >
        로그인
      </button>

      <div className="flex items-center justify-center mt-4">
        <input type="checkbox" id="terms" className="mr-2" />
        <label htmlFor="terms" className="text-xs text-gray-500">서비스, 개인정보 동의함</label>
      </div>
    </form>
  );
};

export default LoginForm;