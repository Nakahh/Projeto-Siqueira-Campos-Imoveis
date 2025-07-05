import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, authorizeRole } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Listar leads
router.get(
  "/",
  authenticateToken,
  authorizeRole(["CORRETOR", "ADMIN", "ASSISTENTE"]),
  async (req, res) => {
    try {
      const {
        status,
        origem,
        page = 1,
        limit = 20,
        orderBy = "createdAt",
        order = "desc",
      } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const where: any = {};

      // Admin pode ver todos, outros apenas os seus
      if (req.user?.tipo !== "ADMIN") {
        where.corretorId = req.user?.id;
      }

      if (status) where.status = status;
      if (origem) where.origem = origem;

      const [leads, total] = await Promise.all([
        prisma.lead.findMany({
          where,
          skip,
          take: parseInt(limit as string),
          orderBy: { [orderBy as string]: order },
          include: {
            corretor: {
              select: {
                id: true,
                nome: true,
                telefone: true,
                email: true,
              },
            },
            imovel: {
              select: {
                id: true,
                titulo: true,
                preco: true,
                tipo: true,
                cidade: true,
                bairro: true,
              },
            },
            atividades: {
              orderBy: { createdAt: "desc" },
              take: 3,
            },
          },
        }),
        prisma.lead.count({ where }),
      ]);

      res.json({
        leads,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(total / parseInt(limit as string)),
          totalItems: total,
          itemsPerPage: parseInt(limit as string),
        },
      });
    } catch (error) {
      console.error("Erro ao buscar leads:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Buscar lead por ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRole(["CORRETOR", "ADMIN", "ASSISTENTE"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const lead = await prisma.lead.findUnique({
        where: { id: parseInt(id) },
        include: {
          corretor: {
            select: {
              id: true,
              nome: true,
              telefone: true,
              email: true,
            },
          },
          imovel: {
            select: {
              id: true,
              titulo: true,
              preco: true,
              tipo: true,
              cidade: true,
              bairro: true,
              imagens: true,
            },
          },
          atividades: {
            orderBy: { createdAt: "desc" },
            include: {
              usuario: {
                select: {
                  id: true,
                  nome: true,
                },
              },
            },
          },
        },
      });

      if (!lead) {
        return res.status(404).json({ error: "Lead não encontrada" });
      }

      // Verificar se o usuário tem acesso a esta lead
      if (req.user?.tipo !== "ADMIN" && lead.corretorId !== req.user?.id) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      res.json(lead);
    } catch (error) {
      console.error("Erro ao buscar lead:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Criar nova lead (público e autenticado)
router.post("/", async (req, res) => {
  try {
    const {
      nome,
      email,
      telefone,
      mensagem,
      imovelId,
      origem = "WEBSITE",
      corretorId,
    } = req.body;

    // Validações
    if (!nome || !telefone) {
      return res
        .status(400)
        .json({ error: "Nome e telefone são obrigatórios" });
    }

    // Se não especificou corretor, atribuir automaticamente
    let corretorAtribuido = corretorId;

    if (!corretorAtribuido) {
      // Buscar corretor responsável pelo imóvel ou um corretor ativo
      if (imovelId) {
        const imovel = await prisma.imovel.findUnique({
          where: { id: parseInt(imovelId) },
          select: { corretorId: true },
        });
        corretorAtribuido = imovel?.corretorId;
      }

      // Se ainda não tem corretor, buscar um disponível
      if (!corretorAtribuido) {
        const corretorDisponivel = await prisma.usuario.findFirst({
          where: {
            tipo: { in: ["CORRETOR", "ASSISTENTE"] },
            ativo: true,
            whatsappAtivo: true,
          },
          orderBy: { createdAt: "asc" }, // Round-robin simples
        });
        corretorAtribuido = corretorDisponivel?.id;
      }
    }

    const lead = await prisma.lead.create({
      data: {
        nome,
        email,
        telefone,
        mensagem,
        origem,
        status: "NOVA",
        imovelId: imovelId ? parseInt(imovelId) : null,
        corretorId: corretorAtribuido,
      },
      include: {
        corretor: {
          select: {
            id: true,
            nome: true,
            telefone: true,
            email: true,
          },
        },
        imovel: {
          select: {
            id: true,
            titulo: true,
            preco: true,
            tipo: true,
          },
        },
      },
    });

    // Registrar atividade
    await prisma.atividadeLead.create({
      data: {
        leadId: lead.id,
        tipo: "NOVA_LEAD",
        descricao: `Nova lead criada via ${origem}`,
        usuarioId: req.user?.id,
      },
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error("Erro ao criar lead:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Atualizar lead
router.put(
  "/:id",
  authenticateToken,
  authorizeRole(["CORRETOR", "ADMIN", "ASSISTENTE"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const leadId = parseInt(id);

      const leadExistente = await prisma.lead.findUnique({
        where: { id: leadId },
      });

      if (!leadExistente) {
        return res.status(404).json({ error: "Lead não encontrada" });
      }

      // Verificar acesso
      if (
        req.user?.tipo !== "ADMIN" &&
        leadExistente.corretorId !== req.user?.id
      ) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      const {
        nome,
        email,
        telefone,
        mensagem,
        status,
        observacoes,
        corretorId,
        imovelId,
      } = req.body;

      const updateData: any = {};
      const atividades: string[] = [];

      if (nome && nome !== leadExistente.nome) {
        updateData.nome = nome;
        atividades.push(`Nome alterado para: ${nome}`);
      }

      if (email && email !== leadExistente.email) {
        updateData.email = email;
        atividades.push(`Email alterado para: ${email}`);
      }

      if (telefone && telefone !== leadExistente.telefone) {
        updateData.telefone = telefone;
        atividades.push(`Telefone alterado para: ${telefone}`);
      }

      if (status && status !== leadExistente.status) {
        updateData.status = status;
        atividades.push(`Status alterado para: ${status}`);
      }

      if (observacoes) {
        updateData.observacoes = observacoes;
        atividades.push("Observações adicionadas");
      }

      if (corretorId && corretorId !== leadExistente.corretorId) {
        updateData.corretorId = corretorId;
        const novoCorretor = await prisma.usuario.findUnique({
          where: { id: corretorId },
          select: { nome: true },
        });
        atividades.push(`Lead transferida para: ${novoCorretor?.nome}`);
      }

      if (imovelId && imovelId !== leadExistente.imovelId) {
        updateData.imovelId = imovelId;
        atividades.push("Imóvel de interesse alterado");
      }

      const lead = await prisma.lead.update({
        where: { id: leadId },
        data: updateData,
        include: {
          corretor: {
            select: {
              id: true,
              nome: true,
              telefone: true,
              email: true,
            },
          },
          imovel: {
            select: {
              id: true,
              titulo: true,
              preco: true,
              tipo: true,
            },
          },
        },
      });

      // Registrar atividades
      for (const atividade of atividades) {
        await prisma.atividadeLead.create({
          data: {
            leadId: lead.id,
            tipo: "ATUALIZACAO",
            descricao: atividade,
            usuarioId: req.user?.id!,
          },
        });
      }

      res.json(lead);
    } catch (error) {
      console.error("Erro ao atualizar lead:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Adicionar atividade à lead
router.post(
  "/:id/atividades",
  authenticateToken,
  authorizeRole(["CORRETOR", "ADMIN", "ASSISTENTE"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { tipo, descricao } = req.body;

      if (!tipo || !descricao) {
        return res
          .status(400)
          .json({ error: "Tipo e descrição são obrigatórios" });
      }

      const leadExistente = await prisma.lead.findUnique({
        where: { id: parseInt(id) },
      });

      if (!leadExistente) {
        return res.status(404).json({ error: "Lead não encontrada" });
      }

      // Verificar acesso
      if (
        req.user?.tipo !== "ADMIN" &&
        leadExistente.corretorId !== req.user?.id
      ) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      const atividade = await prisma.atividadeLead.create({
        data: {
          leadId: parseInt(id),
          tipo,
          descricao,
          usuarioId: req.user?.id!,
        },
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
            },
          },
        },
      });

      res.status(201).json(atividade);
    } catch (error) {
      console.error("Erro ao adicionar atividade:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Estatísticas de leads
router.get(
  "/stats/overview",
  authenticateToken,
  authorizeRole(["CORRETOR", "ADMIN", "ASSISTENTE"]),
  async (req, res) => {
    try {
      const where: any = {};

      // Admin pode ver todos, outros apenas os seus
      if (req.user?.tipo !== "ADMIN") {
        where.corretorId = req.user?.id;
      }

      const [
        total,
        novas,
        emAndamento,
        qualificadas,
        convertidas,
        perdidas,
        porOrigem,
        porMes,
      ] = await Promise.all([
        prisma.lead.count({ where }),
        prisma.lead.count({ where: { ...where, status: "NOVA" } }),
        prisma.lead.count({ where: { ...where, status: "EM_ANDAMENTO" } }),
        prisma.lead.count({ where: { ...where, status: "QUALIFICADA" } }),
        prisma.lead.count({ where: { ...where, status: "CONVERTIDA" } }),
        prisma.lead.count({ where: { ...where, status: "PERDIDA" } }),
        prisma.lead.groupBy({
          where,
          by: ["origem"],
          _count: { origem: true },
        }),
        prisma.lead.groupBy({
          where: {
            ...where,
            createdAt: {
              gte: new Date(new Date().getFullYear(), 0, 1), // Início do ano
            },
          },
          by: ["createdAt"],
          _count: { id: true },
        }),
      ]);

      const stats = {
        total,
        novas,
        emAndamento,
        qualificadas,
        convertidas,
        perdidas,
        taxaConversao:
          total > 0 ? ((convertidas / total) * 100).toFixed(2) : "0",
        porOrigem: porOrigem.reduce(
          (acc, curr) => {
            acc[curr.origem] = curr._count.origem;
            return acc;
          },
          {} as Record<string, number>,
        ),
        porMes: porMes.length,
      };

      res.json(stats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas de leads:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Distribuir leads automaticamente
router.post(
  "/distribuir",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      // Buscar leads sem corretor
      const leadsSemCorretor = await prisma.lead.findMany({
        where: {
          corretorId: null,
          status: "NOVA",
        },
        orderBy: { createdAt: "asc" },
      });

      if (leadsSemCorretor.length === 0) {
        return res.json({
          message: "Nenhuma lead para distribuir",
          distribuidas: 0,
        });
      }

      // Buscar corretores disponíveis
      const corretoresDisponiveis = await prisma.usuario.findMany({
        where: {
          tipo: { in: ["CORRETOR", "ASSISTENTE"] },
          ativo: true,
          whatsappAtivo: true,
        },
        orderBy: { createdAt: "asc" },
      });

      if (corretoresDisponiveis.length === 0) {
        return res.status(400).json({ error: "Nenhum corretor disponível" });
      }

      let distribuidas = 0;
      let corretorIndex = 0;

      for (const lead of leadsSemCorretor) {
        const corretor =
          corretoresDisponiveis[corretorIndex % corretoresDisponiveis.length];

        await prisma.lead.update({
          where: { id: lead.id },
          data: { corretorId: corretor.id },
        });

        await prisma.atividadeLead.create({
          data: {
            leadId: lead.id,
            tipo: "ATRIBUICAO",
            descricao: `Lead atribuída automaticamente para ${corretor.nome}`,
            usuarioId: req.user?.id!,
          },
        });

        distribuidas++;
        corretorIndex++;
      }

      res.json({
        message: `${distribuidas} leads distribuídas com sucesso`,
        distribuidas,
      });
    } catch (error) {
      console.error("Erro ao distribuir leads:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

export default router;
