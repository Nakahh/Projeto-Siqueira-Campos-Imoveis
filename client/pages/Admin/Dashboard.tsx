import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Calendar,
  FileText,
  Activity,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

interface AdminStats {
  totalImoveis: number;
  imoveisAtivos: number;
  imoveisVendidos: number;
  imoveisAlugados: number;
  totalUsuarios: number;
  corretoresAtivos: number;
  clientesAtivos: number;
  leadsTotal: number;
  leadsConvertidos: number;
  faturamentoMes: number;
  faturamentoAnterior: number;
  comissoesPagas: number;
  comissoesPendentes: number;
  visitasAgendadas: number;
  contratosAssinados: number;
}

interface AlertaItem {
  id: number;
  tipo: "warning" | "error" | "info";
  titulo: string;
  descricao: string;
  criadoEm: string;
  lido: boolean;
}

interface AtividadeRecente {
  id: number;
  usuario: string;
  acao: string;
  detalhes: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [alertas, setAlertas] = useState<AlertaItem[]>([]);
  const [atividades, setAtividades] = useState<AtividadeRecente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, alertasResponse, atividadesResponse] =
        await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/alertas"),
          fetch("/api/admin/atividades"),
        ]);

      const [statsData, alertasData, atividadesData] = await Promise.all([
        statsResponse.json(),
        alertasResponse.json(),
        atividadesResponse.json(),
      ]);

      setStats(statsData);
      setAlertas(alertasData);
      setAtividades(atividadesData);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calcularVariacao = (atual: number, anterior: number) => {
    if (anterior === 0) return 0;
    return ((atual - anterior) / anterior) * 100;
  };

  const getAlertaIcon = (tipo: string) => {
    switch (tipo) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  if (isLoading) {
    return (
      <MainLayout showSidebar>
        <div className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const variacaoFaturamento = stats
    ? calcularVariacao(stats.faturamentoMes, stats.faturamentoAnterior)
    : 0;

  return (
    <MainLayout showSidebar>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Administrativo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visão geral completa do negócio
          </p>
        </div>

        {/* Cards de Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Faturamento do Mês
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {(stats?.faturamentoMes || 0).toLocaleString()}
              </div>
              <div className="flex items-center text-xs">
                {variacaoFaturamento >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span
                  className={
                    variacaoFaturamento >= 0 ? "text-green-500" : "text-red-500"
                  }
                >
                  {Math.abs(variacaoFaturamento).toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-1">
                  vs mês anterior
                </span>
              </div>
            </CardContent>
          </Card>

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
              <Progress
                value={
                  stats?.totalImoveis
                    ? (stats.imoveisAtivos / stats.totalImoveis) * 100
                    : 0
                }
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Conversão
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.leadsTotal
                  ? ((stats.leadsConvertidos / stats.leadsTotal) * 100).toFixed(
                      1,
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.leadsConvertidos || 0} de {stats?.leadsTotal || 0} leads
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Corretores Ativos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.corretoresAtivos || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                de {stats?.totalUsuarios || 0} usuários
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cards de Estatísticas Secundárias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Imóveis Vendidos
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.imoveisVendidos || 0}
              </div>
              <p className="text-xs text-muted-foreground">este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Imóveis Alugados
              </CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.imoveisAlugados || 0}
              </div>
              <p className="text-xs text-muted-foreground">este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Comissões Pendentes
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {(stats?.comissoesPendentes || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Pagas: R$ {(stats?.comissoesPagas || 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Contratos Assinados
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.contratosAssinados || 0}
              </div>
              <p className="text-xs text-muted-foreground">este mês</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Alertas do Sistema */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Alertas do Sistema</CardTitle>
              <Badge variant="secondary">
                {alertas.filter((a) => !a.lido).length}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {alertas.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    Nenhum alerta pendente
                  </p>
                ) : (
                  alertas.map((alerta) => (
                    <div
                      key={alerta.id}
                      className={`border-l-4 pl-4 py-2 ${
                        alerta.tipo === "error"
                          ? "border-red-500"
                          : alerta.tipo === "warning"
                            ? "border-yellow-500"
                            : "border-blue-500"
                      } ${!alerta.lido ? "bg-gray-50 dark:bg-gray-800" : ""}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2">
                          {getAlertaIcon(alerta.tipo)}
                          <div>
                            <h4 className="font-medium text-sm">
                              {alerta.titulo}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {alerta.descricao}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(alerta.criadoEm).toLocaleString(
                                "pt-BR",
                              )}
                            </p>
                          </div>
                        </div>
                        {!alerta.lido && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Atividade Recente */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {atividades.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    Nenhuma atividade recente
                  </p>
                ) : (
                  atividades.map((atividade) => (
                    <div
                      key={atividade.id}
                      className="border-b pb-3 last:border-b-0"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-brand-brown-100 rounded-full flex items-center justify-center">
                          <Activity className="h-4 w-4 text-brand-brown-700" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {atividade.usuario}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {atividade.acao}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {atividade.detalhes}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(atividade.timestamp).toLocaleString(
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

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <Link to="/admin/usuarios/novo">
                    <Users className="mr-2 h-4 w-4" />
                    Cadastrar Usuário
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link to="/admin/imoveis">
                    <Building2 className="mr-2 h-4 w-4" />
                    Gerenciar Imóveis
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link to="/admin/financeiro">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Relatório Financeiro
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link to="/admin/leads">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Visualizar Leads
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link to="/admin/configuracoes">
                    <Activity className="mr-2 h-4 w-4" />
                    Configurações
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo de Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats?.leadsConvertidos || 0}
                </div>
                <p className="text-sm text-gray-600">Leads Convertidos</p>
                <Progress
                  value={
                    stats?.leadsTotal
                      ? (stats.leadsConvertidos / stats.leadsTotal) * 100
                      : 0
                  }
                  className="mt-2"
                />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats?.visitasAgendadas || 0}
                </div>
                <p className="text-sm text-gray-600">Visitas Agendadas</p>
                <Progress value={75} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats?.clientesAtivos || 0}
                </div>
                <p className="text-sm text-gray-600">Clientes Ativos</p>
                <Progress value={85} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
