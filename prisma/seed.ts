import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  log: ["error", "warn"],
});

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpar dados existentes (ordem reversa devido às foreign keys)
  try {
    await prisma.comissao.deleteMany().catch(() => {});
    await prisma.contrato.deleteMany().catch(() => {});
    await prisma.visita.deleteMany().catch(() => {});
    await prisma.favorito.deleteMany().catch(() => {});
    await prisma.visualizacao.deleteMany().catch(() => {});
    await prisma.lead.deleteMany().catch(() => {});
    await prisma.imovel.deleteMany().catch(() => {});
    await prisma.mensagem.deleteMany().catch(() => {});
    await prisma.atividade.deleteMany().catch(() => {});
    await prisma.usuario.deleteMany().catch(() => {});
  } catch (error) {
    console.log("⚠️ Aviso: Erro ao limpar dados (normal na primeira execução)");
  }

  console.log("🗑️ Dados existentes limpos");

  // Criar usuários de teste
  const senhaHash = await bcrypt.hash("123456", 12);

  // 1. Admin
  const admin = await prisma.usuario.create({
    data: {
      nome: "Juarez Siqueira",
      email: "admin@siqueicamposimoveis.com.br",
      telefone: "(62) 9 8556-3505",
      whatsapp: "(62) 9 8556-3505",
      senha: senhaHash,
      tipo: "ADMIN",
      ativo: true,
      emailVerificado: true,
    },
  });

  // 2. Corretor Principal
  const corretor1 = await prisma.usuario.create({
    data: {
      nome: "Ana Silva Santos",
      email: "ana@siqueicamposimoveis.com.br",
      telefone: "(62) 9 9999-1111",
      whatsapp: "(62) 9 9999-1111",
      senha: senhaHash,
      tipo: "CORRETOR",
      ativo: true,
      emailVerificado: true,
    },
  });

  // 3. Corretor Secundário
  const corretor2 = await prisma.usuario.create({
    data: {
      nome: "Carlos Ferreira Lima",
      email: "carlos@siqueicamposimoveis.com.br",
      telefone: "(62) 9 9999-2222",
      whatsapp: "(62) 9 9999-2222",
      senha: senhaHash,
      tipo: "CORRETOR",
      ativo: true,
      emailVerificado: true,
    },
  });

  // 4. Assistente
  const assistente = await prisma.usuario.create({
    data: {
      nome: "Maria José Costa",
      email: "maria@siqueicamposimoveis.com.br",
      telefone: "(62) 9 9999-3333",
      whatsapp: "(62) 9 9999-3333",
      senha: senhaHash,
      tipo: "ASSISTENTE",
      ativo: true,
      emailVerificado: true,
    },
  });

  // 5. Marketing
  const marketing = await prisma.usuario.create({
    data: {
      nome: "Fernanda Lima",
      email: "marketing@siqueicamposimoveis.com.br",
      telefone: "(62) 9 9999-4444",
      whatsapp: "(62) 9 9999-4444",
      senha: senhaHash,
      tipo: "MARKETING",
      ativo: true,
      emailVerificado: true,
    },
  });

  // 6. Desenvolvedor
  const desenvolvedor = await prisma.usuario.create({
    data: {
      nome: "Vitor Jayme - KRYONIX",
      email: "dev@kryonix.com.br",
      telefone: "(17) 9 8180-5327",
      whatsapp: "(17) 9 8180-5327",
      senha: senhaHash,
      tipo: "DESENVOLVEDOR",
      ativo: true,
      emailVerificado: true,
    },
  });

  // 7-10. Clientes de teste
  const clientes = await Promise.all([
    prisma.usuario.create({
      data: {
        nome: "João Silva",
        email: "joao@cliente.com",
        telefone: "(62) 9 8888-1111",
        whatsapp: "(62) 9 8888-1111",
        senha: senhaHash,
        tipo: "CLIENTE",
        ativo: true,
        emailVerificado: true,
      },
    }),
    prisma.usuario.create({
      data: {
        nome: "Maria Santos",
        email: "maria@cliente.com",
        telefone: "(62) 9 8888-2222",
        whatsapp: "(62) 9 8888-2222",
        senha: senhaHash,
        tipo: "CLIENTE",
        ativo: true,
        emailVerificado: true,
      },
    }),
    prisma.usuario.create({
      data: {
        nome: "Pedro Costa",
        email: "pedro@cliente.com",
        telefone: "(62) 9 8888-3333",
        whatsapp: "(62) 9 8888-3333",
        senha: senhaHash,
        tipo: "CLIENTE",
        ativo: true,
        emailVerificado: true,
      },
    }),
    prisma.usuario.create({
      data: {
        nome: "Ana Oliveira",
        email: "ana@cliente.com",
        telefone: "(62) 9 8888-4444",
        whatsapp: "(62) 9 8888-4444",
        senha: senhaHash,
        tipo: "CLIENTE",
        ativo: true,
        emailVerificado: true,
      },
    }),
  ]);

  console.log("👥 Usuários criados com sucesso!");

  // Criar alguns imóveis de exemplo
  const imoveis = await Promise.all([
    prisma.imovel.create({
      data: {
        titulo: "Casa 3 quartos - Setor Bueno",
        descricao: "Excelente casa no Setor Bueno, próxima ao shopping",
        tipo: "CASA",
        transacao: "VENDA",
        preco: 650000,
        quartos: 3,
        banheiros: 2,
        vagas: 2,
        area: 180,
        endereco: "Rua T-28, 123",
        bairro: "Setor Bueno",
        cidade: "Goiânia",
        estado: "GO",
        cep: "74210-100",
        caracteristicas: JSON.stringify(["Piscina", "Churrasqueira", "Jardim"]),
        fotos: JSON.stringify(["/uploads/casa1-1.jpg", "/uploads/casa1-2.jpg"]),
        corretorId: corretor1.id,
        status: "DISPONIVEL",
      },
    }),
    prisma.imovel.create({
      data: {
        titulo: "Apartamento 2 quartos - Setor Oeste",
        descricao: "Apartamento moderno com vista panorâmica",
        tipo: "APARTAMENTO",
        transacao: "ALUGUEL",
        preco: 2500,
        quartos: 2,
        banheiros: 1,
        vagas: 1,
        area: 75,
        endereco: "Avenida T-4, 456",
        bairro: "Setor Oeste",
        cidade: "Goiânia",
        estado: "GO",
        cep: "74120-050",
        caracteristicas: JSON.stringify([
          "Elevador",
          "Portaria 24h",
          "Academia",
        ]),
        fotos: JSON.stringify(["/uploads/apt1-1.jpg", "/uploads/apt1-2.jpg"]),
        corretorId: corretor2.id,
        status: "DISPONIVEL",
      },
    }),
  ]);

  console.log("🏠 Imóveis criados com sucesso!");

  // Criar alguns leads de exemplo
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        nome: "Roberto Lima",
        email: "roberto@example.com",
        telefone: "(62) 9 7777-1111",
        mensagem: "Interessado em casas no Setor Bueno",
        origem: "WEBSITE",
        status: "PENDENTE",
        clienteId: clientes[0].id,
      },
    }),
    prisma.lead.create({
      data: {
        nome: "Carla Souza",
        email: "carla@example.com",
        telefone: "(62) 9 7777-2222",
        mensagem: "Procuro apartamento para alugar",
        origem: "WHATSAPP",
        status: "ASSUMIDO",
        clienteId: clientes[1].id,
        corretorId: corretor1.id,
      },
    }),
  ]);

  console.log("🎯 Leads criados com sucesso!");

  console.log("✅ Seed executado com sucesso!");
  console.log(`
📊 Resumo dos dados criados:
- 👥 6 usuários (Admin, 2 Corretores, Assistente, Marketing, Desenvolvedor)
- 👤 4 clientes
- 🏠 2 imóveis
- 🎯 2 leads

🔑 Logins de teste:
- Admin: admin@siqueicamposimoveis.com.br (senha: 123456)
- Corretor: ana@siqueicamposimoveis.com.br (senha: 123456)
- Cliente: joao@cliente.com (senha: 123456)
- Desenvolvedor: dev@kryonix.com.br (senha: 123456)
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erro durante o seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
