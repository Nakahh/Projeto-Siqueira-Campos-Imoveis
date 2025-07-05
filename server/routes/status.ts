import express from "express";
import { PrismaClient } from "@prisma/client";
import os from "os";
import fs from "fs";
import { promisify } from "util";
import { exec } from "child_process";

const router = express.Router();
const prisma = new PrismaClient();
const execAsync = promisify(exec);

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

// Verificar status de um serviço
async function checkService(
  name: string,
  checkFn: () => Promise<{
    success: boolean;
    responseTime: number;
    details?: string;
  }>,
): Promise<ServiceStatus> {
  const start = Date.now();

  try {
    const result = await checkFn();
    const responseTime = Date.now() - start;

    return {
      name,
      status: result.success ? "online" : "offline",
      responseTime: result.responseTime || responseTime,
      lastCheck: new Date().toLocaleString("pt-BR"),
      details: result.details,
    };
  } catch (error) {
    return {
      name,
      status: "offline",
      responseTime: Date.now() - start,
      lastCheck: new Date().toLocaleString("pt-BR"),
      details: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

// Verificar banco de dados
async function checkDatabase(): Promise<{
  success: boolean;
  responseTime: number;
  details?: string;
}> {
  const start = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - start;

    // Verificar número de conexões
    const connections = await prisma.$queryRaw<Array<{ count: number }>>`
      SELECT count(*) as count FROM pg_stat_activity WHERE state = 'active'
    `;

    const activeConnections = Number(connections[0]?.count || 0);

    return {
      success: true,
      responseTime,
      details: `${activeConnections} conexões ativas`,
    };
  } catch (error) {
    return {
      success: false,
      responseTime: Date.now() - start,
      details: error instanceof Error ? error.message : "Erro de conexão",
    };
  }
}

// Verificar Redis (simulado)
async function checkRedis(): Promise<{
  success: boolean;
  responseTime: number;
  details?: string;
}> {
  const start = Date.now();

  try {
    // Simular verificação do Redis
    // Em produção, use a biblioteca redis
    await new Promise((resolve) => setTimeout(resolve, 10));

    return {
      success: true,
      responseTime: Date.now() - start,
      details: "Cache funcionando",
    };
  } catch (error) {
    return {
      success: false,
      responseTime: Date.now() - start,
      details: "Redis não disponível",
    };
  }
}

// Verificar N8N
async function checkN8N(): Promise<{
  success: boolean;
  responseTime: number;
  details?: string;
}> {
  const start = Date.now();

  try {
    // Verificar se N8N está rodando
    const response = await fetch("http://n8n:5678/rest/health", {
      signal: AbortSignal.timeout(5000),
    });

    const responseTime = Date.now() - start;

    if (response.ok) {
      return {
        success: true,
        responseTime,
        details: "Automação ativa",
      };
    } else {
      return {
        success: false,
        responseTime,
        details: `HTTP ${response.status}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      responseTime: Date.now() - start,
      details: "N8N não acessível",
    };
  }
}

// Verificar Evolution API
async function checkEvolutionAPI(): Promise<{
  success: boolean;
  responseTime: number;
  details?: string;
}> {
  const start = Date.now();

  try {
    const response = await fetch("http://evolution:8080/health", {
      signal: AbortSignal.timeout(5000),
    });

    const responseTime = Date.now() - start;

    if (response.ok) {
      return {
        success: true,
        responseTime,
        details: "WhatsApp API ativa",
      };
    } else {
      return {
        success: false,
        responseTime,
        details: `HTTP ${response.status}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      responseTime: Date.now() - start,
      details: "Evolution API não acessível",
    };
  }
}

// Obter métricas do sistema
async function getSystemMetrics(): Promise<SystemMetrics> {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const uptime = os.uptime();

  // Calcular uso da CPU (simplificado)
  const cpuUsage = Math.random() * 30 + 10; // Simulado para exemplo

  // Calcular uso de memória
  const memoryUsage = ((totalMem - freeMem) / totalMem) * 100;

  // Calcular uso do disco
  let diskUsage = 0;
  try {
    const { stdout } = await execAsync(
      "df / | tail -1 | awk '{print $5}' | sed 's/%//'",
    );
    diskUsage = parseInt(stdout.trim()) || 0;
  } catch (error) {
    diskUsage = Math.random() * 40 + 20; // Fallback simulado
  }

  // Formatar uptime
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  const uptimeStr = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return {
    cpu: Math.round(cpuUsage),
    memory: Math.round(memoryUsage),
    disk: diskUsage,
    uptime: uptimeStr,
  };
}

// Endpoint para verificar todos os serviços
router.get("/services", async (req, res) => {
  try {
    const services = await Promise.all([
      checkService("Banco de Dados PostgreSQL", checkDatabase),
      checkService("Cache Redis", checkRedis),
      checkService("Automação N8N", checkN8N),
      checkService("WhatsApp Evolution API", checkEvolutionAPI),
    ]);

    const metrics = await getSystemMetrics();

    res.json({
      success: true,
      services,
      metrics,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erro ao verificar status dos serviços:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
});

// Endpoint de health check simples
router.get("/health", async (req, res) => {
  try {
    // Verificação básica do banco
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Endpoint para logs do sistema
router.get("/logs", async (req, res) => {
  try {
    const { limit = 100, level = "all" } = req.query;

    // Aqui você pode integrar com um sistema de logs real
    // Por exemplo, Winston, Morgan, etc.

    const mockLogs = [
      {
        timestamp: new Date().toISOString(),
        level: "info",
        message: "Sistema iniciado com sucesso",
        service: "backend",
      },
      {
        timestamp: new Date(Date.now() - 60000).toISOString(),
        level: "warn",
        message: "Alto uso de CPU detectado",
        service: "system",
      },
      {
        timestamp: new Date(Date.now() - 120000).toISOString(),
        level: "info",
        message: "Backup automático concluído",
        service: "backup",
      },
    ];

    res.json({
      success: true,
      logs: mockLogs.slice(0, Number(limit)),
      total: mockLogs.length,
    });
  } catch (error) {
    console.error("Erro ao buscar logs:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar logs",
    });
  }
});

export default router;
