// src/hooks/useAuth.ts
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export const useAuth = () => useContext(AuthContext);
