import React, { Suspense, lazy, memo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Lazy load pages for better performance
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

// Enhanced loading component
const LoadingFallback = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-brown-50 to-brand-beige-50 dark:from-brand-brown-900 dark:to-brand-brown-800">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-brand-brown-300 border-t-brand-brown-600 rounded-full animate-spin mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-brand-brown-800 dark:text-brand-beige-200 mb-2">
        🏠 Siqueira Campos Imóveis
      </h2>
      <p className="text-brand-brown-600 dark:text-brand-beige-300">
        Carregando sistema profissional...
      </p>
    </div>
  </div>
));

LoadingFallback.displayName = "LoadingFallback";

// Enhanced Protected Route component with better performance
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

// Enhanced Dashboard Redirect component
const DashboardRedirect = memo(() => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Determine dashboard route based on user type
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

// Error Boundary for route-level error handling
class RouteErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Route Error Boundary caught an error:", error, errorInfo);

    // Log to our system if available
    if (typeof window !== "undefined" && window.SiqueiraSystemLogs) {
      window.SiqueiraSystemLogs.push({
        level: "error",
        message: "Route error boundary activated",
        data: { error: error.message, errorInfo },
        timestamp: Date.now(),
        system: "App-RouterErrorBoundary",
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800">
          <div className="text-center max-w-md mx-auto p-8">
            <h1 className="text-3xl font-bold mb-4 text-red-800 dark:text-red-200">
              🏠 Siqueira Campos Imóveis
            </h1>
            <p className="mb-6 text-red-700 dark:text-red-300">
              Sistema Profissional de Gestão Imobiliária
            </p>
            <div className="bg-red-200 dark:bg-red-800/50 border border-red-300 dark:border-red-700 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2 text-red-800 dark:text-red-200">
                ⚠️ Erro na Navegação
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                Ocorreu um erro inesperado na navegação. Nossa equipe foi
                notificada.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors mr-4"
            >
              🔄 Recarregar Sistema
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-brand-brown-600 hover:bg-brand-brown-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              🏠 Ir para Início
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App Component with enhanced performance and error handling
export default function App() {
  return (
    <RouteErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
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
                    <ProtectedRoute requiredRoles={["DESENVOLVEDOR", "ADMIN"]}>
                      <DesenvolvedorDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Nested Routes - Corretor */}
                <Route
                  path="/corretor/*"
                  element={
                    <ProtectedRoute
                      requiredRoles={["CORRETOR", "ASSISTENTE", "ADMIN"]}
                    >
                      <Routes>
                        <Route
                          path="imoveis"
                          element={
                            <div className="p-8 text-center">
                              <h1 className="text-2xl font-bold mb-4">
                                Gestão de Imóveis
                              </h1>
                              <p>Módulo em desenvolvimento pela KRYONIX</p>
                            </div>
                          }
                        />
                        <Route
                          path="leads"
                          element={
                            <div className="p-8 text-center">
                              <h1 className="text-2xl font-bold mb-4">
                                Gestão de Leads
                              </h1>
                              <p>Módulo em desenvolvimento pela KRYONIX</p>
                            </div>
                          }
                        />
                        <Route
                          path="agenda"
                          element={
                            <div className="p-8 text-center">
                              <h1 className="text-2xl font-bold mb-4">
                                Agenda
                              </h1>
                              <p>Módulo em desenvolvimento pela KRYONIX</p>
                            </div>
                          }
                        />
                        <Route
                          path="comissoes"
                          element={
                            <div className="p-8 text-center">
                              <h1 className="text-2xl font-bold mb-4">
                                Comissões
                              </h1>
                              <p>Módulo em desenvolvimento pela KRYONIX</p>
                            </div>
                          }
                        />
                        <Route
                          path="whatsapp"
                          element={
                            <div className="p-8 text-center">
                              <h1 className="text-2xl font-bold mb-4">
                                WhatsApp Config
                              </h1>
                              <p>Módulo em desenvolvimento pela KRYONIX</p>
                            </div>
                          }
                        />
                        <Route
                          path="perfil"
                          element={
                            <div className="p-8 text-center">
                              <h1 className="text-2xl font-bold mb-4">
                                Perfil
                              </h1>
                              <p>Módulo em desenvolvimento pela KRYONIX</p>
                            </div>
                          }
                        />
                      </Routes>
                    </ProtectedRoute>
                  }
                />

                {/* Nested Routes - Admin */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute requiredRoles={["ADMIN"]}>
                      <Routes>
                        <Route
                          path="usuarios"
                          element={
                            <div className="p-8 text-center">
                              <h1 className="text-2xl font-bold mb-4">
                                Gestão de Usuários
                              </h1>
                              <p>Módulo em desenvolvimento pela KRYONIX</p>
                            </div>
                          }
                        />
                        <Route
                          path="imoveis"
                          element={
                            <div className="p-8 text-center">
                              <h1 className="text-2xl font-bold mb-4">
                                Gestão de Imóveis
                              </h1>
                              <p>Módulo em desenvolvimento pela KRYONIX</p>
                            </div>
                          }
                        />
                        <Route
                          path="leads"
                          element={
                            <div className="p-8 text-center">
                              <h1 className="text-2xl font-bold mb-4">
                                Gestão de Leads
                              </h1>
                              <p>Módulo em desenvolvimento pela KRYONIX</p>
                            </div>
                          }
                        />
                        <Route
                          path="contratos"
                          element={
                            <div className="p-8 text-center">
                              <h1 className="text-2xl font-bold mb-4">
                                Contratos
                              </h1>
                              <p>Módulo em desenvolvimento pela KRYONIX</p>
                            </div>
                          }
                        />
                        <Route
                          path="financeiro"
                          element={
                            <div className="p-8 text-center">
                              <h1 className="text-2xl font-bold mb-4">
                                Financeiro
                              </h1>
                              <p>Módulo em desenvolvimento pela KRYONIX</p>
                            </div>
                          }
                        />
                        <Route
                          path="relatorios"
                          element={
                            <div className="p-8 text-center">
                              <h1 className="text-2xl font-bold mb-4">
                                Relatórios
                              </h1>
                              <p>Módulo em desenvolvimento pela KRYONIX</p>
                            </div>
                          }
                        />
                        <Route
                          path="configuracoes"
                          element={
                            <div className="p-8 text-center">
                              <h1 className="text-2xl font-bold mb-4">
                                Configurações
                              </h1>
                              <p>Módulo em desenvolvimento pela KRYONIX</p>
                            </div>
                          }
                        />
                      </Routes>
                    </ProtectedRoute>
                  }
                />

                {/* Nested Routes - Cliente */}
                <Route
                  path="/cliente/*"
                  element={
                    <ProtectedRoute requiredRoles={["CLIENTE", "ADMIN"]}>
                      <Routes>
                        <Route
                          path="favoritos"
                          element={
                            <div className="p-8 text-center">
                              <h1 className="text-2xl font-bold mb-4">
                                Favoritos
                              </h1>
                              <p>Módulo em desenvolvimento pela KRYONIX</p>
                            </div>
                          }
                        />
                        <Route
                          path="mensagens"
                          element={
                            <div className="p-8 text-center">
                              <h1 className="text-2xl font-bold mb-4">
                                Mensagens
                              </h1>
                              <p>Módulo em desenvolvimento pela KRYONIX</p>
                            </div>
                          }
                        />
                        <Route
                          path="contratos"
                          element={
                            <div className="p-8 text-center">
                              <h1 className="text-2xl font-bold mb-4">
                                Meus Contratos
                              </h1>
                              <p>Módulo em desenvolvimento pela KRYONIX</p>
                            </div>
                          }
                        />
                        <Route
                          path="visitas"
                          element={
                            <div className="p-8 text-center">
                              <h1 className="text-2xl font-bold mb-4">
                                Minhas Visitas
                              </h1>
                              <p>Módulo em desenvolvimento pela KRYONIX</p>
                            </div>
                          }
                        />
                        <Route
                          path="perfil"
                          element={
                            <div className="p-8 text-center">
                              <h1 className="text-2xl font-bold mb-4">
                                Meu Perfil
                              </h1>
                              <p>Módulo em desenvolvimento pela KRYONIX</p>
                            </div>
                          }
                        />
                      </Routes>
                    </ProtectedRoute>
                  }
                />

                {/* 404 - Must be last */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </RouteErrorBoundary>
  );
}
