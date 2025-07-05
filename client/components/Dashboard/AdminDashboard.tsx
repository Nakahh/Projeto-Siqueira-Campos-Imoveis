import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Home,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Building,
  UserCheck,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";
import { useAppState } from "@/contexts/AppStateContext";

interface DashboardMetrics {
  totalProperties: number;
  activeLeads: number;
  monthlyRevenue: number;
  conversionRate: number;
  trends: {
    properties: number;
    leads: number;
    revenue: number;
    conversion: number;
  };
}

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

const COLORS = [
  "#8B4513",
  "#D2B48C",
  "#DEB887",
  "#F4A460",
  "#CD853F",
  "#A0522D",
];

export function AdminDashboard() {
  const { state, actions } = useAppState();
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalProperties: 1247,
    activeLeads: 89,
    monthlyRevenue: 2450000,
    conversionRate: 18.5,
    trends: {
      properties: 12.5,
      leads: 8.3,
      revenue: 15.2,
      conversion: -2.1,
    },
  });

  const salesData = [
    { month: "Jan", vendas: 45, aluguel: 78, leads: 234 },
    { month: "Fev", vendas: 52, aluguel: 85, leads: 267 },
    { month: "Mar", vendas: 48, aluguel: 92, leads: 298 },
    { month: "Abr", vendas: 61, aluguel: 88, leads: 312 },
    { month: "Mai", vendas: 55, aluguel: 94, leads: 286 },
    { month: "Jun", vendas: 67, aluguel: 101, leads: 334 },
  ];

  const propertyTypeData = [
    { name: "Apartamentos", value: 45, color: COLORS[0] },
    { name: "Casas", value: 32, color: COLORS[1] },
    { name: "Terrenos", value: 15, color: COLORS[2] },
    { name: "Comercial", value: 8, color: COLORS[3] },
  ];

  const regionData = [
    { region: "Setor Bueno", properties: 156, avgPrice: 650000 },
    { region: "Setor Oeste", properties: 143, avgPrice: 480000 },
    { region: "Setor Marista", properties: 124, avgPrice: 720000 },
    { region: "Jardim Goiás", properties: 98, avgPrice: 890000 },
    { region: "Setor Central", properties: 87, avgPrice: 420000 },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, [timeRange]);

  const MetricCard = ({
    title,
    value,
    trend,
    icon: Icon,
    format = "number",
  }: {
    title: string;
    value: number;
    trend: number;
    icon: any;
    format?: "number" | "currency" | "percentage";
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case "currency":
          return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(val);
        case "percentage":
          return `${val}%`;
        default:
          return new Intl.NumberFormat("pt-BR").format(val);
      }
    };

    return (
      <Card className="transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatValue(value)}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {trend > 0 ? (
              <>
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-green-600">+{trend}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                <span className="text-red-600">{trend}%</span>
              </>
            )}
            <span className="ml-1">vs mês anterior</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Carregando dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">
            Visão geral do desempenho da Siqueira Campos Imóveis
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Imóveis"
          value={metrics.totalProperties}
          trend={metrics.trends.properties}
          icon={Home}
        />
        <MetricCard
          title="Leads Ativos"
          value={metrics.activeLeads}
          trend={metrics.trends.leads}
          icon={Users}
        />
        <MetricCard
          title="Receita Mensal"
          value={metrics.monthlyRevenue}
          trend={metrics.trends.revenue}
          icon={DollarSign}
          format="currency"
        />
        <MetricCard
          title="Taxa de Conversão"
          value={metrics.conversionRate}
          trend={metrics.trends.conversion}
          icon={TrendingUp}
          format="percentage"
        />
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="sales">Vendas & Locações</TabsTrigger>
          <TabsTrigger value="properties">Imóveis</TabsTrigger>
          <TabsTrigger value="leads">Leads & CRM</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Sales Performance */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="vendas"
                      stackId="1"
                      stroke="#8B4513"
                      fill="#8B4513"
                      fillOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="aluguel"
                      stackId="1"
                      stroke="#D2B48C"
                      fill="#D2B48C"
                      fillOpacity={0.8}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Property Types */}
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Imóveis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={propertyTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {propertyTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {propertyTypeData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold">
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regional Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance por Região</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionData.map((region, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{region.region}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          {region.properties} imóveis
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Preço médio: R${" "}
                          {new Intl.NumberFormat("pt-BR").format(
                            region.avgPrice,
                          )}
                        </div>
                      </div>
                      <Progress
                        value={(region.properties / 156) * 100}
                        className="w-20"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs content would go here */}
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Vendas e Locações</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Conteúdo detalhado de vendas e locações...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Imóveis</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Conteúdo detalhado de gestão de imóveis...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Leads e CRM</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Conteúdo detalhado de leads e CRM...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Avançados</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Conteúdo detalhado de relatórios...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
