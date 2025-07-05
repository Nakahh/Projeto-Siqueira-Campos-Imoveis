import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import {
  Heart,
  Share2,
  Calendar,
  MessageCircle,
  MapPin,
  Bed,
  Bath,
  Square,
  Car,
  Home,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowLeft,
  Calculator,
  Eye,
  Clock,
  Check,
  X,
} from "lucide-react";

interface Imovel {
  id: number;
  titulo: string;
  descricao: string;
  endereco: string;
  bairro: string;
  cidade: string;
  cep: string;
  tipo: string;
  transacao: string;
  preco: number;
  precoAluguel?: number;
  area: number;
  areaTerreno?: number;
  quartos: number;
  banheiros: number;
  suites: number;
  vagas: number;
  fotos: string[];
  caracteristicas: string[];
  mobiliado: boolean;
  aceita: string;
  iptu?: number;
  condominio?: number;
  observacoes: string;
  status: string;
  views: number;
  criadoEm: string;
  corretor: {
    id: number;
    nome: string;
    telefone: string;
    email: string;
    avatar?: string;
  };
}

export default function ImovelDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  useEffect(() => {
    if (id) {
      loadImovel(parseInt(id));
    }
  }, [id]);

  const loadImovel = async (imovelId: number) => {
    try {
      const response = await fetch(`/api/imoveis/${imovelId}`);
      if (response.ok) {
        const data = await response.json();
        setImovel(data);

        // Verificar se é favorito (se usuário logado)
        if (user) {
          const favResponse = await fetch(
            `/api/cliente/favoritos/check/${imovelId}`,
          );
          if (favResponse.ok) {
            const favData = await favResponse.json();
            setIsFavorite(favData.isFavorite);
          }
        }
      } else {
        navigate("/404");
      }
    } catch (error) {
      console.error("Erro ao carregar imóvel:", error);
      navigate("/404");
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

  const toggleFavorite = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const method = isFavorite ? "DELETE" : "POST";
      const response = await fetch(`/api/cliente/favoritos/${imovel?.id}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("Erro ao alterar favorito:", error);
    }
  };

  const shareProperty = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: imovel?.titulo,
          text: `Confira este imóvel: ${imovel?.titulo}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Erro ao compartilhar:", error);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    // TODO: Mostrar toast de sucesso
  };

  const nextImage = () => {
    if (imovel && imovel.fotos.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === imovel.fotos.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    if (imovel && imovel.fotos.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? imovel.fotos.length - 1 : prev - 1,
      );
    }
  };

  const contactWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá! Tenho interesse no imóvel: ${imovel?.titulo} - ${window.location.href}`,
    );
    const phone = imovel?.corretor.telefone.replace(/\D/g, "");
    window.open(`https://wa.me/55${phone}?text=${message}`, "_blank");
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-32 bg-gray-300 rounded"></div>
              </div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!imovel) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Imóvel não encontrado
          </h1>
          <Button onClick={() => navigate("/imoveis")}>
            Voltar aos Imóveis
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link to="/" className="hover:text-brand-brown-700">
            Início
          </Link>
          <span className="mx-2">/</span>
          <Link to="/imoveis" className="hover:text-brand-brown-700">
            Imóveis
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white">{imovel.titulo}</span>
        </div>

        {/* Galeria de Fotos */}
        <div className="relative mb-8">
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
            <img
              src={
                imovel.fotos[currentImageIndex] ||
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              }
              alt={`${imovel.titulo} - Foto ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Controles da galeria */}
            {imovel.fotos.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Indicadores */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {imovel.fotos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>

            {/* Informações sobrepostas */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Badge className="bg-brand-brown-700">{imovel.tipo}</Badge>
              <Badge variant="outline" className="bg-white/90 text-gray-900">
                {imovel.transacao}
              </Badge>
            </div>

            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                size="icon"
                variant="secondary"
                onClick={toggleFavorite}
                className="bg-white/90 hover:bg-white"
              >
                <Heart
                  className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                onClick={shareProperty}
                className="bg-white/90 hover:bg-white"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Thumbnails */}
          {imovel.fotos.length > 1 && (
            <div className="flex mt-4 gap-2 overflow-x-auto">
              {imovel.fotos.map((foto, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? "border-brand-brown-700"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={foto}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações Principais */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {imovel.titulo}
              </h1>
              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {imovel.endereco}, {imovel.bairro} - {imovel.cidade}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {imovel.views} visualizações
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Publicado em{" "}
                  {new Date(imovel.criadoEm).toLocaleDateString("pt-BR")}
                </div>
              </div>
            </div>

            {/* Preço */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-brand-brown-700">
                      {imovel.transacao === "ALUGUEL" && imovel.precoAluguel
                        ? formatPrice(imovel.precoAluguel)
                        : formatPrice(imovel.preco)}
                    </div>
                    {imovel.transacao === "AMBOS" && imovel.precoAluguel && (
                      <div className="text-lg text-gray-600 dark:text-gray-400">
                        Aluguel: {formatPrice(imovel.precoAluguel)}
                      </div>
                    )}
                    {(imovel.iptu || imovel.condominio) && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {imovel.iptu && (
                          <span>IPTU: {formatPrice(imovel.iptu)}</span>
                        )}
                        {imovel.iptu && imovel.condominio && <span> • </span>}
                        {imovel.condominio && (
                          <span>
                            Condomínio: {formatPrice(imovel.condominio)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <Button className="bg-brand-brown-700 hover:bg-brand-brown-800">
                    <Calculator className="h-4 w-4 mr-2" />
                    Simular Financiamento
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Características */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Características</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Square className="h-6 w-6 mx-auto mb-2 text-brand-brown-700" />
                    <div className="font-semibold">{imovel.area}m²</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Área Total
                    </div>
                  </div>
                  {imovel.areaTerreno && (
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Home className="h-6 w-6 mx-auto mb-2 text-brand-brown-700" />
                      <div className="font-semibold">
                        {imovel.areaTerreno}m²
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Terreno
                      </div>
                    </div>
                  )}
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Bed className="h-6 w-6 mx-auto mb-2 text-brand-brown-700" />
                    <div className="font-semibold">{imovel.quartos}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Quartos
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Bath className="h-6 w-6 mx-auto mb-2 text-brand-brown-700" />
                    <div className="font-semibold">{imovel.banheiros}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Banheiros
                    </div>
                  </div>
                  {imovel.suites > 0 && (
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Bed className="h-6 w-6 mx-auto mb-2 text-brand-brown-700" />
                      <div className="font-semibold">{imovel.suites}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Suítes
                      </div>
                    </div>
                  )}
                  {imovel.vagas > 0 && (
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Car className="h-6 w-6 mx-auto mb-2 text-brand-brown-700" />
                      <div className="font-semibold">{imovel.vagas}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Vagas
                      </div>
                    </div>
                  )}
                </div>

                {/* Características adicionais */}
                {imovel.caracteristicas.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Comodidades</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {imovel.caracteristicas.map((caracteristica, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          {caracteristica}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Informações adicionais */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Mobiliado:
                    </span>
                    <span className="ml-2 font-medium">
                      {imovel.mobiliado ? "Sim" : "Não"}
                    </span>
                  </div>
                  {imovel.aceita && (
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Aceita:
                      </span>
                      <span className="ml-2 font-medium">{imovel.aceita}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Descrição */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {imovel.descricao}
                </p>
                {imovel.observacoes && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h4 className="font-semibold mb-2">Observações</h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        {imovel.observacoes}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Mapa - Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Localização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Mapa interativo em breve
                    </p>
                    <p className="text-sm text-gray-400">
                      {imovel.endereco}, {imovel.bairro}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar de Contato */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Informações do Corretor */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Corretor Responsável</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <img
                      src={
                        imovel.corretor.avatar ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                      }
                      alt={imovel.corretor.nome}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-semibold">{imovel.corretor.nome}</h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        4.9 • 127 avaliações
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={contactWhatsApp}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>

                    <Button variant="outline" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Ligar
                    </Button>

                    <Button variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Ações Rápidas */}
              <Card>
                <CardHeader>
                  <CardTitle>Interessado?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-brand-brown-700 hover:bg-brand-brown-800">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Visita
                  </Button>

                  <Button variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Fazer Proposta
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Simular Financiamento
                  </Button>

                  <Separator />

                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Ou entre em contato diretamente:
                    </p>
                    <p className="font-semibold text-brand-brown-700">
                      (62) 9 8556-3505
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Botão Voltar */}
        <div className="mt-8">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
