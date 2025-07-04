import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const router = express.Router();

// Schemas de validação
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const registerSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  telefone: z.string().optional(),
  whatsapp: z.string().optional(),
  tipo: z
    .enum([
      "CLIENTE",
      "CORRETOR",
      "ASSISTENTE",
      "ADMIN",
      "MARKETING",
      "DESENVOLVEDOR",
    ])
    .default("CLIENTE"),
});

// Utility functions
const generateToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const hashPassword = async (password: string): Promise<string> => {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS || "12");
  return bcrypt.hash(password, rounds);
};

// Middleware para verificar token
export const authenticateToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token de acesso necessário" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    const user = await req.prisma.usuario.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        avatar: true,
        whatsapp: true,
        ativo: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    if (!user.ativo) {
      return res.status(401).json({ error: "Usuário inativo" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido" });
  }
};

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = loginSchema.parse(req.body);

    // Buscar usuário
    const user = await req.prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    if (!user.ativo) {
      return res.status(401).json({ error: "Usuário inativo" });
    }

    // Verificar senha
    if (!user.senha) {
      return res
        .status(401)
        .json({ error: "Conta não possui senha. Use login social." });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    // Gerar token
    const token = generateToken(user.id);

    // Criar sessão
    await req.prisma.sessao.create({
      data: {
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
        userAgent: req.get("User-Agent"),
        ip: req.ip,
        usuarioId: user.id,
      },
    });

    // Atualizar último login
    await req.prisma.usuario.update({
      where: { id: user.id },
      data: { ultimoLogin: new Date() },
    });

    // Log de atividade
    await req.prisma.atividade.create({
      data: {
        tipo: "login",
        descricao: "Login realizado com sucesso",
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        usuarioId: user.id,
      },
    });

    const userResponse = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      tipo: user.tipo,
      avatar: user.avatar,
      whatsapp: user.whatsapp,
      ativo: user.ativo,
    };

    res.json({
      token,
      user: userResponse,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const userData = registerSchema.parse(req.body);

    // Verificar se email já existe
    const existingUser = await req.prisma.usuario.findUnique({
      where: { email: userData.email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email já está sendo usado" });
    }

    // Hash da senha
    const senhaHash = await hashPassword(userData.senha);

    // Criar usuário
    const newUser = await req.prisma.usuario.create({
      data: {
        nome: userData.nome,
        email: userData.email.toLowerCase(),
        senha: senhaHash,
        telefone: userData.telefone,
        whatsapp: userData.whatsapp,
        tipo: userData.tipo,
        emailVerificado: false, // Para implementar verificação por email
      },
    });

    // Gerar token
    const token = generateToken(newUser.id);

    // Log de atividade
    await req.prisma.atividade.create({
      data: {
        tipo: "registro",
        descricao: "Nova conta criada",
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        usuarioId: newUser.id,
      },
    });

    const userResponse = {
      id: newUser.id,
      nome: newUser.nome,
      email: newUser.email,
      tipo: newUser.tipo,
      avatar: newUser.avatar,
      whatsapp: newUser.whatsapp,
      ativo: newUser.ativo,
    };

    res.status(201).json({
      token,
      user: userResponse,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Erro no registro:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET /api/auth/validate
router.get("/validate", authenticateToken, (req, res) => {
  res.json(req.user);
});

// POST /api/auth/logout
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      // Invalidar sessão
      await req.prisma.sessao.updateMany({
        where: { token, ativo: true },
        data: { ativo: false },
      });
    }

    // Log de atividade
    await req.prisma.atividade.create({
      data: {
        tipo: "logout",
        descricao: "Logout realizado",
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        usuarioId: req.user.id,
      },
    });

    res.json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    console.error("Erro no logout:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET /api/auth/google - Redirecionar para Google OAuth
router.get("/google", (req, res) => {
  const googleAuthUrl =
    `https://accounts.google.com/oauth/authorize?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `response_type=code&` +
    `scope=openid email profile&` +
    `redirect_uri=${encodeURIComponent(process.env.GOOGLE_CALLBACK_URL!)}&` +
    `state=${req.query.state || ""}`;

  res.redirect(googleAuthUrl);
});

// GET /api/auth/google/callback - Callback do Google OAuth
router.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.redirect("/login?error=google_auth_failed");
    }

    // Trocar código por token do Google
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code: code as string,
        grant_type: "authorization_code",
        redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.redirect("/login?error=google_token_failed");
    }

    // Buscar dados do usuário no Google
    const userResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`,
    );
    const googleUser = await userResponse.json();

    // Buscar ou criar usuário
    let user = await req.prisma.usuario.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      // Criar novo usuário
      user = await req.prisma.usuario.create({
        data: {
          nome: googleUser.name,
          email: googleUser.email,
          googleId: googleUser.id,
          avatar: googleUser.picture,
          emailVerificado: true,
          tipo: "CLIENTE",
        },
      });
    } else if (!user.googleId) {
      // Vincular conta existente ao Google
      user = await req.prisma.usuario.update({
        where: { id: user.id },
        data: {
          googleId: googleUser.id,
          avatar: user.avatar || googleUser.picture,
          emailVerificado: true,
        },
      });
    }

    // Gerar token
    const token = generateToken(user.id);

    // Criar sessão
    await req.prisma.sessao.create({
      data: {
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent: req.get("User-Agent"),
        ip: req.ip,
        usuarioId: user.id,
      },
    });

    // Log de atividade
    await req.prisma.atividade.create({
      data: {
        tipo: "login_google",
        descricao: "Login com Google realizado",
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        usuarioId: user.id,
      },
    });

    // Redirecionar com token
    res.redirect(
      `/?token=${token}&user=${encodeURIComponent(
        JSON.stringify({
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo,
          avatar: user.avatar,
        }),
      )}`,
    );
  } catch (error) {
    console.error("Erro no Google OAuth:", error);
    res.redirect("/login?error=google_auth_error");
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await req.prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Por segurança, sempre retorna sucesso
      return res.json({
        message: "Se o email existir, você receberá instruções de recuperação",
      });
    }

    // Gerar token de recuperação
    const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    await req.prisma.usuario.update({
      where: { id: user.id },
      data: { tokenRecuperacao: resetToken },
    });

    // TODO: Enviar email com link de recuperação
    // await sendPasswordResetEmail(user.email, resetToken);

    res.json({
      message: "Se o email existir, você receberá instruções de recuperação",
    });
  } catch (error) {
    console.error("Erro na recuperação de senha:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
