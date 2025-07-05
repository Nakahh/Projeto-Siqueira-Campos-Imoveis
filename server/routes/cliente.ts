import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, authorizeRole } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Dashboard do cliente
router.get(
  "/dashboard",
  authenticateToken,
  authorizeRole(["CLIENTE", "ADMIN"]),
  async (req, res) => {
    try {
      const usuarioId = req.user?.id!;

      const [favoritos, visitas, mensagens, contratos, leads] =
        await Promise.all([
          prisma.favorito.count({
            where: { usuarioId },
          }),
          prisma.visita.count({
            where: { clienteId: usuarioId },
          }),
          prisma.mensagem.count({
            where: {
              OR: [{ remetenteId: usuarioId }, { destinatarioId: usuarioId }],
            },
          }),
          prisma.contrato.count({
            where: { clienteId: usuarioId },
          }),
          prisma.lead.count({
            where: {
              OR: [
                { email: req.user?.email },
                { telefone: req.user?.telefone },
              ],
            },
          }),
        ]);

      const stats = {
        favoritos,
        visitas,
        mensagens,
        contratos,
        leads,
      };

      res.json(stats);
    } catch (error) {
      console.error("Erro ao buscar dashboard do cliente:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Imóveis favoritos
router.get(
  "/favoritos",
  authenticateToken,
  authorizeRole(["CLIENTE", "ADMIN"]),
  async (req, res) => {
    try {
      const { page = 1, limit = 12 } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const [favoritos, total] = await Promise.all([
        prisma.favorito.findMany({
          where: { usuarioId: req.user?.id! },
          skip,
          take: parseInt(limit as string),
          orderBy: { createdAt: "desc" },
          include: {
            imovel: {
              include: {
                corretor: {
                  select: {
                    id: true,
                    nome: true,
                    telefone: true,
                    email: true,
                  },
                },
                _count: {
                  select: {
                    visualizacoes: true,
                    favoritos: true,
                  },
                },
              },
            },
          },
        }),
        prisma.favorito.count({
          where: { usuarioId: req.user?.id! },
        }),
      ]);

      res.json({
        favoritos: favoritos.map((fav) => fav.imovel),
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(total / parseInt(limit as string)),
          totalItems: total,
          itemsPerPage: parseInt(limit as string),
        },
      });
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Adicionar/remover favorito
router.post(
  "/favoritos/:imovelId",
  authenticateToken,
  authorizeRole(["CLIENTE", "ADMIN"]),
  async (req, res) => {
    try {
      const { imovelId } = req.params;
      const usuarioId = req.user?.id!;

      const favoritoExistente = await prisma.favorito.findUnique({
        where: {
          usuarioId_imovelId: {
            usuarioId,
            imovelId: parseInt(imovelId),
          },
        },
      });

      if (favoritoExistente) {
        // Remover favorito
        await prisma.favorito.delete({
          where: {
            usuarioId_imovelId: {
              usuarioId,
              imovelId: parseInt(imovelId),
            },
          },
        });
        res.json({ favorito: false, message: "Removido dos favoritos" });
      } else {
        // Adicionar favorito
        await prisma.favorito.create({
          data: {
            usuarioId,
            imovelId: parseInt(imovelId),
          },
        });
        res.json({ favorito: true, message: "Adicionado aos favoritos" });
      }
    } catch (error) {
      console.error("Erro ao gerenciar favorito:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Visitas agendadas
router.get(
  "/visitas",
  authenticateToken,
  authorizeRole(["CLIENTE", "ADMIN"]),
  async (req, res) => {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const where: any = { clienteId: req.user?.id! };
      if (status) where.status = status;

      const [visitas, total] = await Promise.all([
        prisma.visita.findMany({
          where,
          skip,
          take: parseInt(limit as string),
          orderBy: { dataHora: "desc" },
          include: {
            imovel: {
              select: {
                id: true,
                titulo: true,
                endereco: true,
                cidade: true,
                bairro: true,
                preco: true,
                tipo: true,
                imagens: true,
              },
            },
            corretor: {
              select: {
                id: true,
                nome: true,
                telefone: true,
                email: true,
              },
            },
          },
        }),
        prisma.visita.count({ where }),
      ]);

      res.json({
        visitas,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(total / parseInt(limit as string)),
          totalItems: total,
          itemsPerPage: parseInt(limit as string),
        },
      });
    } catch (error) {
      console.error("Erro ao buscar visitas:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Agendar visita
router.post(
  "/visitas",
  authenticateToken,
  authorizeRole(["CLIENTE", "ADMIN"]),
  async (req, res) => {
    try {
      const { imovelId, dataHora, observacoes } = req.body;

      if (!imovelId || !dataHora) {
        return res
          .status(400)
          .json({ error: "Imóvel e data/hora são obrigatórios" });
      }

      // Verificar se o imóvel existe e está disponível
      const imovel = await prisma.imovel.findUnique({
        where: { id: parseInt(imovelId) },
        include: {
          corretor: {
            select: { id: true, nome: true },
          },
        },
      });

      if (!imovel || !imovel.ativo || imovel.status !== "DISPONIVEL") {
        return res
          .status(400)
          .json({ error: "Imóvel não disponível para visita" });
      }

      // Verificar se não há conflito de horário
      const conflito = await prisma.visita.findFirst({
        where: {
          imovelId: parseInt(imovelId),
          dataHora: new Date(dataHora),
          status: { in: ["AGENDADA", "CONFIRMADA"] },
        },
      });

      if (conflito) {
        return res
          .status(400)
          .json({ error: "Já existe uma visita agendada para este horário" });
      }

      const visita = await prisma.visita.create({
        data: {
          clienteId: req.user?.id!,
          imovelId: parseInt(imovelId),
          corretorId: imovel.corretorId!,
          dataHora: new Date(dataHora),
          observacoes,
          status: "AGENDADA",
        },
        include: {
          imovel: {
            select: {
              id: true,
              titulo: true,
              endereco: true,
              cidade: true,
              bairro: true,
            },
          },
          corretor: {
            select: {
              id: true,
              nome: true,
              telefone: true,
              email: true,
            },
          },
        },
      });

      res.status(201).json(visita);
    } catch (error) {
      console.error("Erro ao agendar visita:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Cancelar visita
router.put(
  "/visitas/:id/cancelar",
  authenticateToken,
  authorizeRole(["CLIENTE", "ADMIN"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { motivo } = req.body;

      const visita = await prisma.visita.findUnique({
        where: { id: parseInt(id) },
      });

      if (!visita) {
        return res.status(404).json({ error: "Visita não encontrada" });
      }

      if (visita.clienteId !== req.user?.id && req.user?.tipo !== "ADMIN") {
        return res.status(403).json({ error: "Acesso negado" });
      }

      if (visita.status === "CANCELADA") {
        return res.status(400).json({ error: "Visita já foi cancelada" });
      }

      if (visita.status === "REALIZADA") {
        return res
          .status(400)
          .json({ error: "Não é possível cancelar visita já realizada" });
      }

      const visitaAtualizada = await prisma.visita.update({
        where: { id: parseInt(id) },
        data: {
          status: "CANCELADA",
          observacoes: motivo
            ? `${visita.observacoes || ""}\nCancelamento: ${motivo}`.trim()
            : visita.observacoes,
        },
        include: {
          imovel: {
            select: {
              id: true,
              titulo: true,
            },
          },
        },
      });

      res.json(visitaAtualizada);
    } catch (error) {
      console.error("Erro ao cancelar visita:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Mensagens
router.get(
  "/mensagens",
  authenticateToken,
  authorizeRole(["CLIENTE", "ADMIN"]),
  async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const [mensagens, total] = await Promise.all([
        prisma.mensagem.findMany({
          where: {
            OR: [
              { remetenteId: req.user?.id! },
              { destinatarioId: req.user?.id! },
            ],
          },
          skip,
          take: parseInt(limit as string),
          orderBy: { createdAt: "desc" },
          include: {
            remetente: {
              select: {
                id: true,
                nome: true,
                tipo: true,
              },
            },
            destinatario: {
              select: {
                id: true,
                nome: true,
                tipo: true,
              },
            },
            imovel: {
              select: {
                id: true,
                titulo: true,
              },
            },
          },
        }),
        prisma.mensagem.count({
          where: {
            OR: [
              { remetenteId: req.user?.id! },
              { destinatarioId: req.user?.id! },
            ],
          },
        }),
      ]);

      res.json({
        mensagens,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(total / parseInt(limit as string)),
          totalItems: total,
          itemsPerPage: parseInt(limit as string),
        },
      });
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Enviar mensagem
router.post(
  "/mensagens",
  authenticateToken,
  authorizeRole(["CLIENTE", "ADMIN"]),
  async (req, res) => {
    try {
      const { destinatarioId, assunto, conteudo, imovelId } = req.body;

      if (!destinatarioId || !assunto || !conteudo) {
        return res
          .status(400)
          .json({ error: "Destinatário, assunto e conteúdo são obrigatórios" });
      }

      const mensagem = await prisma.mensagem.create({
        data: {
          remetenteId: req.user?.id!,
          destinatarioId: parseInt(destinatarioId),
          assunto,
          conteudo,
          imovelId: imovelId ? parseInt(imovelId) : null,
        },
        include: {
          remetente: {
            select: {
              id: true,
              nome: true,
              tipo: true,
            },
          },
          destinatario: {
            select: {
              id: true,
              nome: true,
              tipo: true,
            },
          },
          imovel: {
            select: {
              id: true,
              titulo: true,
            },
          },
        },
      });

      res.status(201).json(mensagem);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Contratos do cliente
router.get(
  "/contratos",
  authenticateToken,
  authorizeRole(["CLIENTE", "ADMIN"]),
  async (req, res) => {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const where: any = { clienteId: req.user?.id! };
      if (status) where.status = status;

      const [contratos, total] = await Promise.all([
        prisma.contrato.findMany({
          where,
          skip,
          take: parseInt(limit as string),
          orderBy: { createdAt: "desc" },
          include: {
            imovel: {
              select: {
                id: true,
                titulo: true,
                endereco: true,
                cidade: true,
                bairro: true,
                tipo: true,
                imagens: true,
              },
            },
            corretor: {
              select: {
                id: true,
                nome: true,
                telefone: true,
                email: true,
              },
            },
          },
        }),
        prisma.contrato.count({ where }),
      ]);

      res.json({
        contratos,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(total / parseInt(limit as string)),
          totalItems: total,
          itemsPerPage: parseInt(limit as string),
        },
      });
    } catch (error) {
      console.error("Erro ao buscar contratos:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Perfil do cliente
router.get(
  "/perfil",
  authenticateToken,
  authorizeRole(["CLIENTE", "ADMIN"]),
  async (req, res) => {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: req.user?.id! },
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
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
      console.error("Erro ao buscar perfil:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Atualizar perfil
router.put(
  "/perfil",
  authenticateToken,
  authorizeRole(["CLIENTE", "ADMIN"]),
  async (req, res) => {
    try {
      const { nome, telefone, configuracoes } = req.body;

      const updateData: any = {};
      if (nome) updateData.nome = nome;
      if (telefone) updateData.telefone = telefone;
      if (configuracoes) updateData.configuracoes = configuracoes;

      const usuario = await prisma.usuario.update({
        where: { id: req.user?.id! },
        data: updateData,
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          configuracoes: true,
          updatedAt: true,
        },
      });

      res.json(usuario);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

export default router;
