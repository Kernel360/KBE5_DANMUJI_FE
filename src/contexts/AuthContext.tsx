// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "@/api/axios";

export interface AuthContextProps {
  role: string | null;
  setRole: (role: string | null) => void;
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  refreshUser: () => Promise<void>;
}

interface JwtPayload {
  role?: string;
}

export interface UserData {
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
  lastLoginAt?: string;
}

export const AuthContext = createContext<AuthContextProps>({
  role: null,
  setRole: () => {},
  user: null,
  setUser: () => {},
  refreshUser: async () => {},
});

const fetchUserFromApi = async (): Promise<UserData | null> => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const res = await api.get("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (err) {
    console.error("유저 정보 로딩 실패:", err);
    localStorage.removeItem("accessToken");
    return null;
  }
};

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

  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const init = async () => {
      const userData = await fetchUserFromApi();
      if (userData) setUser(userData);
    };
    init();
  }, []);

  const refreshUser = async () => {
    const userData = await fetchUserFromApi();
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ role, setRole, user, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
