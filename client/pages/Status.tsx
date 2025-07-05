import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  Server,
  Database,
  Wifi,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Clock,
  HardDrive,
  Cpu,
  MemoryStick,
} from "lucide-react";

interface ServiceStatus {
  name: string;
  status: "online" | "offline" | "warning";
  responseTime: number;
  lastCheck: string;
  details?: string;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  uptime: string;
}

export default function Status() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const checkServices = async () => {
    try {
      const response = await fetch("/api/status/services");
      const data = await response.json();

      if (data.success) {
        setServices(data.services);
        setMetrics(data.metrics);
      }
    } catch (error) {
      console.error("Erro ao verificar status dos serviços:", error);
    } finally {
      setLoading(false);
      setLastUpdate(new Date());
    }
  };

  useEffect(() => {
    checkServices();

    // Auto-refresh a cada 30 segundos
    const interval = setInterval(checkServices, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "offline":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "offline":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatUptime = (uptime: string) => {
    const match = uptime.match(/(\d+):(\d+):(\d+)/);
    if (match) {
      const [, hours, minutes, seconds] = match;
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return uptime;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Verificando status dos serviços...</span>
        </div>
      </div>
    );
  }

  const overallStatus = services.every((s) => s.status === "online")
    ? "online"
    : services.some((s) => s.status === "offline")
      ? "offline"
      : "warning";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Status do Sistema
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitoramento em tempo real dos serviços
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${getStatusColor(overallStatus)}`}
              ></div>
              <span className="text-sm font-medium">
                {overallStatus === "online"
                  ? "Todos os sistemas operacionais"
                  : overallStatus === "warning"
                    ? "Alguns alertas detectados"
                    : "Problemas detectados"}
              </span>
            </div>

            <Button
              onClick={checkServices}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Atualizar</span>
            </Button>
          </div>
        </div>

        {/* Status Geral */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Status Geral do Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div
                  className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center ${getStatusColor(overallStatus)}`}
                >
                  {getStatusIcon(overallStatus)}
                </div>
                <h3 className="font-semibold">Status Geral</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {overallStatus === "online"
                    ? "Operacional"
                    : overallStatus === "warning"
                      ? "Atenção"
                      : "Offline"}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500 mx-auto mb-2 flex items-center justify-center">
                  <Server className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold">Serviços Ativos</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {services.filter((s) => s.status === "online").length} de{" "}
                  {services.length}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-500 mx-auto mb-2 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold">Última Verificação</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métricas do Sistema */}
        {metrics && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cpu className="h-5 w-5" />
                <span>Métricas do Sistema</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex items-center space-x-3">
                  <Cpu className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      CPU
                    </p>
                    <p className="text-2xl font-bold">{metrics.cpu}%</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MemoryStick className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Memória
                    </p>
                    <p className="text-2xl font-bold">{metrics.memory}%</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <HardDrive className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Disco
                    </p>
                    <p className="text-2xl font-bold">{metrics.disk}%</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Uptime
                    </p>
                    <p className="text-lg font-bold">
                      {formatUptime(metrics.uptime)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Serviços */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5" />
              <span>Status dos Serviços</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(service.status)}
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      {service.details && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {service.details}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {service.responseTime}ms
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {service.lastCheck}
                      </p>
                    </div>

                    <Badge
                      variant={
                        service.status === "online"
                          ? "default"
                          : service.status === "warning"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {service.status === "online"
                        ? "Online"
                        : service.status === "warning"
                          ? "Atenção"
                          : "Offline"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
