import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  Heart,
  MessageSquare,
  Calendar,
  FileText,
  Search,
  Eye,
  Bell,
  Home,
  TrendingUp,
  MapPin,
  Star,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

interface ClienteStats {
  favoritosTotal: number;
  visitasAgendadas: number;
  mensagensNaoLidas: number;
  contratosAtivos: number;
  buscasRecentes: number;
}

interface ImovelFavorito {
  id: number;
  titulo: string;
  endereco: string;
  preco: number;
  tipo: string;
  foto: string;
  adicionadoEm: string;
}

interface VisitaAgendada {
  id: number;
  imovel: {
    titulo: string;
    endereco: string;
    foto: string;
  };
  dataHora: string;
  corretor: string;
  status: string;
}

interface MensagemRecente {
  id: number;
  corretor: string;
  assunto: string;
  preview: string;
  dataEnvio: string;
  lida: boolean;
}

interface RecomendacaoImovel {
  id: number;
  titulo: string;
  endereco: string;
  preco: number;
  foto: string;
  score: number;
  motivo: string;
}

export default function ClienteDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ClienteStats | null>(null);
  const [favoritos, setFavoritos] = useState<ImovelFavorito[]>([]);
  const [visitas, setVisitas] = useState<VisitaAgendada[]>([]);
  const [mensagens, setMensagens] = useState<MensagemRecente[]>([]);
  const [recomendacoes, setRecomendacoes] = useState<RecomendacaoImovel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [
        statsResponse,
        favoritosResponse,
        visitasResponse,
        mensagensResponse,
        recomendacoesResponse,
      ] = await Promise.all([
        fetch("/api/cliente/stats"),
        fetch("/api/cliente/favoritos?limit=3"),
        fetch("/api/cliente/visitas?proximas=true"),
        fetch("/api/cliente/mensagens?limit=3"),
        fetch("/api/cliente/recomendacoes?limit=3"),
      ]);

      const [
        statsData,
        favoritosData,
        visitasData,
        mensagensData,
        recomendacoesData,
      ] = await Promise.all([
        statsResponse.json(),
        favoritosResponse.json(),
        visitasResponse.json(),
        mensagensResponse.json(),
        recomendacoesResponse.json(),
      ]);

      setStats(statsData);
      setFavoritos(favoritosData);
      setVisitas(visitasData);
      setMensagens(mensagensData);
      setRecomendacoes(recomendacoesData);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "agendada":
        return "bg-blue-100 text-blue-800";
      case "confirmada":
        return "bg-green-100 text-green-800";
      case "realizada":
        return "bg-purple-100 text-purple-800";
      case "cancelada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <MainLayout showSidebar>
        <div className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showSidebar>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Minha Área
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bem-vindo, {user?.nome}! Gerencie seus imóveis favoritos e acompanhe
            suas atividades.
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Imóveis Favoritos
              </CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.favoritosTotal || 0}
              </div>
              <p className="text-xs text-muted-foreground">salvos na lista</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Visitas Agendadas
              </CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.visitasAgendadas || 0}
              </div>
              <p className="text-xs text-muted-foreground">próximas visitas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Mensagens Não Lidas
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.mensagensNaoLidas || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                mensagens pendentes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Contratos Ativos
              </CardTitle>
              <FileText className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.contratosAtivos || 0}
              </div>
              <p className="text-xs text-muted-foreground">em andamento</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Imóveis Favoritos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Favoritos Recentes</CardTitle>
              <Button asChild size="sm">
                <Link to="/cliente/favoritos">Ver Todos</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {favoritos.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">
                      Nenhum imóvel favoritado ainda
                    </p>
                    <Button asChild size="sm" className="mt-2">
                      <Link to="/imoveis">Explorar Imóveis</Link>
                    </Button>
                  </div>
                ) : (
                  favoritos.map((favorito) => (
                    <div
                      key={favorito.id}
                      className="flex space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <img
                        src={favorito.foto}
                        alt={favorito.titulo}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {favorito.titulo}
                        </h4>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {favorito.endereco}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline">{favorito.tipo}</Badge>
                          <span className="text-sm font-semibold text-brand-brown-700">
                            {formatPrice(favorito.preco)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Próximas Visitas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Próximas Visitas</CardTitle>
              <Button asChild size="sm">
                <Link to="/cliente/visitas">Ver Agenda</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visitas.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">
                      Nenhuma visita agendada
                    </p>
                    <Button asChild size="sm" className="mt-2">
                      <Link to="/imoveis">Agendar Visita</Link>
                    </Button>
                  </div>
                ) : (
                  visitas.map((visita) => (
                    <div
                      key={visita.id}
                      className="border-b pb-3 last:border-b-0"
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={visita.imovel.foto}
                          alt={visita.imovel.titulo}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {visita.imovel.titulo}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {visita.imovel.endereco}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(visita.dataHora).toLocaleString(
                                "pt-BR",
                              )}
                            </div>
                            <Badge
                              className={`text-xs ${getStatusColor(visita.status)}`}
                            >
                              {visita.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            Corretor: {visita.corretor}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mensagens Recentes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Mensagens</CardTitle>
              <Button asChild size="sm">
                <Link to="/cliente/mensagens">Ver Todas</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mensagens.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">
                      Nenhuma mensagem ainda
                    </p>
                  </div>
                ) : (
                  mensagens.map((mensagem) => (
                    <div
                      key={mensagem.id}
                      className={`border-b pb-3 last:border-b-0 ${
                        !mensagem.lida ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-sm">
                              {mensagem.corretor}
                            </h4>
                            {!mensagem.lida && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                            {mensagem.assunto}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {mensagem.preview}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(mensagem.dataEnvio).toLocaleDateString(
                              "pt-BR",
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recomendações Personalizadas */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recomendações Para Você</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Baseado nos seus interesses e buscas anteriores
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/imoveis">Ver Mais</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recomendacoes.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">
                  Explore alguns imóveis para receber recomendações
                  personalizadas
                </p>
                <Button asChild className="mt-4">
                  <Link to="/imoveis">Explorar Imóveis</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recomendacoes.map((recomendacao) => (
                  <div
                    key={recomendacao.id}
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={recomendacao.foto}
                      alt={recomendacao.titulo}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {recomendacao.score}% compatível
                        </Badge>
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <h4 className="font-medium text-sm mb-1 line-clamp-2">
                        {recomendacao.titulo}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {recomendacao.endereco}
                      </p>
                      <p className="text-sm font-semibold text-brand-brown-700 mb-2">
                        {formatPrice(recomendacao.preco)}
                      </p>
                      <p className="text-xs text-gray-600">
                        {recomendacao.motivo}
                      </p>
                      <Button
                        asChild
                        size="sm"
                        className="w-full mt-3"
                        variant="outline"
                      >
                        <Link to={`/imoveis/${recomendacao.id}`}>
                          Ver Detalhes
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button asChild variant="outline" className="h-20 flex-col">
            <Link to="/imoveis">
              <Search className="h-6 w-6 mb-2" />
              Buscar Imóveis
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col">
            <Link to="/cliente/favoritos">
              <Heart className="h-6 w-6 mb-2" />
              Meus Favoritos
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col">
            <Link to="/simulador-financiamento">
              <TrendingUp className="h-6 w-6 mb-2" />
              Simular Financiamento
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col">
            <Link to="/contato">
              <MessageSquare className="h-6 w-6 mb-2" />
              Falar com Corretor
            </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
