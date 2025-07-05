import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

// Dashboards
import CorretorDashboard from "@/pages/Corretor/Dashboard";
import AdminDashboard from "@/pages/Admin/Dashboard";
import ClienteDashboard from "@/pages/Cliente/Dashboard";
import DesenvolvedorDashboard from "@/pages/Desenvolvedor/Dashboard";

// Outras páginas
import Imoveis from "@/pages/Imoveis";
import ImovelDetalhes from "@/pages/ImovelDetalhes";
import Contato from "@/pages/Contato";
import SimuladorFinanciamento from "@/pages/SimuladorFinanciamento";
import Blog from "@/pages/Blog";
import Sobre from "@/pages/Sobre";
import Desenvolvedor from "@/pages/Desenvolvedor";

// Componente para rotas protegidas
function ProtectedRoute({
  children,
  requiredRoles,
}: {
  children: React.ReactNode;
  requiredRoles?: string[];
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-brown-700"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user.tipo)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Componente para redirecionamento baseado no tipo de usuário
function DashboardRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.tipo) {
    case "ADMIN":
      return <Navigate to="/admin/dashboard" replace />;
    case "CORRETOR":
    case "ASSISTENTE":
      return <Navigate to="/corretor/dashboard" replace />;
    case "CLIENTE":
      return <Navigate to="/cliente/dashboard" replace />;
    case "MARKETING":
      return <Navigate to="/marketing/dashboard" replace />;
    case "DESENVOLVEDOR":
      return <Navigate to="/dev/dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Páginas Públicas */}
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

            {/* Redirecionamento para dashboard apropriado */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />

            {/* Dashboard do Admin */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Dashboard do Corretor/Assistente */}
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

            {/* Dashboard do Cliente */}
            <Route
              path="/cliente/dashboard"
              element={
                <ProtectedRoute requiredRoles={["CLIENTE", "ADMIN"]}>
                  <ClienteDashboard />
                </ProtectedRoute>
              }
            />

            {/* Rotas do Corretor */}
            <Route
              path="/corretor/*"
              element={
                <ProtectedRoute
                  requiredRoles={["CORRETOR", "ASSISTENTE", "ADMIN"]}
                >
                  <Routes>
                    <Route
                      path="imoveis"
                      element={<div>Gestão de Imóveis</div>}
                    />
                    <Route path="leads" element={<div>Gestão de Leads</div>} />
                    <Route path="agenda" element={<div>Agenda</div>} />
                    <Route path="comissoes" element={<div>Comissões</div>} />
                    <Route
                      path="whatsapp"
                      element={<div>WhatsApp Config</div>}
                    />
                    <Route path="perfil" element={<div>Perfil</div>} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Rotas do Admin */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredRoles={["ADMIN"]}>
                  <Routes>
                    <Route
                      path="usuarios"
                      element={<div>Gestão de Usuários</div>}
                    />
                    <Route
                      path="imoveis"
                      element={<div>Gestão de Imóveis</div>}
                    />
                    <Route path="leads" element={<div>Gestão de Leads</div>} />
                    <Route path="contratos" element={<div>Contratos</div>} />
                    <Route path="financeiro" element={<div>Financeiro</div>} />
                    <Route path="relatorios" element={<div>Relatórios</div>} />
                    <Route
                      path="configuracoes"
                      element={<div>Configurações</div>}
                    />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Rotas do Cliente */}
            <Route
              path="/cliente/*"
              element={
                <ProtectedRoute requiredRoles={["CLIENTE", "ADMIN"]}>
                  <Routes>
                    <Route path="favoritos" element={<div>Favoritos</div>} />
                    <Route path="mensagens" element={<div>Mensagens</div>} />
                    <Route
                      path="contratos"
                      element={<div>Meus Contratos</div>}
                    />
                    <Route path="visitas" element={<div>Minhas Visitas</div>} />
                    <Route path="perfil" element={<div>Meu Perfil</div>} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Rotas do Marketing */}
            <Route
              path="/marketing/*"
              element={
                <ProtectedRoute requiredRoles={["MARKETING", "ADMIN"]}>
                  <Routes>
                    <Route
                      path="dashboard"
                      element={<div>Marketing Dashboard</div>}
                    />
                    <Route path="campanhas" element={<div>Campanhas</div>} />
                    <Route path="leads" element={<div>Leads Marketing</div>} />
                    <Route path="emails" element={<div>Email Marketing</div>} />
                    <Route
                      path="relatorios"
                      element={<div>Relatórios Marketing</div>}
                    />
                    <Route
                      path="configuracoes"
                      element={<div>Config Marketing</div>}
                    />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Rotas do Desenvolvedor */}
            <Route
              path="/dev/*"
              element={
                <ProtectedRoute requiredRoles={["DESENVOLVEDOR", "ADMIN"]}>
                  <Routes>
                    <Route
                      path="dashboard"
                      element={<div>Dev Dashboard</div>}
                    />
                    <Route
                      path="sistema"
                      element={<div>Status do Sistema</div>}
                    />
                    <Route
                      path="database"
                      element={<div>Banco de Dados</div>}
                    />
                    <Route path="apis" element={<div>APIs</div>} />
                    <Route path="logs" element={<div>Logs do Sistema</div>} />
                    <Route path="seguranca" element={<div>Segurança</div>} />
                    <Route
                      path="configuracoes"
                      element={<div>Configurações Dev</div>}
                    />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Página 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
