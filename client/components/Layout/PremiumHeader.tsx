import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NotificationCenter } from "@/components/Notifications/NotificationCenter";
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
  Crown,
  Shield,
  Award,
  Sparkles,
  Building2,
} from "lucide-react";
import { useTheme } from "next-themes";

export function PremiumHeader() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Início", href: "/", icon: Home, premium: true },
    {
      label: "Imóveis Premium",
      href: "/imoveis",
      icon: Building2,
      premium: true,
    },
    {
      label: "Simulador Elite",
      href: "/simulador-financiamento",
      icon: Calculator,
      premium: true,
    },
    { label: "Blog Exclusivo", href: "/blog", icon: FileText, premium: false },
    { label: "Sobre Nós", href: "/sobre", icon: Users, premium: false },
    { label: "Contato VIP", href: "/contato", icon: Phone, premium: true },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

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
        return "/";
    }
  };

  return (
    <>
      {/* Premium Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 dark:bg-brand-brown-900/95 backdrop-blur-lg shadow-xl border-b border-brand-brown-200/20"
            : "bg-transparent"
        }`}
      >
        {/* Top Bar Premium */}
        <div className="bg-gradient-to-r from-brand-brown-900 via-brand-brown-800 to-brand-brown-900 text-brand-beige-100 py-2">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Crown className="h-4 w-4 text-yellow-400" />
                  <span className="font-semibold">Imobiliária Premium</span>
                </div>
                <div className="hidden md:flex items-center space-x-1">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span>Negócios Seguros</span>
                </div>
                <div className="hidden md:flex items-center space-x-1">
                  <Award className="h-4 w-4 text-blue-400" />
                  <span>Certificada CRECI</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className="hidden sm:block">📞 (62) 3333-4444</span>
                <span className="hidden sm:block">
                  📧 vip@siqueiracampos.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo Premium */}
            <Link
              to="/"
              className="flex items-center space-x-3 group transition-transform hover:scale-105"
            >
              <div className="relative">
                {/* Logo da empresa - versão clara para fundo claro */}
                <img
                  src="https://cdn.builder.io/api/v1/assets/175866fa236440d4a5b360ca5b1302b3/siqueira-campos-para-fundo-claro-0c3be3?format=webp&width=400"
                  alt="Siqueira Campos Imóveis"
                  className="h-10 w-auto dark:hidden"
                />
                {/* Logo da empresa - versão escura para fundo escuro */}
                <img
                  src="https://cdn.builder.io/api/v1/assets/175866fa236440d4a5b360ca5b1302b3/siqueira-campos-para-fundo-escuro-2b3ef2?format=webp&width=400"
                  alt="Siqueira Campos Imóveis"
                  className="h-10 w-auto hidden dark:block"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-2 w-2 text-brand-brown-900" />
                </div>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-brand-brown-600 dark:text-brand-beige-400 font-medium">
                  Premium Real Estate
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="group relative px-4 py-2 rounded-lg transition-all duration-300 hover:bg-brand-brown-50 dark:hover:bg-brand-brown-800/50"
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4 text-brand-brown-600 dark:text-brand-beige-300 group-hover:text-brand-brown-800 dark:group-hover:text-brand-beige-100" />
                    <span className="font-medium text-brand-brown-700 dark:text-brand-beige-200 group-hover:text-brand-brown-900 dark:group-hover:text-brand-beige-100">
                      {item.label}
                    </span>
                    {item.premium && (
                      <Crown className="h-3 w-3 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-brand-brown-600 to-brand-brown-800 transition-all duration-300 group-hover:w-full group-hover:left-0"></div>
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              {user && <NotificationCenter />}

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="relative text-brand-brown-700 dark:text-brand-beige-200 hover:bg-brand-brown-100 dark:hover:bg-brand-brown-800 rounded-xl"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-brand-brown-100 to-brand-beige-100 dark:from-brand-brown-800 dark:to-brand-brown-700 border border-brand-brown-200 dark:border-brand-brown-600 hover:shadow-lg transition-all"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.nome} />
                        <AvatarFallback className="bg-gradient-to-br from-brand-brown-600 to-brand-brown-800 text-brand-beige-100 text-sm font-semibold">
                          {user.nome.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-64 bg-white/95 dark:bg-brand-brown-900/95 backdrop-blur-lg border border-brand-brown-200/50 dark:border-brand-brown-700/50 shadow-xl"
                    align="end"
                  >
                    <div className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.nome} />
                          <AvatarFallback className="bg-gradient-to-br from-brand-brown-600 to-brand-brown-800 text-brand-beige-100">
                            {user.nome.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-brand-brown-900 dark:text-brand-beige-100">
                            {user.nome}
                          </p>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-brand-brown-100 text-brand-brown-800 dark:bg-brand-brown-800 dark:text-brand-beige-200"
                          >
                            {user.tipo}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-brand-brown-200 dark:bg-brand-brown-700" />
                    <DropdownMenuItem asChild>
                      <Link
                        to={getDashboardUrl()}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-brand-brown-50 dark:hover:bg-brand-brown-800"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-brand-brown-50 dark:hover:bg-brand-brown-800"
                      >
                        <User className="h-4 w-4" />
                        <span>Meu Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-brand-brown-200 dark:bg-brand-brown-700" />
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    asChild
                    className="text-brand-brown-700 dark:text-brand-beige-200 hover:bg-brand-brown-100 dark:hover:bg-brand-brown-800 rounded-xl font-medium"
                  >
                    <Link to="/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Entrar
                    </Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu */}
              <div className="lg:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-brand-brown-700 dark:text-brand-beige-200 hover:bg-brand-brown-100 dark:hover:bg-brand-brown-800 rounded-xl"
                    >
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-80 bg-white/95 dark:bg-brand-brown-900/95 backdrop-blur-lg border-l border-brand-brown-200/50 dark:border-brand-brown-700/50"
                  >
                    <div className="flex flex-col h-full">
                      {/* Mobile Menu Header */}
                      <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-brown-200 dark:border-brand-brown-700">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-brand-brown-600 to-brand-brown-800 rounded-lg flex items-center justify-center">
                            <Home className="h-5 w-5 text-brand-beige-100" />
                          </div>
                          <div>
                            <h2 className="font-bold text-brand-brown-800 dark:text-brand-beige-200">
                              Siqueira Campos
                            </h2>
                            <p className="text-xs text-brand-brown-600 dark:text-brand-beige-400">
                              Premium Real Estate
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-brand-brown-600 hover:bg-brand-brown-100 dark:hover:bg-brand-brown-800 rounded-lg"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Mobile Navigation */}
                      <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            className="flex items-center justify-between p-4 rounded-xl bg-brand-brown-50/50 dark:bg-brand-brown-800/50 hover:bg-brand-brown-100 dark:hover:bg-brand-brown-800 transition-colors group"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-brand-brown-100 dark:bg-brand-brown-700 rounded-lg flex items-center justify-center group-hover:bg-brand-brown-200 dark:group-hover:bg-brand-brown-600 transition-colors">
                                <item.icon className="h-4 w-4 text-brand-brown-600 dark:text-brand-beige-300" />
                              </div>
                              <span className="font-medium text-brand-brown-700 dark:text-brand-beige-200">
                                {item.label}
                              </span>
                            </div>
                            {item.premium && (
                              <Crown className="h-4 w-4 text-yellow-500" />
                            )}
                          </Link>
                        ))}
                      </nav>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Premium House Image */}
      <section className="relative h-[70vh] overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            transform: scrolled ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.3s ease-out",
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-brown-900/80 via-brand-brown-800/60 to-brand-brown-900/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-brown-900/90 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="mb-6 flex items-center space-x-3">
                <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 backdrop-blur-sm">
                  <Crown className="h-3 w-3 mr-1" />
                  Imobiliária Premium #1 em Goiânia
                </Badge>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Imóveis de
                <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Alto Padrão
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-brand-beige-200 mb-8 max-w-2xl leading-relaxed">
                Descobra residências exclusivas e investimentos únicos com nossa
                expertise em imóveis premium
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brand-brown-900 font-semibold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Explorar Imóveis Premium
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl font-semibold"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Consultoria Personalizada
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    1.200+
                  </div>
                  <div className="text-brand-beige-300 text-sm">
                    Imóveis Premium
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">98%</div>
                  <div className="text-brand-beige-300 text-sm">Satisfação</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">15+</div>
                  <div className="text-brand-beige-300 text-sm">
                    Anos Experiência
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>
    </>
  );
}
