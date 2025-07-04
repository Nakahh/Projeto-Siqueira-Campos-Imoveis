import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
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

  useEffect(() => {
    loadImoveisDestaque();
  }, []);

  const loadImoveisDestaque = async () => {
    try {
      const response = await fetch("/api/imoveis/destaque");
      const data = await response.json();
      setImoveisDestaque(data);
    } catch (error) {
      console.error("Erro ao carregar imóveis:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brand-brown-900 to-brand-brown-700 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80')",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Encontre o Imóvel
              <span className="text-brand-beige-400"> dos Seus Sonhos</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-brand-beige-200 max-w-3xl mx-auto">
              A maior e melhor imobiliária de Goiânia, com mais de 1000 imóveis
              disponíveis para venda e locação
            </p>

            {/* Barra de Pesquisa */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-xl">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Busque por bairro, cidade ou tipo de imóvel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button
                  size="lg"
                  className="bg-brand-brown-700 hover:bg-brand-brown-800"
                  asChild
                >
                  <Link
                    to={`/imoveis${searchTerm ? `?search=${searchTerm}` : ""}`}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Buscar Imóveis
                  </Link>
                </Button>
              </div>
            </div>

            {/* Links rápidos */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {["Casas", "Apartamentos", "Terrenos", "Comercial"].map(
                (tipo) => (
                  <Button
                    key={tipo}
                    variant="outline"
                    className="border-brand-beige-400 text-brand-beige-400 hover:bg-brand-beige-400 hover:text-brand-brown-900"
                    asChild
                  >
                    <Link to={`/imoveis?tipo=${tipo.toLowerCase()}`}>
                      {tipo}
                    </Link>
                  </Button>
                ),
              )}
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
