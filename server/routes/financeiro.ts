import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, authorizeRole } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Dashboard financeiro completo
router.get(
  "/dashboard",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const { ano = new Date().getFullYear(), mes } = req.query;
      const anoInt = parseInt(ano as string);
      const mesInt = mes ? parseInt(mes as string) : undefined;

      // Período de análise
      let dataInicio: Date;
      let dataFim: Date;

      if (mesInt) {
        dataInicio = new Date(anoInt, mesInt - 1, 1);
        dataFim = new Date(anoInt, mesInt, 0, 23, 59, 59);
      } else {
        dataInicio = new Date(anoInt, 0, 1);
        dataFim = new Date(anoInt, 11, 31, 23, 59, 59);
      }

      // Buscar dados financeiros
      const [
        vendas,
        locacoes,
        comissoesPagas,
        comissoesPendentes,
        despesas,
        metasVendas,
        performanceCorretores,
      ] = await Promise.all([
        // Vendas
        prisma.contrato.findMany({
          where: {
            tipo: "VENDA",
            status: "ASSINADO",
            dataAssinatura: { gte: dataInicio, lte: dataFim },
          },
          include: {
            imovel: { select: { titulo: true, endereco: true } },
            corretor: { select: { nome: true } },
          },
        }),

        // Locações
        prisma.contrato.findMany({
          where: {
            tipo: "LOCACAO",
            status: "ASSINADO",
            dataAssinatura: { gte: dataInicio, lte: dataFim },
          },
          include: {
            imovel: { select: { titulo: true, endereco: true } },
            corretor: { select: { nome: true } },
          },
        }),

        // Comissões pagas
        prisma.comissao.aggregate({
          where: {
            status: "PAGA",
            dataPagamento: { gte: dataInicio, lte: dataFim },
          },
          _sum: { valor: true },
          _count: { id: true },
        }),

        // Comissões pendentes
        prisma.comissao.aggregate({
          where: {
            status: "PENDENTE",
            createdAt: { gte: dataInicio, lte: dataFim },
          },
          _sum: { valor: true },
          _count: { id: true },
        }),

        // Despesas (simulação - criar tabela de despesas depois)
        Promise.resolve({
          marketing: 15000,
          operacional: 8000,
          pessoal: 25000,
          infraestrutura: 5000,
        }),

        // Metas (da configuração)
        prisma.configuracao.findFirst({
          where: { chave: "meta_vendas_mensal" },
        }),

        // Performance por corretor
        prisma.usuario.findMany({
          where: { tipo: { in: ["CORRETOR", "ASSISTENTE"] } },
          include: {
            _count: {
              select: {
                contratos: {
                  where: {
                    status: "ASSINADO",
                    dataAssinatura: { gte: dataInicio, lte: dataFim },
                  },
                },
                leads: {
                  where: {
                    status: "CONVERTIDA",
                    createdAt: { gte: dataInicio, lte: dataFim },
                  },
                },
              },
            },
          },
        }),
      ]);

      // Calcular totais
      const totalVendas = vendas.reduce(
        (sum, venda) => sum + (venda.valorTotal || 0),
        0,
      );
      const totalLocacoes = locacoes.reduce(
        (sum, locacao) => sum + (locacao.valorTotal || 0),
        0,
      );
      const receitaBruta = totalVendas + totalLocacoes;
      const totalComissoesPagas = comissoesPagas._sum.valor || 0;
      const totalComissoesPendentes = comissoesPendentes._sum.valor || 0;
      const totalDespesas =
        despesas.marketing +
        despesas.operacional +
        despesas.pessoal +
        despesas.infraestrutura;
      const lucroLiquido = receitaBruta - totalComissoesPagas - totalDespesas;

      // Performance vs período anterior
      const periodoAnteriorInicio = new Date(dataInicio);
      const periodoAnteriorFim = new Date(dataFim);
      periodoAnteriorInicio.setFullYear(
        periodoAnteriorInicio.getFullYear() - 1,
      );
      periodoAnteriorFim.setFullYear(periodoAnteriorFim.getFullYear() - 1);

      const [vendasAnterior, locacoesAnterior] = await Promise.all([
        prisma.contrato.aggregate({
          where: {
            tipo: "VENDA",
            status: "ASSINADO",
            dataAssinatura: {
              gte: periodoAnteriorInicio,
              lte: periodoAnteriorFim,
            },
          },
          _sum: { valorTotal: true },
        }),
        prisma.contrato.aggregate({
          where: {
            tipo: "LOCACAO",
            status: "ASSINADO",
            dataAssinatura: {
              gte: periodoAnteriorInicio,
              lte: periodoAnteriorFim,
            },
          },
          _sum: { valorTotal: true },
        }),
      ]);

      const receitaAnterior =
        (vendasAnterior._sum.valorTotal || 0) +
        (locacoesAnterior._sum.valorTotal || 0);
      const crescimento =
        receitaAnterior > 0
          ? ((receitaBruta - receitaAnterior) / receitaAnterior) * 100
          : 0;

      // Projeção para o ano
      const mesAtual = new Date().getMonth() + 1;
      const projecaoAnual = mesInt
        ? (receitaBruta / mesInt) * 12
        : (receitaBruta / mesAtual) * 12;

      res.json({
        periodo: {
          inicio: dataInicio,
          fim: dataFim,
          tipo: mesInt ? "mensal" : "anual",
        },
        resumo: {
          receitaBruta,
          totalVendas,
          totalLocacoes,
          totalComissoesPagas,
          totalComissoesPendentes,
          totalDespesas,
          lucroLiquido,
          margemLucro:
            receitaBruta > 0 ? (lucroLiquido / receitaBruta) * 100 : 0,
        },
        comparativo: {
          periodoAnterior: receitaAnterior,
          crescimento: crescimento.toFixed(2),
          projecaoAnual,
        },
        detalhes: {
          vendas: vendas.length,
          locacoes: locacoes.length,
          comissoesPagas: comissoesPagas._count,
          comissoesPendentes: comissoesPendentes._count,
        },
        despesas,
        performance: performanceCorretores.map((corretor) => ({
          id: corretor.id,
          nome: corretor.nome,
          vendas: corretor._count.contratos,
          leadsConvertidas: corretor._count.leads,
          meta: parseInt(metasVendas?.valor || "10"),
          percentualMeta:
            (corretor._count.contratos / parseInt(metasVendas?.valor || "10")) *
            100,
        })),
      });
    } catch (error) {
      console.error("Erro ao buscar dados financeiros:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Relatório detalhado de comissões
router.get(
  "/comissoes",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const {
        status,
        corretorId,
        dataInicio,
        dataFim,
        page = 1,
        limit = 20,
      } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const where: any = {};

      if (status) where.status = status;
      if (corretorId) where.corretorId = parseInt(corretorId as string);
      if (dataInicio || dataFim) {
        where.createdAt = {};
        if (dataInicio) where.createdAt.gte = new Date(dataInicio as string);
        if (dataFim) where.createdAt.lte = new Date(dataFim as string);
      }

      const [comissoes, total, resumo] = await Promise.all([
        prisma.comissao.findMany({
          where,
          skip,
          take: parseInt(limit as string),
          orderBy: { createdAt: "desc" },
          include: {
            corretor: {
              select: { nome: true, email: true },
            },
            contrato: {
              include: {
                imovel: {
                  select: { titulo: true, endereco: true },
                },
              },
            },
          },
        }),
        prisma.comissao.count({ where }),
        prisma.comissao.groupBy({
          where,
          by: ["status"],
          _sum: { valor: true },
          _count: { id: true },
        }),
      ]);

      res.json({
        comissoes,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(total / parseInt(limit as string)),
          totalItems: total,
          itemsPerPage: parseInt(limit as string),
        },
        resumo: resumo.reduce(
          (acc, item) => {
            acc[item.status] = {
              valor: item._sum.valor || 0,
              quantidade: item._count || 0,
            };
            return acc;
          },
          {} as Record<string, { valor: number; quantidade: number }>,
        ),
      });
    } catch (error) {
      console.error("Erro ao buscar comissões:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Pagar comissão
router.put(
  "/comissoes/:id/pagar",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { observacoes } = req.body;

      const comissao = await prisma.comissao.update({
        where: { id: parseInt(id) },
        data: {
          status: "PAGA",
          dataPagamento: new Date(),
          observacoes,
        },
        include: {
          corretor: {
            select: { nome: true, email: true },
          },
        },
      });

      // Log da atividade
      await prisma.log.create({
        data: {
          nivel: "INFO",
          tipo: "FINANCEIRO",
          mensagem: `Comissão de R$ ${comissao.valor} paga para ${comissao.corretor.nome}`,
          usuarioId: req.user?.id!,
        },
      });

      res.json(comissao);
    } catch (error) {
      console.error("Erro ao pagar comissão:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Relatório de fluxo de caixa
router.get(
  "/fluxo-caixa",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const { ano = new Date().getFullYear() } = req.query;
      const anoInt = parseInt(ano as string);

      // Buscar dados mês a mês
      const meses = [];
      for (let mes = 1; mes <= 12; mes++) {
        const dataInicio = new Date(anoInt, mes - 1, 1);
        const dataFim = new Date(anoInt, mes, 0, 23, 59, 59);

        const [receitas, comissoes] = await Promise.all([
          prisma.contrato.aggregate({
            where: {
              status: "ASSINADO",
              dataAssinatura: { gte: dataInicio, lte: dataFim },
            },
            _sum: { valorTotal: true },
          }),
          prisma.comissao.aggregate({
            where: {
              status: "PAGA",
              dataPagamento: { gte: dataInicio, lte: dataFim },
            },
            _sum: { valor: true },
          }),
        ]);

        // Despesas simuladas (depois criar tabela real)
        const despesasDoMes = {
          marketing: 15000,
          operacional: 8000,
          pessoal: 25000,
          infraestrutura: 5000,
        };

        const totalDespesas = Object.values(despesasDoMes).reduce(
          (a, b) => a + b,
          0,
        );
        const receita = receitas._sum.valorTotal || 0;
        const comissoesPagas = comissoes._sum.valor || 0;

        meses.push({
          mes,
          nome: new Date(anoInt, mes - 1, 1).toLocaleDateString("pt-BR", {
            month: "long",
          }),
          receita,
          comissoes: comissoesPagas,
          despesas: despesasDoMes,
          totalDespesas,
          lucro: receita - comissoesPagas - totalDespesas,
          margemLucro:
            receita > 0
              ? ((receita - comissoesPagas - totalDespesas) / receita) * 100
              : 0,
        });
      }

      res.json({
        ano: anoInt,
        meses,
        resumoAnual: {
          totalReceita: meses.reduce((sum, m) => sum + m.receita, 0),
          totalComissoes: meses.reduce((sum, m) => sum + m.comissoes, 0),
          totalDespesas: meses.reduce((sum, m) => sum + m.totalDespesas, 0),
          lucroTotal: meses.reduce((sum, m) => sum + m.lucro, 0),
        },
      });
    } catch (error) {
      console.error("Erro ao gerar fluxo de caixa:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Metas e projeções
router.get(
  "/metas",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const { ano = new Date().getFullYear() } = req.query;
      const anoInt = parseInt(ano as string);

      // Buscar metas configuradas
      const [metaVendasMensal, metaReceitaAnual] = await Promise.all([
        prisma.configuracao.findFirst({
          where: { chave: "meta_vendas_mensal" },
        }),
        prisma.configuracao.findFirst({
          where: { chave: "meta_receita_anual" },
        }),
      ]);

      // Performance atual
      const dataInicio = new Date(anoInt, 0, 1);
      const dataFim = new Date();

      const [vendasRealizadas, receitaRealizada] = await Promise.all([
        prisma.contrato.count({
          where: {
            status: "ASSINADO",
            dataAssinatura: { gte: dataInicio, lte: dataFim },
          },
        }),
        prisma.contrato.aggregate({
          where: {
            status: "ASSINADO",
            dataAssinatura: { gte: dataInicio, lte: dataFim },
          },
          _sum: { valorTotal: true },
        }),
      ]);

      const mesAtual = new Date().getMonth() + 1;
      const metaVendasAteAgora =
        parseInt(metaVendasMensal?.valor || "10") * mesAtual;
      const metaReceitaAteAgora =
        (parseInt(metaReceitaAnual?.valor || "1000000") / 12) * mesAtual;

      res.json({
        metas: {
          vendasMensal: parseInt(metaVendasMensal?.valor || "10"),
          receitaAnual: parseInt(metaReceitaAnual?.valor || "1000000"),
        },
        performance: {
          vendasRealizadas,
          receitaRealizada: receitaRealizada._sum.valorTotal || 0,
          percentualVendas: (vendasRealizadas / metaVendasAteAgora) * 100,
          percentualReceita:
            ((receitaRealizada._sum.valorTotal || 0) / metaReceitaAteAgora) *
            100,
        },
        projecao: {
          vendasProjetadas: (vendasRealizadas / mesAtual) * 12,
          receitaProjetada:
            ((receitaRealizada._sum.valorTotal || 0) / mesAtual) * 12,
        },
      });
    } catch (error) {
      console.error("Erro ao buscar metas:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Definir/atualizar metas
router.put(
  "/metas",
  authenticateToken,
  authorizeRole(["ADMIN"]),
  async (req, res) => {
    try {
      const { vendasMensal, receitaAnual } = req.body;

      const updates = [];

      if (vendasMensal) {
        updates.push(
          prisma.configuracao.upsert({
            where: { chave: "meta_vendas_mensal" },
            update: { valor: vendasMensal.toString() },
            create: {
              chave: "meta_vendas_mensal",
              valor: vendasMensal.toString(),
              descricao: "Meta de vendas por corretor por mês",
            },
          }),
        );
      }

      if (receitaAnual) {
        updates.push(
          prisma.configuracao.upsert({
            where: { chave: "meta_receita_anual" },
            update: { valor: receitaAnual.toString() },
            create: {
              chave: "meta_receita_anual",
              valor: receitaAnual.toString(),
              descricao: "Meta de receita anual da empresa",
            },
          }),
        );
      }

      await Promise.all(updates);

      res.json({ message: "Metas atualizadas com sucesso" });
    } catch (error) {
      console.error("Erro ao atualizar metas:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

export default router;
