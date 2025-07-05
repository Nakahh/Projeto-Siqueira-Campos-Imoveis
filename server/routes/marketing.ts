import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, authorizeRole } from "../middleware/auth";
import axios from "axios";

const router = express.Router();
const prisma = new PrismaClient();

// Configurações da Meta API
const META_API_BASE = "https://graph.facebook.com/v18.0";
const META_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

// Dashboard de marketing
router.get(
  "/dashboard",
  authenticateToken,
  authorizeRole(["MARKETING", "ADMIN"]),
  async (req, res) => {
    try {
      const { periodo = "30" } = req.query;
      const dias = parseInt(periodo as string);
      const dataInicio = new Date(Date.now() - dias * 24 * 60 * 60 * 1000);

      const [
        campanhasAtivas,
        leadsGeradas,
        conversoes,
        investimentoTotal,
        performanceRedes,
      ] = await Promise.all([
        // Campanhas ativas
        prisma.campanha.count({
          where: {
            status: "ATIVA",
            dataInicio: { gte: dataInicio },
          },
        }),

        // Leads geradas
        prisma.lead.count({
          where: {
            origem: { in: ["FACEBOOK", "INSTAGRAM", "GOOGLE_ADS"] },
            createdAt: { gte: dataInicio },
          },
        }),

        // Conversões
        prisma.lead.count({
          where: {
            origem: { in: ["FACEBOOK", "INSTAGRAM", "GOOGLE_ADS"] },
            status: "CONVERTIDA",
            createdAt: { gte: dataInicio },
          },
        }),

        // Investimento (simulado - integrar com Meta API)
        Promise.resolve(15000),

        // Performance por rede social
        prisma.lead.groupBy({
          where: {
            origem: { in: ["FACEBOOK", "INSTAGRAM", "GOOGLE_ADS", "WEBSITE"] },
            createdAt: { gte: dataInicio },
          },
          by: ["origem"],
          _count: { id: true },
        }),
      ]);

      const taxaConversao =
        leadsGeradas > 0 ? (conversoes / leadsGeradas) * 100 : 0;
      const custoLead = leadsGeradas > 0 ? investimentoTotal / leadsGeradas : 0;

      res.json({
        resumo: {
          campanhasAtivas,
          leadsGeradas,
          conversoes,
          taxaConversao: taxaConversao.toFixed(2),
          investimentoTotal,
          custoLead: custoLead.toFixed(2),
        },
        performanceRedes: performanceRedes.reduce(
          (acc, item) => {
            acc[item.origem] = item._count.id;
            return acc;
          },
          {} as Record<string, number>,
        ),
      });
    } catch (error) {
      console.error("Erro ao buscar dashboard marketing:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Listar campanhas
router.get(
  "/campanhas",
  authenticateToken,
  authorizeRole(["MARKETING", "ADMIN"]),
  async (req, res) => {
    try {
      const { status, plataforma, page = 1, limit = 20 } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const where: any = {};
      if (status) where.status = status;
      if (plataforma) where.plataforma = plataforma;

      const [campanhas, total] = await Promise.all([
        prisma.campanha.findMany({
          where,
          skip,
          take: parseInt(limit as string),
          orderBy: { createdAt: "desc" },
          include: {
            usuario: {
              select: { nome: true },
            },
            _count: {
              select: {
                leads: true,
              },
            },
          },
        }),
        prisma.campanha.count({ where }),
      ]);

      res.json({
        campanhas,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(total / parseInt(limit as string)),
          totalItems: total,
          itemsPerPage: parseInt(limit as string),
        },
      });
    } catch (error) {
      console.error("Erro ao listar campanhas:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Criar campanha
router.post(
  "/campanhas",
  authenticateToken,
  authorizeRole(["MARKETING", "ADMIN"]),
  async (req, res) => {
    try {
      const {
        nome,
        descricao,
        plataforma,
        objetivo,
        publicoAlvo,
        orcamento,
        dataInicio,
        dataFim,
        criativos,
      } = req.body;

      // Validações
      if (!nome || !plataforma || !objetivo || !orcamento) {
        return res.status(400).json({ error: "Campos obrigatórios faltando" });
      }

      const campanha = await prisma.campanha.create({
        data: {
          nome,
          descricao,
          plataforma,
          objetivo,
          publicoAlvo,
          orcamento,
          dataInicio: new Date(dataInicio),
          dataFim: dataFim ? new Date(dataFim) : null,
          criativos: criativos || [],
          status: "RASCUNHO",
          usuarioId: req.user?.id!,
        },
      });

      res.status(201).json(campanha);
    } catch (error) {
      console.error("Erro ao criar campanha:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Integração com Meta API - Criar campanha no Facebook
router.post(
  "/campanhas/:id/publicar-facebook",
  authenticateToken,
  authorizeRole(["MARKETING", "ADMIN"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const campanha = await prisma.campanha.findUnique({
        where: { id: parseInt(id) },
      });

      if (!campanha) {
        return res.status(404).json({ error: "Campanha não encontrada" });
      }

      if (!META_ACCESS_TOKEN) {
        return res
          .status(400)
          .json({ error: "Token do Facebook não configurado" });
      }

      // Criar campanha no Facebook Ads
      const facebookCampaignData = {
        name: campanha.nome,
        objective: campanha.objetivo.toLowerCase(),
        status: "PAUSED", // Inicia pausada para configuração
        buying_type: "AUCTION",
      };

      const response = await axios.post(
        `${META_API_BASE}/${process.env.FACEBOOK_AD_ACCOUNT_ID}/campaigns`,
        facebookCampaignData,
        {
          params: {
            access_token: META_ACCESS_TOKEN,
          },
        },
      );

      // Atualizar campanha local com ID do Facebook
      const campanhaAtualizada = await prisma.campanha.update({
        where: { id: parseInt(id) },
        data: {
          idExterno: response.data.id,
          status: "ATIVA",
          configuracoes: {
            ...campanha.configuracoes,
            facebook: response.data,
          },
        },
      });

      res.json({
        message: "Campanha publicada no Facebook com sucesso",
        campanha: campanhaAtualizada,
        facebook: response.data,
      });
    } catch (error) {
      console.error("Erro ao publicar campanha no Facebook:", error);
      res.status(500).json({
        error: "Erro ao publicar campanha no Facebook",
        details: error.response?.data || error.message,
      });
    }
  },
);

// Buscar insights do Facebook
router.get(
  "/campanhas/:id/insights-facebook",
  authenticateToken,
  authorizeRole(["MARKETING", "ADMIN"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const campanha = await prisma.campanha.findUnique({
        where: { id: parseInt(id) },
      });

      if (!campanha || !campanha.idExterno) {
        return res.status(404).json({
          error: "Campanha não encontrada ou não publicada no Facebook",
        });
      }

      // Buscar insights da campanha
      const response = await axios.get(
        `${META_API_BASE}/${campanha.idExterno}/insights`,
        {
          params: {
            access_token: META_ACCESS_TOKEN,
            fields: [
              "campaign_name",
              "impressions",
              "clicks",
              "spend",
              "reach",
              "frequency",
              "cpm",
              "cpc",
              "ctr",
              "actions",
            ].join(","),
            time_range: JSON.stringify({
              since: campanha.dataInicio.toISOString().split("T")[0],
              until: new Date().toISOString().split("T")[0],
            }),
          },
        },
      );

      res.json(response.data);
    } catch (error) {
      console.error("Erro ao buscar insights do Facebook:", error);
      res.status(500).json({
        error: "Erro ao buscar insights do Facebook",
        details: error.response?.data || error.message,
      });
    }
  },
);

// Análise de público-alvo
router.get(
  "/publico-alvo",
  authenticateToken,
  authorizeRole(["MARKETING", "ADMIN"]),
  async (req, res) => {
    try {
      // Analisar leads por idade, cidade, fonte, etc.
      const [porIdade, porCidade, porFonte, porInteresse] = await Promise.all([
        // Por idade (estimativa baseada em nomes/dados)
        prisma.lead.groupBy({
          by: ["createdAt"],
          _count: { id: true },
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        }),

        // Por cidade (dos imóveis de interesse)
        prisma.lead.findMany({
          where: {
            imovelId: { not: null },
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
          include: {
            imovel: {
              select: { cidade: true, bairro: true },
            },
          },
        }),

        // Por fonte
        prisma.lead.groupBy({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
          by: ["origem"],
          _count: { id: true },
        }),

        // Por tipo de imóvel de interesse
        prisma.lead.findMany({
          where: {
            imovelId: { not: null },
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
          include: {
            imovel: {
              select: { tipo: true, finalidade: true, preco: true },
            },
          },
        }),
      ]);

      // Processar dados
      const cidades = porCidade.reduce(
        (acc, lead) => {
          const cidade = lead.imovel?.cidade || "Não informado";
          acc[cidade] = (acc[cidade] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const tiposImovel = porInteresse.reduce(
        (acc, lead) => {
          const tipo = lead.imovel?.tipo || "Não informado";
          acc[tipo] = (acc[tipo] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const faixasPreco = porInteresse.reduce(
        (acc, lead) => {
          const preco = lead.imovel?.preco || 0;
          let faixa = "Não informado";

          if (preco < 200000) faixa = "Até R$ 200.000";
          else if (preco < 400000) faixa = "R$ 200.000 - R$ 400.000";
          else if (preco < 600000) faixa = "R$ 400.000 - R$ 600.000";
          else if (preco < 1000000) faixa = "R$ 600.000 - R$ 1.000.000";
          else faixa = "Acima de R$ 1.000.000";

          acc[faixa] = (acc[faixa] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      res.json({
        cidades,
        fontes: porFonte.reduce(
          (acc, item) => {
            acc[item.origem] = item._count.id;
            return acc;
          },
          {} as Record<string, number>,
        ),
        tiposImovel,
        faixasPreco,
        recomendacoes: [
          "Focar em campanhas para apartamentos até R$ 400.000",
          "Direcionar anúncios para região de Goiânia e cidades próximas",
          "Aumentar investimento em leads do Instagram",
          "Criar campanhas específicas para cada faixa de preço",
        ],
      });
    } catch (error) {
      console.error("Erro ao analisar público-alvo:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Newsletter - listar contatos
router.get(
  "/newsletter",
  authenticateToken,
  authorizeRole(["MARKETING", "ADMIN"]),
  async (req, res) => {
    try {
      const { status = "ATIVO", page = 1, limit = 50 } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const [contatos, total] = await Promise.all([
        prisma.newsletterContato.findMany({
          where: { status: status as string },
          skip,
          take: parseInt(limit as string),
          orderBy: { createdAt: "desc" },
        }),
        prisma.newsletterContato.count({
          where: { status: status as string },
        }),
      ]);

      res.json({
        contatos,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(total / parseInt(limit as string)),
          totalItems: total,
          itemsPerPage: parseInt(limit as string),
        },
      });
    } catch (error) {
      console.error("Erro ao listar newsletter:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Newsletter - adicionar contato
router.post("/newsletter/subscribe", async (req, res) => {
  try {
    const { email, nome, origem = "WEBSITE" } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email é obrigatório" });
    }

    // Verificar se já existe
    const existente = await prisma.newsletterContato.findUnique({
      where: { email },
    });

    if (existente) {
      if (existente.status === "INATIVO") {
        // Reativar se estava inativo
        await prisma.newsletterContato.update({
          where: { email },
          data: { status: "ATIVO" },
        });
        return res.json({ message: "Inscrição reativada com sucesso" });
      }
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    await prisma.newsletterContato.create({
      data: {
        email,
        nome,
        origem,
        status: "ATIVO",
      },
    });

    res.status(201).json({ message: "Inscrição realizada com sucesso" });
  } catch (error) {
    console.error("Erro ao inscrever newsletter:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Newsletter - remover/desinscrever
router.post("/newsletter/unsubscribe", async (req, res) => {
  try {
    const { email } = req.body;

    await prisma.newsletterContato.update({
      where: { email },
      data: { status: "INATIVO" },
    });

    res.json({ message: "Descadastro realizado com sucesso" });
  } catch (error) {
    console.error("Erro ao desinscrever newsletter:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
