import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Importar rotas
import authRoutes from "./routes/auth";
import usuarioRoutes from "./routes/usuarios";
import imovelRoutes from "./routes/imoveis";
import leadRoutes from "./routes/leads";
import corretorRoutes from "./routes/corretor";
import adminRoutes from "./routes/admin";
import clienteRoutes from "./routes/cliente";
import chatRoutes from "./routes/chat";
import whatsappRoutes from "./routes/whatsapp";
import uploadRoutes from "./routes/upload";
import financeiroRoutes from "./routes/financeiro";
import marketingRoutes from "./routes/marketing";
import statusRoutes from "./routes/status";
import artigosRoutes from "./routes/artigos";
import depoimentosRoutes from "./routes/depoimentos";

dotenv.config();

const app = express();

// Configurar Prisma com tratamento de erro
let prisma: PrismaClient;
try {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
} catch (error) {
  console.error("Erro ao conectar com o banco de dados:", error);
  // Criar um mock do Prisma para desenvolvimento se falhar
  prisma = {
    $queryRaw: async () => ({ result: "mock" }),
    $disconnect: async () => {},
    user: {
      findMany: async () => [],
      findUnique: async () => null,
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
    },
  } as any;
}

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
        server: "running",
      },
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      timestamp: new Date().toISOString(),
      services: {
        database: "disconnected",
        server: "running",
      },
      error: error.message,
    });
  }
});

// Middlewares de segurança
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https:"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || "900000"), // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX || "100"), // máximo 100 requests por IP
  message: {
    error: "Muitas tentativas, tente novamente em 15 minutos",
  },
});

app.use("/api/", limiter);

// Middlewares gerais
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Middleware para disponibilizar o Prisma nas rotas
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Log de requests em desenvolvimento
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/imoveis", imovelRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/corretor", corretorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cliente", clienteRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/financeiro", financeiroRoutes);
app.use("/api/marketing", marketingRoutes);
app.use("/api/status", statusRoutes);

// Rota para servir arquivos est��ticos (uploads)
app.use("/uploads", express.static("uploads"));

// Middleware de tratamento de erros
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Erro na aplicação:", err);

    // Log detalhado do erro
    const errorLog = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      error: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
    };

    // Salvar log no banco de dados
    if (req.prisma) {
      req.prisma.logSistema
        .create({
          data: {
            nivel: "error",
            categoria: "sistema",
            mensagem: err.message,
            dados: errorLog,
            ip: req.ip,
            userAgent: req.get("User-Agent"),
          },
        })
        .catch(console.error);
    }

    // Resposta baseada no ambiente
    if (process.env.NODE_ENV === "production") {
      res.status(500).json({
        error: "Erro interno do servidor",
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(500).json({
        error: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString(),
      });
    }
  },
);

// Rota 404 para APIs
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: "Endpoint não encontrado",
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// Servir arquivos estáticos do frontend em produção
if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist/spa"));

  // Catch-all handler: retorna o index.html para qualquer rota não-API
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../spa/index.html"));
  });
}

// Processo de desligamento gracioso
process.on("SIGTERM", async () => {
  console.log("SIGTERM recebido, desligando graciosamente...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT recebido, desligando graciosamente...");
  await prisma.$disconnect();
  process.exit(0);
});

// Em desenvolvimento, o Vite gerencia o servidor
// Em produção, iniciar servidor Express standalone
if (process.env.NODE_ENV === "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 Ambiente: ${process.env.NODE_ENV}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  });
}

export const createServer = () => {
  // Não iniciar o servidor HTTP aqui para evitar conflito com Vite
  return app;
};

export default app;
