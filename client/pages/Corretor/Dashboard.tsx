import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  Building2,
  MessageSquare,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Phone,
  Mail,
  Eye,
  Plus,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardStats {
  totalImoveis: number;
  imoveisAtivos: number;
  leadsRecebidos: number;
  leadsConvertidos: number;
  visitasAgendadas: number;
  comissaoMes: number;
  metaMes: number;
}

interface Lead {
  id: number;
  nome: string;
  telefone: string;
  mensagem: string;
  status: string;
  criadoEm: string;
  imovel?: {
    titulo: string;
    endereco: string;
  };
}

interface Visita {
  id: number;
  cliente: string;
  imovel: string;
  dataHora: string;
  status: string;
}

export default function CorretorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [leadsRecentes, setLeadsRecentes] = useState<Lead[]>([]);
  const [visitasProximas, setVisitasProximas] = useState<Visita[]>([]);
  const [whatsappConfig, setWhatsappConfig] = useState({
    numero: "",
    ativo: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, leadsResponse, visitasResponse, whatsappResponse] =
        await Promise.all([
          fetch("/api/corretor/stats"),
          fetch("/api/corretor/leads?limit=5"),
          fetch("/api/corretor/visitas?proximas=true"),
          fetch("/api/corretor/whatsapp"),
        ]);

      const [statsData, leadsData, visitasData, whatsappData] =
        await Promise.all([
          statsResponse.json(),
          leadsResponse.json(),
          visitasResponse.json(),
          whatsappResponse.json(),
        ]);

      setStats(statsData);
      setLeadsRecentes(leadsData);
      setVisitasProximas(visitasData);
      setWhatsappConfig(whatsappData);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateWhatsappConfig = async (config: typeof whatsappConfig) => {
    try {
      const response = await fetch("/api/corretor/whatsapp", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setWhatsappConfig(config);
      }
    } catch (error) {
      console.error("Erro ao atualizar WhatsApp:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "assumido":
        return "bg-green-100 text-green-800";
      case "finalizado":
        return "bg-blue-100 text-blue-800";
      case "cancelado":
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
            Dashboard do Corretor
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bem-vindo, {user?.nome}! Aqui está um resumo da sua atividade.
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Imóveis Ativos
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.imoveisAtivos || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                de {stats?.totalImoveis || 0} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Leads do Mês
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.leadsRecebidos || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.leadsConvertidos || 0} convertidos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Visitas Agendadas
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.visitasAgendadas || 0}
              </div>
              <p className="text-xs text-muted-foreground">esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Comissão do Mês
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {(stats?.comissaoMes || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Meta: R$ {(stats?.metaMes || 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuração WhatsApp */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                Configuração WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Número WhatsApp</label>
                <div className="flex space-x-2 mt-1">
                  <input
                    type="text"
                    value={whatsappConfig.numero}
                    onChange={(e) =>
                      setWhatsappConfig({
                        ...whatsappConfig,
                        numero: e.target.value,
                      })
                    }
                    placeholder="(62) 9 9999-9999"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whatsappConfig.ativo}
                    onChange={(e) =>
                      setWhatsappConfig({
                        ...whatsappConfig,
                        ativo: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-brown-300 dark:peer-focus:ring-brand-brown-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-brown-600"></div>
                </label>
              </div>

              <Badge
                variant={whatsappConfig.ativo ? "default" : "secondary"}
                className="w-full justify-center"
              >
                {whatsappConfig.ativo ? "Recebendo Leads" : "Inativo"}
              </Badge>

              <Button
                onClick={() => updateWhatsappConfig(whatsappConfig)}
                className="w-full"
              >
                Salvar Configurações
              </Button>

              <p className="text-xs text-gray-500">
                Configure seu WhatsApp para receber leads automaticamente da
                nossa assistente inteligente.
              </p>
            </CardContent>
          </Card>

          {/* Leads Recentes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Leads Recentes</CardTitle>
              <Button asChild size="sm">
                <Link to="/corretor/leads">Ver Todos</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadsRecentes.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    Nenhum lead recente
                  </p>
                ) : (
                  leadsRecentes.map((lead) => (
                    <div
                      key={lead.id}
                      className="border-b pb-3 last:border-b-0"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{lead.nome}</h4>
                          <p className="text-xs text-gray-500">
                            {lead.telefone}
                          </p>
                          {lead.imovel && (
                            <p className="text-xs text-gray-600 mt-1">
                              {lead.imovel.titulo}
                            </p>
                          )}
                        </div>
                        <Badge
                          className={`text-xs ${getStatusColor(lead.status)}`}
                        >
                          {lead.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                        {lead.mensagem}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(lead.criadoEm).toLocaleDateString("pt-BR")}
                      </p>
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
                <Link to="/corretor/agenda">Ver Agenda</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visitasProximas.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    Nenhuma visita agendada
                  </p>
                ) : (
                  visitasProximas.map((visita) => (
                    <div
                      key={visita.id}
                      className="border-b pb-3 last:border-b-0"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {visita.cliente}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {visita.imovel}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(visita.dataHora).toLocaleString("pt-BR")}
                          </p>
                        </div>
                        <Badge
                          className={`text-xs ${getStatusColor(visita.status)}`}
                        >
                          {visita.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/corretor/imoveis/novo">
                <Plus className="h-6 w-6 mb-2" />
                Cadastrar Imóvel
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/corretor/leads">
                <MessageSquare className="h-6 w-6 mb-2" />
                Gerenciar Leads
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/corretor/agenda">
                <Calendar className="h-6 w-6 mb-2" />
                Agendar Visita
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/corretor/relatorios">
                <TrendingUp className="h-6 w-6 mb-2" />
                Relatórios
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
