import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, authorizeRole } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Listar artigos públicos
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, tag, search } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {
      status: "PUBLICADO",
    };

    if (search) {
      where.OR = [
        { titulo: { contains: search as string, mode: "insensitive" } },
        { conteudo: { contains: search as string, mode: "insensitive" } },
        { resumo: { contains: search as string, mode: "insensitive" } },
      ];
    }

    if (tag) {
      where.tags = {
        contains: tag as string,
      };
    }

    const [artigos, total] = await Promise.all([
      prisma.artigo.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { publicadoEm: "desc" },
        include: {
          autor: {
            select: {
              nome: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.artigo.count({ where }),
    ]);

    // Formatar artigos
    const artigosFormatados = artigos.map((artigo) => ({
      ...artigo,
      tags: artigo.tags ? JSON.parse(artigo.tags) : [],
    }));

    res.json({
      success: true,
      data: artigosFormatados,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error("Erro ao listar artigos:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
});

// Obter artigo por slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const artigo = await prisma.artigo.findUnique({
      where: { slug },
      include: {
        autor: {
          select: {
            nome: true,
            avatar: true,
          },
        },
      },
    });

    if (!artigo || artigo.status !== "PUBLICADO") {
      return res.status(404).json({
        success: false,
        message: "Artigo não encontrado",
      });
    }

    // Incrementar visualizações
    await prisma.artigo.update({
      where: { id: artigo.id },
      data: { visualizacoes: { increment: 1 } },
    });

    // Formatar artigo
    const artigoFormatado = {
      ...artigo,
      tags: artigo.tags ? JSON.parse(artigo.tags) : [],
    };

    res.json({
      success: true,
      data: artigoFormatado,
    });
  } catch (error) {
    console.error("Erro ao obter artigo:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
});

// Listar artigos para gestão (dashboard marketing)
router.get(
  "/admin/lista",
  authenticateToken,
  authorizeRole(["ADMIN", "MARKETING"]),
  async (req, res) => {
    try {
      const { page = 1, limit = 10, status, autor } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const where: any = {};

      if (status) {
        where.status = status;
      }

      if (autor) {
        where.autorId = parseInt(autor as string);
      }

      const [artigos, total] = await Promise.all([
        prisma.artigo.findMany({
          where,
          skip,
          take: parseInt(limit as string),
          orderBy: { criadoEm: "desc" },
          include: {
            autor: {
              select: {
                nome: true,
                avatar: true,
              },
            },
          },
        }),
        prisma.artigo.count({ where }),
      ]);

      // Formatar artigos
      const artigosFormatados = artigos.map((artigo) => ({
        ...artigo,
        tags: artigo.tags ? JSON.parse(artigo.tags) : [],
      }));

      res.json({
        success: true,
        data: artigosFormatados,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      console.error("Erro ao listar artigos admin:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  },
);

// Criar artigo
router.post(
  "/",
  authenticateToken,
  authorizeRole(["ADMIN", "MARKETING"]),
  async (req, res) => {
    try {
      const { titulo, conteudo, resumo, imagemDestaque, tags, status } =
        req.body;
      const autorId = req.user.id;

      // Gerar slug
      const slug = titulo
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Verificar se slug já existe
      let slugFinal = slug;
      let contador = 1;
      while (await prisma.artigo.findUnique({ where: { slug: slugFinal } })) {
        slugFinal = `${slug}-${contador}`;
        contador++;
      }

      const artigo = await prisma.artigo.create({
        data: {
          titulo,
          slug: slugFinal,
          conteudo,
          resumo,
          imagemDestaque,
          tags: tags ? JSON.stringify(tags) : null,
          status: status || "RASCUNHO",
          autorId,
          publicadoEm: status === "PUBLICADO" ? new Date() : null,
        },
        include: {
          autor: {
            select: {
              nome: true,
              avatar: true,
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        data: {
          ...artigo,
          tags: artigo.tags ? JSON.parse(artigo.tags) : [],
        },
      });
    } catch (error) {
      console.error("Erro ao criar artigo:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  },
);

// Atualizar artigo
router.put(
  "/:id",
  authenticateToken,
  authorizeRole(["ADMIN", "MARKETING"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { titulo, conteudo, resumo, imagemDestaque, tags, status } =
        req.body;

      const artigoExistente = await prisma.artigo.findUnique({
        where: { id: parseInt(id) },
      });

      if (!artigoExistente) {
        return res.status(404).json({
          success: false,
          message: "Artigo não encontrado",
        });
      }

      const dadosAtualizacao: any = {
        titulo,
        conteudo,
        resumo,
        imagemDestaque,
        tags: tags ? JSON.stringify(tags) : null,
        status,
      };

      // Se mudar para publicado, definir data de publicação
      if (status === "PUBLICADO" && artigoExistente.status !== "PUBLICADO") {
        dadosAtualizacao.publicadoEm = new Date();
      }

      const artigo = await prisma.artigo.update({
        where: { id: parseInt(id) },
        data: dadosAtualizacao,
        include: {
          autor: {
            select: {
              nome: true,
              avatar: true,
            },
          },
        },
      });

      res.json({
        success: true,
        data: {
          ...artigo,
          tags: artigo.tags ? JSON.parse(artigo.tags) : [],
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar artigo:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  },
);

// Deletar artigo
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole(["ADMIN", "MARKETING"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const artigo = await prisma.artigo.findUnique({
        where: { id: parseInt(id) },
      });

      if (!artigo) {
        return res.status(404).json({
          success: false,
          message: "Artigo não encontrado",
        });
      }

      await prisma.artigo.delete({
        where: { id: parseInt(id) },
      });

      res.json({
        success: true,
        message: "Artigo deletado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao deletar artigo:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  },
);

export default router;
