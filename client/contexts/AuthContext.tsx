import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
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

// Enhanced error handling with circuit breaker pattern
class AuthErrorHandler {
  private static instance: AuthErrorHandler;
  private errorCount = 0;
  private lastErrorTime = 0;
  private readonly MAX_ERRORS = 3;
  private readonly ERROR_WINDOW = 60000; // 1 minute
  private circuitOpen = false;

  static getInstance(): AuthErrorHandler {
    if (!AuthErrorHandler.instance) {
      AuthErrorHandler.instance = new AuthErrorHandler();
    }
    return AuthErrorHandler.instance;
  }

  shouldAllowRequest(): boolean {
    const now = Date.now();

    // Reset circuit if enough time has passed
    if (now - this.lastErrorTime > this.ERROR_WINDOW) {
      this.reset();
    }

    return !this.circuitOpen;
  }

  recordError(error: any, context: string): void {
    const now = Date.now();
    this.errorCount++;
    this.lastErrorTime = now;

    console.error(`[AUTH] Erro em ${context}:`, error);

    // Log to our system if available
    if (typeof window !== "undefined" && window.SiqueiraSystemLogs) {
      window.SiqueiraSystemLogs.push({
        level: "error",
        message: `Auth error in ${context}`,
        data: { error: error.message, context, count: this.errorCount },
        timestamp: now,
        system: "AuthContext",
      });
    }

    // Open circuit if too many errors
    if (this.errorCount >= this.MAX_ERRORS) {
      this.circuitOpen = true;
      console.warn(
        "[AUTH] Circuit breaker opened due to repeated errors. Auth operations temporarily disabled.",
      );
    }
  }

  private reset(): void {
    this.errorCount = 0;
    this.circuitOpen = false;
    console.log("[AUTH] Circuit breaker reset");
  }
}

// Anti-loop protection for auth operations
class AuthLoopProtection {
  private static instance: AuthLoopProtection;
  private operations = new Map<string, number>();
  private readonly OPERATION_COOLDOWN = 2000; // 2 seconds

  static getInstance(): AuthLoopProtection {
    if (!AuthLoopProtection.instance) {
      AuthLoopProtection.instance = new AuthLoopProtection();
    }
    return AuthLoopProtection.instance;
  }

  canPerformOperation(operation: string): boolean {
    const now = Date.now();
    const lastOperation = this.operations.get(operation) || 0;

    if (now - lastOperation < this.OPERATION_COOLDOWN) {
      console.warn(
        `[AUTH] Operation ${operation} blocked by anti-loop protection`,
      );
      return false;
    }

    this.operations.set(operation, now);
    return true;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initializationRef = useRef(false);
  const authTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const errorHandler = AuthErrorHandler.getInstance();
  const loopProtection = AuthLoopProtection.getInstance();

  // Memoized values for performance
  const isAuthenticated = useMemo(() => !!user, [user]);

  // Debounced token validation to prevent excessive API calls
  const validateToken = useCallback(
    async (token: string): Promise<boolean> => {
      if (!errorHandler.shouldAllowRequest()) {
        console.warn("[AUTH] Request blocked by circuit breaker");
        return false;
      }

      if (!loopProtection.canPerformOperation("validateToken")) {
        return false;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

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
          // Only remove token if it's actually invalid (not network error)
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("auth_token");
            setUser(null);
          }
          return false;
        }
      } catch (error) {
        if (error.name === "AbortError") {
          errorHandler.recordError(error, "token validation timeout");
        } else {
          errorHandler.recordError(error, "token validation");
        }

        // Only remove token on auth errors, not network errors
        if (error.message?.includes("401") || error.message?.includes("403")) {
          localStorage.removeItem("auth_token");
          setUser(null);
        }
        return false;
      }
    },
    [errorHandler, loopProtection],
  );

  // Enhanced login function with comprehensive protection
  const login = useCallback(
    async (email: string, senha: string): Promise<void> => {
      if (!errorHandler.shouldAllowRequest()) {
        throw new Error(
          "Muitas tentativas de login. Tente novamente em breve.",
        );
      }

      if (!loopProtection.canPerformOperation("login")) {
        throw new Error("Aguarde antes de tentar novamente.");
      }

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
        errorHandler.recordError(error, "login");
        throw error;
      }
    },
    [errorHandler, loopProtection],
  );

  // Enhanced Google login
  const loginWithGoogle = useCallback(async (): Promise<void> => {
    if (!loopProtection.canPerformOperation("loginWithGoogle")) {
      return;
    }

    try {
      // Redirect to Google OAuth endpoint
      window.location.href = "/api/auth/google";
    } catch (error) {
      errorHandler.recordError(error, "Google login");
      throw error;
    }
  }, [errorHandler, loopProtection]);

  // Enhanced logout function with comprehensive cleanup
  const logout = useCallback(() => {
    try {
      // Clear any pending timeouts
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
        authTimeoutRef.current = null;
      }

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

      // Redirect to login with protection against infinite loops
      if (!loopProtection.canPerformOperation("logout-redirect")) {
        return;
      }

      // Use replace to prevent back button issues
      window.location.replace("/login");
    } catch (error) {
      errorHandler.recordError(error, "logout");
      // Force redirect even if logging fails
      window.location.replace("/login");
    }
  }, [loopProtection, errorHandler]);

  // Function to refresh user data with protection
  const refreshUser = useCallback(async (): Promise<void> => {
    if (!loopProtection.canPerformOperation("refreshUser")) {
      return;
    }

    const token = localStorage.getItem("auth_token");
    if (token) {
      await validateToken(token);
    }
  }, [validateToken, loopProtection]);

  // Enhanced initialization effect with comprehensive protection
  useEffect(() => {
    // Prevent multiple initializations
    if (initializationRef.current) {
      return;
    }
    initializationRef.current = true;

    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Add slight delay to prevent race conditions
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (!isMounted) return;

        const token = localStorage.getItem("auth_token");
        if (token && isMounted) {
          await validateToken(token);
        }
      } catch (error) {
        errorHandler.recordError(error, "auth initialization");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Use timeout to ensure DOM is ready
    authTimeoutRef.current = setTimeout(initializeAuth, 50);

    // Cleanup function
    return () => {
      isMounted = false;
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
        authTimeoutRef.current = null;
      }
    };
  }, []); // Empty dependency array is intentional

  // Token refresh on focus (for better UX) with protection
  useEffect(() => {
    const handleFocus = () => {
      if (!loopProtection.canPerformOperation("focus-refresh")) {
        return;
      }

      const token = localStorage.getItem("auth_token");
      if (token && user) {
        validateToken(token);
      }
    };

    // Debounce focus events
    let focusTimeout: NodeJS.Timeout;
    const debouncedFocus = () => {
      clearTimeout(focusTimeout);
      focusTimeout = setTimeout(handleFocus, 1000);
    };

    window.addEventListener("focus", debouncedFocus);
    return () => {
      window.removeEventListener("focus", debouncedFocus);
      clearTimeout(focusTimeout);
    };
  }, [user, validateToken, loopProtection]);

  // Storage event listener for cross-tab logout
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_token" && !e.newValue && user) {
        // Token was removed in another tab
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user]);

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

// Enhanced useAuth hook with error handling and fallback
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    const error = new Error("useAuth must be used within an AuthProvider");
    console.error("[AUTH] Hook used outside provider:", error);

    // Log the error
    if (typeof window !== "undefined" && window.SiqueiraSystemLogs) {
      window.SiqueiraSystemLogs.push({
        level: "error",
        message: "useAuth hook used outside provider",
        data: { stack: error.stack },
        timestamp: Date.now(),
        system: "AuthContext",
      });
    }

    throw error;
  }

  return context;
}

// Safe version that doesn't throw
export function useAuthSafe() {
  try {
    return useAuth();
  } catch {
    console.warn("[AUTH] Using safe fallback auth context");
    return {
      user: null,
      login: async () => {
        throw new Error("Auth context not available");
      },
      loginWithGoogle: async () => {
        throw new Error("Auth context not available");
      },
      logout: () => {
        window.location.replace("/login");
      },
      isLoading: false,
      isAuthenticated: false,
      refreshUser: async () => {},
    };
  }
}

// Export utilities for debugging
export const AuthDebug = {
  getErrorHandler: () => AuthErrorHandler.getInstance(),
  getLoopProtection: () => AuthLoopProtection.getInstance(),
  resetProtection: () => {
    AuthErrorHandler.getInstance();
    AuthLoopProtection.getInstance();
  },
};
