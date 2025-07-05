import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, authorizeRole } from "../middleware/auth";
import axios from "axios";

const router = express.Router();
const prisma = new PrismaClient();

// Configuração da Evolution API
const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || "";
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || "";

// Verificar status da conexão WhatsApp
router.get(
  "/status/:instance",
  authenticateToken,
  authorizeRole(["CORRETOR", "ADMIN", "ASSISTENTE"]),
  async (req, res) => {
    try {
      const { instance } = req.params;

      const response = await axios.get(
        `${EVOLUTION_API_URL}/instance/connectionState/${instance}`,
        {
          headers: {
            apikey: EVOLUTION_API_KEY,
          },
        },
      );

      res.json(response.data);
    } catch (error) {
      console.error("Erro ao verificar status WhatsApp:", error);
      res.status(500).json({ error: "Erro ao verificar status" });
    }
  },
);

// Gerar QR Code para conectar WhatsApp
router.get(
  "/qrcode/:instance",
  authenticateToken,
  authorizeRole(["CORRETOR", "ADMIN", "ASSISTENTE"]),
  async (req, res) => {
    try {
      const { instance } = req.params;

      const response = await axios.get(
        `${EVOLUTION_API_URL}/instance/connect/${instance}`,
        {
          headers: {
            apikey: EVOLUTION_API_KEY,
          },
        },
      );

      res.json(response.data);
    } catch (error) {
      console.error("Erro ao gerar QR Code:", error);
      res.status(500).json({ error: "Erro ao gerar QR Code" });
    }
  },
);

// Enviar mensagem WhatsApp
router.post(
  "/send",
  authenticateToken,
  authorizeRole(["CORRETOR", "ADMIN", "ASSISTENTE"]),
  async (req, res) => {
    try {
      const { instance, number, message, leadId } = req.body;

      if (!instance || !number || !message) {
        return res
          .status(400)
          .json({ error: "Instância, número e mensagem são obrigatórios" });
      }

      const response = await axios.post(
        `${EVOLUTION_API_URL}/message/sendText/${instance}`,
        {
          number: number.replace(/\D/g, ""), // Remove caracteres não numéricos
          text: message,
        },
        {
          headers: {
            "Content-Type": "application/json",
            apikey: EVOLUTION_API_KEY,
          },
        },
      );

      // Registrar a mensagem no banco
      if (leadId) {
        await prisma.atividadeLead.create({
          data: {
            leadId: parseInt(leadId),
            tipo: "WHATSAPP",
            descricao: `Mensagem WhatsApp enviada: ${message.substring(0, 100)}${message.length > 100 ? "..." : ""}`,
            usuarioId: req.user?.id!,
          },
        });
      }

      res.json({
        success: true,
        data: response.data,
        message: "Mensagem enviada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem WhatsApp:", error);
      res.status(500).json({ error: "Erro ao enviar mensagem" });
    }
  },
);

// Listar mensagens de uma conversa
router.get(
  "/messages/:instance/:number",
  authenticateToken,
  authorizeRole(["CORRETOR", "ADMIN", "ASSISTENTE"]),
  async (req, res) => {
    try {
      const { instance, number } = req.params;
      const { limit = 50 } = req.query;

      const response = await axios.get(
        `${EVOLUTION_API_URL}/chat/findMessages/${instance}`,
        {
          headers: {
            apikey: EVOLUTION_API_KEY,
          },
          params: {
            number: number.replace(/\D/g, ""),
            limit,
          },
        },
      );

      res.json(response.data);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      res.status(500).json({ error: "Erro ao buscar mensagens" });
    }
  },
);

// Listar contatos/chats
router.get(
  "/chats/:instance",
  authenticateToken,
  authorizeRole(["CORRETOR", "ADMIN", "ASSISTENTE"]),
  async (req, res) => {
    try {
      const { instance } = req.params;

      const response = await axios.get(
        `${EVOLUTION_API_URL}/chat/findChats/${instance}`,
        {
          headers: {
            apikey: EVOLUTION_API_KEY,
          },
        },
      );

      res.json(response.data);
    } catch (error) {
      console.error("Erro ao buscar chats:", error);
      res.status(500).json({ error: "Erro ao buscar chats" });
    }
  },
);

// Configurar webhook
router.post(
  "/webhook/:instance",
  authenticateToken,
  authorizeRole(["CORRETOR", "ADMIN", "ASSISTENTE"]),
  async (req, res) => {
    try {
      const { instance } = req.params;
      const { webhookUrl, events } = req.body;

      const response = await axios.post(
        `${EVOLUTION_API_URL}/webhook/set/${instance}`,
        {
          webhook: {
            url: webhookUrl,
            by_events: true,
            base64: false,
          },
          events: events || [
            "APPLICATION_STARTUP",
            "QRCODE_UPDATED",
            "MESSAGES_UPSERT",
            "MESSAGES_UPDATE",
            "CONNECTION_UPDATE",
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            apikey: EVOLUTION_API_KEY,
          },
        },
      );

      res.json(response.data);
    } catch (error) {
      console.error("Erro ao configurar webhook:", error);
      res.status(500).json({ error: "Erro ao configurar webhook" });
    }
  },
);

// Receber webhook (público - usado pelo Evolution API)
router.post("/webhook/receive/:instance", async (req, res) => {
  try {
    const { instance } = req.params;
    const data = req.body;

    console.log(`Webhook recebido para instância ${instance}:`, data);

    // Processar diferentes tipos de eventos
    switch (data.event) {
      case "messages.upsert":
        await processIncomingMessage(data, instance);
        break;
      case "connection.update":
        await processConnectionUpdate(data, instance);
        break;
      case "qrcode.updated":
        await processQRCodeUpdate(data, instance);
        break;
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    res.status(500).json({ error: "Erro ao processar webhook" });
  }
});

// Processar mensagem recebida
async function processIncomingMessage(data: any, instance: string) {
  try {
    const message = data.data;
    if (!message.key.fromMe && message.message) {
      const phone = message.key.remoteJid.replace("@s.whatsapp.net", "");
      const messageText =
        message.message.conversation ||
        message.message.extendedTextMessage?.text ||
        "";

      // Buscar lead existente pelo telefone
      let lead = await prisma.lead.findFirst({
        where: {
          telefone: {
            contains: phone.substring(-8), // Últimos 8 dígitos
          },
        },
        include: {
          corretor: true,
        },
      });

      if (!lead) {
        // Criar nova lead se não existir
        const corretorDisponivel = await prisma.usuario.findFirst({
          where: {
            tipo: { in: ["CORRETOR", "ASSISTENTE"] },
            ativo: true,
            whatsappAtivo: true,
          },
        });

        if (corretorDisponivel) {
          lead = await prisma.lead.create({
            data: {
              nome: message.pushName || "Cliente WhatsApp",
              telefone: phone,
              mensagem: messageText,
              origem: "WHATSAPP",
              status: "NOVA",
              corretorId: corretorDisponivel.id,
            },
            include: {
              corretor: true,
            },
          });
        }
      }

      if (lead) {
        // Registrar atividade
        await prisma.atividadeLead.create({
          data: {
            leadId: lead.id,
            tipo: "WHATSAPP",
            descricao: `Mensagem recebida: ${messageText.substring(0, 100)}${messageText.length > 100 ? "..." : ""}`,
          },
        });
      }
    }
  } catch (error) {
    console.error("Erro ao processar mensagem:", error);
  }
}

// Processar atualização de conexão
async function processConnectionUpdate(data: any, instance: string) {
  try {
    const state = data.data.state;
    console.log(`Estado da conexão ${instance}: ${state}`);

    // Atualizar status do corretor se necessário
    if (state === "open") {
      await prisma.usuario.updateMany({
        where: {
          configuracoes: {
            path: ["whatsapp", "instance"],
            equals: instance,
          },
        },
        data: {
          whatsappAtivo: true,
        },
      });
    } else if (state === "close") {
      await prisma.usuario.updateMany({
        where: {
          configuracoes: {
            path: ["whatsapp", "instance"],
            equals: instance,
          },
        },
        data: {
          whatsappAtivo: false,
        },
      });
    }
  } catch (error) {
    console.error("Erro ao processar atualização de conexão:", error);
  }
}

// Processar atualização de QR Code
async function processQRCodeUpdate(data: any, instance: string) {
  try {
    const qrcode = data.data.qrcode;
    console.log(`QR Code atualizado para instância ${instance}`);

    // Aqui você poderia salvar o QR code ou notificar o usuário
    // Por exemplo, via WebSocket para atualizar em tempo real
  } catch (error) {
    console.error("Erro ao processar QR Code:", error);
  }
}

// Desconectar instância
router.delete(
  "/disconnect/:instance",
  authenticateToken,
  authorizeRole(["CORRETOR", "ADMIN", "ASSISTENTE"]),
  async (req, res) => {
    try {
      const { instance } = req.params;

      const response = await axios.delete(
        `${EVOLUTION_API_URL}/instance/logout/${instance}`,
        {
          headers: {
            apikey: EVOLUTION_API_KEY,
          },
        },
      );

      // Atualizar status no banco
      await prisma.usuario.updateMany({
        where: {
          configuracoes: {
            path: ["whatsapp", "instance"],
            equals: instance,
          },
        },
        data: {
          whatsappAtivo: false,
        },
      });

      res.json(response.data);
    } catch (error) {
      console.error("Erro ao desconectar WhatsApp:", error);
      res.status(500).json({ error: "Erro ao desconectar" });
    }
  },
);

// Configurações de WhatsApp do corretor
router.get(
  "/config",
  authenticateToken,
  authorizeRole(["CORRETOR", "ADMIN", "ASSISTENTE"]),
  async (req, res) => {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: req.user?.id! },
        select: {
          whatsappAtivo: true,
          configuracoes: true,
        },
      });

      const whatsappConfig = usuario?.configuracoes?.whatsapp || {};

      res.json({
        ativo: usuario?.whatsappAtivo || false,
        instance: whatsappConfig.instance || null,
        autoResposta: whatsappConfig.autoResposta || false,
        mensagemPadrao: whatsappConfig.mensagemPadrao || "",
      });
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

// Atualizar configurações de WhatsApp
router.put(
  "/config",
  authenticateToken,
  authorizeRole(["CORRETOR", "ADMIN", "ASSISTENTE"]),
  async (req, res) => {
    try {
      const { instance, autoResposta, mensagemPadrao } = req.body;

      const usuario = await prisma.usuario.findUnique({
        where: { id: req.user?.id! },
        select: { configuracoes: true },
      });

      const configuracoes = usuario?.configuracoes || {};
      configuracoes.whatsapp = {
        ...configuracoes.whatsapp,
        instance,
        autoResposta,
        mensagemPadrao,
      };

      await prisma.usuario.update({
        where: { id: req.user?.id! },
        data: { configuracoes },
      });

      res.json({ message: "Configurações atualizadas com sucesso" });
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

export default router;
