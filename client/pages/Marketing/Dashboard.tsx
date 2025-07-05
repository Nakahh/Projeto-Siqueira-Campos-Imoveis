import React, { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import Artigos from "./Artigos";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Users,
  Mail,
  Eye,
  Target,
  TrendingUp,
  Calendar,
  MessageSquare,
  Share2,
  Heart,
  Activity,
  Globe,
  Zap,
  PieChart,
  ArrowUp,
  ArrowDown,
  Phone,
  Instagram,
  Facebook,
  Youtube,
  Send,
  Filter,
} from "lucide-react";

export default function MarketingDashboard() {
  const marketingStats = [
    {
      icon: Users,
      value: "2,847",
      label: "Leads Gerados",
      change: "+23%",
      period: "vs. mês anterior",
    },
    {
      icon: Eye,
      value: "45,832",
      label: "Visualizações",
      change: "+18%",
      period: "vs. mês anterior",
    },
    {
      icon: Mail,
      value: "89.3%",
      label: "Taxa de Abertura",
      change: "+5.2%",
      period: "vs. mês anterior",
    },
    {
      icon: Target,
      value: "12.8%",
      label: "Taxa de Conversão",
      change: "+2.1%",
      period: "vs. mês anterior",
    },
  ];

  const campaigns = [
    {
      name: "Campanha Apartamentos Centro",
      status: "active",
      budget: "R$ 5.000",
      spent: "R$ 3.200",
      leads: 45,
      conversion: "8.2%",
      platform: "Google Ads",
    },
    {
      name: "Promoção Casas Setor Sul",
      status: "active",
      budget: "R$ 3.500",
      spent: "R$ 2.100",
      leads: 32,
      conversion: "12.5%",
      platform: "Facebook Ads",
    },
    {
      name: "Email Marketing Semanal",
      status: "scheduled",
      budget: "R$ 800",
      spent: "R$ 0",
      leads: 0,
      conversion: "0%",
      platform: "Mailchimp",
    },
    {
      name: "Instagram Stories",
      status: "completed",
      budget: "R$ 2.000",
      spent: "R$ 1.850",
      leads: 28,
      conversion: "15.7%",
      platform: "Instagram",
    },
  ];

  const socialMediaStats = [
    {
      platform: "Instagram",
      icon: Instagram,
      followers: "8.5K",
      engagement: "4.2%",
      posts: 25,
      reach: "45.2K",
    },
    {
      platform: "Facebook",
      icon: Facebook,
      followers: "12.3K",
      engagement: "3.8%",
      posts: 18,
      reach: "67.8K",
    },
    {
      platform: "YouTube",
      icon: Youtube,
      followers: "2.1K",
      engagement: "6.1%",
      posts: 8,
      reach: "23.5K",
    },
  ];

  const recentActivities = [
    {
      type: "lead",
      message: "Nova lead gerada via Instagram Stories",
      time: "há 2 horas",
      value: "R$ 450.000",
    },
    {
      type: "campaign",
      message: "Campanha Facebook Ads pausada por orçamento",
      time: "há 4 horas",
      value: null,
    },
    {
      type: "conversion",
      message: "Lead convertida em visita agendada",
      time: "há 6 horas",
      value: "R$ 320.000",
    },
    {
      type: "email",
      message: "Newsletter enviada para 1.200 contatos",
      time: "há 1 dia",
      value: null,
    },
  ];

  const topProperties = [
    {
      name: "Apartamento 3Q Setor Oeste",
      views: 1245,
      leads: 23,
      shares: 45,
      conversion: "1.8%",
    },
    {
      name: "Casa 4Q Jardim Goiás",
      views: 987,
      leads: 18,
      shares: 32,
      conversion: "1.9%",
    },
    {
      name: "Loft Centro Histórico",
      views: 756,
      leads: 15,
      shares: 28,
      conversion: "2.0%",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "lead":
        return <Users className="h-4 w-4 text-green-500" />;
      case "campaign":
        return <Target className="h-4 w-4 text-blue-500" />;
      case "conversion":
        return <TrendingUp className="h-4 w-4 text-purple-500" />;
      case "email":
        return <Mail className="h-4 w-4 text-orange-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard de Marketing
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Acompanhe o desempenho das campanhas e estratégias de marketing
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Nova Campanha
              </Button>
            </div>
          </div>
        </div>

        {/* Marketing Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {marketingStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <div className="flex items-center text-sm">
                      <span className="text-green-500 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        {stat.change}
                      </span>
                      <span className="text-gray-500 ml-2">{stat.period}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-brand-brown-100 dark:bg-brand-brown-800 rounded-full flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-brand-brown-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="social">Redes Sociais</TabsTrigger>
            <TabsTrigger value="properties">Imóveis</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Campanhas Ativas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{campaign.name}</h3>
                          <p className="text-sm text-gray-500">
                            {campaign.platform}
                          </p>
                        </div>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Orçamento:</span>
                          <p className="font-medium">{campaign.budget}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Gasto:</span>
                          <p className="font-medium">{campaign.spent}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Leads:</span>
                          <p className="font-medium">{campaign.leads}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Conversão:</span>
                          <p className="font-medium">{campaign.conversion}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Editar
                          </Button>
                          <Button size="sm" variant="outline">
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Atividades Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <p className="text-sm">{activity.message}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">
                              {activity.time}
                            </span>
                            {activity.value && (
                              <span className="text-xs font-medium text-green-600">
                                {activity.value}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Funil de Conversão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Visitantes</span>
                      <span className="font-bold">45,832</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full w-full"></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Leads</span>
                      <span className="font-bold">2,847</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full w-[62%]"></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Contatos Qualificados</span>
                      <span className="font-bold">1,234</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full w-[43%]"></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Visitas Agendadas</span>
                      <span className="font-bold">456</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full w-[37%]"></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Vendas</span>
                      <span className="font-bold">89</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full w-[19%]"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {socialMediaStats.map((social, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <social.icon className="mr-2 h-5 w-5" />
                      {social.platform}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Seguidores</p>
                          <p className="text-xl font-bold">
                            {social.followers}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Engajamento</p>
                          <p className="text-xl font-bold">
                            {social.engagement}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Posts/Mês</p>
                          <p className="text-xl font-bold">{social.posts}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Alcance</p>
                          <p className="text-xl font-bold">{social.reach}</p>
                        </div>
                      </div>
                      <Button className="w-full" variant="outline">
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="mr-2 h-5 w-5" />
                  Imóveis Mais Visualizados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProperties.map((property, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{property.name}</h3>
                        <p className="text-sm text-gray-500">
                          {property.views} visualizações
                        </p>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <p className="font-medium">{property.leads}</p>
                          <p className="text-gray-500">Leads</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{property.shares}</p>
                          <p className="text-gray-500">Shares</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{property.conversion}</p>
                          <p className="text-gray-500">Conversão</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2 h-5 w-5" />
                    Origem dos Leads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Google Ads</span>
                      <span className="font-bold">35%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Facebook/Instagram</span>
                      <span className="font-bold">28%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Website Orgânico</span>
                      <span className="font-bold">20%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Email Marketing</span>
                      <span className="font-bold">12%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Outros</span>
                      <span className="font-bold">5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5" />
                    Relatórios Rápidos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Relatório de Performance
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    Relatório de Email Marketing
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="mr-2 h-4 w-4" />
                    Relatório de Redes Sociais
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="mr-2 h-4 w-4" />
                    Relatório de Campanhas
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
