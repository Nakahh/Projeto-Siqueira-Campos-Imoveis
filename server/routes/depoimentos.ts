import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, authorizeRole } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Listar depoimentos aprovados para exibição pública
router.get("/", async (req, res) => {
  try {
    const { limit = 6, destaque } = req.query;

    const where: any = {
      aprovado: true,
    };

    if (destaque === "true") {
      where.destaque = true;
    }

    const depoimentos = await prisma.depoimento.findMany({
      where,
      take: parseInt(limit as string),
      orderBy: [{ destaque: "desc" }, { criadoEm: "desc" }],
      include: {
        cliente: {
          select: {
            nome: true,
            avatar: true,
          },
        },
        imovel: {
          select: {
            titulo: true,
            endereco: true,
            bairro: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: depoimentos,
    });
  } catch (error) {
    console.error("Erro ao listar depoimentos:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
});

// Listar depoimentos para gestão (dashboard admin)
router.get(
  "/admin/lista",
  authenticateToken,
  authorizeRole(["ADMIN", "MARKETING"]),
  async (req, res) => {
    try {
      const { page = 1, limit = 10, aprovado, destaque } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const where: any = {};

      if (aprovado !== undefined) {
        where.aprovado = aprovado === "true";
      }

      if (destaque !== undefined) {
        where.destaque = destaque === "true";
      }

      const [depoimentos, total] = await Promise.all([
        prisma.depoimento.findMany({
          where,
          skip,
          take: parseInt(limit as string),
          orderBy: { criadoEm: "desc" },
          include: {
            cliente: {
              select: {
                nome: true,
                email: true,
                avatar: true,
              },
            },
            imovel: {
              select: {
                titulo: true,
                endereco: true,
                bairro: true,
              },
            },
          },
        }),
        prisma.depoimento.count({ where }),
      ]);

      res.json({
        success: true,
        data: depoimentos,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      console.error("Erro ao listar depoimentos admin:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  },
);

// Criar depoimento (cliente)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { nome, email, foto, conteudo, nota, cidade, imovelId } = req.body;
    const clienteId = req.user.id;

    // Validar nota
    if (nota < 1 || nota > 5) {
      return res.status(400).json({
        success: false,
        message: "A nota deve ser entre 1 e 5",
      });
    }

    const depoimento = await prisma.depoimento.create({
      data: {
        nome: nome || req.user.nome,
        email: email || req.user.email,
        foto,
        conteudo,
        nota,
        cidade,
        clienteId,
        imovelId: imovelId ? parseInt(imovelId) : null,
        aprovado: false, // Precisa de aprovação do admin
      },
      include: {
        cliente: {
          select: {
            nome: true,
            avatar: true,
          },
        },
        imovel: {
          select: {
            titulo: true,
            endereco: true,
            bairro: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: depoimento,
      message: "Depoimento criado! Aguardando aprovação.",
    });
  } catch (error) {
    console.error("Erro ao criar depoimento:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
});

// Atualizar status do depoimento (aprovar/reprovar)
router.put(
  "/:id/status",
  authenticateToken,
  authorizeRole(["ADMIN", "MARKETING"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { aprovado, destaque } = req.body;

      const depoimento = await prisma.depoimento.findUnique({
        where: { id: parseInt(id) },
      });

      if (!depoimento) {
        return res.status(404).json({
          success: false,
          message: "Depoimento não encontrado",
        });
      }

      const depoimentoAtualizado = await prisma.depoimento.update({
        where: { id: parseInt(id) },
        data: {
          aprovado: aprovado !== undefined ? aprovado : depoimento.aprovado,
          destaque: destaque !== undefined ? destaque : depoimento.destaque,
        },
        include: {
          cliente: {
            select: {
              nome: true,
              avatar: true,
            },
          },
          imovel: {
            select: {
              titulo: true,
              endereco: true,
              bairro: true,
            },
          },
        },
      });

      res.json({
        success: true,
        data: depoimentoAtualizado,
      });
    } catch (error) {
      console.error("Erro ao atualizar status do depoimento:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  },
);

// Deletar depoimento
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole(["ADMIN", "MARKETING"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const depoimento = await prisma.depoimento.findUnique({
        where: { id: parseInt(id) },
      });

      if (!depoimento) {
        return res.status(404).json({
          success: false,
          message: "Depoimento não encontrado",
        });
      }

      await prisma.depoimento.delete({
        where: { id: parseInt(id) },
      });

      res.json({
        success: true,
        message: "Depoimento deletado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao deletar depoimento:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  },
);

// Listar depoimentos do cliente logado
router.get("/meus", authenticateToken, async (req, res) => {
  try {
    const clienteId = req.user.id;

    const depoimentos = await prisma.depoimento.findMany({
      where: { clienteId },
      orderBy: { criadoEm: "desc" },
      include: {
        imovel: {
          select: {
            titulo: true,
            endereco: true,
            bairro: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: depoimentos,
    });
  } catch (error) {
    console.error("Erro ao listar depoimentos do cliente:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
});

export default router;
