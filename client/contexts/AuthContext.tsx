import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
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

// Enhanced error handling
const handleAuthError = (error: any, context: string) => {
  console.error(`[AUTH] Erro em ${context}:`, error);

  // Log to our system if available
  if (typeof window !== "undefined" && window.SiqueiraSystemLogs) {
    window.SiqueiraSystemLogs.push({
      level: "error",
      message: `Auth error in ${context}`,
      data: error,
      timestamp: Date.now(),
      system: "AuthContext",
    });
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized values for performance
  const isAuthenticated = useMemo(() => !!user, [user]);

  // Optimized token validation
  const validateToken = useCallback(async (token: string): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch("/api/auth/validate", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return true;
      } else {
        // Remove invalid token
        localStorage.removeItem("auth_token");
        setUser(null);
        return false;
      }
    } catch (error) {
      if (error.name === "AbortError") {
        handleAuthError(error, "token validation timeout");
      } else {
        handleAuthError(error, "token validation");
      }
      localStorage.removeItem("auth_token");
      setUser(null);
      return false;
    }
  }, []);

  // Enhanced login function
  const login = useCallback(
    async (email: string, senha: string): Promise<void> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, senha }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Erro ao fazer login");
        }

        const { token, user: userData } = await response.json();

        // Store token securely
        localStorage.setItem("auth_token", token);
        setUser(userData);

        // Log successful login
        if (typeof window !== "undefined" && window.SiqueiraSystemLogs) {
          window.SiqueiraSystemLogs.push({
            level: "info",
            message: "User logged in successfully",
            data: { userId: userData.id, userType: userData.tipo },
            timestamp: Date.now(),
            system: "AuthContext",
          });
        }
      } catch (error) {
        handleAuthError(error, "login");
        throw error;
      }
    },
    [],
  );

  // Enhanced Google login
  const loginWithGoogle = useCallback(async (): Promise<void> => {
    try {
      // Redirect to Google OAuth endpoint
      window.location.href = "/api/auth/google";
    } catch (error) {
      handleAuthError(error, "Google login");
      throw error;
    }
  }, []);

  // Enhanced logout function
  const logout = useCallback(() => {
    try {
      // Clear token and user state
      localStorage.removeItem("auth_token");
      setUser(null);

      // Log logout
      if (typeof window !== "undefined" && window.SiqueiraSystemLogs) {
        window.SiqueiraSystemLogs.push({
          level: "info",
          message: "User logged out",
          timestamp: Date.now(),
          system: "AuthContext",
        });
      }

      // Redirect to login
      window.location.href = "/login";
    } catch (error) {
      handleAuthError(error, "logout");
      // Force redirect even if logging fails
      window.location.href = "/login";
    }
  }, []);

  // Function to refresh user data
  const refreshUser = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      await validateToken(token);
    }
  }, [validateToken]);

  // Enhanced initialization effect
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token && isMounted) {
          await validateToken(token);
        }
      } catch (error) {
        handleAuthError(error, "auth initialization");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [validateToken]);

  // Token refresh on focus (for better UX)
  useEffect(() => {
    const handleFocus = () => {
      const token = localStorage.getItem("auth_token");
      if (token && user) {
        validateToken(token);
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user, validateToken]);

  // Memoized context value for performance
  const contextValue = useMemo(
    () => ({
      user,
      login,
      loginWithGoogle,
      logout,
      isLoading,
      isAuthenticated,
      refreshUser,
    }),
    [
      user,
      login,
      loginWithGoogle,
      logout,
      isLoading,
      isAuthenticated,
      refreshUser,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Enhanced useAuth hook with error handling
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    const error = new Error("useAuth must be used within an AuthProvider");
    handleAuthError(error, "useAuth hook");
    throw error;
  }

  return context;
}

// Utility function to get auth status without throwing
export function useAuthSafe() {
  try {
    return useAuth();
  } catch {
    return {
      user: null,
      login: async () => {},
      loginWithGoogle: async () => {},
      logout: () => {},
      isLoading: false,
      isAuthenticated: false,
      refreshUser: async () => {},
    };
  }
}
