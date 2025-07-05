import React, { Suspense, lazy, memo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppStateProvider } from "@/contexts/AppStateContext";

// Lazy load pages for optimal performance
const Index = lazy(() => import("@/pages/Index"));
const Login = lazy(() => import("@/pages/Login"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Lazy load Dashboards
const CorretorDashboard = lazy(() => import("@/pages/Corretor/Dashboard"));
const AdminDashboard = lazy(() => import("@/pages/Admin/Dashboard"));
const ClienteDashboard = lazy(() => import("@/pages/Cliente/Dashboard"));
const DesenvolvedorDashboard = lazy(
  () => import("@/pages/Desenvolvedor/Dashboard"),
);
const MarketingDashboard = lazy(() => import("@/pages/Marketing/Dashboard"));

// Lazy load other pages
const Imoveis = lazy(() => import("@/pages/Imoveis"));
const ImovelDetalhes = lazy(() => import("@/pages/ImovelDetalhes"));
const Contato = lazy(() => import("@/pages/Contato"));
const SimuladorFinanciamento = lazy(
  () => import("@/pages/SimuladorFinanciamento"),
);
const Blog = lazy(() => import("@/pages/Blog"));
const Sobre = lazy(() => import("@/pages/Sobre"));
const Desenvolvedor = lazy(() => import("@/pages/Desenvolvedor"));
const Status = lazy(() => import("@/pages/Status"));

// 🌟 ULTRA-PREMIUM LOADING COMPONENT 🌟
const LoadingFallback = memo(() => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      background:
        "linear-gradient(135deg, #fdf8f6 0%, #fef7e0 50%, #ffffff 100%)",
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}
  >
    {/* ✨ Background Pattern */}
    <div
      style={{
        position: "absolute",
        inset: "0",
        opacity: "0.1",
        backgroundImage:
          "radial-gradient(circle at 25% 25%, #d4af37 0%, transparent 70%), radial-gradient(circle at 75% 75%, #f59e0b 0%, transparent 70%)",
      }}
    ></div>

    {/* 🎯 Floating Particles */}
    <div
      style={{
        position: "absolute",
        inset: "0",
        overflow: "hidden",
        opacity: "0.4",
      }}
    >
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
            background:
              i % 2 === 0
                ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                : "linear-gradient(135deg, #d4af37, #b8860b)",
            borderRadius: "50%",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float${i} ${3 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        ></div>
      ))}
    </div>

    {/* 🏰 Main Content */}
    <div
      style={{
        position: "relative",
        zIndex: "10",
        textAlign: "center",
        padding: "3rem",
      }}
    >
      {/* 👑 Premium Logo */}
      <div
        style={{
          position: "relative",
          marginBottom: "3rem",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            margin: "0 auto",
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(20px)",
            borderRadius: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid rgba(212, 175, 55, 0.3)",
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px rgba(212, 175, 55, 0.2)",
            fontSize: "3rem",
            position: "relative",
          }}
        >
          🏠
          {/* ✨ Sparkles */}
          <div
            style={{
              position: "absolute",
              top: "-10px",
              right: "-10px",
              width: "30px",
              height: "30px",
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              borderRadius: "50%",
              animation: "sparkle 2s ease-in-out infinite",
              boxShadow: "0 0 20px rgba(251, 191, 36, 0.6)",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              bottom: "-8px",
              left: "-8px",
              width: "20px",
              height: "20px",
              background: "linear-gradient(135deg, #d4af37, #b8860b)",
              borderRadius: "50%",
              animation: "sparkle 2s ease-in-out infinite 0.5s",
              boxShadow: "0 0 15px rgba(212, 175, 55, 0.6)",
            }}
          ></div>
        </div>
      </div>

      {/* 🎪 Premium Loading Ring */}
      <div
        style={{
          position: "relative",
          marginBottom: "3rem",
        }}
      >
        <div
          style={{
            width: "100px",
            height: "100px",
            margin: "0 auto",
            position: "relative",
          }}
        >
          {/* 🌟 Outer Luxury Ring */}
          <div
            style={{
              position: "absolute",
              inset: "0",
              borderRadius: "50%",
              border: "6px solid transparent",
              background:
                "conic-gradient(from 0deg, #d4af37, #fbbf24, #f59e0b, #d4af37)",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 6px), black calc(100% - 6px))",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 6px), black calc(100% - 6px))",
              animation: "luxurySpin 3s linear infinite",
              filter: "drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))",
            }}
          ></div>
          {/* 💫 Inner Ring */}
          <div
            style={{
              position: "absolute",
              inset: "15px",
              borderRadius: "50%",
              border: "3px solid transparent",
              background:
                "conic-gradient(from 180deg, #f59e0b, #fbbf24, #f59e0b)",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px))",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px))",
              animation: "luxurySpin 2s linear infinite reverse",
              opacity: "0.8",
            }}
          ></div>
          {/* 🔥 Center Premium Dot */}
          <div
            style={{
              position: "absolute",
              inset: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                background: "radial-gradient(circle, #fbbf24, #f59e0b)",
                borderRadius: "50%",
                boxShadow: "0 0 20px rgba(251, 191, 36, 0.8)",
                animation: "luxuryPulse 2s ease-in-out infinite",
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* 🎨 Premium Brand Text */}
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: "bold",
            background:
              "linear-gradient(135deg, #8b5a2b, #d4af37, #fbbf24, #8b5a2b)",
            backgroundSize: "300% 300%",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            marginBottom: "1.5rem",
            lineHeight: "1.1",
            animation: "gradientShift 4s ease-in-out infinite",
            textShadow: "0 0 30px rgba(212, 175, 55, 0.3)",
          }}
        >
          Siqueira Campos Imóveis
        </h1>

        {/* 💎 Premium Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "2rem",
            padding: "0.75rem 2rem",
            background:
              "linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(251, 191, 36, 0.15))",
            border: "1px solid rgba(212, 175, 55, 0.3)",
            borderRadius: "50px",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              borderRadius: "50%",
              animation: "luxuryPulse 2s ease-in-out infinite",
            }}
          ></div>
          <span
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              background: "linear-gradient(135deg, #b45309, #8b5a2b)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              letterSpacing: "0.05em",
            }}
          >
            PREMIUM EXPERIENCE
          </span>
          <div
            style={{
              width: "10px",
              height: "10px",
              background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
              borderRadius: "50%",
              animation: "luxuryPulse 2s ease-in-out infinite 0.5s",
            }}
          ></div>
        </div>

        <p
          style={{
            color: "#92664f",
            fontSize: "1.375rem",
            fontWeight: "500",
            marginBottom: "2.5rem",
            letterSpacing: "0.025em",
          }}
        >
          Carregando experiência premium...
        </p>

        {/* 🌊 Luxury Progress Bar */}
        <div
          style={{
            width: "320px",
            height: "12px",
            background: "rgba(146, 102, 79, 0.2)",
            borderRadius: "50px",
            margin: "0 auto",
            overflow: "hidden",
            border: "1px solid rgba(212, 175, 55, 0.2)",
            boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              height: "100%",
              background:
                "linear-gradient(90deg, #8b5a2b, #d4af37, #fbbf24, #f59e0b, #d4af37, #8b5a2b)",
              borderRadius: "50px",
              backgroundSize: "300% 100%",
              animation: "luxuryShimmer 3s ease-in-out infinite",
              boxShadow: "0 0 20px rgba(212, 175, 55, 0.4)",
            }}
          ></div>
        </div>

        {/* 📜 Luxury Tagline */}
        <p
          style={{
            fontSize: "1rem",
            color: "#a3765a",
            opacity: "0.8",
            marginTop: "2rem",
            fontStyle: "italic",
            letterSpacing: "0.025em",
          }}
        >
          ✨ Transformando sonhos em realidade desde 2008 ✨
        </p>
      </div>
    </div>

    {/* 🎭 CSS Animations */}
    <style>{`
      @keyframes luxuryShimmer {
        0% { background-position: -300% 0; }
        100% { background-position: 300% 0; }
      }
      @keyframes luxurySpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes luxuryPulse {
        0%, 100% { 
          transform: scale(1); 
          opacity: 1;
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.8);
        }
        50% { 
          transform: scale(1.2); 
          opacity: 0.8;
          box-shadow: 0 0 30px rgba(251, 191, 36, 1);
        }
      }
      @keyframes sparkle {
        0%, 100% { 
          transform: scale(1) rotate(0deg); 
          opacity: 1;
        }
        50% { 
          transform: scale(1.3) rotate(180deg); 
          opacity: 0.7;
        }
      }
      @keyframes gradientShift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      ${[...Array(10)]
        .map(
          (_, i) => `
        @keyframes float${i} {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1); 
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-${15 + Math.random() * 15}px) rotate(${180 + Math.random() * 180}deg) scale(1.1); 
            opacity: 1;
          }
        }
      `,
        )
        .join("")}
    `}</style>
  </div>
));

LoadingFallback.displayName = "LoadingFallback";

// Enhanced Protected Route
const ProtectedRoute = memo(
  ({
    children,
    requiredRoles,
  }: {
    children: React.ReactNode;
    requiredRoles?: string[];
  }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
      return <LoadingFallback />;
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (requiredRoles && !requiredRoles.includes(user.tipo)) {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  },
);

ProtectedRoute.displayName = "ProtectedRoute";

// Dashboard Router
const DashboardRedirect = memo(() => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getDashboardRoute = (userType: string) => {
    switch (userType) {
      case "ADMIN":
        return "/admin/dashboard";
      case "CORRETOR":
      case "ASSISTENTE":
        return "/corretor/dashboard";
      case "CLIENTE":
        return "/cliente/dashboard";
      case "MARKETING":
        return "/marketing/dashboard";
      case "DESENVOLVEDOR":
        return "/dev/dashboard";
      default:
        return "/";
    }
  };

  return <Navigate to={getDashboardRoute(user.tipo)} replace />;
});

DashboardRedirect.displayName = "DashboardRedirect";

// Error Boundary
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error; errorCount: number }
> {
  private maxErrors = 3;

  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[App] Error caught by boundary:", error, errorInfo);

    // Prevent infinite error loops
    this.setState((prevState) => ({
      errorCount: prevState.errorCount + 1,
    }));

    if (this.state.errorCount >= this.maxErrors) {
      console.error("[App] Too many errors, stopping error reporting");
      return;
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
          }}
        >
          <div
            style={{
              textAlign: "center",
              maxWidth: "500px",
              margin: "0 auto",
              padding: "3rem",
            }}
          >
            <h1
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                color: "#dc2626",
              }}
            >
              🏠 Siqueira Campos Imóveis
            </h1>
            <p
              style={{
                marginBottom: "1.5rem",
                color: "#b91c1c",
                fontSize: "1.25rem",
              }}
            >
              Sistema Profissional de Gestão Imobiliária
            </p>
            <div
              style={{
                background: "#fee2e2",
                border: "1px solid #fecaca",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <h3
                style={{
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  color: "#dc2626",
                }}
              >
                ⚠️ Erro do Sistema
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#b91c1c",
                }}
              >
                Ocorreu um erro inesperado. Nossa equipe KRYONIX foi notificada.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "#dc2626",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              🔄 Recarregar Sistema
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App Component
export default function App() {
  return (
    <AppErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <AppStateProvider>
          <AuthProvider>
            <BrowserRouter>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/imoveis" element={<Imoveis />} />
                  <Route path="/imoveis/:id" element={<ImovelDetalhes />} />
                  <Route path="/contato" element={<Contato />} />
                  <Route
                    path="/simulador-financiamento"
                    element={<SimuladorFinanciamento />}
                  />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/sobre" element={<Sobre />} />
                  <Route path="/desenvolvedor" element={<Desenvolvedor />} />
                  <Route path="/status" element={<Status />} />

                  {/* Dashboard Redirect */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardRedirect />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Dashboard */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute requiredRoles={["ADMIN"]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Corretor Dashboard */}
                  <Route
                    path="/corretor/dashboard"
                    element={
                      <ProtectedRoute
                        requiredRoles={["CORRETOR", "ASSISTENTE", "ADMIN"]}
                      >
                        <CorretorDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Cliente Dashboard */}
                  <Route
                    path="/cliente/dashboard"
                    element={
                      <ProtectedRoute requiredRoles={["CLIENTE", "ADMIN"]}>
                        <ClienteDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Marketing Dashboard */}
                  <Route
                    path="/marketing/dashboard"
                    element={
                      <ProtectedRoute requiredRoles={["MARKETING", "ADMIN"]}>
                        <MarketingDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Desenvolvedor Dashboard */}
                  <Route
                    path="/dev/dashboard"
                    element={
                      <ProtectedRoute
                        requiredRoles={["DESENVOLVEDOR", "ADMIN"]}
                      >
                        <DesenvolvedorDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </AppStateProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}
