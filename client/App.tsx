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

// Professional loading component
const LoadingFallback = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-brown-50 to-brand-beige-50 dark:from-brand-brown-900 dark:to-brand-brown-800">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-brand-brown-300 border-t-brand-brown-600 rounded-full animate-spin mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-brand-brown-800 dark:text-brand-beige-200 mb-2">
        🏠 Siqueira Campos Imóveis
      </h2>
      <p className="text-brand-brown-600 dark:text-brand-beige-300">
        Sistema profissional carregando...
      </p>
    </div>
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

// SIMPLIFIED App Component for debugging
export default function App() {
  return (
    <div>
      <h1>Siqueira Campos Imóveis</h1>
      <p>Sistema funcionando sem loops!</p>
    </div>
  );
}
