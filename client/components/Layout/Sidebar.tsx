import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Home,
  Users,
  Building2,
  MessageSquare,
  Heart,
  FileText,
  DollarSign,
  BarChart3,
  Settings,
  UserPlus,
  Calendar,
  Mail,
  Smartphone,
  Shield,
  Code,
  TrendingUp,
  Database,
  Activity,
} from "lucide-react";

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const getMenuItems = () => {
    const baseItems = [
      {
        label: "Dashboard",
        href: getDashboardPath(),
        icon: LayoutDashboard,
      },
    ];

    switch (user.tipo) {
      case "ADMIN":
        return [
          ...baseItems,
          {
            label: "Imóveis",
            href: "/admin/imoveis",
            icon: Building2,
          },
          {
            label: "Usuários",
            href: "/admin/usuarios",
            icon: Users,
          },
          {
            label: "Leads",
            href: "/admin/leads",
            icon: MessageSquare,
          },
          {
            label: "Contratos",
            href: "/admin/contratos",
            icon: FileText,
          },
          {
            label: "Financeiro",
            href: "/admin/financeiro",
            icon: DollarSign,
          },
          {
            label: "Relatórios",
            href: "/admin/relatorios",
            icon: BarChart3,
          },
          {
            label: "Configurações",
            href: "/admin/configuracoes",
            icon: Settings,
          },
        ];

      case "CORRETOR":
        return [
          ...baseItems,
          {
            label: "Meus Imóveis",
            href: "/corretor/imoveis",
            icon: Building2,
          },
          {
            label: "Leads",
            href: "/corretor/leads",
            icon: MessageSquare,
          },
          {
            label: "Agenda",
            href: "/corretor/agenda",
            icon: Calendar,
          },
          {
            label: "Comissões",
            href: "/corretor/comissoes",
            icon: DollarSign,
          },
          {
            label: "WhatsApp",
            href: "/corretor/whatsapp",
            icon: Smartphone,
          },
          {
            label: "Perfil",
            href: "/corretor/perfil",
            icon: Settings,
          },
        ];

      case "ASSISTENTE":
        return [
          ...baseItems,
          {
            label: "Imóveis",
            href: "/corretor/imoveis",
            icon: Building2,
          },
          {
            label: "Leads",
            href: "/corretor/leads",
            icon: MessageSquare,
          },
          {
            label: "Agenda",
            href: "/corretor/agenda",
            icon: Calendar,
          },
          {
            label: "Cadastros",
            href: "/corretor/cadastros",
            icon: UserPlus,
          },
        ];

      case "CLIENTE":
        return [
          ...baseItems,
          {
            label: "Favoritos",
            href: "/cliente/favoritos",
            icon: Heart,
          },
          {
            label: "Mensagens",
            href: "/cliente/mensagens",
            icon: MessageSquare,
          },
          {
            label: "Contratos",
            href: "/cliente/contratos",
            icon: FileText,
          },
          {
            label: "Perfil",
            href: "/cliente/perfil",
            icon: Settings,
          },
        ];

      case "MARKETING":
        return [
          ...baseItems,
          {
            label: "Campanhas",
            href: "/marketing/campanhas",
            icon: TrendingUp,
          },
          {
            label: "Leads",
            href: "/marketing/leads",
            icon: MessageSquare,
          },
          {
            label: "Email Marketing",
            href: "/marketing/emails",
            icon: Mail,
          },
          {
            label: "Relatórios",
            href: "/marketing/relatorios",
            icon: BarChart3,
          },
          {
            label: "Configurações",
            href: "/marketing/configuracoes",
            icon: Settings,
          },
        ];

      case "DESENVOLVEDOR":
        return [
          ...baseItems,
          {
            label: "Sistema",
            href: "/dev/sistema",
            icon: Activity,
          },
          {
            label: "Banco de Dados",
            href: "/dev/database",
            icon: Database,
          },
          {
            label: "APIs",
            href: "/dev/apis",
            icon: Code,
          },
          {
            label: "Logs",
            href: "/dev/logs",
            icon: FileText,
          },
          {
            label: "Segurança",
            href: "/dev/seguranca",
            icon: Shield,
          },
          {
            label: "Configurações",
            href: "/dev/configuracoes",
            icon: Settings,
          },
        ];

      default:
        return baseItems;
    }
  };

  const getDashboardPath = () => {
    switch (user.tipo) {
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
        return "/dashboard";
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {user.tipo === "ADMIN" && "Administração"}
            {(user.tipo === "CORRETOR" || user.tipo === "ASSISTENTE") &&
              "Área do Corretor"}
            {user.tipo === "CLIENTE" && "Área do Cliente"}
            {user.tipo === "MARKETING" && "Marketing"}
            {user.tipo === "DESENVOLVEDOR" && "Desenvolvimento"}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {user.nome}
          </p>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                location.pathname === item.href
                  ? "bg-brand-brown-100 text-brand-brown-900 dark:bg-brand-brown-800 dark:text-brand-beige-100"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
              )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
