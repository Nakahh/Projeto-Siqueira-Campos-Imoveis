import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, authorizeRole } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads");

    // Criar diretório se não existir
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Tipos de arquivo permitidos
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de arquivo não permitido"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Upload de imagens para imóveis
router.post(
  "/imovel/:id/imagens",
  authenticateToken,
  authorizeRole(["CORRETOR", "ADMIN", "ASSISTENTE"]),
  upload.array("imagens", 10), // Máximo 10 imagens
  async (req, res) => {
    try {
      const { id } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "Nenhuma imagem enviada" });
      }

      // Verificar se o imóvel existe e se o usuário tem permissão
      const imovel = await prisma.imovel.findUnique({
        where: { id: parseInt(id) },
      });

      if (!imovel) {
        return res.status(404).json({ error: "Imóvel não encontrado" });
      }

      if (req.user?.tipo !== "ADMIN" && imovel.corretorId !== req.user?.id) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      // Processar arquivos e gerar URLs
      const novasImagens = files.map((file) => {
        return `/uploads/${file.filename}`;
      });

      // Atualizar imóvel com novas imagens
      const imagensExistentes = imovel.imagens || [];
      const todasImagens = [...imagensExistentes, ...novasImagens];

      const imovelAtualizado = await prisma.imovel.update({
        where: { id: parseInt(id) },
        data: { imagens: todasImagens },
      });

      res.json({
        message: "Imagens enviadas com sucesso",
        imagens: novasImagens,
        total: todasImagens.length,
      });
    } catch (error) {
      console.error("Erro ao fazer upload de imagens:", error);
      res.status(500).json({ error: "Erro ao fazer upload das imagens" });
    }
  },
);

// Remover imagem de imóvel
router.delete(
  "/imovel/:id/imagens",
  authenticateToken,
  authorizeRole(["CORRETOR", "ADMIN", "ASSISTENTE"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { imagemUrl } = req.body;

      if (!imagemUrl) {
        return res.status(400).json({ error: "URL da imagem é obrigatória" });
      }

      const imovel = await prisma.imovel.findUnique({
        where: { id: parseInt(id) },
      });

      if (!imovel) {
        return res.status(404).json({ error: "Imóvel não encontrado" });
      }

      if (req.user?.tipo !== "ADMIN" && imovel.corretorId !== req.user?.id) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      // Remover imagem da lista
      const imagensAtualizadas = (imovel.imagens || []).filter(
        (img) => img !== imagemUrl,
      );

      await prisma.imovel.update({
        where: { id: parseInt(id) },
        data: { imagens: imagensAtualizadas },
      });

      // Tentar remover arquivo físico
      try {
        const filename = imagemUrl.replace("/uploads/", "");
        const filePath = path.join(process.cwd(), "uploads", filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fileError) {
        console.error("Erro ao remover arquivo físico:", fileError);
      }

      res.json({ message: "Imagem removida com sucesso" });
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
      res.status(500).json({ error: "Erro ao remover imagem" });
    }
  },
);

// Upload de documentos para contratos
router.post(
  "/contrato/:id/documentos",
  authenticateToken,
  authorizeRole(["CORRETOR", "ADMIN", "ASSISTENTE"]),
  upload.array("documentos", 5), // Máximo 5 documentos
  async (req, res) => {
    try {
      const { id } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "Nenhum documento enviado" });
      }

      // Verificar se o contrato existe
      const contrato = await prisma.contrato.findUnique({
        where: { id: parseInt(id) },
      });

      if (!contrato) {
        return res.status(404).json({ error: "Contrato não encontrado" });
      }

      // Verificar permissão
      if (req.user?.tipo !== "ADMIN" && contrato.corretorId !== req.user?.id) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      // Processar documentos
      const novosDocumentos = files.map((file) => ({
        nome: file.originalname,
        url: `/uploads/${file.filename}`,
        tipo: file.mimetype,
        tamanho: file.size,
        uploadedAt: new Date(),
      }));

      // Atualizar contrato
      const documentosExistentes = contrato.documentos || [];
      const todosDocumentos = [...documentosExistentes, ...novosDocumentos];

      await prisma.contrato.update({
        where: { id: parseInt(id) },
        data: { documentos: todosDocumentos },
      });

      res.json({
        message: "Documentos enviados com sucesso",
        documentos: novosDocumentos,
      });
    } catch (error) {
      console.error("Erro ao fazer upload de documentos:", error);
      res.status(500).json({ error: "Erro ao fazer upload dos documentos" });
    }
  },
);

// Upload de avatar do usuário
router.post(
  "/usuario/avatar",
  authenticateToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "Nenhuma imagem enviada" });
      }

      // Verificar se é imagem
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({ error: "Arquivo deve ser uma imagem" });
      }

      const avatarUrl = `/uploads/${file.filename}`;

      // Atualizar usuário
      const usuario = await prisma.usuario.findUnique({
        where: { id: req.user?.id! },
        select: { configuracoes: true },
      });

      const configuracoes = usuario?.configuracoes || {};
      configuracoes.avatar = avatarUrl;

      await prisma.usuario.update({
        where: { id: req.user?.id! },
        data: { configuracoes },
      });

      res.json({
        message: "Avatar atualizado com sucesso",
        avatar: avatarUrl,
      });
    } catch (error) {
      console.error("Erro ao fazer upload do avatar:", error);
      res.status(500).json({ error: "Erro ao fazer upload do avatar" });
    }
  },
);

// Servir arquivos estáticos
router.get("/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), "uploads", filename);

    // Verificar se arquivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Arquivo não encontrado" });
    }

    // Definir tipo de conteúdo baseado na extensão
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };

    const mimeType = mimeTypes[ext] || "application/octet-stream";
    res.setHeader("Content-Type", mimeType);

    // Cache por 1 dia para imagens
    if (mimeType.startsWith("image/")) {
      res.setHeader("Cache-Control", "public, max-age=86400");
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error("Erro ao servir arquivo:", error);
    res.status(500).json({ error: "Erro ao carregar arquivo" });
  }
});

// Listar arquivos de um imóvel
router.get("/imovel/:id/imagens", async (req, res) => {
  try {
    const { id } = req.params;

    const imovel = await prisma.imovel.findUnique({
      where: { id: parseInt(id) },
      select: { imagens: true },
    });

    if (!imovel) {
      return res.status(404).json({ error: "Imóvel não encontrado" });
    }

    res.json(imovel.imagens || []);
  } catch (error) {
    console.error("Erro ao listar imagens:", error);
    res.status(500).json({ error: "Erro ao listar imagens" });
  }
});

// Informações de upload
router.get("/info", authenticateToken, async (req, res) => {
  try {
    const uploadPath = path.join(process.cwd(), "uploads");

    let totalFiles = 0;
    let totalSize = 0;

    if (fs.existsSync(uploadPath)) {
      const files = fs.readdirSync(uploadPath);
      totalFiles = files.length;

      files.forEach((file) => {
        const filePath = path.join(uploadPath, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      });
    }

    res.json({
      totalFiles,
      totalSize,
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
      uploadPath: "/uploads",
      maxFileSize: "10MB",
      allowedTypes: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    });
  } catch (error) {
    console.error("Erro ao obter informações de upload:", error);
    res.status(500).json({ error: "Erro ao obter informações" });
  }
});

export default router;
