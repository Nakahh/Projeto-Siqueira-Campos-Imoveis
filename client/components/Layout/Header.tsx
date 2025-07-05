import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { NotificationCenter } from "@/components/Notifications/NotificationCenter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  FileText,
  Calculator,
  Users,
  MessageCircle,
  X,
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
    { label: "Simulador", href: "/simulador-financiamento", icon: Calculator },
    { label: "Blog", href: "/blog", icon: FileText },
    { label: "Sobre", href: "/sobre", icon: Users },
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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-brand-brown-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-brand-brown-200 dark:border-brand-brown-700">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile: Menu Button (Left) */}
          <div className="flex items-center lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-brand-brown-700 dark:text-brand-beige-200"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-80 bg-white dark:bg-brand-brown-900 border-r border-brand-brown-200 dark:border-brand-brown-700"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-2">
                      <Home className="h-8 w-8 text-brand-brown-600" />
                      <span className="text-xl font-bold text-brand-brown-800 dark:text-brand-beige-200">
                        Siqueira Campos
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1">
                    <ul className="space-y-2">
                      {menuItems.map((item) => (
                        <li key={item.href}>
                          <Link
                            to={item.href}
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-brand-brown-700 dark:text-brand-beige-200 hover:bg-brand-brown-100 dark:hover:bg-brand-brown-800 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <item.icon className="h-5 w-5" />
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {/* Mobile User Section */}
                    {user && (
                      <div className="mt-8 pt-8 border-t border-brand-brown-200 dark:border-brand-brown-700">
                        <div className="flex items-center space-x-3 px-4 py-3 mb-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={user.nome} />
                            <AvatarFallback className="bg-brand-brown-600 text-white">
                              {user.nome
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-brand-brown-800 dark:text-brand-beige-200">
                              {user.nome}
                            </p>
                            <p className="text-sm text-brand-brown-600 dark:text-brand-beige-300">
                              {user.tipo}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Link
                            to={getDashboardUrl()}
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-brand-brown-700 dark:text-brand-beige-200 hover:bg-brand-brown-100 dark:hover:bg-brand-brown-800 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Settings className="h-5 w-5" />
                            <span>Dashboard</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors w-full text-left"
                          >
                            <LogOut className="h-5 w-5" />
                            <span>Sair</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation (Left) */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-brand-brown-700 dark:text-brand-beige-200 hover:text-brand-brown-900 dark:hover:text-brand-beige-100 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Logo (Center) */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-brand-brown-600" />
              <span className="text-xl font-bold text-brand-brown-800 dark:text-brand-beige-200 hidden sm:block">
                Siqueira Campos
              </span>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-brand-brown-700 dark:text-brand-beige-200"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* User Menu or Login */}
            {user ? (
              <div className="hidden lg:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.nome} />
                        <AvatarFallback className="bg-brand-brown-600 text-white">
                          {user.nome
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
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
                        <Settings className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {user.tipo === "CLIENTE" && (
                      <DropdownMenuItem asChild>
                        <Link to="/cliente/favoritos">
                          <Heart className="mr-2 h-4 w-4" />
                          Favoritos
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-brand-brown-700 dark:text-brand-beige-200"
                >
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Entrar</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
