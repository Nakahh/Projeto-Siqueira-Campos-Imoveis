import React, { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code,
  Database,
  Settings,
  Monitor,
  Users,
  Activity,
  Server,
  Shield,
  Bug,
  GitBranch,
  Terminal,
  Globe,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react";

export default function DesenvolvedorDashboard() {
  const systemStats = [
    { icon: Users, value: "1,247", label: "Usuários Ativos", change: "+12%" },
    { icon: Activity, value: "99.9%", label: "Uptime", change: "+0.1%" },
    { icon: Database, value: "2.3GB", label: "Uso de DB", change: "+5%" },
    { icon: Server, value: "45ms", label: "Latência", change: "-3ms" },
  ];

  const recentLogs = [
    {
      type: "info",
      message: "Sistema de backup executado com sucesso",
      timestamp: "2024-01-15 10:30:22",
    },
    {
      type: "warning",
      message: "Uso de CPU acima de 80%",
      timestamp: "2024-01-15 10:25:15",
    },
    {
      type: "error",
      message: "Falha na conexão com serviço externo",
      timestamp: "2024-01-15 10:20:08",
    },
    {
      type: "success",
      message: "Deploy realizado com sucesso",
      timestamp: "2024-01-15 09:45:30",
    },
  ];

  const apis = [
    { name: "Auth API", status: "online", response: "120ms" },
    { name: "Property API", status: "online", response: "85ms" },
    { name: "Chat API", status: "online", response: "95ms" },
    { name: "WhatsApp API", status: "warning", response: "250ms" },
    { name: "N8N Workflow", status: "online", response: "180ms" },
  ];

  const features = [
    {
      name: "Sistema de Autenticação",
      status: "active",
      description: "JWT + Google OAuth",
    },
    {
      name: "Chat AI",
      status: "active",
      description: "OpenAI GPT-3.5 Turbo",
    },
    {
      name: "WhatsApp Bot",
      status: "active",
      description: "Evolution API + N8N",
    },
    {
      name: "Sistema de Leads",
      status: "active",
      description: "Captura e distribuição automática",
    },
    {
      name: "Dashboard Analytics",
      status: "development",
      description: "Métricas avançadas em desenvolvimento",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
      case "active":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "error":
      case "offline":
        return "text-red-500";
      case "development":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard do Desenvolvedor
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Painel de controle técnico do sistema
          </p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemStats.map((stat, index) => (
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
                    <p className="text-sm text-green-500">{stat.change}</p>
                  </div>
                  <div className="w-12 h-12 bg-brand-brown-100 dark:bg-brand-brown-800 rounded-full flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-brand-brown-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="system" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="system">Sistema</TabsTrigger>
            <TabsTrigger value="apis">APIs</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="tools">Ferramentas</TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="mr-2 h-5 w-5" />
                    Status do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Frontend (React + Vite)</span>
                      <Badge className="bg-green-100 text-green-800">
                        Online
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Backend (Node.js + Express)</span>
                      <Badge className="bg-green-100 text-green-800">
                        Online
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Database (PostgreSQL)</span>
                      <Badge className="bg-green-100 text-green-800">
                        Online
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>N8N Automation</span>
                      <Badge className="bg-green-100 text-green-800">
                        Online
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>CPU Usage</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full w-[45%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Memory Usage</span>
                        <span>68%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full w-[68%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Disk Usage</span>
                        <span>32%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full w-[32%]"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="apis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Status das APIs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apis.map((api, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            api.status === "online"
                              ? "bg-green-500"
                              : api.status === "warning"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        ></div>
                        <span className="font-medium">{api.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">
                          {api.response}
                        </span>
                        <Badge
                          variant={
                            api.status === "online"
                              ? "default"
                              : api.status === "warning"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {api.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Terminal className="mr-2 h-5 w-5" />
                  Logs do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLogs.map((log, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 border rounded-lg"
                    >
                      {getLogIcon(log.type)}
                      <div className="flex-1">
                        <p className="text-sm">{log.message}</p>
                        <p className="text-xs text-gray-500">{log.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" size="sm">
                    Ver Todos os Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Funcionalidades do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{feature.name}</h3>
                        <Badge
                          variant={
                            feature.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {feature.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="mr-2 h-5 w-5" />
                    Database
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    Executar Backup
                  </Button>
                  <Button variant="outline" className="w-full">
                    Ver Logs do DB
                  </Button>
                  <Button variant="outline" className="w-full">
                    Otimizar Tabelas
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GitBranch className="mr-2 h-5 w-5" />
                    Deploy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    Deploy Frontend
                  </Button>
                  <Button variant="outline" className="w-full">
                    Deploy Backend
                  </Button>
                  <Button variant="outline" className="w-full">
                    Rollback
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Segurança
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    Scan de Vulnerabilidades
                  </Button>
                  <Button variant="outline" className="w-full">
                    Revisar Logs de Acesso
                  </Button>
                  <Button variant="outline" className="w-full">
                    Atualizar Certificados
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
