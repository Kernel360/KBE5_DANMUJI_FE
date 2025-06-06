// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextProps {
  role: string | null;
  setRole: (role: string | null) => void;
  user: UserData | null;
  setUser: (user: UserData | null) => void;
}

interface JwtPayload {
  role?: string;
  [key: string]: any;
}

interface UserData {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  companyId: number;
  companyName: string;
  createdAt: string;
  updatedAt: string;
}

const AuthContext = createContext<AuthContextProps>({
  role: null,
  setRole: () => {},
  user: null,
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

// 렌더 전에 디코딩해서 초기값 세팅
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [role, setRole] = useState<string | null>(() => {
    const token = localStorage.getItem("accessToken");
    try {
      if (token) {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.role || null;
      }
    } catch (err) {
      console.error("JWT decode error:", err);
      return null;
    }
    return null;
  });

  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const res = await fetch("/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("사용자 정보를 불러올 수 없습니다.");

        const result = await res.json();
        setUser(result.data);
      } catch (err) {
        console.error("유저 정보 로딩 실패:", err);
        localStorage.removeItem("accessToken"); // 토큰 삭제
        setUser(null);
      }
    };

    fetchUser();
  }, []);
  return (
    <AuthContext.Provider value={{ role, setRole, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
