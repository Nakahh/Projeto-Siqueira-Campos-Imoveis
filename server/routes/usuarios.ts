import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { authenticateToken, authorizeRole } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Listar todos os usuários (apenas admin)
router.get(
  "/",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const usuarios = await prisma.usuario.findMany({
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          tipo: true,
          ativo: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      res.json(usuarios);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Buscar usuário por ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user?.id;

    // Verificar se é admin ou o próprio usuário
    if (req.user?.tipo !== "ADMIN" && usuarioId !== parseInt(id)) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        tipo: true,
        ativo: true,
        whatsappAtivo: true,
        configuracoes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Criar novo usuário (apenas admin)
router.post(
  "/",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const { nome, email, telefone, senha, tipo } = req.body;

      // Validações
      if (!nome || !email || !senha || !tipo) {
        return res.status(400).json({ error: "Campos obrigatórios faltando" });
      }

      // Verificar se email já existe
      const emailExistente = await prisma.usuario.findUnique({
        where: { email },
      });

      if (emailExistente) {
        return res.status(400).json({ error: "Email já cadastrado" });
      }

      // Criptografar senha
      const senhaHash = await bcrypt.hash(senha, 10);

      const usuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          telefone,
          senha: senhaHash,
          tipo,
          ativo: true,
        },
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          tipo: true,
          ativo: true,
          createdAt: true,
        },
      });

      res.status(201).json(usuario);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Atualizar usuário
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user?.id;
    const { nome, email, telefone, tipo, ativo, senha } = req.body;

    // Verificar se é admin ou o próprio usuário
    if (req.user?.tipo !== "ADMIN" && usuarioId !== parseInt(id)) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    // Usuários normais não podem alterar tipo e ativo
    if (req.user?.tipo !== "ADMIN" && (tipo || ativo !== undefined)) {
      return res.status(403).json({
        error: "Apenas administradores podem alterar tipo e status",
      });
    }

    const updateData: any = {};

    if (nome) updateData.nome = nome;
    if (email) updateData.email = email;
    if (telefone) updateData.telefone = telefone;

    // Apenas admin pode alterar estas propriedades
    if (req.user?.tipo === "ADMIN") {
      if (tipo) updateData.tipo = tipo;
      if (ativo !== undefined) updateData.ativo = ativo;
    }

    // Se senha foi fornecida, criptografar
    if (senha) {
      updateData.senha = await bcrypt.hash(senha, 10);
    }

    const usuario = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        tipo: true,
        ativo: true,
        updatedAt: true,
      },
    });

    res.json(usuario);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email já cadastrado" });
    }
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Deletar usuário (apenas admin)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Não permitir deletar admin
      const usuario = await prisma.usuario.findUnique({
        where: { id: parseInt(id) },
      });

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      if (usuario.tipo === "ADMIN") {
        return res.status(400).json({
          error: "Não é possível deletar usuário administrador",
        });
      }

      await prisma.usuario.delete({
        where: { id: parseInt(id) },
      });

      res.json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Estatísticas de usuários (apenas admin)
router.get(
  "/stats/overview",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const [totalUsuarios, usuariosAtivos, usuariosPorTipo, usuariosRecentes] =
        await Promise.all([
          prisma.usuario.count(),
          prisma.usuario.count({ where: { ativo: true } }),
          prisma.usuario.groupBy({
            by: ["tipo"],
            _count: { tipo: true },
          }),
          prisma.usuario.count({
            where: {
              createdAt: {
                gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // últimos 30 dias
              },
            },
          }),
        ]);

      const stats = {
        total: totalUsuarios,
        ativos: usuariosAtivos,
        inativos: totalUsuarios - usuariosAtivos,
        recentes: usuariosRecentes,
        porTipo: usuariosPorTipo.reduce(
          (acc, curr) => {
            acc[curr.tipo] = curr._count.tipo;
            return acc;
          },
          {} as Record<string, number>,
        ),
      };

      res.json(stats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

export default router;
