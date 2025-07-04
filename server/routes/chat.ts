import express from "express";
import { z } from "zod";
import OpenAI from "openai";

const router = express.Router();

// Configurar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Schema de validação
const chatSchema = z.object({
  message: z.string().min(1, "Mensagem não pode estar vazia"),
  userInfo: z
    .object({
      nome: z.string().optional(),
      telefone: z.string().optional(),
      email: z.string().optional(),
    })
    .optional(),
  context: z.string().default("website"),
  leadId: z.number().optional(),
});

// Sistema de prompt para a IA
const getSystemPrompt = () => {
  return `Você é a assistente virtual da Siqueira Campos Imóveis, uma imobiliária premium em Goiânia-GO.

INFORMAÇÕES DA EMPRESA:
- Nome: Siqueira Campos Imóveis
- Localização: Goiânia - GO
- WhatsApp: (62) 9 8556-3505
- Instagram: @imoveissiqueiracampos
- Email: SiqueiraCamposImoveisGoiania@gmail.com
- Proprietário: Juarez

SUAS RESPONSABILIDADES:
1. Atender clientes interessados em imóveis (compra, venda, aluguel)
2. Coletar informações básicas dos leads
3. Encaminhar leads qualificados para corretores disponíveis
4. Fornecer informações gerais sobre nossos serviços
5. Agendar visitas quando solicitado

TIPOS DE IMÓVEIS QUE TRABALHAMOS:
- Casas (todos os padrões)
- Apartamentos
- Terrenos
- Imóveis comerciais
- Coberturas
- Kitnets e Lofts

SERVIÇOS OFERECIDOS:
- Venda de imóveis
- Locação de imóveis
- Avaliação gratuita
- Consultoria imobiliária
- Financiamento imobiliário
- Documentação completa

COMPORTAMENTO:
- Seja sempre cordial, profissional e prestativa
- Use linguagem clara e acessível
- Faça perguntas para entender melhor as necessidades
- Ofereça soluções personalizadas
- Mantenha foco em gerar leads qualificados
- Se não souber uma informação específica, seja honesta e ofereça contato direto

QUANDO ENCAMINHAR PARA CORRETOR:
- Cliente demonstra interesse real em comprar/alugar
- Solicita visita a imóvel específico
- Quer informações sobre financiamento
- Precisa de avaliação de imóvel
- Tem dúvidas técnicas específicas

MENSAGENS IMPORTANTES:
- Sempre mencione que temos corretores especializados disponíveis
- Ofereça contato via WhatsApp para urgências: (62) 9 8556-3505
- Mantenha o tom profissional mas amigável
- Use emojis moderadamente para humanizar a conversa

Responda de forma útil, direta e sempre dentro do contexto imobiliário da Siqueira Campos Imóveis.`;
};

// POST /api/chat - Processar mensagem do chat
router.post("/", async (req, res) => {
  try {
    const { message, userInfo, context, leadId } = chatSchema.parse(req.body);

    // Preparar contexto da conversa
    let contextMessage = `Cliente escreveu: "${message}"`;

    if (userInfo) {
      contextMessage += `\n\nInformações do cliente:`;
      if (userInfo.nome) contextMessage += `\n- Nome: ${userInfo.nome}`;
      if (userInfo.telefone)
        contextMessage += `\n- Telefone: ${userInfo.telefone}`;
      if (userInfo.email) contextMessage += `\n- Email: ${userInfo.email}`;
    }

    // Se há um lead associado, buscar mais contexto
    if (leadId && req.prisma) {
      const lead = await req.prisma.lead.findUnique({
        where: { id: leadId },
        include: {
          imovel: {
            select: {
              titulo: true,
              endereco: true,
              preco: true,
              tipo: true,
            },
          },
        },
      });

      if (lead && lead.imovel) {
        contextMessage += `\n\nImóvel de interesse:
- ${lead.imovel.titulo}
- ${lead.imovel.endereco}
- Tipo: ${lead.imovel.tipo}
- Preço: R$ ${lead.imovel.preco.toLocaleString()}`;
      }
    }

    // Gerar resposta com OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: getSystemPrompt(),
        },
        {
          role: "user",
          content: contextMessage,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error("Não foi possível gerar resposta");
    }

    // Analisar se deve criar/atualizar lead
    const shouldCreateLead = analyzeLeadIntent(message, response);

    let leadData = null;

    if (shouldCreateLead && userInfo?.nome && userInfo?.telefone) {
      // Verificar se já existe lead para este telefone hoje
      const existingLead = await req.prisma?.lead.findFirst({
        where: {
          telefone: userInfo.telefone,
          criadoEm: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      });

      if (!existingLead) {
        // Criar novo lead
        leadData = await req.prisma?.lead.create({
          data: {
            nome: userInfo.nome,
            telefone: userInfo.telefone,
            email: userInfo.email,
            mensagem: message,
            origem: "chat_website",
            status: "PENDENTE",
            respostaIa: response,
          },
        });

        // Enviar lead para N8N (webhook)
        if (process.env.N8N_WEBHOOK_URL) {
          try {
            await fetch(`${process.env.N8N_WEBHOOK_URL}/lead-site`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                nome: userInfo.nome,
                telefone: userInfo.telefone,
                mensagem: message,
                leadId: leadData?.id,
              }),
            });
          } catch (webhookError) {
            console.error("Erro ao enviar para N8N:", webhookError);
          }
        }
      }
    }

    // Log da conversa
    if (req.prisma && userInfo?.telefone) {
      await req.prisma.atividade.create({
        data: {
          tipo: "chat_ia",
          descricao: `Chat com IA - ${userInfo.nome || "Anônimo"}`,
          dados: {
            message,
            response,
            userInfo,
            leadCreated: !!leadData,
          },
          ip: req.ip,
          userAgent: req.get("User-Agent"),
        },
      });
    }

    res.json({
      response,
      leadCreated: !!leadData,
      leadId: leadData?.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }

    console.error("Erro no chat:", error);

    // Resposta de fallback
    res.json({
      response:
        "Desculpe, estou com dificuldades técnicas no momento. Por favor, entre em contato diretamente pelo WhatsApp (62) 9 8556-3505 ou continue navegando em nosso site para conhecer nossos imóveis.",
      leadCreated: false,
    });
  }
});

// Função para analisar se deve criar um lead
function analyzeLeadIntent(message: string, aiResponse: string): boolean {
  const leadKeywords = [
    "quero",
    "gostaria",
    "interesse",
    "comprar",
    "alugar",
    "financiar",
    "visita",
    "ver",
    "conhecer",
    "apartamento",
    "casa",
    "terreno",
    "comercial",
    "quanto custa",
    "preço",
    "valor",
    "disponível",
    "contato",
    "corretor",
    "agendar",
  ];

  const messageWords = message.toLowerCase();
  const hasIntent = leadKeywords.some((keyword) =>
    messageWords.includes(keyword),
  );

  // Também analisar se a IA sugeriu contato com corretor
  const aiSuggestedContact = aiResponse
    .toLowerCase()
    .includes("corretor" || "contato" || "whatsapp" || "agendar");

  return hasIntent || aiSuggestedContact;
}

// GET /api/chat/history/:telefone - Histórico de conversas
router.get("/history/:telefone", async (req, res) => {
  try {
    const { telefone } = req.params;

    if (!req.prisma) {
      return res.status(500).json({ error: "Banco de dados indisponível" });
    }

    const historico = await req.prisma.atividade.findMany({
      where: {
        tipo: "chat_ia",
        dados: {
          path: ["userInfo", "telefone"],
          equals: telefone,
        },
      },
      orderBy: { criadoEm: "asc" },
      take: 50, // Limitar últimas 50 mensagens
    });

    const conversas = historico.map((atividade) => ({
      id: atividade.id,
      timestamp: atividade.criadoEm,
      message: atividade.dados?.message,
      response: atividade.dados?.response,
      userInfo: atividade.dados?.userInfo,
    }));

    res.json(conversas);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST /api/chat/feedback - Feedback sobre a resposta da IA
router.post("/feedback", async (req, res) => {
  try {
    const { messageId, rating, comment } = req.body;

    if (!req.prisma) {
      return res.status(500).json({ error: "Banco de dados indisponível" });
    }

    // Salvar feedback
    await req.prisma.atividade.create({
      data: {
        tipo: "chat_feedback",
        descricao: `Feedback do chat - Nota: ${rating}`,
        dados: {
          messageId,
          rating,
          comment,
        },
        ip: req.ip,
        userAgent: req.get("User-Agent"),
      },
    });

    res.json({ message: "Feedback registrado com sucesso" });
  } catch (error) {
    console.error("Erro ao salvar feedback:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
