import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: number;
  nome: string;
  email: string;
  tipo:
    | "ADMIN"
    | "CORRETOR"
    | "ASSISTENTE"
    | "CLIENTE"
    | "MARKETING"
    | "DESENVOLVEDOR";
  avatar?: string;
  whatsapp?: string;
  ativo: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, senha: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Verificar se há um token salvo e validá-lo
    const token = localStorage.getItem("auth_token");
    if (token) {
      validateToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch("/api/auth/validate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem("auth_token");
      }
    } catch (error) {
      console.error("Erro ao validar token:", error);
      localStorage.removeItem("auth_token");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, senha: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao fazer login");
      }

      const { token, user: userData } = await response.json();
      localStorage.setItem("auth_token", token);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Redirecionar para o endpoint de autenticação do Google
      window.location.href = "/api/auth/google";
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        logout,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
