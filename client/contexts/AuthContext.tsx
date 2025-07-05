import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

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
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  const isAuthenticated = !!user;

  const validateToken = useCallback(async (token: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/validate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return true;
      } else {
        localStorage.removeItem("auth_token");
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  }, []);

  const login = useCallback(
    async (email: string, senha: string): Promise<void> => {
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
    },
    [],
  );

  const loginWithGoogle = useCallback(async (): Promise<void> => {
    window.location.href = "/api/auth/google";
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    setUser(null);
    window.location.replace("/login");
  }, []);

  const refreshUser = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      await validateToken(token);
    }
  }, [validateToken]);

  // Simple initialization - only run once
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        await validateToken(token);
      }
      setIsLoading(false);
    };

    initAuth();
  }, [validateToken]);

  const value = {
    user,
    login,
    loginWithGoogle,
    logout,
    isLoading,
    isAuthenticated,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
