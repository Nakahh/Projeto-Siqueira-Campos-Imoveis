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

// Ultra-Premium loading component with luxury effects
const LoadingFallback = memo(() => (
  <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
    {/* Premium Background with Animated Gradients */}
    <div className="absolute inset-0 bg-gradient-to-br from-brand-brown-50 via-brand-beige-50 to-white dark:from-brand-brown-900 dark:via-brand-brown-800 dark:to-brand-brown-900"></div>

    {/* Floating Particles Animation */}
    <div className="absolute inset-0 overflow-hidden opacity-30">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400/40 to-amber-500/40 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        ></div>
      ))}
    </div>

    {/* Main Loading Content */}
    <div className="relative z-10 text-center p-8">
      {/* Premium Logo with Glassmorphism */}
      <div className="relative mb-8">
        <div className="w-24 h-24 mx-auto bg-white/20 dark:bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl">
          <div className="text-4xl">🏠</div>
          {/* Sparkle Effects */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full animate-ping"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Premium Loading Ring */}
      <div className="relative mb-8">
        <div className="w-20 h-20 mx-auto">
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-brand-brown-400 via-amber-400 to-brand-brown-600 animate-spin"
            style={{
              background:
                "conic-gradient(from 0deg, #d4af37, #b8860b, #cd853f, #d4af37)",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 4px))",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 4px))",
            }}
          ></div>
          {/* Inner ring */}
          <div
            className="absolute inset-2 rounded-full border-2 border-transparent bg-gradient-to-r from-amber-300 to-yellow-400 animate-spin opacity-70"
            style={{
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}
          ></div>
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Premium Brand Text */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-brown-800 via-amber-700 to-brand-brown-900 dark:from-brand-beige-200 dark:via-yellow-300 dark:to-brand-beige-100 bg-clip-text text-transparent mb-3">
          Siqueira Campos Imóveis
        </h1>

        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"></div>
          <span className="text-lg font-medium bg-gradient-to-r from-amber-700 to-brand-brown-700 dark:from-amber-300 dark:to-yellow-200 bg-clip-text text-transparent">
            PREMIUM EXPERIENCE
          </span>
          <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"></div>
        </div>

        <p className="text-brand-brown-600 dark:text-brand-beige-300 text-lg font-medium mb-6">
          Carregando experiência premium...
        </p>

        {/* Loading Progress Bar */}
        <div className="w-64 h-2 bg-brand-brown-200/30 dark:bg-brand-brown-700/30 rounded-full mx-auto overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-brown-500 via-amber-500 to-yellow-500 rounded-full animate-pulse"
            style={{
              background:
                "linear-gradient(90deg, #8b5a2b, #d4af37, #ffd700, #d4af37, #8b5a2b)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2s infinite",
            }}
          ></div>
        </div>

        {/* Subtle tagline */}
        <p className="text-sm text-brand-brown-500 dark:text-brand-beige-400 opacity-75 mt-4">
          Transformando sonhos em realidade desde 2008
        </p>
      </div>
    </div>

    {/* CSS animation for shimmer effect */}
    <style jsx>{`
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
          <div className="text-center max-w-md mx-auto p-8">
            <h1 className="text-3xl font-bold mb-4 text-red-800">
              🏠 Siqueira Campos Imóveis
            </h1>
            <p className="mb-6 text-red-700">
              Sistema Profissional de Gestão Imobiliária
            </p>
            <div className="bg-red-200 border border-red-300 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2 text-red-800">
                ⚠️ Erro do Sistema
              </h3>
              <p className="text-sm text-red-700">
                Ocorreu um erro inesperado. Nossa equipe KRYONIX foi notificada.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
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
