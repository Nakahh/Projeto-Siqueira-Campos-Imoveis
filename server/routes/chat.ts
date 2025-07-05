import express from "express";
import { z } from "zod";
import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

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

// Dados específicos da imobiliária para contexto da IA
const empresaContext = {
  nome: "Siqueira Campos Imóveis",
  cidade: "Goiânia",
  estado: "Goiás",
  proprietario: "Juarez",
  whatsapp: "(62) 9 8556-3505",
  instagram: "@imoveissiqueiracampos",
  email: "SiqueiraCamposImoveisGoiania@gmail.com",
  experiencia: "Mais de 10 anos no mercado imobiliário goiano",

  regioes: [
    "Setor Oeste",
    "Jardim Goiás",
    "Setor Marista",
    "Setor Campinas",
    "Centro",
    "Setor Bueno",
    "Vila Nova",
    "Setor Sul",
    "Setor Pedro Ludovico",
    "Park Lozandes",
    "Setor Coimbra",
    "Cidade Jardim",
    "Goiânia 2",
    "Região Noroeste",
    "Setor Universitário",
    "Setor Aeroporto",
  ],

  tiposImoveis: [
    "Apartamentos de 1 a 4 quartos",
    "Casas térreas e sobrados",
    "Casas de condomínio",
    "Salas comerciais",
    "Lojas",
    "Galpões industriais",
    "Terrenos residenciais",
    "Terrenos comerciais",
    "Chácaras de recreio",
    "Lofts e estúdios",
  ],

  faixasPreco: {
    entrada: "R$ 120.000 - R$ 200.000 (ideal para primeiro imóvel)",
    popular: "R$ 200.000 - R$ 400.000 (mais procurado)",
    medio: "R$ 400.000 - R$ 700.000 (bom padrão)",
    alto: "R$ 700.000 - R$ 1.500.000 (alto padrão)",
    luxo: "Acima de R$ 1.500.000 (imóveis de luxo)",
  },

  caracteristicasRegionais: {
    "Setor Oeste":
      "Região nobre, apartamentos de alto padrão, excelente infraestrutura, próximo a shoppings",
    "Jardim Goiás":
      "Área residencial em expansão, casas e sobrados, ótimo para famílias, condomínios fechados",
    "Setor Marista":
      "Tradicional, próximo a universidades, mix de apartamentos e casas, boa valorização",
    Centro:
      "Região comercial, apartamentos compactos, boa mobilidade urbana, ideal para investimento",
    "Setor Campinas":
      "Tradicional, variedade de imóveis, bem localizado, fácil acesso ao centro",
    "Setor Bueno":
      "Consolidado, apartamentos de médio padrão, boa infraestrutura",
    "Vila Nova": "Residencial, casas térreas, tranquilo, preços acessíveis",
  },
};

// Sistema de prompt para a IA
const getSystemPrompt = () => {
  return `Você é Sofia, assistente virtual especializada da ${empresaContext.nome}, a principal imobiliária de ${empresaContext.cidade}, ${empresaContext.estado}.

🏢 INFORMAÇÕES DA EMPRESA:
- Proprietário: ${empresaContext.proprietario}
- ${empresaContext.experiencia}
- WhatsApp: ${empresaContext.whatsapp}
- Instagram: ${empresaContext.instagram}  
- Email: ${empresaContext.email}

🗺️ REGIÕES QUE ATENDEMOS EM GOIÂNIA:
${empresaContext.regioes.join(" • ")}

🏠 TIPOS DE IMÓVEIS DISPONÍVEIS:
${empresaContext.tiposImoveis.map((t) => `• ${t}`).join("\n")}

💰 FAIXAS DE PREÇO (2024):
• Entrada: ${empresaContext.faixasPreco.entrada}
• Popular: ${empresaContext.faixasPreco.popular}  
• Médio: ${empresaContext.faixasPreco.medio}
• Alto: ${empresaContext.faixasPreco.alto}
• Luxo: ${empresaContext.faixasPreco.luxo}

🎯 SEUS OBJETIVOS PRINCIPAIS:
1. 🤝 Atender com excelência clientes interessados em comprar, vender ou alugar
2. 📋 Coletar informações essenciais: nome, telefone, tipo de imóvel, orçamento, região
3. 💡 Sugerir imóveis e regiões compatíveis com o perfil do cliente
4. 📅 Agendar visitas aos imóveis de interesse  
5. 👥 Conectar com nossos corretores especialistas
6. 💰 Orientar sobre financiamento e processos

📍 CONHECIMENTO DAS REGIÕES:
${Object.entries(empresaContext.caracteristicasRegionais)
  .map(([regiao, desc]) => `• ${regiao}: ${desc}`)
  .join("\n")}

🎨 DIRETRIZES DE ATENDIMENTO:
- Seja sempre cordial, prestativa e proativa
- Use emojis moderadamente para ser mais amigável
- Faça perguntas inteligentes para entender necessidades
- Qualifique leads coletando nome, telefone, tipo de imóvel e orçamento
- Forneça informações precisas sobre Goiânia e mercado local
- Se não souber algo específico, seja transparente e ofereça contato direto
- Mantenha foco em imóveis e assuntos relacionados
- Use linguagem acessível e natural
- Demonstre conhecimento do mercado local

💪 NOSSOS DIFERENCIAIS:
• Mais de 10 anos de experiência em Goiânia
• Equipe especializada por região da cidade
• Atendimento personalizado e humanizado  
• Processo 100% transparente e seguro
• Suporte completo da visita à escritura
• Parcerias com principais bancos para financiamento
• Avaliação gratuita de imóveis

Sempre busque qualificar o cliente e conectá-lo com nossa equipe! Seja a ponte entre o sonho do cliente e o imóvel ideal! 🏡✨`;
};

// Buscar imóveis relacionados para contexto
const buscarImoveisParaContexto = async (mensagem: string) => {
  try {
    // Identificar tipo de busca na mensagem
    const tiposBusca = {
      apartamento: ["apartamento", "ap", "flat", "studio"],
      casa: ["casa", "sobrado", "residencia"],
      comercial: ["comercial", "sala", "loja", "escritorio"],
    };

    let tipoFiltro = null;
    for (const [tipo, palavras] of Object.entries(tiposBusca)) {
      if (
        palavras.some((palavra) => mensagem.toLowerCase().includes(palavra))
      ) {
        tipoFiltro = tipo.toUpperCase();
        break;
      }
    }

    // Buscar imóveis no banco
    const where: any = {
      ativo: true,
      status: "DISPONIVEL",
    };

    if (tipoFiltro) {
      where.tipo =
        tipoFiltro === "APARTAMENTO"
          ? "APARTAMENTO"
          : tipoFiltro === "CASA"
            ? "CASA"
            : "COMERCIAL";
    }

    const imoveis = await prisma.imovel.findMany({
      where,
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        titulo: true,
        tipo: true,
        preco: true,
        cidade: true,
        bairro: true,
        quartos: true,
        area: true,
      },
    });

    return imoveis;
  } catch (error) {
    console.error("Erro ao buscar imóveis para contexto:", error);
    return [];
  }
};

// Endpoint principal do chat
router.post("/", async (req, res) => {
  try {
    const validatedData = chatSchema.parse(req.body);
    const { message, userInfo, context } = validatedData;

    // Buscar imóveis relacionados
    const imoveisRelacionados = await buscarImoveisParaContexto(message);

    // Criar contexto adicional com imóveis
    let contexturaImoveis = "";
    if (imoveisRelacionados.length > 0) {
      contexturaImoveis = `\n\n📋 IMÓVEIS DISPONÍVEIS RELACIONADOS:\n${imoveisRelacionados
        .map(
          (imovel) =>
            `• ${imovel.titulo} - ${imovel.tipo} - R$ ${imovel.preco?.toLocaleString("pt-BR")} - ${imovel.bairro}, ${imovel.cidade} ${imovel.quartos ? `- ${imovel.quartos}Q` : ""} ${imovel.area ? `- ${imovel.area}m²` : ""}`,
        )
        .join("\n")}`;
    }

    // Preparar mensagens para a IA
    const messages = [
      {
        role: "system" as const,
        content: getSystemPrompt() + contexturaImoveis,
      },
      {
        role: "user" as const,
        content: message,
      },
    ];

    // Chamada para OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.6,
      frequency_penalty: 0.3,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("Sem resposta da IA");
    }

    // Verificar se precisa criar/atualizar lead
    const precisaLead =
      message.toLowerCase().includes("interesse") ||
      message.toLowerCase().includes("quero") ||
      message.toLowerCase().includes("gostaria") ||
      (userInfo?.telefone && userInfo?.nome);

    let leadId = validatedData.leadId;

    if (precisaLead && userInfo?.telefone) {
      try {
        // Buscar lead existente pelo telefone
        let lead = await prisma.lead.findFirst({
          where: {
            telefone: { contains: userInfo.telefone.slice(-8) },
          },
        });

        if (!lead) {
          // Buscar corretor disponível
          const corretorDisponivel = await prisma.usuario.findFirst({
            where: {
              tipo: { in: ["CORRETOR", "ASSISTENTE"] },
              ativo: true,
              whatsappAtivo: true,
            },
            orderBy: { createdAt: "asc" },
          });

          // Criar nova lead
          lead = await prisma.lead.create({
            data: {
              nome: userInfo.nome || "Cliente Chat",
              telefone: userInfo.telefone,
              email: userInfo.email,
              mensagem: message,
              origem: "CHAT_IA",
              status: "NOVA",
              corretorId: corretorDisponivel?.id,
            },
          });

          leadId = lead.id;

          // Registrar atividade
          await prisma.atividadeLead.create({
            data: {
              leadId: lead.id,
              tipo: "CHAT_IA",
              descricao: `Conversa iniciada via chat IA: ${message.substring(0, 100)}`,
            },
          });
        } else {
          leadId = lead.id;

          // Atualizar lead existente
          await prisma.lead.update({
            where: { id: lead.id },
            data: {
              mensagem: message,
              updatedAt: new Date(),
            },
          });

          // Adicionar nova atividade
          await prisma.atividadeLead.create({
            data: {
              leadId: lead.id,
              tipo: "CHAT_IA",
              descricao: `Nova mensagem via chat: ${message.substring(0, 100)}`,
            },
          });
        }

        // Verificar se deve notificar corretor via N8N
        if (lead.corretorId && process.env.N8N_WEBHOOK_URL) {
          try {
            const webhookData = {
              leadId: lead.id,
              nome: lead.nome,
              telefone: lead.telefone,
              mensagem: message,
              origem: "CHAT_IA",
              corretorId: lead.corretorId,
              timestamp: new Date().toISOString(),
            };

            // Enviar para N8N (não aguardar resposta)
            fetch(process.env.N8N_WEBHOOK_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(webhookData),
            }).catch((err) => console.error("Erro webhook N8N:", err));
          } catch (webhookError) {
            console.error("Erro ao enviar webhook:", webhookError);
          }
        }
      } catch (leadError) {
        console.error("Erro ao gerenciar lead:", leadError);
      }
    }

    // Resposta final
    res.json({
      response: aiResponse,
      leadId,
      suggestions:
        imoveisRelacionados.length > 0
          ? [
              "Ver mais detalhes dos imóveis",
              "Agendar uma visita",
              "Falar com um corretor",
              "Simular financiamento",
            ]
          : [
              "Me conte mais sobre suas preferências",
              "Qual região tem interesse?",
              "Qual sua faixa de orçamento?",
              "Prefere casa ou apartamento?",
            ],
    });
  } catch (error) {
    console.error("Erro no chat:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.errors,
      });
    }

    res.status(500).json({
      error: "Erro interno do servidor",
      response:
        "Desculpe, ocorreu um erro. Por favor, tente novamente ou entre em contato pelo WhatsApp (62) 9 8556-3505.",
    });
  }
});

// Buscar histórico de conversa
router.get("/historico/:telefone", async (req, res) => {
  try {
    const { telefone } = req.params;

    const lead = await prisma.lead.findFirst({
      where: {
        telefone: { contains: telefone.slice(-8) },
      },
      include: {
        atividades: {
          where: { tipo: "CHAT_IA" },
          orderBy: { createdAt: "asc" },
          take: 20,
        },
      },
    });

    if (!lead) {
      return res.json({ historico: [] });
    }

    res.json({
      leadId: lead.id,
      nome: lead.nome,
      historico: lead.atividades.map((atividade) => ({
        id: atividade.id,
        mensagem: atividade.descricao,
        timestamp: atividade.createdAt,
      })),
    });
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Endpoint para sugestões baseadas no contexto
router.post("/sugestoes", async (req, res) => {
  try {
    const { contexto, orcamento, regiao, tipo } = req.body;

    const where: any = {
      ativo: true,
      status: "DISPONIVEL",
    };

    if (tipo) where.tipo = tipo.toUpperCase();
    if (regiao) where.bairro = { contains: regiao, mode: "insensitive" };
    if (orcamento) {
      where.preco = {
        lte: orcamento * 1.2, // 20% de flexibilidade
        gte: orcamento * 0.8,
      };
    }

    const sugestoes = await prisma.imovel.findMany({
      where,
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        titulo: true,
        tipo: true,
        preco: true,
        cidade: true,
        bairro: true,
        quartos: true,
        banheiros: true,
        area: true,
        imagens: true,
      },
    });

    res.json({ sugestoes });
  } catch (error) {
    console.error("Erro ao buscar sugestões:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
