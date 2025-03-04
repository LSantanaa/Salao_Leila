"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type User = {
  name?: string;
  id: number;
  email: string;
  role: "client" | "admin";
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tempo de expiração do token: 6 horas (em milissegundos)
const TOKEN_EXPIRATION = 60 * 60 * 6000;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Verifica o token ao carregar a página
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedId = localStorage.getItem("id");
    const storedEmail = localStorage.getItem("email");
    const storedName = localStorage.getItem("name") || undefined;
    const storedExpiresAt = localStorage.getItem("expiresAt");

    if (storedToken && storedRole && storedEmail && storedExpiresAt) {
      const now = new Date().getTime();
      if (now > Number(storedExpiresAt)) {
        logout();
      } else {
        const restoredUser = { id:Number(storedId), email: storedEmail, name: storedName, role: storedRole as "client" | "admin" };
        setUser(restoredUser);
        setToken(storedToken);
        router.push(restoredUser.role === "admin" ? "/admin/dashboard" : "/dashboard");
      }
    }
  }, [router]);

  // Função auxiliar para salvar usuário e token após sucesso
  const handleAuthSuccess = (userData: User, authToken: string, redirectPath: string) => {
    const expiresAt = new Date().getTime() + TOKEN_EXPIRATION;
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("token", authToken);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("email", userData.email);
    localStorage.setItem("id", String(userData.id));
    if (userData.name) localStorage.setItem("name", userData.name);
    localStorage.setItem("expiresAt", expiresAt.toString());
    router.push(redirectPath);
  };

  const login = async (email: string, password: string) => {
    const result = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!result.success) {
      throw new Error(result.error);
    }

    const { data } = result;
    const userData: User = { id:data.id, email, name: data.name, role: data.role };
    const authToken = data.token;
    const redirectPath = userData.role === "admin" ? "/admin/dashboard" : "/dashboard";

    handleAuthSuccess(userData, authToken, redirectPath);
  };

  const register = async (name: string, email: string, password: string) => {
    const result = await api("/auth/register/client", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    if (!result.success) {
      throw new Error(result.error);
    }

    const { data } = result;
    const userData: User = {id:data.id, email, name: data.name, role:data.role };
    const authToken = data.token;

    handleAuthSuccess(userData, authToken, "/dashboard");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("expiresAt");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};