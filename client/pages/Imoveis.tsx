import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
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
} from "lucide-react";

interface Imovel {
  id: number;
  titulo: string;
  endereco: string;
  bairro: string;
  cidade: string;
  preco: number;
  precoAluguel?: number;
  tipo: string;
  transacao: string;
  quartos: number;
  banheiros: number;
  area: number;
  vagas: number;
  fotos: string[];
  destaque: boolean;
  status: string;
  views: number;
  criadoEm: string;
}

interface Filtros {
  busca: string;
  tipo: string;
  transacao: string;
  bairro: string;
  precoMin: number;
  precoMax: number;
  quartos: string;
  banheiros: string;
  areaMin: number;
  areaMax: number;
  vagas: string;
}

export default function Imoveis() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recentes");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filtros, setFiltros] = useState<Filtros>({
    busca: searchParams.get("search") || "",
    tipo: searchParams.get("tipo") || "",
    transacao: searchParams.get("transacao") || "",
    bairro: "",
    precoMin: 0,
    precoMax: 2000000,
    quartos: "",
    banheiros: "",
    areaMin: 0,
    areaMax: 1000,
    vagas: "",
  });

  useEffect(() => {
    loadImoveis();
  }, [filtros, sortBy, page]);

  const loadImoveis = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      Object.entries(filtros).forEach(([key, value]) => {
        if (value && value !== "" && value !== 0) {
          params.append(key, value.toString());
        }
      });

      params.append("page", page.toString());
      params.append("limit", "12");
      params.append("sortBy", sortBy);

      const response = await fetch(`/api/imoveis?${params}`);
      const data = await response.json();

      setImoveis(data.imoveis || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar imóveis:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof Filtros, value: any) => {
    setFiltros((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset para primeira página
  };

  const clearFilters = () => {
    setFiltros({
      busca: "",
      tipo: "",
      transacao: "",
      bairro: "",
      precoMin: 0,
      precoMax: 2000000,
      quartos: "",
      banheiros: "",
      areaMin: 0,
      areaMax: 1000,
      vagas: "",
    });
    setSearchParams({});
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "disponivel":
        return "bg-green-100 text-green-800";
      case "alugado":
        return "bg-yellow-100 text-yellow-800";
      case "vendido":
        return "bg-red-100 text-red-800";
      case "reservado":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const ImovelCard = ({ imovel }: { imovel: Imovel }) => (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative">
        <img
          src={
            imovel.fotos[0] ||
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
          }
          alt={imovel.titulo}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {imovel.destaque && (
            <Badge className="bg-brand-brown-700">Destaque</Badge>
          )}
          <Badge className={getStatusColor(imovel.status)}>
            {imovel.status}
          </Badge>
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          <Button size="icon" variant="secondary" className="h-8 w-8">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-2 left-2 flex items-center text-white text-xs bg-black/50 px-2 py-1 rounded">
          <Eye className="h-3 w-3 mr-1" />
          {imovel.views}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex justify-between items-start">
          <Badge variant="outline">{imovel.tipo}</Badge>
          <Badge variant="outline" className="ml-2">
            {imovel.transacao}
          </Badge>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {imovel.titulo}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {imovel.bairro}, {imovel.cidade}
        </p>

        <div className="grid grid-cols-4 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
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

        <div className="mb-4">
          <div className="text-2xl font-bold text-brand-brown-700">
            {imovel.transacao === "ALUGUEL" && imovel.precoAluguel
              ? formatPrice(imovel.precoAluguel)
              : formatPrice(imovel.preco)}
          </div>
          {imovel.transacao === "AMBOS" && imovel.precoAluguel && (
            <div className="text-sm text-gray-600">
              Aluguel: {formatPrice(imovel.precoAluguel)}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Calendar className="h-4 w-4 mr-1" />
            Agendar
          </Button>
          <Button size="sm" className="flex-1" asChild>
            <Link to={`/imoveis/${imovel.id}`}>
              <MessageCircle className="h-4 w-4 mr-1" />
              Ver Mais
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ImovelListItem = ({ imovel }: { imovel: Imovel }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex">
        <div className="relative w-48 h-32 flex-shrink-0">
          <img
            src={
              imovel.fotos[0] ||
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
            }
            alt={imovel.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2">
            {imovel.destaque && (
              <Badge className="bg-brand-brown-700">Destaque</Badge>
            )}
          </div>
        </div>

        <CardContent className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex gap-2">
              <Badge variant="outline">{imovel.tipo}</Badge>
              <Badge variant="outline">{imovel.transacao}</Badge>
              <Badge className={getStatusColor(imovel.status)}>
                {imovel.status}
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <h3 className="font-semibold text-lg mb-2">{imovel.titulo}</h3>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {imovel.endereco}, {imovel.bairro}
          </p>

          <div className="flex justify-between items-center">
            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                {imovel.quartos} quartos
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                {imovel.banheiros} banheiros
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                {imovel.area}m²
              </div>
              {imovel.vagas > 0 && (
                <div className="flex items-center">
                  <Car className="h-4 w-4 mr-1" />
                  {imovel.vagas} vagas
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-brand-brown-700">
                {imovel.transacao === "ALUGUEL" && imovel.precoAluguel
                  ? formatPrice(imovel.precoAluguel)
                  : formatPrice(imovel.preco)}
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  Agendar
                </Button>
                <Button size="sm" asChild>
                  <Link to={`/imoveis/${imovel.id}`}>Ver Mais</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Nossos Imóveis
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Encontre o imóvel perfeito para você em Goiânia
          </p>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Busque por endereço, bairro ou tipo de imóvel..."
                value={filtros.busca}
                onChange={(e) => handleFilterChange("busca", e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={filtros.tipo}
                onValueChange={(value) => handleFilterChange("tipo", value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="CASA">Casa</SelectItem>
                  <SelectItem value="APARTAMENTO">Apartamento</SelectItem>
                  <SelectItem value="TERRENO">Terreno</SelectItem>
                  <SelectItem value="COMERCIAL">Comercial</SelectItem>
                  <SelectItem value="COBERTURA">Cobertura</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filtros.transacao}
                onValueChange={(value) =>
                  handleFilterChange("transacao", value)
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Transação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="VENDA">Venda</SelectItem>
                  <SelectItem value="ALUGUEL">Aluguel</SelectItem>
                  <SelectItem value="AMBOS">Ambos</SelectItem>
                </SelectContent>
              </Select>

              <Dialog open={showFilters} onOpenChange={setShowFilters}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Filtros Avançados</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Preço */}
                    <div>
                      <Label className="text-sm font-medium">
                        Faixa de Preço
                      </Label>
                      <div className="mt-2 space-y-3">
                        <Slider
                          min={0}
                          max={2000000}
                          step={50000}
                          value={[filtros.precoMin, filtros.precoMax]}
                          onValueChange={([min, max]) => {
                            handleFilterChange("precoMin", min);
                            handleFilterChange("precoMax", max);
                          }}
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{formatPrice(filtros.precoMin)}</span>
                          <span>{formatPrice(filtros.precoMax)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quartos */}
                    <div>
                      <Label>Quartos</Label>
                      <Select
                        value={filtros.quartos}
                        onValueChange={(value) =>
                          handleFilterChange("quartos", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Qualquer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Qualquer</SelectItem>
                          <SelectItem value="1">1+</SelectItem>
                          <SelectItem value="2">2+</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Banheiros */}
                    <div>
                      <Label>Banheiros</Label>
                      <Select
                        value={filtros.banheiros}
                        onValueChange={(value) =>
                          handleFilterChange("banheiros", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Qualquer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Qualquer</SelectItem>
                          <SelectItem value="1">1+</SelectItem>
                          <SelectItem value="2">2+</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Área */}
                    <div>
                      <Label className="text-sm font-medium">Área (m²)</Label>
                      <div className="mt-2 space-y-3">
                        <Slider
                          min={0}
                          max={1000}
                          step={10}
                          value={[filtros.areaMin, filtros.areaMax]}
                          onValueChange={([min, max]) => {
                            handleFilterChange("areaMin", min);
                            handleFilterChange("areaMax", max);
                          }}
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{filtros.areaMin}m²</span>
                          <span>{filtros.areaMax}m²</span>
                        </div>
                      </div>
                    </div>

                    {/* Vagas */}
                    <div>
                      <Label>Vagas de Garagem</Label>
                      <Select
                        value={filtros.vagas}
                        onValueChange={(value) =>
                          handleFilterChange("vagas", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Qualquer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Qualquer</SelectItem>
                          <SelectItem value="1">1+</SelectItem>
                          <SelectItem value="2">2+</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={clearFilters}
                        variant="outline"
                        className="flex-1"
                      >
                        Limpar
                      </Button>
                      <Button
                        onClick={() => setShowFilters(false)}
                        className="flex-1"
                      >
                        Aplicar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Controles de Visualização */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recentes">Mais Recentes</SelectItem>
                  <SelectItem value="preco_asc">Menor Preço</SelectItem>
                  <SelectItem value="preco_desc">Maior Preço</SelectItem>
                  <SelectItem value="area_desc">Maior Área</SelectItem>
                  <SelectItem value="views_desc">Mais Visualizados</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">
                {imoveis.length} imóveis encontrados
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Lista de Imóveis */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(12)].map((_, index) => (
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
        ) : imoveis.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum imóvel encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tente ajustar os filtros ou fazer uma nova busca
            </p>
            <Button onClick={clearFilters}>Limpar Filtros</Button>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {imoveis.map((imovel) => (
                  <ImovelCard key={imovel.id} imovel={imovel} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {imoveis.map((imovel) => (
                  <ImovelListItem key={imovel.id} imovel={imovel} />
                ))}
              </div>
            )}

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Anterior
                  </Button>
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index + 1}
                      variant={page === index + 1 ? "default" : "outline"}
                      onClick={() => setPage(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
