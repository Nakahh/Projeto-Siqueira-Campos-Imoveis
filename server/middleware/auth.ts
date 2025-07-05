import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Estender interface Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        nome: string;
        tipo: string;
      };
    }
  }
}

// Middleware para autenticar token JWT
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Token de acesso requerido" });
    }

    const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

    // Verificar e decodificar token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Buscar usuário no banco para verificar se ainda existe e está ativo
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        nome: true,
        tipo: true,
        ativo: true,
      },
    });

    if (!usuario) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    if (!usuario.ativo) {
      return res.status(401).json({ error: "Usuário desativado" });
    }

    // Adicionar usuário ao request
    req.user = usuario;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ error: "Token inválido" });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).json({ error: "Token expirado" });
    }

    console.error("Erro na autenticação:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Middleware para autorizar roles específicos
export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (!allowedRoles.includes(req.user.tipo)) {
      return res.status(403).json({
        error: "Acesso negado - Permissão insuficiente",
        required: allowedRoles,
        current: req.user.tipo,
      });
    }

    next();
  };
};

// Middleware para verificar se é o próprio usuário ou admin
export const authorizeUserOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const { id } = req.params;
  const isAdmin = req.user.tipo === "ADMIN";
  const isOwnUser = req.user.id === parseInt(id);

  if (!isAdmin && !isOwnUser) {
    return res.status(403).json({
      error: "Acesso negado - Você só pode acessar seus próprios dados",
    });
  }

  next();
};

// Middleware opcional de autenticação (não falha se não tiver token)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      const usuario = await prisma.usuario.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          nome: true,
          tipo: true,
          ativo: true,
        },
      });

      if (usuario && usuario.ativo) {
        req.user = usuario;
      }
    }

    next();
  } catch (error) {
    // Se der erro, apenas continue sem autenticação
    next();
  }
};

// Middleware para rate limiting por usuário
export const userRateLimit = (maxRequests: number, windowMs: number) => {
  const requests = new Map<number, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user.id;
    const now = Date.now();
    const userRequests = requests.get(userId);

    if (!userRequests || now > userRequests.resetTime) {
      // Reset window
      requests.set(userId, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (userRequests.count >= maxRequests) {
      return res.status(429).json({
        error: "Muitas requisições",
        resetTime: new Date(userRequests.resetTime).toISOString(),
      });
    }

    userRequests.count++;
    next();
  };
};

// Middleware para log de atividades
export const logActivity = (activity: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      try {
        await prisma.log.create({
          data: {
            nivel: "INFO",
            tipo: "ATIVIDADE",
            mensagem: `${activity} - ${req.method} ${req.path}`,
            usuarioId: req.user.id,
            ip: req.ip,
            userAgent: req.get("User-Agent") || "unknown",
          },
        });
      } catch (error) {
        console.error("Erro ao registrar log:", error);
      }
    }
    next();
  };
};

// Middleware para verificar permissões específicas
export const requirePermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: req.user.id },
        select: { configuracoes: true, tipo: true },
      });

      // Admin sempre tem todas as permissões
      if (usuario?.tipo === "ADMIN") {
        return next();
      }

      // Verificar permissões específicas nas configurações do usuário
      const permissions = usuario?.configuracoes?.permissions || [];
      if (permissions.includes(permission)) {
        return next();
      }

      return res.status(403).json({
        error: `Permissão '${permission}' necessária`,
      });
    } catch (error) {
      console.error("Erro ao verificar permissões:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  };
};

// Middleware para validar ownership de recursos
export const validateResourceOwnership = (
  resourceType: "imovel" | "lead" | "contrato",
  paramName = "id",
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    // Admin sempre tem acesso
    if (req.user.tipo === "ADMIN") {
      return next();
    }

    try {
      const resourceId = parseInt(req.params[paramName]);

      let resource;
      switch (resourceType) {
        case "imovel":
          resource = await prisma.imovel.findUnique({
            where: { id: resourceId },
            select: { corretorId: true },
          });
          break;
        case "lead":
          resource = await prisma.lead.findUnique({
            where: { id: resourceId },
            select: { corretorId: true },
          });
          break;
        case "contrato":
          resource = await prisma.contrato.findUnique({
            where: { id: resourceId },
            select: { corretorId: true },
          });
          break;
      }

      if (!resource) {
        return res.status(404).json({ error: "Recurso não encontrado" });
      }

      if (resource.corretorId !== req.user.id) {
        return res.status(403).json({ error: "Acesso negado ao recurso" });
      }

      next();
    } catch (error) {
      console.error("Erro ao validar ownership:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  };
};
