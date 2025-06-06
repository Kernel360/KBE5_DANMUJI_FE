// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextProps {
  role: string | null;
  setRole: (role: string | null) => void;
}

interface JwtPayload {
  role?: string;
  [key: string]: any;
}

const AuthContext = createContext<AuthContextProps>({
  role: null,
  setRole: () => {},
});

export const useAuth = () => useContext(AuthContext);

// 렌더 전에 디코딩해서 초기값 세팅
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<string | null>(() => {
    const token = localStorage.getItem("accessToken");
    try {
      if (token) {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.role || null;
      }
    } catch (err) {
      console.error("JWT decode error:", err);
    }
    return null;
  });

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};
