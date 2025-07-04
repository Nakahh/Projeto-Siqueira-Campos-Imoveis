import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Search,
  Heart,
  Phone,
  User,
  LogIn,
  LogOut,
  Settings,
  Moon,
  Sun,
  Menu,
} from "lucide-react";
import { useTheme } from "next-themes";

export function Header() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: "Início", href: "/", icon: Home },
    { label: "Imóveis", href: "/imoveis", icon: Search },
    { label: "Contato", href: "/contato", icon: Phone },
  ];

  const getDashboardUrl = () => {
    if (!user) return "/login";

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

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="https://cdn.builder.io/api/v1/assets/175866fa236440d4a5b360ca5b1302b3/siqueira-campos-para-fundo-claro-0c3be3?format=webp&width=800"
              alt="Siqueira Campos Imóveis"
              className="h-10 w-auto dark:hidden"
            />
            <img
              src="https://cdn.builder.io/api/v1/assets/175866fa236440d4a5b360ca5b1302b3/siqueira-campos-para-fundo-escuro-2b3ef2?format=webp&width=800"
              alt="Siqueira Campos Imóveis"
              className="h-10 w-auto hidden dark:block"
            />
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-brand-brown-700 dark:hover:text-brand-beige-400 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Ações do usuário */}
          <div className="flex items-center space-x-4">
            {/* Toggle tema */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {user ? (
              <>
                {/* Favoritos (apenas para clientes) */}
                {user.tipo === "CLIENTE" && (
                  <Button variant="ghost" size="icon" asChild>
                    <Link to="/favoritos">
                      <Heart className="h-4 w-4" />
                    </Link>
                  </Button>
                )}

                {/* Menu do usuário */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.nome} />
                        <AvatarFallback>
                          {user.nome.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.nome}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardUrl()}>
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/perfil">
                        <Settings className="mr-2 h-4 w-4" />
                        Configurações
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild>
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Entrar
                </Link>
              </Button>
            )}

            {/* Menu mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-brand-brown-700 dark:hover:text-brand-beige-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
