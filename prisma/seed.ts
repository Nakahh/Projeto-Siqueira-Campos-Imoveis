import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpar dados existentes
  await prisma.atividade.deleteMany();
  await prisma.favorito.deleteMany();
  await prisma.visualizacao.deleteMany();
  await prisma.comissao.deleteMany();
  await prisma.contrato.deleteMany();
  await prisma.visita.deleteMany();
  await prisma.atividadeLead.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.caracteristicaImovel.deleteMany();
  await prisma.imovel.deleteMany();
  await prisma.mensagem.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.configuracao.deleteMany();

  console.log("🗑️ Dados existentes limpos");

  // Criar usuários de teste
  const senhaHash = await bcrypt.hash("123456", 12);

  // 1. Admin
  const admin = await prisma.usuario.create({
    data: {
      nome: "Juarez Siqueira",
      email: "admin@siqueicamposimoveis.com.br",
      telefone: "(62) 9 8556-3505",
      senha: senhaHash,
      tipo: "ADMIN",
      ativo: true,
      whatsappAtivo: true,
      configuracoes: {
        avatar: "/uploads/admin-avatar.jpg",
        notificacoes: true,
        tema: "claro",
        whatsapp: {
          instance: "admin",
          autoResposta: true,
          mensagemPadrao:
            "Olá! Sou o administrador da Siqueira Campos Imóveis.",
        },
      },
    },
  });

  // 2. Corretor Principal
  const corretor1 = await prisma.usuario.create({
    data: {
      nome: "Ana Silva Santos",
      email: "ana@siqueicamposimoveis.com.br",
      telefone: "(62) 9 9999-1111",
      senha: senhaHash,
      tipo: "CORRETOR",
      ativo: true,
      whatsappAtivo: true,
      configuracoes: {
        avatar: "/uploads/corretor1-avatar.jpg",
        creci: "CRECI-GO 12345",
        especialidades: ["Residencial", "Alto Padrão"],
        whatsapp: {
          instance: "corretor1",
          autoResposta: true,
          mensagemPadrao:
            "Olá! Sou a Ana, corretora da Siqueira Campos. Como posso ajudar?",
        },
      },
    },
  });

  // 3. Corretor 2
  const corretor2 = await prisma.usuario.create({
    data: {
      nome: "Carlos Ferreira Lima",
      email: "carlos@siqueicamposimoveis.com.br",
      telefone: "(62) 9 9999-2222",
      senha: senhaHash,
      tipo: "CORRETOR",
      ativo: true,
      whatsappAtivo: true,
      configuracoes: {
        avatar: "/uploads/corretor2-avatar.jpg",
        creci: "CRECI-GO 23456",
        especialidades: ["Comercial", "Investimentos"],
        whatsapp: {
          instance: "corretor2",
          autoResposta: true,
          mensagemPadrao:
            "Oi! Sou o Carlos, especialista em imóveis comerciais.",
        },
      },
    },
  });

  // 4. Assistente
  const assistente = await prisma.usuario.create({
    data: {
      nome: "Maria José Costa",
      email: "maria@siqueicamposimoveis.com.br",
      telefone: "(62) 9 9999-3333",
      senha: senhaHash,
      tipo: "ASSISTENTE",
      ativo: true,
      whatsappAtivo: true,
      configuracoes: {
        avatar: "/uploads/assistente-avatar.jpg",
        supervisor: corretor1.id,
        whatsapp: {
          instance: "assistente1",
          autoResposta: true,
          mensagemPadrao:
            "Olá! Sou a Maria, assistente da equipe. Posso ajudar!",
        },
      },
    },
  });

  // 5. Marketing
  const marketing = await prisma.usuario.create({
    data: {
      nome: "Fernanda Lima Marketing",
      email: "marketing@siqueicamposimoveis.com.br",
      telefone: "(62) 9 9999-4444",
      senha: senhaHash,
      tipo: "MARKETING",
      ativo: true,
      whatsappAtivo: false,
      configuracoes: {
        avatar: "/uploads/marketing-avatar.jpg",
        especialidades: ["Campanhas Digitais", "Redes Sociais"],
        certificacoes: ["Google Ads", "Facebook Ads"],
      },
    },
  });

  // 6. Desenvolvedor
  const desenvolvedor = await prisma.usuario.create({
    data: {
      nome: "Vitor Jayme Fernandes Ferreira",
      email: "dev@kryonix.com.br",
      telefone: "(17) 98180-5327",
      senha: senhaHash,
      tipo: "DESENVOLVEDOR",
      ativo: true,
      whatsappAtivo: true,
      configuracoes: {
        avatar: "/uploads/dev-avatar.jpg",
        empresa: "KRYONIX",
        instagram: "kryon.ix",
        especialidades: ["React", "Node.js", "TypeScript", "PostgreSQL"],
        whatsapp: {
          instance: "dev",
          autoResposta: true,
          mensagemPadrao:
            "Olá! Sou o Vitor da KRYONIX, desenvolvedor do sistema.",
        },
      },
    },
  });

  // 7-10. Clientes de teste
  const clientes = await Promise.all([
    prisma.usuario.create({
      data: {
        nome: "João Carlos Silva",
        email: "joao@cliente.com",
        telefone: "(62) 9 8888-1111",
        senha: senhaHash,
        tipo: "CLIENTE",
        ativo: true,
        configuracoes: {
          avatar: "/uploads/cliente1-avatar.jpg",
          preferencias: {
            tipoImovel: ["APARTAMENTO"],
            faixaPreco: { min: 200000, max: 500000 },
            regioes: ["Setor Oeste", "Jardim Goiás"],
          },
        },
      },
    }),
    prisma.usuario.create({
      data: {
        nome: "Maria Fernanda Oliveira",
        email: "maria@cliente.com",
        telefone: "(62) 9 8888-2222",
        senha: senhaHash,
        tipo: "CLIENTE",
        ativo: true,
        configuracoes: {
          avatar: "/uploads/cliente2-avatar.jpg",
          preferencias: {
            tipoImovel: ["CASA"],
            faixaPreco: { min: 300000, max: 800000 },
            regioes: ["Jardim Goiás", "Setor Marista"],
          },
        },
      },
    }),
    prisma.usuario.create({
      data: {
        nome: "Pedro Santos Rodrigues",
        email: "pedro@cliente.com",
        telefone: "(62) 9 8888-3333",
        senha: senhaHash,
        tipo: "CLIENTE",
        ativo: true,
        configuracoes: {
          avatar: "/uploads/cliente3-avatar.jpg",
          preferencias: {
            tipoImovel: ["COMERCIAL"],
            faixaPreco: { min: 500000, max: 2000000 },
            regioes: ["Centro", "Setor Oeste"],
          },
        },
      },
    }),
    prisma.usuario.create({
      data: {
        nome: "Ana Beatriz Costa",
        email: "ana@cliente.com",
        telefone: "(62) 9 8888-4444",
        senha: senhaHash,
        tipo: "CLIENTE",
        ativo: true,
        configuracoes: {
          avatar: "/uploads/cliente4-avatar.jpg",
          preferencias: {
            tipoImovel: ["APARTAMENTO", "CASA"],
            faixaPreco: { min: 150000, max: 400000 },
            regioes: ["Setor Campinas", "Vila Nova"],
          },
        },
      },
    }),
  ]);

  console.log("👥 Usuários criados com sucesso");

  // Criar imóveis de exemplo com fotos profissionais
  const imoveis = await Promise.all([
    // 1. Apartamento Luxo Setor Oeste
    prisma.imovel.create({
      data: {
        titulo: "Apartamento de Luxo - 4 Suítes - Setor Oeste",
        descricao:
          "Magnífico apartamento de alto padrão no coração do Setor Oeste. Com 4 suítes completas, sala ampla com pé direito duplo, cozinha gourmet integrada e varanda com vista panorâmica da cidade. Condomínio com infraestrutura completa: piscina, academia, salão de festas, playground e segurança 24h. Localização privilegiada próxima a shopping centers, restaurantes e principais vias de acesso.",
        tipo: "APARTAMENTO",
        finalidade: "VENDA",
        preco: 850000,
        endereco: "Rua T-25, 1234 - Setor Oeste",
        cidade: "Goiânia",
        bairro: "Setor Oeste",
        cep: "74120-050",
        area: 180,
        quartos: 4,
        banheiros: 5,
        vagas: 3,
        imagens: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ],
        corretorId: corretor1.id,
        ativo: true,
        status: "DISPONIVEL",
        caracteristicas: {
          create: [
            { nome: "Piscina", valor: "Sim" },
            { nome: "Academia", valor: "Sim" },
            { nome: "Salão de Festas", valor: "Sim" },
            { nome: "Playground", valor: "Sim" },
            { nome: "Segurança 24h", valor: "Sim" },
            { nome: "Elevador", valor: "Sim" },
            { nome: "Varanda Gourmet", valor: "Sim" },
            { nome: "Andar", valor: "12º" },
          ],
        },
      },
    }),

    // 2. Casa Jardim Goiás
    prisma.imovel.create({
      data: {
        titulo: "Casa Sobrado - 3 Suítes - Jardim Goiás",
        descricao:
          "Belíssima casa sobrado em condomínio fechado no Jardim Goiás. Projeto arquitetônico moderno com 3 suítes, sendo a master com closet e hidromassagem. Sala de estar e jantar integradas, cozinha planejada, área gourmet com churrasqueira, piscina e jardim. Garagem para 4 carros. Condomínio com portaria, área verde e segurança. Próximo a escolas, supermercados e academias.",
        tipo: "CASA",
        finalidade: "VENDA",
        preco: 680000,
        endereco: "Rua JG-15, 567 - Jardim Goiás",
        cidade: "Goiânia",
        bairro: "Jardim Goiás",
        cep: "74805-310",
        area: 220,
        quartos: 3,
        banheiros: 4,
        vagas: 4,
        imagens: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600563438938-a42d3819e657?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ],
        corretorId: corretor2.id,
        ativo: true,
        status: "DISPONIVEL",
        caracteristicas: {
          create: [
            { nome: "Piscina", valor: "Sim" },
            { nome: "Churrasqueira", valor: "Sim" },
            { nome: "Jardim", valor: "Sim" },
            { nome: "Hidromassagem", valor: "Sim" },
            { nome: "Closet", valor: "Sim" },
            { nome: "Condomínio Fechado", valor: "Sim" },
            { nome: "Portaria", valor: "Sim" },
          ],
        },
      },
    }),

    // 3. Apartamento Compacto Campinas
    prisma.imovel.create({
      data: {
        titulo: "Apartamento 2 Quartos - Setor Campinas - Pronto para Morar",
        descricao:
          "Ótimo apartamento de 2 quartos no tradicional Setor Campinas. Imóvel bem conservado com sala integrada, cozinha funcional, área de serviço e varanda. Prédio com elevador, portaria e salão de festas. Localização estratégica com fácil acesso ao centro da cidade, próximo ao Terminal Rodoviário, shoppings e principais avenidas. Ideal para casais ou investimento.",
        tipo: "APARTAMENTO",
        finalidade: "VENDA",
        preco: 280000,
        endereco: "Avenida Anhanguera, 2890 - Setor Campinas",
        cidade: "Goiânia",
        bairro: "Setor Campinas",
        cep: "74023-900",
        area: 65,
        quartos: 2,
        banheiros: 1,
        vagas: 1,
        imagens: [
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ],
        corretorId: corretor1.id,
        ativo: true,
        status: "DISPONIVEL",
        caracteristicas: {
          create: [
            { nome: "Elevador", valor: "Sim" },
            { nome: "Portaria", valor: "Sim" },
            { nome: "Salão de Festas", valor: "Sim" },
            { nome: "Varanda", valor: "Sim" },
            { nome: "Andar", valor: "7º" },
          ],
        },
      },
    }),

    // 4. Sala Comercial Centro
    prisma.imovel.create({
      data: {
        titulo: "Sala Comercial - Centro - Ideal para Escritório",
        descricao:
          "Excelente sala comercial no centro de Goiânia, em edifício empresarial de alto padrão. Ambiente climatizado, com divisórias em vidro, recepção, 2 salas privativas e copa. Edifício com elevadores, estacionamento, segurança e limpeza. Localização privilegiada próxima a bancos, órgãos públicos, comércio e transporte público. Perfeita para escritórios, consultórios ou pequenas empresas.",
        tipo: "COMERCIAL",
        finalidade: "LOCACAO",
        preco: 3500,
        endereco: "Rua 8, 123 - Centro",
        cidade: "Goiânia",
        bairro: "Centro",
        cep: "74023-010",
        area: 45,
        quartos: 0,
        banheiros: 2,
        vagas: 2,
        imagens: [
          "https://images.unsplash.com/photo-1600607688960-e095d9d4c015?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ],
        corretorId: corretor2.id,
        ativo: true,
        status: "DISPONIVEL",
        caracteristicas: {
          create: [
            { nome: "Ar Condicionado", valor: "Sim" },
            { nome: "Divisórias", valor: "Vidro" },
            { nome: "Elevador", valor: "Sim" },
            { nome: "Segurança", valor: "Sim" },
            { nome: "Limpeza", valor: "Inclusa" },
            { nome: "Andar", valor: "5º" },
          ],
        },
      },
    }),

    // 5. Casa Setor Marista
    prisma.imovel.create({
      data: {
        titulo: "Casa Térrea - 4 Quartos - Setor Marista",
        descricao:
          "Aconchegante casa térrea no valorizado Setor Marista. Com 4 quartos sendo 2 suítes, sala ampla, cozinha, área gourmet coberta e quintal espaçoso. Garagem para 3 carros. Bairro residencial tranquilo, próximo a escolas, universidades, shoppings e com excelente infraestrutura urbana. Casa com potencial para reforma e valorização.",
        tipo: "CASA",
        finalidade: "VENDA",
        preco: 520000,
        endereco: "Rua 124, 456 - Setor Marista",
        cidade: "Goiânia",
        bairro: "Setor Marista",
        cep: "74175-100",
        area: 180,
        quartos: 4,
        banheiros: 3,
        vagas: 3,
        imagens: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600563438938-a42d3819e657?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ],
        corretorId: corretor1.id,
        ativo: true,
        status: "VENDIDO",
        caracteristicas: {
          create: [
            { nome: "Quintal", valor: "Sim" },
            { nome: "Área Gourmet", valor: "Sim" },
            { nome: "Térrea", valor: "Sim" },
          ],
        },
      },
    }),
  ]);

  console.log("🏠 Imóveis criados com sucesso");

  // Criar leads de exemplo
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        nome: "Ricardo Almeida",
        email: "ricardo@email.com",
        telefone: "(62) 9 7777-1111",
        mensagem:
          "Tenho interesse em apartamentos no Setor Oeste, até R$ 500.000.",
        origem: "WEBSITE",
        status: "NOVA",
        imovelId: imoveis[0].id,
        corretorId: corretor1.id,
      },
    }),
    prisma.lead.create({
      data: {
        nome: "Luciana Santos",
        email: "luciana@email.com",
        telefone: "(62) 9 7777-2222",
        mensagem: "Procuro casa no Jardim Goiás para comprar. Tenho urgência.",
        origem: "WHATSAPP",
        status: "EM_ANDAMENTO",
        imovelId: imoveis[1].id,
        corretorId: corretor2.id,
      },
    }),
    prisma.lead.create({
      data: {
        nome: "Fernando Costa",
        email: "fernando@empresa.com",
        telefone: "(62) 9 7777-3333",
        mensagem: "Preciso de sala comercial no centro para escritório.",
        origem: "CHAT_IA",
        status: "QUALIFICADA",
        imovelId: imoveis[3].id,
        corretorId: corretor2.id,
      },
    }),
  ]);

  console.log("📞 Leads criadas com sucesso");

  // Criar visitas agendadas
  await Promise.all([
    prisma.visita.create({
      data: {
        clienteId: clientes[0].id,
        imovelId: imoveis[0].id,
        corretorId: corretor1.id,
        dataHora: new Date(Date.now() + 86400000), // Amanhã
        observacoes: "Cliente interessado, primeira visita",
        status: "AGENDADA",
      },
    }),
    prisma.visita.create({
      data: {
        clienteId: clientes[1].id,
        imovelId: imoveis[1].id,
        corretorId: corretor2.id,
        dataHora: new Date(Date.now() + 2 * 86400000), // Depois de amanhã
        observacoes: "Cliente com perfil de compra definido",
        status: "CONFIRMADA",
      },
    }),
  ]);

  console.log("📅 Visitas criadas com sucesso");

  // Criar favoritos
  await Promise.all([
    prisma.favorito.create({
      data: {
        usuarioId: clientes[0].id,
        imovelId: imoveis[0].id,
      },
    }),
    prisma.favorito.create({
      data: {
        usuarioId: clientes[0].id,
        imovelId: imoveis[2].id,
      },
    }),
    prisma.favorito.create({
      data: {
        usuarioId: clientes[1].id,
        imovelId: imoveis[1].id,
      },
    }),
  ]);

  console.log("⭐ Favoritos criados com sucesso");

  // Criar contratos de exemplo
  await prisma.contrato.create({
    data: {
      clienteId: clientes[2].id,
      imovelId: imoveis[4].id, // Casa vendida
      corretorId: corretor1.id,
      tipo: "VENDA",
      valorTotal: 520000,
      valorComissao: 15600, // 3%
      dataAssinatura: new Date(),
      status: "ASSINADO",
      observacoes: "Venda concluída com sucesso. Cliente satisfeito.",
    },
  });

  // Criar comissão correspondente
  await prisma.comissao.create({
    data: {
      corretorId: corretor1.id,
      valor: 15600,
      tipo: "VENDA",
      status: "PAGA",
      descricao: "Comissão venda casa Setor Marista",
      dataPagamento: new Date(),
    },
  });

  console.log("💰 Contratos e comissões criados");

  // Criar configurações do sistema
  await Promise.all([
    prisma.configuracao.create({
      data: {
        chave: "comissao_padrao_venda",
        valor: "3.0",
        descricao: "Porcentagem padrão de comissão para vendas",
      },
    }),
    prisma.configuracao.create({
      data: {
        chave: "comissao_padrao_locacao",
        valor: "100.0",
        descricao: "Valor fixo de comissão para locações",
      },
    }),
    prisma.configuracao.create({
      data: {
        chave: "meta_vendas_mensal",
        valor: "10",
        descricao: "Meta de vendas por corretor por mês",
      },
    }),
    prisma.configuracao.create({
      data: {
        chave: "backup_automatico",
        valor: "true",
        descricao: "Habilitar backup automático diário",
      },
    }),
  ]);

  console.log("⚙️ Configurações do sistema criadas");

  // Criar algumas visualizações
  await Promise.all([
    prisma.visualizacao.create({
      data: {
        imovelId: imoveis[0].id,
        ip: "192.168.1.100",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    }),
    prisma.visualizacao.create({
      data: {
        imovelId: imoveis[1].id,
        ip: "192.168.1.101",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
      },
    }),
  ]);

  console.log("👁️ Visualizações criadas");

  // Criar atividades de exemplo
  await Promise.all([
    prisma.atividadeLead.create({
      data: {
        leadId: leads[0].id,
        tipo: "NOVA_LEAD",
        descricao: "Nova lead criada via website",
        usuarioId: admin.id,
      },
    }),
    prisma.atividadeLead.create({
      data: {
        leadId: leads[1].id,
        tipo: "WHATSAPP",
        descricao: "Cliente enviou mensagem via WhatsApp",
        usuarioId: corretor2.id,
      },
    }),
  ]);

  console.log("📋 Atividades criadas");

  console.log("✅ Seed concluído com sucesso!");
  console.log("\n🔑 USUÁRIOS DE TESTE CRIADOS:");
  console.log("👑 Admin: admin@siqueicamposimoveis.com.br | Senha: 123456");
  console.log("🏠 Corretor 1: ana@siqueicamposimoveis.com.br | Senha: 123456");
  console.log(
    "🏢 Corretor 2: carlos@siqueicamposimoveis.com.br | Senha: 123456",
  );
  console.log(
    "👩‍💼 Assistente: maria@siqueicamposimoveis.com.br | Senha: 123456",
  );
  console.log(
    "📈 Marketing: marketing@siqueicamposimoveis.com.br | Senha: 123456",
  );
  console.log("💻 Dev: dev@kryonix.com.br | Senha: 123456");
  console.log("👤 Cliente 1: joao@cliente.com | Senha: 123456");
  console.log("👤 Cliente 2: maria@cliente.com | Senha: 123456");
  console.log("👤 Cliente 3: pedro@cliente.com | Senha: 123456");
  console.log("👤 Cliente 4: ana@cliente.com | Senha: 123456");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
