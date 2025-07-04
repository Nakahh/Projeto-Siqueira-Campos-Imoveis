import express from "express";
import { z } from "zod";
import { authenticateToken } from "./auth";

const router = express.Router();

// Middleware para verificar se usuário é corretor ou assistente
const isCorretorOrAssistente = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (!["CORRETOR", "ASSISTENTE", "ADMIN"].includes(req.user.tipo)) {
    return res.status(403).json({ error: "Acesso negado" });
  }
  next();
};

// Todas as rotas precisam de autenticação
router.use(authenticateToken);
router.use(isCorretorOrAssistente);

// Schemas de validação
const whatsappConfigSchema = z.object({
  whatsapp: z.string().optional(),
  ativo: z.boolean(),
});

// GET /api/corretor/stats - Estatísticas do dashboard
router.get("/stats", async (req, res) => {
  try {
    const corretorId = req.user.id;

    // Buscar estatísticas
    const [
      totalImoveis,
      imoveisAtivos,
      leadsRecebidos,
      leadsConvertidos,
      visitasAgendadas,
      comissaoMes,
    ] = await Promise.all([
      // Total de imóveis do corretor
      req.prisma.imovel.count({
        where: { corretorId },
      }),

      // Imóveis ativos
      req.prisma.imovel.count({
        where: {
          corretorId,
          status: "DISPONIVEL",
        },
      }),

      // Leads recebidos este mês
      req.prisma.lead.count({
        where: {
          corretorId,
          criadoEm: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),

      // Leads convertidos (finalizados) este mês
      req.prisma.lead.count({
        where: {
          corretorId,
          status: "FINALIZADO",
          criadoEm: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),

      // Visitas agendadas esta semana
      req.prisma.visita.count({
        where: {
          imovel: {
            corretorId,
          },
          dataHora: {
            gte: new Date(
              new Date().setDate(new Date().getDate() - new Date().getDay()),
            ),
          },
          status: {
            in: ["agendada", "confirmada"],
          },
        },
      }),

      // Comissão do mês
      req.prisma.comissao.aggregate({
        where: {
          corretorId,
          criadoEm: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
          status: "pago",
        },
        _sum: {
          valor: true,
        },
      }),
    ]);

    const stats = {
      totalImoveis,
      imoveisAtivos,
      leadsRecebidos,
      leadsConvertidos,
      visitasAgendadas,
      comissaoMes: comissaoMes._sum.valor || 0,
      metaMes: 50000, // Meta fictícia, pode vir de configurações
    };

    res.json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET /api/corretor/leads - Lista de leads do corretor
router.get("/leads", async (req, res) => {
  try {
    const corretorId = req.user.id;
    const { page = "1", limit = "10", status } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = { corretorId };
    if (status) {
      where.status = status;
    }

    const [leads, total] = await Promise.all([
      req.prisma.lead.findMany({
        where,
        include: {
          imovel: {
            select: {
              titulo: true,
              endereco: true,
            },
          },
        },
        orderBy: { criadoEm: "desc" },
        skip,
        take,
      }),
      req.prisma.lead.count({ where }),
    ]);

    res.json({
      leads,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar leads:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET /api/corretor/visitas - Próximas visitas
router.get("/visitas", async (req, res) => {
  try {
    const corretorId = req.user.id;
    const { proximas } = req.query;

    let where: any = {
      imovel: {
        corretorId,
      },
    };

    if (proximas === "true") {
      where.dataHora = {
        gte: new Date(),
      };
      where.status = {
        in: ["agendada", "confirmada"],
      };
    }

    const visitas = await req.prisma.visita.findMany({
      where,
      include: {
        cliente: {
          select: {
            nome: true,
            telefone: true,
            email: true,
          },
        },
        imovel: {
          select: {
            titulo: true,
            endereco: true,
            fotos: true,
          },
        },
      },
      orderBy: { dataHora: "asc" },
      take: proximas === "true" ? 5 : undefined,
    });

    const visitasFormatted = visitas.map((visita) => ({
      id: visita.id,
      cliente: visita.cliente.nome,
      imovel: visita.imovel.titulo,
      endereco: visita.imovel.endereco,
      dataHora: visita.dataHora,
      status: visita.status,
      observacoes: visita.observacoes,
    }));

    res.json(visitasFormatted);
  } catch (error) {
    console.error("Erro ao buscar visitas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET /api/corretor/whatsapp - Configurações do WhatsApp
router.get("/whatsapp", async (req, res) => {
  try {
    const usuario = await req.prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: {
        whatsapp: true,
        ativo: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({
      numero: usuario.whatsapp || "",
      ativo: usuario.ativo,
    });
  } catch (error) {
    console.error("Erro ao buscar configurações WhatsApp:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// PATCH /api/corretor/whatsapp - Atualizar configurações do WhatsApp
router.patch("/whatsapp", async (req, res) => {
  try {
    const { whatsapp, ativo } = whatsappConfigSchema.parse(req.body);

    const usuario = await req.prisma.usuario.update({
      where: { id: req.user.id },
      data: {
        whatsapp: whatsapp || null,
        ativo,
      },
      select: {
        whatsapp: true,
        ativo: true,
      },
    });

    // Log da atividade
    await req.prisma.atividade.create({
      data: {
        tipo: "configuracao_whatsapp",
        descricao: `WhatsApp ${ativo ? "ativado" : "desativado"}${
          whatsapp ? ` - ${whatsapp}` : ""
        }`,
        usuarioId: req.user.id,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
      },
    });

    res.json({
      numero: usuario.whatsapp || "",
      ativo: usuario.ativo,
      message: "Configurações atualizadas com sucesso",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Erro ao atualizar WhatsApp:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET /api/corretor/imoveis - Imóveis do corretor
router.get("/imoveis", async (req, res) => {
  try {
    const corretorId = req.user.id;
    const { page = "1", limit = "10", status, tipo } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = { corretorId };
    if (status) {
      where.status = status;
    }
    if (tipo) {
      where.tipo = tipo;
    }

    const [imoveis, total] = await Promise.all([
      req.prisma.imovel.findMany({
        where,
        orderBy: { criadoEm: "desc" },
        skip,
        take,
      }),
      req.prisma.imovel.count({ where }),
    ]);

    res.json({
      imoveis,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar imóveis:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET /api/corretor/comissoes - Comissões do corretor
router.get("/comissoes", async (req, res) => {
  try {
    const corretorId = req.user.id;
    const { page = "1", limit = "10", status } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = { corretorId };
    if (status) {
      where.status = status;
    }

    const [comissoes, total, totalValor] = await Promise.all([
      req.prisma.comissao.findMany({
        where,
        include: {
          contrato: {
            include: {
              imovel: {
                select: {
                  titulo: true,
                  endereco: true,
                },
              },
              cliente: {
                select: {
                  nome: true,
                },
              },
            },
          },
        },
        orderBy: { criadoEm: "desc" },
        skip,
        take,
      }),
      req.prisma.comissao.count({ where }),
      req.prisma.comissao.aggregate({
        where,
        _sum: {
          valor: true,
        },
      }),
    ]);

    res.json({
      comissoes,
      totalValor: totalValor._sum.valor || 0,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar comissões:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST /api/corretor/leads/:id/assumir - Assumir um lead
router.post("/leads/:id/assumir", async (req, res) => {
  try {
    const leadId = parseInt(req.params.id);
    const corretorId = req.user.id;

    // Verificar se o lead existe e está pendente
    const lead = await req.prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return res.status(404).json({ error: "Lead não encontrado" });
    }

    if (lead.status !== "PENDENTE") {
      return res
        .status(400)
        .json({ error: "Lead já foi assumido ou finalizado" });
    }

    // Assumir o lead
    const leadAtualizado = await req.prisma.lead.update({
      where: { id: leadId },
      data: {
        status: "ASSUMIDO",
        corretorId,
      },
    });

    // Log da atividade
    await req.prisma.atividade.create({
      data: {
        tipo: "lead_assumido",
        descricao: `Lead assumido: ${lead.nome}`,
        usuarioId: req.user.id,
        leadId,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
      },
    });

    res.json({
      message: "Lead assumido com sucesso",
      lead: leadAtualizado,
    });
  } catch (error) {
    console.error("Erro ao assumir lead:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET /api/corretor/agenda - Agenda do corretor
router.get("/agenda", async (req, res) => {
  try {
    const corretorId = req.user.id;
    const { data } = req.query;

    let where: any = {
      imovel: {
        corretorId,
      },
    };

    if (data) {
      const startDate = new Date(data as string);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      where.dataHora = {
        gte: startDate,
        lt: endDate,
      };
    }

    const visitas = await req.prisma.visita.findMany({
      where,
      include: {
        cliente: {
          select: {
            nome: true,
            telefone: true,
            email: true,
          },
        },
        imovel: {
          select: {
            titulo: true,
            endereco: true,
          },
        },
      },
      orderBy: { dataHora: "asc" },
    });

    res.json(visitas);
  } catch (error) {
    console.error("Erro ao buscar agenda:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
