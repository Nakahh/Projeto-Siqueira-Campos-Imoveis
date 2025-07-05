import React, { useState, useEffect, useCallback } from "react";
import { cachedFetch } from "@/utils/cache";
import { Link } from "react-router-dom";
import { PremiumHeader } from "@/components/Layout/PremiumHeader";
import { PremiumChatWidget } from "@/components/Chat/PremiumChatWidget";
import { PremiumFAQ } from "@/components/FAQ/PremiumFAQ";
import DepoimentosSection from "@/components/Home/DepoimentosSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Bed,
  Bath,
  Square,
  Car,
  Heart,
  Share2,
  Calendar,
  MessageCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Shield,
  Clock,
  Phone,
  Crown,
  Award,
  Sparkles,
  Building2,
  Users,
  Zap,
  CheckCircle,
  Eye,
  BarChart3,
  Home,
  Compass,
  Target,
  Diamond,
} from "lucide-react";

interface Imovel {
  id: number;
  titulo: string;
  endereco: string;
  bairro: string;
  preco: number;
  tipo: string;
  quartos: number;
  banheiros: number;
  area: number;
  vagas: number;
  fotos: string[];
  destaque: boolean;
  status: string;
}

export default function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const [imoveisDestaque, setImoveisDestaque] = useState<Imovel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadImoveisDestaque = useCallback(async () => {
    if (!isLoading) return;

    try {
      const data = await cachedFetch<Imovel[]>("/api/imoveis/destaque", {
        cacheOptions: {
          ttl: 5 * 60 * 1000,
          persistToStorage: true,
        },
      });
      setImoveisDestaque(data);
    } catch (error) {
      console.error("Erro ao carregar imóveis:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    loadImoveisDestaque();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const testimonials = [
    {
      name: "Maria Silva",
      role: "CEO Empresária",
      content:
        "Experiência extraordinária! Encontrei minha mansão dos sonhos com atendimento VIP incomparável.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b5c1?w=100&h=100&fit=crop&crop=face",
      location: "Setor Marista",
    },
    {
      name: "João Santos",
      role: "Investidor Premium",
      content:
        "Portfolio imobiliário de R$ 5M+ construído com a Siqueira Campos. Retorno excepcional!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      location: "Setor Bueno",
    },
    {
      name: "Ana Costa",
      role: "Arquiteta",
      content:
        "Venderam meu penthouse em 15 dias por valor 20% acima do mercado. Simplesmente perfeito!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      location: "Setor Oeste",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Premium Header with Hero */}
      <PremiumHeader />

      <main className="pt-0">
        {/* Ultra-Premium Search Section */}
        <section className="relative py-24 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-brand-brown-50/30 to-brand-beige-50/50 dark:from-brand-brown-900 dark:via-brand-brown-800/80 dark:to-brand-brown-900">
            {/* Floating Geometric Shapes */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-amber-500/10 rounded-full animate-float"></div>
            <div
              className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-brand-brown-400/10 to-brand-brown-600/10 rounded-full animate-float"
              style={{ animationDelay: "-1s" }}
            ></div>
            <div
              className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-br from-amber-400/10 to-yellow-500/10 rounded-full animate-float"
              style={{ animationDelay: "-2s" }}
            ></div>
          </div>

          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Premium Search Card */}
              <Card className="premium-card p-8 md:p-12 shadow-2xl border-0">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center space-x-3">
                      <Diamond className="h-8 w-8 text-yellow-500 animate-sparkle" />
                      <Crown className="h-10 w-10 text-yellow-600 animate-premium-pulse" />
                      <Diamond
                        className="h-8 w-8 text-yellow-500 animate-sparkle"
                        style={{ animationDelay: "0.5s" }}
                      />
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-brown-800 via-amber-700 to-brand-brown-900 bg-clip-text text-transparent mb-4">
                    Busca Inteligente Premium
                  </h2>
                  <p className="text-lg text-brand-brown-600 dark:text-brand-beige-300 max-w-2xl mx-auto">
                    Encontre seu imóvel dos sonhos com nossa IA avançada e
                    curadoria de especialistas
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 mb-8">
                  <div className="flex-1 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Input
                      type="text"
                      placeholder="Ex: 'Penthouse com piscina no Setor Marista' ou 'Casa 4 suítes até R$ 1.5M'"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="relative h-16 text-lg pl-6 pr-4 border-2 border-brand-brown-200/50 dark:border-brand-brown-700/50 focus:border-yellow-500 rounded-xl bg-white/70 dark:bg-brand-brown-800/70 backdrop-blur-sm placeholder:text-brand-brown-400 group"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="h-16 px-10 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-600 hover:via-amber-600 hover:to-yellow-700 text-brand-brown-900 font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 interactive-button"
                    asChild
                  >
                    <Link
                      to={`/imoveis${searchTerm ? `?search=${searchTerm}` : ""}`}
                    >
                      <Search className="mr-3 h-6 w-6" />
                      Buscar Premium
                      <Sparkles className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>

                {/* Premium Categories */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Mansões & Casas de Luxo",
                      icon: "🏰",
                      type: "casa",
                      gradient: "from-purple-500/20 to-pink-500/20",
                    },
                    {
                      label: "Penthouses Premium",
                      icon: "🏙️",
                      type: "apartamento",
                      gradient: "from-blue-500/20 to-cyan-500/20",
                    },
                    {
                      label: "Terrenos Exclusivos",
                      icon: "🌿",
                      type: "terreno",
                      gradient: "from-green-500/20 to-emerald-500/20",
                    },
                    {
                      label: "Comercial VIP",
                      icon: "🏢",
                      type: "comercial",
                      gradient: "from-orange-500/20 to-red-500/20",
                    },
                  ].map((categoria) => (
                    <Button
                      key={categoria.label}
                      variant="outline"
                      className={`h-auto p-4 flex flex-col items-center space-y-2 border-2 border-brand-brown-200/50 dark:border-brand-brown-600/50 rounded-xl font-medium hover:scale-105 transition-all duration-300 group bg-gradient-to-br ${categoria.gradient} hover:shadow-lg`}
                      asChild
                    >
                      <Link to={`/imoveis?tipo=${categoria.type}`}>
                        <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                          {categoria.icon}
                        </span>
                        <span className="text-sm text-center text-brand-brown-700 dark:text-brand-beige-200 group-hover:text-brand-brown-900 dark:group-hover:text-white">
                          {categoria.label}
                        </span>
                      </Link>
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Ultra-Premium Why Choose Us */}
        <section className="py-24 bg-gradient-to-br from-brand-brown-900 via-brand-brown-800 to-brand-brown-900 text-white relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_70%)]"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"></div>
          </div>

          <div className="relative container mx-auto px-4">
            <div className="text-center mb-20">
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  <Award className="h-12 w-12 text-yellow-400 animate-luxury-glow" />
                  <Crown className="h-16 w-16 text-yellow-500 animate-premium-pulse" />
                  <Award className="h-12 w-12 text-yellow-400 animate-luxury-glow" />
                </div>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold mb-8">
                <span className="block text-white">Por que somos a</span>
                <span className="block bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-600 bg-clip-text text-transparent animate-gradient-shift">
                  #1 Premium em Goiânia
                </span>
              </h2>
              <p className="text-2xl text-brand-beige-200 max-w-4xl mx-auto leading-relaxed">
                Mais de 15 anos transformando sonhos em realidade com
                excelência, inovação e resultados extraordinários que superam
                expectativas
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {[
                {
                  icon: Crown,
                  title: "Experiência Ultra-Premium",
                  description:
                    "Atendimento VIP personalizado com consultores especialistas certificados em imóveis de alto padrão e luxo",
                  stats: "98% Satisfação",
                  color: "from-yellow-400 to-amber-500",
                  features: [
                    "Consultor Dedicado 24/7",
                    "Acesso VIP a Lançamentos",
                    "Relatórios Personalizados",
                  ],
                },
                {
                  icon: Shield,
                  title: "Segurança & Garantia Total",
                  description:
                    "Processos certificados ISO e garantia completa em documentação, transações e pós-venda",
                  stats: "100% Seguro",
                  color: "from-emerald-400 to-green-500",
                  features: [
                    "Seguro Jurídico Completo",
                    "Auditoria Documental",
                    "Suporte Pós-Venda Vitalício",
                  ],
                },
                {
                  icon: Target,
                  title: "Resultados Comprovados",
                  description:
                    "Mais de 5.000 famílias realizaram sonhos e R$ 500M+ em negócios fechados com excelência",
                  stats: "5.000+ Famílias",
                  color: "from-blue-400 to-cyan-500",
                  features: [
                    "Portfolio R$ 500M+",
                    "Média 45 dias para venda",
                    "ROI 25% acima do mercado",
                  ],
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="premium-card hover-luxury group relative overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>
                  <CardContent className="relative p-10 text-center">
                    <div
                      className={`w-24 h-24 bg-gradient-to-br ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl`}
                    >
                      <feature.icon className="h-12 w-12 text-white" />
                    </div>

                    <Badge
                      className={`bg-gradient-to-r ${feature.color} text-white border-0 mb-6 px-4 py-2 text-sm font-bold`}
                    >
                      {feature.stats}
                    </Badge>

                    <h3 className="text-3xl font-bold mb-6 text-white group-hover:text-yellow-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-brand-beige-200 text-lg leading-relaxed mb-8">
                      {feature.description}
                    </p>

                    <div className="space-y-3">
                      {feature.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-center space-x-2"
                        >
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <span className="text-brand-beige-300">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Ultra-Premium Stats */}
            <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: "1.500+", label: "Imóveis Premium", icon: Building2 },
                { number: "15+", label: "Anos Liderança", icon: Crown },
                { number: "5.000+", label: "Clientes VIP", icon: Users },
                { number: "R$ 500M+", label: "Em Negócios", icon: TrendingUp },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-yellow-400/30 group-hover:to-amber-500/30 transition-colors">
                    <stat.icon className="h-8 w-8 text-yellow-400" />
                  </div>
                  <div className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-brand-beige-300 font-semibold text-lg">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ultra-Premium Featured Properties */}
        <section className="py-24 bg-gradient-to-br from-white via-brand-brown-50/30 to-brand-beige-50/50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-16">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Diamond className="h-8 w-8 text-yellow-500" />
                  <Crown className="h-6 w-6 text-yellow-600" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-brown-800 to-brand-brown-600 bg-clip-text text-transparent mb-4">
                  Imóveis Exclusivos em Destaque
                </h2>
                <p className="text-xl text-brand-brown-600 dark:text-brand-beige-300 max-w-2xl">
                  Curadoria especial dos melhores imóveis premium de Goiânia
                </p>
              </div>
              <Button
                asChild
                className="bg-gradient-to-r from-brand-brown-700 to-brand-brown-800 hover:from-brand-brown-800 hover:to-brand-brown-900 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                <Link to="/imoveis">
                  <Eye className="mr-2 h-5 w-5" />
                  Ver Todos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="overflow-hidden animate-pulse">
                    <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-6 bg-gray-300 rounded w-full"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {imoveisDestaque.slice(0, 6).map((imovel) => (
                  <Card
                    key={imovel.id}
                    className="overflow-hidden premium-card hover-luxury group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          imovel.fotos[0] ||
                          "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        }
                        alt={imovel.titulo}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {imovel.destaque && (
                        <Badge className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-brand-brown-900 font-bold border-0">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}

                      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <Button
                          size="icon"
                          className="h-10 w-10 rounded-full bg-white/90 hover:bg-white text-brand-brown-800 shadow-lg"
                        >
                          <Heart className="h-5 w-5" />
                        </Button>
                        <Button
                          size="icon"
                          className="h-10 w-10 rounded-full bg-white/90 hover:bg-white text-brand-brown-800 shadow-lg"
                        >
                          <Share2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="mb-4">
                        <Badge
                          variant="outline"
                          className="border-brand-brown-300 text-brand-brown-700 mb-2"
                        >
                          {imovel.tipo}
                        </Badge>
                        <h3 className="font-bold text-xl mb-2 text-brand-brown-800 dark:text-brand-beige-200 group-hover:text-brand-brown-900 transition-colors">
                          {imovel.titulo}
                        </h3>
                        <p className="text-brand-brown-600 dark:text-brand-beige-400 flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {imovel.bairro}, Goiânia
                        </p>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-6 text-sm text-brand-brown-600 dark:text-brand-beige-400">
                        <div className="flex flex-col items-center p-2 bg-brand-brown-50 dark:bg-brand-brown-800 rounded-lg">
                          <Bed className="h-4 w-4 mb-1" />
                          <span className="font-medium">{imovel.quartos}</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-brand-brown-50 dark:bg-brand-brown-800 rounded-lg">
                          <Bath className="h-4 w-4 mb-1" />
                          <span className="font-medium">
                            {imovel.banheiros}
                          </span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-brand-brown-50 dark:bg-brand-brown-800 rounded-lg">
                          <Square className="h-4 w-4 mb-1" />
                          <span className="font-medium">{imovel.area}m²</span>
                        </div>
                        {imovel.vagas > 0 && (
                          <div className="flex flex-col items-center p-2 bg-brand-brown-50 dark:bg-brand-brown-800 rounded-lg">
                            <Car className="h-4 w-4 mb-1" />
                            <span className="font-medium">{imovel.vagas}</span>
                          </div>
                        )}
                      </div>

                      <div className="mb-6">
                        <p className="text-3xl font-bold bg-gradient-to-r from-brand-brown-700 to-brand-brown-800 bg-clip-text text-transparent">
                          {formatPrice(imovel.preco)}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="border-2 border-brand-brown-300 text-brand-brown-700 hover:bg-brand-brown-50 rounded-lg font-medium"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Agendar
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-brand-brown-700 to-brand-brown-800 hover:from-brand-brown-800 hover:to-brand-brown-900 text-white rounded-lg font-medium shadow-lg"
                          asChild
                        >
                          <Link to={`/imoveis/${imovel.id}`}>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Detalhes
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Ultra-Premium Testimonials */}
        <section className="py-24 bg-gradient-to-br from-brand-brown-50 via-brand-beige-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <Star className="h-8 w-8 text-yellow-500 animate-sparkle" />
                <Star className="h-10 w-10 text-yellow-600 mx-3 animate-premium-pulse" />
                <Star className="h-8 w-8 text-yellow-500 animate-sparkle" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-brown-800 to-brand-brown-600 bg-clip-text text-transparent mb-6">
                Histórias de Sucesso VIP
              </h2>
              <p className="text-xl text-brand-brown-600 max-w-3xl mx-auto">
                Veja os depoimentos exclusivos de nossos clientes premium que
                confiaram seus sonhos à Siqueira Campos
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="premium-card hover-luxury p-8 text-center"
                >
                  <CardContent className="p-0">
                    <div className="flex justify-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-6 w-6 text-yellow-500 fill-current animate-sparkle"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>

                    <blockquote className="text-lg text-brand-brown-700 dark:text-brand-beige-300 mb-8 leading-relaxed italic">
                      "{testimonial.content}"
                    </blockquote>

                    <div className="flex items-center justify-center space-x-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full border-4 border-yellow-400/30 object-cover"
                      />
                      <div className="text-left">
                        <p className="font-bold text-brand-brown-800 dark:text-brand-beige-200">
                          {testimonial.name}
                        </p>
                        <p className="text-brand-brown-600 dark:text-brand-beige-400 text-sm">
                          {testimonial.role}
                        </p>
                        <p className="text-brand-brown-500 dark:text-brand-beige-500 text-xs flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Seção de Depoimentos Reais */}
        <DepoimentosSection />

        {/* Ultra-Premium CTA Section */}
        <section className="py-24 bg-gradient-to-br from-brand-brown-800 via-brand-brown-900 to-black text-white relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,175,55,0.15),transparent_70%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,191,0,0.1),transparent_70%)]"></div>
          </div>

          <div className="relative container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <Crown className="h-16 w-16 text-yellow-400 animate-luxury-glow" />
              </div>

              <h2 className="text-5xl md:text-7xl font-bold mb-8">
                Pronto para realizar
                <span className="block bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-600 bg-clip-text text-transparent">
                  seu sonho premium?
                </span>
              </h2>

              <p className="text-2xl text-brand-beige-200 mb-12 leading-relaxed">
                Entre em contato com nossa equipe especializada e deixe-nos
                transformar seus sonhos imobiliários em realidade com
                atendimento VIP exclusivo
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <Button
                  size="lg"
                  className="h-16 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-600 hover:via-amber-600 hover:to-yellow-700 text-brand-brown-900 font-bold text-lg px-8 rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 interactive-button"
                  asChild
                >
                  <Link to="/contato">
                    <Phone className="mr-3 h-6 w-6" />
                    Consultoria VIP
                    <Crown className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-bold text-lg px-8 rounded-xl"
                  asChild
                >
                  <Link to="/simulador-financiamento">
                    <BarChart3 className="mr-3 h-6 w-6" />
                    Simular Premium
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="mt-12 text-brand-beige-400">
                <p className="text-lg">
                  💎 Atendimento VIP 24/7 • 🏆 +15 anos de experiência • 👑
                  Resultados garantidos
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Premium */}
        <PremiumFAQ />

        {/* Premium Chat Widget */}
        <PremiumChatWidget />
      </main>
    </div>
  );
}
