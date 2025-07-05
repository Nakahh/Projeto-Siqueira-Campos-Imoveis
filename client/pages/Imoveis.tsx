import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { PremiumHeader } from "@/components/Layout/PremiumHeader";
import { PremiumChatWidget } from "@/components/Chat/PremiumChatWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  Filter,
  MapPin,
  Bed,
  Bath,
  Square,
  Car,
  Heart,
  Share2,
  Calendar,
  MessageCircle,
  ArrowUpDown,
  Grid3X3,
  List,
  Eye,
  X,
  Crown,
  Star,
  Diamond,
  Sparkles,
  SlidersHorizontal,
  Building2,
  Home,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";

interface Imovel {
  id: number;
  titulo: string;
  endereco: string;
  bairro: string;
  cidade: string;
  preco: number;
  tipo: string;
  quartos: number;
  banheiros: number;
  area: number;
  vagas: number;
  fotos: string[];
  destaque: boolean;
  status: string;
  descricao?: string;
  caracteristicas?: string[];
}

export default function Imoveis() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [filteredImoveis, setFilteredImoveis] = useState<Imovel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filters
  const [tipoFilter, setTipoFilter] = useState(searchParams.get("tipo") || "");
  const [precoMin, setPrecoMin] = useState([0]);
  const [precoMax, setPrecoMax] = useState([5000000]);
  const [quartosFilter, setQuartosFilter] = useState("");
  const [bairroFilter, setBairroFilter] = useState("");
  const [sortBy, setSortBy] = useState("preco-asc");

  // Mock data for demonstration
  const mockImoveis: Imovel[] = [
    {
      id: 1,
      titulo: "Mansão Premium com Piscina Infinity",
      endereco: "Rua das Palmeiras, 123",
      bairro: "Setor Marista",
      cidade: "Goiânia",
      preco: 1850000,
      tipo: "Casa",
      quartos: 5,
      banheiros: 6,
      area: 420,
      vagas: 4,
      fotos: [
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ],
      destaque: true,
      status: "Disponível",
      descricao:
        "Mansão de luxo com acabamentos premium, piscina infinity, área gourmet completa e vista panorâmica.",
      caracteristicas: [
        "Piscina Infinity",
        "Área Gourmet",
        "Cinema",
        "Adega",
        "Vista Panorâmica",
      ],
    },
    {
      id: 2,
      titulo: "Penthouse Exclusivo com Vista 360°",
      endereco: "Av. T-4, 456",
      bairro: "Setor Bueno",
      cidade: "Goiânia",
      preco: 2100000,
      tipo: "Apartamento",
      quartos: 4,
      banheiros: 5,
      area: 350,
      vagas: 3,
      fotos: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ],
      destaque: true,
      status: "Disponível",
      descricao:
        "Penthouse único com vista 360° da cidade, terraço privativo e acabamentos importados.",
      caracteristicas: [
        "Vista 360°",
        "Terraço Privativo",
        "Acabamentos Importados",
        "Smart Home",
        "Heliponto",
      ],
    },
    {
      id: 3,
      titulo: "Casa de Alto Padrão com Design Contemporâneo",
      endereco: "Rua do Lago, 789",
      bairro: "Setor Oeste",
      cidade: "Goiânia",
      preco: 1320000,
      tipo: "Casa",
      quartos: 4,
      banheiros: 4,
      area: 380,
      vagas: 3,
      fotos: [
        "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ],
      destaque: false,
      status: "Disponível",
      descricao:
        "Casa moderna com design contemporâneo, amplos espaços e integração com a natureza.",
      caracteristicas: [
        "Design Contemporâneo",
        "Automação",
        "Jardim Zen",
        "Escritório",
        "Lavabo Social",
      ],
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setImoveis(mockImoveis);
      setFilteredImoveis(mockImoveis);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...imoveis];

    // Apply filters
    if (searchTerm) {
      filtered = filtered.filter(
        (imovel) =>
          imovel.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          imovel.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
          imovel.endereco.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (tipoFilter) {
      filtered = filtered.filter((imovel) => imovel.tipo === tipoFilter);
    }

    if (quartosFilter) {
      filtered = filtered.filter(
        (imovel) => imovel.quartos >= parseInt(quartosFilter),
      );
    }

    if (bairroFilter) {
      filtered = filtered.filter((imovel) => imovel.bairro === bairroFilter);
    }

    filtered = filtered.filter(
      (imovel) => imovel.preco >= precoMin[0] && imovel.preco <= precoMax[0],
    );

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "preco-asc":
          return a.preco - b.preco;
        case "preco-desc":
          return b.preco - a.preco;
        case "area-desc":
          return b.area - a.area;
        case "quartos-desc":
          return b.quartos - a.quartos;
        default:
          return 0;
      }
    });

    setFilteredImoveis(filtered);
  }, [
    imoveis,
    searchTerm,
    tipoFilter,
    quartosFilter,
    bairroFilter,
    precoMin,
    precoMax,
    sortBy,
  ]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const bairros = [...new Set(imoveis.map((imovel) => imovel.bairro))];

  return (
    <div className="min-h-screen bg-background">
      <PremiumHeader />

      <main className="pt-32">
        {/* Ultra-Premium Hero Section */}
        <section className="relative py-16 bg-gradient-to-br from-brand-brown-900 via-brand-brown-800 to-brand-brown-900 text-white overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_70%)]"></div>
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>

          <div className="relative container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <Diamond className="h-10 w-10 text-yellow-400 animate-sparkle" />
                <Crown className="h-12 w-12 text-yellow-500 animate-premium-pulse" />
                <Diamond
                  className="h-10 w-10 text-yellow-400 animate-sparkle"
                  style={{ animationDelay: "0.5s" }}
                />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Imóveis
              <span className="block bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-600 bg-clip-text text-transparent">
                Premium & Exclusivos
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-brand-beige-200 max-w-3xl mx-auto mb-8">
              Descubra nossa curadoria exclusiva dos melhores imóveis de alto
              padrão em Goiânia
            </p>

            <div className="flex justify-center space-x-8 text-brand-beige-300">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">
                  {filteredImoveis.length}
                </div>
                <div className="text-sm">Imóveis Premium</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">15+</div>
                <div className="text-sm">Bairros Nobres</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">98%</div>
                <div className="text-sm">Satisfação</div>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Search & Filters */}
        <section className="py-8 bg-white dark:bg-brand-brown-900 border-b border-brand-brown-200 dark:border-brand-brown-700">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Search Bar */}
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-brown-400" />
                  <Input
                    type="text"
                    placeholder="Busque por bairro, tipo ou características..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 text-lg border-2 border-brand-brown-200 dark:border-brand-brown-700 focus:border-yellow-500 rounded-xl bg-white/70 dark:bg-brand-brown-800/70 backdrop-blur-sm"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                  </div>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="flex items-center space-x-4">
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger className="w-48 h-14 border-2 border-brand-brown-200 dark:border-brand-brown-700 rounded-xl">
                    <SelectValue placeholder="Tipo de Imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os Tipos</SelectItem>
                    <SelectItem value="Casa">Casas Premium</SelectItem>
                    <SelectItem value="Apartamento">
                      Apartamentos VIP
                    </SelectItem>
                    <SelectItem value="Terreno">Terrenos Exclusivos</SelectItem>
                    <SelectItem value="Comercial">Comercial Elite</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={quartosFilter} onValueChange={setQuartosFilter}>
                  <SelectTrigger className="w-40 h-14 border-2 border-brand-brown-200 dark:border-brand-brown-700 rounded-xl">
                    <SelectValue placeholder="Quartos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Qualquer</SelectItem>
                    <SelectItem value="1">1+ Quarto</SelectItem>
                    <SelectItem value="2">2+ Quartos</SelectItem>
                    <SelectItem value="3">3+ Quartos</SelectItem>
                    <SelectItem value="4">4+ Quartos</SelectItem>
                    <SelectItem value="5">5+ Quartos</SelectItem>
                  </SelectContent>
                </Select>

                {/* Advanced Filters Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-14 px-6 border-2 border-brand-brown-200 dark:border-brand-brown-700 rounded-xl font-medium hover:bg-brand-brown-50 dark:hover:bg-brand-brown-800"
                    >
                      <SlidersHorizontal className="h-5 w-5 mr-2" />
                      Filtros Avançados
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-white/95 dark:bg-brand-brown-900/95 backdrop-blur-lg">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <Crown className="h-5 w-5 text-yellow-500" />
                        <span>Filtros Premium</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Faixa de Preço
                        </Label>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-xs text-brand-brown-600 dark:text-brand-beige-400">
                              Mínimo: {formatPrice(precoMin[0])}
                            </Label>
                            <Slider
                              value={precoMin}
                              onValueChange={setPrecoMin}
                              max={5000000}
                              step={50000}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-brand-brown-600 dark:text-brand-beige-400">
                              Máximo: {formatPrice(precoMax[0])}
                            </Label>
                            <Slider
                              value={precoMax}
                              onValueChange={setPrecoMax}
                              max={5000000}
                              step={50000}
                              className="mt-2"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Bairro Premium
                        </Label>
                        <Select
                          value={bairroFilter}
                          onValueChange={setBairroFilter}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o bairro" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Todos os Bairros</SelectItem>
                            {bairros.map((bairro) => (
                              <SelectItem key={bairro} value={bairro}>
                                {bairro}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex justify-between items-center mt-8">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-brand-brown-800 dark:text-brand-beige-200">
                  {filteredImoveis.length} Imóveis Premium Encontrados
                </h2>
                {filteredImoveis.some((i) => i.destaque) && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-amber-600 text-brand-brown-900 font-bold">
                    <Crown className="h-3 w-3 mr-1" />
                    Destaques Disponíveis
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort Options */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-56">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preco-asc">Menor Preço</SelectItem>
                    <SelectItem value="preco-desc">Maior Preço</SelectItem>
                    <SelectItem value="area-desc">Maior Área</SelectItem>
                    <SelectItem value="quartos-desc">Mais Quartos</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex border border-brand-brown-200 dark:border-brand-brown-700 rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="px-3"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="px-3"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Properties Grid/List */}
        <section className="py-12 bg-gradient-to-br from-brand-brown-50/30 via-white to-brand-beige-50/30">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div
                className={`grid gap-8 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
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
            ) : filteredImoveis.length === 0 ? (
              <div className="text-center py-20">
                <Building2 className="h-24 w-24 text-brand-brown-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-brand-brown-800 dark:text-brand-beige-200 mb-4">
                  Nenhum imóvel encontrado
                </h3>
                <p className="text-brand-brown-600 dark:text-brand-beige-400 mb-8">
                  Tente ajustar seus filtros ou entre em contato conosco para
                  encontrar o imóvel perfeito.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setTipoFilter("");
                    setQuartosFilter("");
                    setBairroFilter("");
                    setPrecoMin([0]);
                    setPrecoMax([5000000]);
                  }}
                  className="bg-gradient-to-r from-brand-brown-700 to-brand-brown-800 hover:from-brand-brown-800 hover:to-brand-brown-900 text-white"
                >
                  Limpar Filtros
                </Button>
              </div>
            ) : (
              <div
                className={`grid gap-8 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredImoveis.map((imovel) => (
                  <Card
                    key={imovel.id}
                    className={`overflow-hidden premium-card hover-luxury group ${
                      viewMode === "list" ? "flex flex-row" : ""
                    }`}
                  >
                    <div
                      className={`relative overflow-hidden ${
                        viewMode === "list" ? "w-80 flex-shrink-0" : ""
                      }`}
                    >
                      <img
                        src={imovel.fotos[0]}
                        alt={imovel.titulo}
                        className={`object-cover group-hover:scale-110 transition-transform duration-700 ${
                          viewMode === "list" ? "w-full h-full" : "w-full h-64"
                        }`}
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

                      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <Button
                          size="sm"
                          className="bg-white/90 hover:bg-white text-brand-brown-800 rounded-full font-medium"
                          asChild
                        >
                          <Link to={`/imoveis/${imovel.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Link>
                        </Button>
                      </div>
                    </div>

                    <CardContent
                      className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}
                    >
                      <div className="mb-4">
                        <Badge
                          variant="outline"
                          className="border-brand-brown-300 text-brand-brown-700 mb-3"
                        >
                          {imovel.tipo}
                        </Badge>
                        <h3 className="font-bold text-xl mb-2 text-brand-brown-800 dark:text-brand-beige-200 group-hover:text-brand-brown-900 transition-colors">
                          {imovel.titulo}
                        </h3>
                        <p className="text-brand-brown-600 dark:text-brand-beige-400 flex items-center mb-2">
                          <MapPin className="h-4 w-4 mr-2" />
                          {imovel.bairro}, {imovel.cidade}
                        </p>
                        {imovel.descricao && (
                          <p className="text-sm text-brand-brown-500 dark:text-brand-beige-500 line-clamp-2">
                            {imovel.descricao}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-3 mb-6 text-sm">
                        <div className="flex flex-col items-center p-3 bg-brand-brown-50 dark:bg-brand-brown-800 rounded-lg">
                          <Bed className="h-4 w-4 mb-1 text-brand-brown-600 dark:text-brand-beige-300" />
                          <span className="font-medium text-brand-brown-800 dark:text-brand-beige-200">
                            {imovel.quartos}
                          </span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-brand-brown-50 dark:bg-brand-brown-800 rounded-lg">
                          <Bath className="h-4 w-4 mb-1 text-brand-brown-600 dark:text-brand-beige-300" />
                          <span className="font-medium text-brand-brown-800 dark:text-brand-beige-200">
                            {imovel.banheiros}
                          </span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-brand-brown-50 dark:bg-brand-brown-800 rounded-lg">
                          <Square className="h-4 w-4 mb-1 text-brand-brown-600 dark:text-brand-beige-300" />
                          <span className="font-medium text-brand-brown-800 dark:text-brand-beige-200">
                            {imovel.area}m²
                          </span>
                        </div>
                        {imovel.vagas > 0 && (
                          <div className="flex flex-col items-center p-3 bg-brand-brown-50 dark:bg-brand-brown-800 rounded-lg">
                            <Car className="h-4 w-4 mb-1 text-brand-brown-600 dark:text-brand-beige-300" />
                            <span className="font-medium text-brand-brown-800 dark:text-brand-beige-200">
                              {imovel.vagas}
                            </span>
                          </div>
                        )}
                      </div>

                      {imovel.caracteristicas && (
                        <div className="mb-6">
                          <div className="flex flex-wrap gap-2">
                            {imovel.caracteristicas.slice(0, 3).map((carac) => (
                              <Badge
                                key={carac}
                                variant="secondary"
                                className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              >
                                <Star className="h-3 w-3 mr-1" />
                                {carac}
                              </Badge>
                            ))}
                            {imovel.caracteristicas.length > 3 && (
                              <Badge
                                variant="outline"
                                className="text-xs border-brand-brown-300"
                              >
                                +{imovel.caracteristicas.length - 3} mais
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mb-6">
                        <p className="text-3xl font-bold bg-gradient-to-r from-brand-brown-700 to-brand-brown-800 bg-clip-text text-transparent">
                          {formatPrice(imovel.preco)}
                        </p>
                        <p className="text-sm text-brand-brown-500 dark:text-brand-beige-500">
                          R$ {Math.round(imovel.preco / imovel.area)}/m²
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

        {/* Premium CTA */}
        <section className="py-16 bg-gradient-to-br from-brand-brown-800 to-brand-brown-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-6 animate-luxury-glow" />
              <h2 className="text-4xl font-bold mb-6">
                Não encontrou o imóvel ideal?
              </h2>
              <p className="text-xl text-brand-beige-200 mb-8">
                Nossa equipe premium está pronta para encontrar o imóvel
                perfeito para você. Atendimento VIP personalizado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-brand-brown-900 font-bold px-8"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Consultoria Personalizada
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-medium px-8"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Chat com Clara AI
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PremiumChatWidget />
    </div>
  );
}
