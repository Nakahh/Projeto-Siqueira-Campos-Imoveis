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
    if (!isLoading) return; // Previne chamadas desnecessárias

    try {
      const data = await cachedFetch<Imovel[]>("/api/imoveis/destaque", {
        cacheOptions: {
          ttl: 5 * 60 * 1000, // Cache for 5 minutes (aumentado de 2 para 5)
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
  }, []); // Remover dependency para evitar loop

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const features = [
    {
      icon: TrendingUp,
      title: "Melhor Investimento",
      description: "Imóveis valorizados em Goiânia",
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Documentação e processos seguros",
    },
    {
      icon: Clock,
      title: "Atendimento 24h",
      description: "Suporte completo quando precisar",
    },
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Cliente",
      content:
        "Excelente atendimento! Encontrei minha casa dos sonhos rapidamente.",
      rating: 5,
      avatar: "/placeholder-avatar.jpg",
    },
    {
      name: "João Santos",
      role: "Investidor",
      content: "Profissionais competentes e transparentes. Recomendo a todos!",
      rating: 5,
      avatar: "/placeholder-avatar.jpg",
    },
    {
      name: "Ana Costa",
      role: "Proprietária",
      content: "Venderam meu apartamento em apenas 30 dias. Fantástico!",
      rating: 5,
      avatar: "/placeholder-avatar.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Premium Header with Hero */}
      <PremiumHeader />

      <main className="pt-0">
        {/* Premium Search Bar */}
        <section className="relative py-20 bg-gradient-to-br from-white via-brand-brown-50 to-brand-beige-50 dark:from-brand-brown-900 dark:via-brand-brown-800 dark:to-brand-brown-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/90 dark:bg-brand-brown-800/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-brand-brown-200/50 dark:border-brand-brown-700/50">
                <h2 className="text-2xl font-bold text-center text-brand-brown-800 dark:text-brand-beige-200 mb-6">
                  Busca Inteligente Premium
                </h2>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Digite o que procura: 'apartamento 3 quartos Setor Bueno'..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-14 text-lg border-brand-brown-200 dark:border-brand-brown-700 focus:border-brand-brown-500 rounded-xl bg-white/50 dark:bg-brand-brown-700/50"
                    />
                  </div>
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-gradient-to-r from-brand-brown-700 to-brand-brown-800 hover:from-brand-brown-800 hover:to-brand-brown-900 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                    asChild
                  >
                    <Link
                      to={`/imoveis${searchTerm ? `?search=${searchTerm}` : ""}`}
                    >
                      <Search className="mr-2 h-5 w-5" />
                      Buscar Premium
                    </Link>
                  </Button>
                </div>

                {/* Quick Categories */}
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                  {[
                    { label: "Casas de Luxo", icon: "🏖" },
                    { label: "Apartamentos Premium", icon: "🌆" },
                    { label: "Terrenos Exclusivos", icon: "🌳" },
                    { label: "Comercial VIP", icon: "🏢" },
                  ].map((tipo) => (
                    <Button
                      key={tipo.label}
                      variant="outline"
                      className="border-brand-brown-300 text-brand-brown-700 hover:bg-brand-brown-100 dark:border-brand-brown-600 dark:text-brand-beige-200 dark:hover:bg-brand-brown-800 rounded-full px-6 font-medium"
                      asChild
                    >
                      <Link
                        to={`/imoveis?tipo=${tipo.label.toLowerCase()}`}
                      >
                        <span className="mr-2">{tipo.icon}</span>
                        {tipo.label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Por que escolher a Siqueira Campos?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Somos líderes no mercado imobiliário de Goiânia com mais de 10
              anos de experiência
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-brand-brown-100 dark:bg-brand-brown-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-brand-brown-700" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Imóveis em Destaque */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Imóveis em Destaque
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Conheça nossas melhores oportunidades
              </p>
            </div>
            <Button asChild>
              <Link to="/imoveis">
                Ver Todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {imoveisDestaque.map((imovel) => (
                <Card
                  key={imovel.id}
                  className="overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="relative">
                    <img
                      src={
                        imovel.fotos[0] ||
                        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                      }
                      alt={imovel.titulo}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {imovel.destaque && (
                      <Badge className="absolute top-2 left-2 bg-brand-brown-700">
                        Destaque
                      </Badge>
                    )}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-2">
                      <Badge variant="outline">{imovel.tipo}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {imovel.titulo}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {imovel.bairro}, Goiânia
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {imovel.quartos}
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {imovel.banheiros}
                      </div>
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        {imovel.area}m²
                      </div>
                      {imovel.vagas > 0 && (
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-1" />
                          {imovel.vagas}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-brand-brown-700">
                          {formatPrice(imovel.preco)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Agendar
                      </Button>
                      <Button size="sm" className="flex-1" asChild>
                        <Link to={`/imoveis/${imovel.id}`}>
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Conversar
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

      {/* Depoimentos */}
      <section className="py-16 bg-brand-brown-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Veja os depoimentos de quem confia na Siqueira Campos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
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

      {/* CTA Section */}
      <section className="py-16 bg-brand-brown-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para encontrar seu novo lar?
          </h2>
          <p className="text-xl mb-8 text-brand-beige-200">
            Entre em contato conosco e deixe nossa equipe especializada te
            ajudar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-brand-beige-400 text-brand-brown-900 hover:bg-brand-beige-500"
              asChild
            >
              <Link to="/contato">
                <Phone className="mr-2 h-5 w-5" />
                Falar com Especialista
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-brand-beige-400 text-brand-beige-400 hover:bg-brand-beige-400 hover:text-brand-brown-900"
              asChild
            >
              <Link to="/simulador-financiamento">
                <TrendingUp className="mr-2 h-5 w-5" />
                Simular Financiamento
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}