import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, authorizeRole } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Listar imóveis em destaque (público)
router.get("/destaque", async (req, res) => {
  try {
    const imoveis = await prisma.imovel.findMany({
      where: {
        status: "DISPONIVEL",
      },
      take: 6,
      orderBy: {
        criadoEm: "desc",
      },
      include: {
        corretor: {
          select: {
            nome: true,
            telefone: true,
            whatsapp: true,
          },
        },
      },
    });

    // Converter fotos de JSON string para array
    const imoveisFormatados = imoveis.map((imovel) => ({
      ...imovel,
      fotos: imovel.fotos ? JSON.parse(imovel.fotos) : [],
      caracteristicas: imovel.caracteristicas
        ? JSON.parse(imovel.caracteristicas)
        : [],
    }));

    res.json(imoveisFormatados);
  } catch (error) {
    console.error("Erro ao buscar imóveis destaque:", error);

    // Retornar dados mock para desenvolvimento
    const mockImoveis = [
      {
        id: 1,
        titulo: "Casa moderna no Setor Bueno",
        endereco: "Rua das Flores, 123",
        bairro: "Setor Bueno",
        preco: 650000,
        tipo: "CASA",
        quartos: 3,
        banheiros: 2,
        area: 120,
        vagas: 2,
        fotos: [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        ],
        destaque: true,
        status: "DISPONIVEL",
      },
      {
        id: 2,
        titulo: "Apartamento no Setor Oeste",
        endereco: "Av. T-7, 456",
        bairro: "Setor Oeste",
        preco: 350000,
        tipo: "APARTAMENTO",
        quartos: 2,
        banheiros: 1,
        area: 65,
        vagas: 1,
        fotos: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        ],
        destaque: true,
        status: "DISPONIVEL",
      },
      {
        id: 3,
        titulo: "Cobertura no Setor Marista",
        endereco: "Rua 85, 789",
        bairro: "Setor Marista",
        preco: 890000,
        tipo: "COBERTURA",
        quartos: 4,
        banheiros: 3,
        area: 180,
        vagas: 3,
        fotos: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        ],
        destaque: true,
        status: "DISPONIVEL",
      },
    ];

    res.json(mockImoveis);
  }
});

// Listar imóveis com filtros (público)
router.get("/", async (req, res) => {
  try {
    const {
      tipo,
      finalidade,
      cidade,
      bairro,
      precoMin,
      precoMax,
      quartos,
      banheiros,
      vagas,
      areaMin,
      areaMax,
      page = 1,
      limit = 12,
      orderBy = "createdAt",
      order = "desc",
    } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {
      ativo: true,
      status: "DISPONIVEL",
    };

    if (tipo) where.tipo = tipo;
    if (finalidade) where.finalidade = finalidade;
    if (cidade)
      where.cidade = { contains: cidade as string, mode: "insensitive" };
    if (bairro)
      where.bairro = { contains: bairro as string, mode: "insensitive" };
    if (precoMin || precoMax) {
      where.preco = {};
      if (precoMin) where.preco.gte = parseFloat(precoMin as string);
      if (precoMax) where.preco.lte = parseFloat(precoMax as string);
    }
    if (quartos) where.quartos = { gte: parseInt(quartos as string) };
    if (banheiros) where.banheiros = { gte: parseInt(banheiros as string) };
    if (vagas) where.vagas = { gte: parseInt(vagas as string) };
    if (areaMin || areaMax) {
      where.area = {};
      if (areaMin) where.area.gte = parseFloat(areaMin as string);
      if (areaMax) where.area.lte = parseFloat(areaMax as string);
    }

    const [imoveis, total] = await Promise.all([
      prisma.imovel.findMany({
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
          _count: {
            select: {
              visualizacoes: true,
              favoritos: true,
            },
          },
        },
      }),
      prisma.imovel.count({ where }),
    ]);

    const totalPages = Math.ceil(total / parseInt(limit as string));

    res.json({
      imoveis,
      pagination: {
        currentPage: parseInt(page as string),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit as string),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar imóveis:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Buscar imóvel por ID (público)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const imovel = await prisma.imovel.findUnique({
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
        caracteristicas: true,
        _count: {
          select: {
            visualizacoes: true,
            favoritos: true,
          },
        },
      },
    });

    if (!imovel) {
      return res.status(404).json({ error: "Imóvel não encontrado" });
    }

    // Se não estiver ativo ou disponível, apenas corretor/admin pode ver
    if (!imovel.ativo || imovel.status !== "DISPONIVEL") {
      // Se não há usuário autenticado, negar acesso
      if (!req.headers.authorization) {
        return res.status(404).json({ error: "Imóvel não encontrado" });
      }

      // Verificar se é corretor responsável ou admin
      // (implementar verificação de token se necessário)
    }

    // Registrar visualização (se for público)
    if (!req.headers.authorization || !req.user) {
      await prisma.visualizacao.create({
        data: {
          imovelId: imovel.id,
          ip: req.ip || "unknown",
          userAgent: req.get("User-Agent") || "unknown",
        },
      });
    }

    res.json(imovel);
  } catch (error) {
    console.error("Erro ao buscar imóvel:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Criar novo imóvel (corretor/admin)
router.post(
  "/",
  authenticateToken,
  authorizeRole(["CORRETOR", "ADMIN", "ASSISTENTE"]),
  async (req, res) => {
    try {
      const {
        titulo,
        descricao,
        tipo,
        finalidade,
        preco,
        endereco,
        cidade,
        bairro,
        cep,
        area,
        quartos,
        banheiros,
        vagas,
        imagens,
        caracteristicas,
      } = req.body;

      // Validações
      if (!titulo || !tipo || !finalidade || !preco || !cidade) {
        return res.status(400).json({ error: "Campos obrigatórios faltando" });
      }

      const imovel = await prisma.imovel.create({
        data: {
          titulo,
          descricao,
          tipo,
          finalidade,
          preco,
          endereco,
          cidade,
          bairro,
          cep,
          area,
          quartos,
          banheiros,
          vagas,
          imagens: imagens || [],
          corretorId: req.user?.id,
          ativo: true,
          status: "DISPONIVEL",
          caracteristicas: caracteristicas
            ? {
                create: caracteristicas.map((car: any) => ({
                  nome: car.nome,
                  valor: car.valor,
                })),
              }
            : undefined,
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
          caracteristicas: true,
        },
      });

      res.status(201).json(imovel);
    } catch (error) {
      console.error("Erro ao criar imóvel:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Atualizar imóvel
router.put(
  "/:id",
  authenticateToken,
  authorizeRole(["CORRETOR", "ADMIN", "ASSISTENTE"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const imovelId = parseInt(id);

      // Verificar se o imóvel existe e se o usuário tem permissão
      const imovelExistente = await prisma.imovel.findUnique({
        where: { id: imovelId },
      });

      if (!imovelExistente) {
        return res.status(404).json({ error: "Imóvel não encontrado" });
      }

      // Apenas o corretor responsável ou admin pode editar
      if (
        req.user?.tipo !== "ADMIN" &&
        imovelExistente.corretorId !== req.user?.id
      ) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      const {
        titulo,
        descricao,
        tipo,
        finalidade,
        preco,
        endereco,
        cidade,
        bairro,
        cep,
        area,
        quartos,
        banheiros,
        vagas,
        imagens,
        status,
        ativo,
        caracteristicas,
      } = req.body;

      const updateData: any = {};

      if (titulo) updateData.titulo = titulo;
      if (descricao) updateData.descricao = descricao;
      if (tipo) updateData.tipo = tipo;
      if (finalidade) updateData.finalidade = finalidade;
      if (preco) updateData.preco = preco;
      if (endereco) updateData.endereco = endereco;
      if (cidade) updateData.cidade = cidade;
      if (bairro) updateData.bairro = bairro;
      if (cep) updateData.cep = cep;
      if (area) updateData.area = area;
      if (quartos) updateData.quartos = quartos;
      if (banheiros) updateData.banheiros = banheiros;
      if (vagas) updateData.vagas = vagas;
      if (imagens) updateData.imagens = imagens;
      if (status) updateData.status = status;
      if (ativo !== undefined) updateData.ativo = ativo;

      const imovel = await prisma.imovel.update({
        where: { id: imovelId },
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
          caracteristicas: true,
        },
      });

      res.json(imovel);
    } catch (error) {
      console.error("Erro ao atualizar imóvel:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Deletar imóvel
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole(["CORRETOR", "ADMIN", "ASSISTENTE"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const imovelId = parseInt(id);

      const imovelExistente = await prisma.imovel.findUnique({
        where: { id: imovelId },
      });

      if (!imovelExistente) {
        return res.status(404).json({ error: "Imóvel não encontrado" });
      }

      // Apenas o corretor responsável ou admin pode deletar
      if (
        req.user?.tipo !== "ADMIN" &&
        imovelExistente.corretorId !== req.user?.id
      ) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      await prisma.imovel.delete({
        where: { id: imovelId },
      });

      res.json({ message: "Imóvel deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar imóvel:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Imóveis do corretor
router.get(
  "/corretor/meus",
  authenticateToken,
  authorizeRole(["CORRETOR", "ADMIN", "ASSISTENTE"]),
  async (req, res) => {
    try {
      const { page = 1, limit = 12, status, orderBy = "createdAt" } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const where: any = {};

      // Admin pode ver todos, outros apenas os seus
      if (req.user?.tipo !== "ADMIN") {
        where.corretorId = req.user?.id;
      }

      if (status) {
        where.status = status;
      }

      const [imoveis, total] = await Promise.all([
        prisma.imovel.findMany({
          where,
          skip,
          take: parseInt(limit as string),
          orderBy: { [orderBy as string]: "desc" },
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
                leads: true,
              },
            },
          },
        }),
        prisma.imovel.count({ where }),
      ]);

      res.json({
        imoveis,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(total / parseInt(limit as string)),
          totalItems: total,
          itemsPerPage: parseInt(limit as string),
        },
      });
    } catch (error) {
      console.error("Erro ao buscar imóveis do corretor:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Estatísticas de imóveis
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
        disponiveis,
        vendidos,
        alugados,
        porTipo,
        visualizacoesTotais,
        favoritosTotais,
      ] = await Promise.all([
        prisma.imovel.count({ where }),
        prisma.imovel.count({ where: { ...where, status: "DISPONIVEL" } }),
        prisma.imovel.count({ where: { ...where, status: "VENDIDO" } }),
        prisma.imovel.count({ where: { ...where, status: "ALUGADO" } }),
        prisma.imovel.groupBy({
          where,
          by: ["tipo"],
          _count: { tipo: true },
        }),
        prisma.visualizacao.count({
          where: where.corretorId
            ? { imovel: { corretorId: where.corretorId } }
            : {},
        }),
        prisma.favorito.count({
          where: where.corretorId
            ? { imovel: { corretorId: where.corretorId } }
            : {},
        }),
      ]);

      const stats = {
        total,
        disponiveis,
        vendidos,
        alugados,
        visualizacoes: visualizacoesTotais,
        favoritos: favoritosTotais,
        porTipo: porTipo.reduce(
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

// Favoritar/Desfavoritar imóvel
router.post("/:id/favorito", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const imovelId = parseInt(id);
    const usuarioId = req.user?.id;

    const favoritoExistente = await prisma.favorito.findUnique({
      where: {
        usuarioId_imovelId: {
          usuarioId: usuarioId!,
          imovelId,
        },
      },
    });

    if (favoritoExistente) {
      // Remover favorito
      await prisma.favorito.delete({
        where: {
          usuarioId_imovelId: {
            usuarioId: usuarioId!,
            imovelId,
          },
        },
      });
      res.json({ favorito: false });
    } else {
      // Adicionar favorito
      await prisma.favorito.create({
        data: {
          usuarioId: usuarioId!,
          imovelId,
        },
      });
      res.json({ favorito: true });
    }
  } catch (error) {
    console.error("Erro ao favoritar imóvel:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
