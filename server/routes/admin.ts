import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, authorizeRole } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Dashboard de estatísticas gerais (apenas admin)
router.get(
  "/dashboard",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const [
        totalUsuarios,
        usuariosAtivos,
        totalImoveis,
        imoveisDisponiveis,
        totalLeads,
        leadsNovas,
        vendas30Dias,
        receita30Dias,
        atividadesRecentes,
      ] = await Promise.all([
        prisma.usuario.count(),
        prisma.usuario.count({ where: { ativo: true } }),
        prisma.imovel.count(),
        prisma.imovel.count({ where: { status: "DISPONIVEL", ativo: true } }),
        prisma.lead.count(),
        prisma.lead.count({ where: { status: "NOVA" } }),
        prisma.contrato.count({
          where: {
            status: "ASSINADO",
            createdAt: {
              gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        }),
        prisma.contrato.aggregate({
          where: {
            status: "ASSINADO",
            createdAt: {
              gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
            },
          },
          _sum: { valorTotal: true },
        }),
        prisma.atividadeLead.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            lead: {
              select: { id: true, nome: true },
            },
            usuario: {
              select: { id: true, nome: true },
            },
          },
        }),
      ]);

      const stats = {
        usuarios: {
          total: totalUsuarios,
          ativos: usuariosAtivos,
          inativos: totalUsuarios - usuariosAtivos,
        },
        imoveis: {
          total: totalImoveis,
          disponiveis: imoveisDisponiveis,
          indisponiveis: totalImoveis - imoveisDisponiveis,
        },
        leads: {
          total: totalLeads,
          novas: leadsNovas,
          processadas: totalLeads - leadsNovas,
        },
        vendas: {
          mes: vendas30Dias,
          receita: receita30Dias._sum.valorTotal || 0,
        },
        atividadesRecentes,
      };

      res.json(stats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Relatório de performance de corretores
router.get(
  "/corretores/performance",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const { periodo = "30" } = req.query;
      const diasAtras = parseInt(periodo as string);
      const dataInicio = new Date(
        new Date().getTime() - diasAtras * 24 * 60 * 60 * 1000,
      );

      const corretores = await prisma.usuario.findMany({
        where: {
          tipo: { in: ["CORRETOR", "ASSISTENTE"] },
        },
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          ativo: true,
          whatsappAtivo: true,
          _count: {
            select: {
              imoveis: true,
              leads: {
                where: {
                  createdAt: { gte: dataInicio },
                },
              },
              contratos: {
                where: {
                  status: "ASSINADO",
                  createdAt: { gte: dataInicio },
                },
              },
            },
          },
        },
      });

      // Buscar comissões para cada corretor
      const performance = await Promise.all(
        corretores.map(async (corretor) => {
          const comissoes = await prisma.comissao.aggregate({
            where: {
              corretorId: corretor.id,
              createdAt: { gte: dataInicio },
            },
            _sum: { valor: true },
          });

          const leadsConvertidas = await prisma.lead.count({
            where: {
              corretorId: corretor.id,
              status: "CONVERTIDA",
              createdAt: { gte: dataInicio },
            },
          });

          return {
            ...corretor,
            performance: {
              leadsConvertidas,
              comissoesTotais: comissoes._sum.valor || 0,
              taxaConversao:
                corretor._count.leads > 0
                  ? ((leadsConvertidas / corretor._count.leads) * 100).toFixed(
                      2,
                    )
                  : "0",
            },
          };
        }),
      );

      res.json(performance);
    } catch (error) {
      console.error("Erro ao buscar performance dos corretores:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Relatório financeiro
router.get(
  "/financeiro/resumo",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const { ano = new Date().getFullYear() } = req.query;
      const anoInt = parseInt(ano as string);

      const [vendas, locacoes, comissoes, comissoesPorMes] = await Promise.all([
        prisma.contrato.findMany({
          where: {
            tipo: "VENDA",
            status: "ASSINADO",
            createdAt: {
              gte: new Date(anoInt, 0, 1),
              lt: new Date(anoInt + 1, 0, 1),
            },
          },
          include: {
            imovel: {
              select: { titulo: true, preco: true },
            },
            corretor: {
              select: { nome: true },
            },
          },
        }),
        prisma.contrato.findMany({
          where: {
            tipo: "LOCACAO",
            status: "ASSINADO",
            createdAt: {
              gte: new Date(anoInt, 0, 1),
              lt: new Date(anoInt + 1, 0, 1),
            },
          },
          include: {
            imovel: {
              select: { titulo: true, preco: true },
            },
            corretor: {
              select: { nome: true },
            },
          },
        }),
        prisma.comissao.aggregate({
          where: {
            createdAt: {
              gte: new Date(anoInt, 0, 1),
              lt: new Date(anoInt + 1, 0, 1),
            },
          },
          _sum: { valor: true },
          _count: { id: true },
        }),
        prisma.comissao.groupBy({
          where: {
            createdAt: {
              gte: new Date(anoInt, 0, 1),
              lt: new Date(anoInt + 1, 0, 1),
            },
          },
          by: ["createdAt"],
          _sum: { valor: true },
          _count: { id: true },
        }),
      ]);

      const totalVendas = vendas.reduce(
        (sum, venda) => sum + (venda.valorTotal || 0),
        0,
      );
      const totalLocacoes = locacoes.reduce(
        (sum, locacao) => sum + (locacao.valorTotal || 0),
        0,
      );

      const resumo = {
        vendas: {
          quantidade: vendas.length,
          valorTotal: totalVendas,
          dados: vendas,
        },
        locacoes: {
          quantidade: locacoes.length,
          valorTotal: totalLocacoes,
          dados: locacoes,
        },
        comissoes: {
          total: comissoes._sum.valor || 0,
          quantidade: comissoes._count || 0,
          porMes: comissoesPorMes,
        },
        receitaTotal: totalVendas + totalLocacoes,
      };

      res.json(resumo);
    } catch (error) {
      console.error("Erro ao buscar resumo financeiro:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Configurações do sistema
router.get(
  "/configuracoes",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const configuracoes = await prisma.configuracao.findMany({
        orderBy: { chave: "asc" },
      });

      res.json(configuracoes);
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Atualizar configuração
router.put(
  "/configuracoes/:chave",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const { chave } = req.params;
      const { valor, descricao } = req.body;

      const configuracao = await prisma.configuracao.upsert({
        where: { chave },
        update: {
          valor,
          descricao,
          updatedAt: new Date(),
        },
        create: {
          chave,
          valor,
          descricao,
        },
      });

      res.json(configuracao);
    } catch (error) {
      console.error("Erro ao atualizar configuração:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Logs do sistema
router.get(
  "/logs",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const { page = 1, limit = 50, nivel, tipo } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const where: any = {};
      if (nivel) where.nivel = nivel;
      if (tipo) where.tipo = tipo;

      const [logs, total] = await Promise.all([
        prisma.log.findMany({
          where,
          skip,
          take: parseInt(limit as string),
          orderBy: { createdAt: "desc" },
          include: {
            usuario: {
              select: { id: true, nome: true },
            },
          },
        }),
        prisma.log.count({ where }),
      ]);

      res.json({
        logs,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(total / parseInt(limit as string)),
          totalItems: total,
          itemsPerPage: parseInt(limit as string),
        },
      });
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Backup do banco de dados
router.post(
  "/backup",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      // Log da operação
      await prisma.log.create({
        data: {
          nivel: "INFO",
          tipo: "BACKUP",
          mensagem: "Backup iniciado pelo administrador",
          usuarioId: req.user?.id,
        },
      });

      // Aqui você implementaria a lógica real de backup
      // Por enquanto, apenas simular
      const backupId = `backup_${new Date().getTime()}`;

      res.json({
        message: "Backup iniciado com sucesso",
        backupId,
        estimatedTime: "5-10 minutos",
      });
    } catch (error) {
      console.error("Erro ao iniciar backup:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Estatísticas de uso do sistema
router.get(
  "/sistema/estatisticas",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const [
        totalVisualizacoes,
        visualizacoesHoje,
        usuariosOnline,
        leadsHoje,
        contratosHoje,
        errorLogs,
      ] = await Promise.all([
        prisma.visualizacao.count(),
        prisma.visualizacao.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
        prisma.usuario.count({
          where: {
            ativo: true,
            updatedAt: {
              gte: new Date(new Date().getTime() - 30 * 60 * 1000), // últimos 30 min
            },
          },
        }),
        prisma.lead.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
        prisma.contrato.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
        prisma.log.count({
          where: {
            nivel: "ERROR",
            createdAt: {
              gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // últimas 24h
            },
          },
        }),
      ]);

      const stats = {
        visualizacoes: {
          total: totalVisualizacoes,
          hoje: visualizacoesHoje,
        },
        usuarios: {
          online: usuariosOnline,
        },
        leads: {
          hoje: leadsHoje,
        },
        contratos: {
          hoje: contratosHoje,
        },
        sistema: {
          errors24h: errorLogs,
        },
      };

      res.json(stats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas do sistema:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

export default router;
