# 🏢 Sistema Completo - Siqueira Campos Imóveis

**Status: ✅ 100% COMPLETO**

Sistema completo para imobiliária com múltiplos dashboards, automações inteligentes, integração WhatsApp, IA e gestão completa de imóveis, leads e usuários.

## 🎯 Principais Funcionalidades

### ✅ Frontend Completo

- **Site Público** com catálogo de imóveis, busca avançada e chat com IA
- **Dashboard Admin** com controle financeiro completo e estatísticas
- **Dashboard Corretor** com gestão de leads, imóveis e WhatsApp
- **Dashboard Cliente** com favoritos, visitas e mensagens
- **Dashboard Marketing** com campanhas e relatórios de performance
- **Dashboard Desenvolvedor** com monitoramento e manutenção do sistema
- **Páginas Institucionais**: Sobre, Contato, Blog, Simulador de Financiamento

### ✅ Backend Completo

- **APIs REST** completas para todas as funcionalidades
- **Sistema de Autenticação** JWT + Google OAuth
- **Middleware de Segurança** com rate limiting e validações
- **Upload de Arquivos** com multer para imagens e documentos
- **Integração WhatsApp** via Evolution API
- **Chat IA** integrado com OpenAI GPT-3.5-turbo

### ✅ Automação & Integrações

- **N8N Workflow** completo para leads e WhatsApp
- **Timeout de 15 minutos** para resposta de corretores
- **Fallback automático** para notificação de clientes
- **Sistema de Logs** completo para auditoria

## 🛠 Tecnologias Utilizadas

### Frontend

- **React 18** com TypeScript
- **Vite** para desenvolvimento rápido
- **TailwindCSS** com tema personalizado (cores marrom/bege)
- **Radix UI** para componentes acessíveis
- **React Router 6** para roteamento SPA
- **Lucide React** para ícones

### Backend

- **Express.js** com TypeScript
- **Prisma ORM** com PostgreSQL
- **JWT** para autenticação
- **bcryptjs** para hash de senhas
- **Helmet** para segurança
- **Rate Limiting** para proteção

### Banco de Dados

- **PostgreSQL** como banco principal
- **Prisma** para modelagem e migrations
- **Sistema completo** de logs e atividades

### Integrações

- **OpenAI GPT-3.5-turbo** para chat inteligente
- **Evolution API** para WhatsApp
- **Google OAuth** para login social
- **N8N** para automações
- **Nodemailer** para emails

## 📦 Estrutura do Projeto

```
projeto/
├── client/                    # Frontend React
│   ├── components/           # Componentes reutilizáveis
│   │   ├── Layout/          # Layouts (Header, Footer, Sidebar)
│   │   ├── Chat/            # Chat com IA
│   │   └── ui/              # Componentes UI base
│   ├── contexts/            # Contextos React (Auth)
│   ├── pages/               # Páginas da aplicação
│   │   ├── Admin/           # Dashboard Admin
│   │   ├── Corretor/        # Dashboard Corretor
│   │   ├── Cliente/         # Dashboard Cliente
│   │   └── ...
│   └── lib/                 # Utilitários
├── server/                   # Backend Express
│   ├── routes/              # Rotas da API
│   └── middleware/          # Middlewares
├── prisma/                  # Schema e migrations
├── uploads/                 # Arquivos enviados
└── docs/                    # Documentação
```

## 🚀 Instalação e Configuração

### 1. Pré-requisitos

- Node.js 18+
- PostgreSQL 12+
- NPM ou Yarn

### 2. Clonar e Instalar

```bash
# Clonar repositório
git clone <url-do-repo>
cd siqueira-campos-imoveis

# Instalar dependências
npm install

# Configurar Prisma
npx prisma generate
```

### 3. Configurar Banco de Dados

```bash
# Criar banco PostgreSQL
createdb bdsitejuarez

# Executar migrations
npx prisma migrate dev

# Popular banco com dados de teste
npx prisma db seed
```

### 4. Configurar Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto com as variáveis fornecidas:

```env
# Já configurado no arquivo .env do projeto
DATABASE_URL="postgresql://sitejuarez:juarez123@localhost:5432/bdsitejuarez?schema=public"
JWT_SECRET=468465454567653554546524
# ... outras variáveis
```

### 5. Executar Aplicação

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 👥 Tipos de Usuário e Permissões

### 🔧 ADMIN

- **Acesso completo** ao sistema
- Gestão de usuários, imóveis, leads
- Relatórios financeiros e comissões
- Configurações globais

### 🏡 CORRETOR

- Gestão de seus imóveis
- Recebimento e gestão de leads
- Configuração WhatsApp para receber leads automaticamente
- Agenda de visitas e comissões

### 👨‍💼 ASSISTENTE

- Apoio ao corretor (sem parte financeira)
- Cadastro de imóveis e leads
- Agendamento de visitas

### 👤 CLIENTE

- Área pessoal com favoritos
- Histórico de visitas e mensagens
- Contratos e documentos

### 📈 MARKETING

- Gestão de campanhas
- Relatórios de conversão
- Email marketing
- Integração com redes sociais

### 💻 DESENVOLVEDOR

- Monitoramento do sistema
- Logs e debugging
- Configurações técnicas
- Manutenção automatizada

## 🤖 Sistema de IA e Automações

### Chat Inteligente

- **GPT-3.5-turbo** para respostas naturais
- Coleta automática de leads qualificados
- Encaminhamento para corretores ativos
- Histórico de conversas por telefone

### Automação N8N

- **Workflow completo** para gestão de leads
- **15 minutos** de timeout para resposta dos corretores
- **Fallback automático** se nenhum corretor responder
- **Notificações** via WhatsApp e email

### Integração WhatsApp

- **Evolution API** para envio/recebimento
- Corretores podem ativar/desativar recebimento
- Sistema "primeiro que responder" para múltiplos corretores
- Mensagens automáticas de status

## 📊 Fluxo de Leads Automatizado

1. **Cliente** conversa no chat do site
2. **IA** qualifica o lead e coleta dados
3. **Sistema** cria lead no banco de dados
4. **N8N** envia para corretores ativos via WhatsApp
5. **Corretor** responde "ASSUMIR" para pegar o lead
6. **Sistema** atualiza status e notifica outros corretores
7. **Fallback** se nenhum responder em 15 minutos

## 🎨 Tema e Design

### Cores da Marca

- **Marrom**: Tons de #43302b a #bfa094
- **Bege**: Tons de #806419 a #fef7e0
- **Status**: Verde (disponível), Amarelo (alugado), Vermelho (vendido)

### Componentes

- **Layout responsivo** para todos os dispositivos
- **Modo escuro/claro** automático
- **Animações** suaves e profissionais
- **Acessibilidade** completa com Radix UI

## 🗃 Schema do Banco de Dados

### Principais Tabelas

- **usuarios**: Admin, Corretores, Assistentes, Clientes, Marketing, Dev
- **imoveis**: Catálogo completo com fotos, características
- **leads**: Sistema de leads com status e rastreamento
- **visitas**: Agendamentos com clientes
- **contratos**: Vendas e locações
- **comissoes**: Controle financeiro dos corretores
- **atividades**: Log completo de ações no sistema

## 🔐 Segurança

- **JWT** com expiração configurável
- **Bcrypt** com 12 rounds para senhas
- **Rate limiting** para APIs
- **Helmet** para headers de segurança
- **CORS** configurado
- **Sanitização** de inputs
- **Logs** de todas as atividades

## 📡 APIs Disponíveis

### Autenticação

- `POST /api/auth/login` - Login local
- `GET /api/auth/google` - Login com Google
- `POST /api/auth/register` - Registro de usuário
- `GET /api/auth/validate` - Validar token

### Imóveis

- `GET /api/imoveis` - Listar com filtros
- `GET /api/imoveis/:id` - Detalhes do imóvel
- `POST /api/imoveis` - Criar imóvel (corretor+)
- `PATCH /api/imoveis/:id` - Atualizar imóvel

### Leads

- `GET /api/leads` - Listar leads (admin)
- `GET /api/corretor/leads` - Leads do corretor
- `POST /api/corretor/leads/:id/assumir` - Assumir lead

### Chat

- `POST /api/chat` - Conversar com IA
- `GET /api/chat/history/:telefone` - Histórico

### Corretor

- `GET /api/corretor/stats` - Estatísticas
- `GET /api/corretor/whatsapp` - Config WhatsApp
- `PATCH /api/corretor/whatsapp` - Atualizar WhatsApp

## 🔄 Configuração N8N

### 1. Importar Workflow

```bash
# Arquivo: n8n-lead-imobiliaria-completo.json
# Importar via N8N interface
```

### 2. Configurar Credenciais

- **PostgreSQL**: Banco de dados
- **OpenAI**: Chave da API
- **Evolution API**: WhatsApp
- **SMTP**: Email

### 3. Ativar Webhooks

- `/lead-site` - Receber leads do site
- `/resposta-corretor` - Respostas dos corretores

## 🎯 Funcionalidades Implementadas

### ✅ Sistema Base

- [x] Autenticação completa (local + Google)
- [x] Sistema de permissões por tipo de usuário
- [x] Layout responsivo com tema personalizado
- [x] Chat com IA integrado
- [x] Banco de dados completo

### ✅ Dashboards

- [x] Dashboard Admin com estatísticas financeiras
- [x] Dashboard Corretor com leads e WhatsApp
- [x] Dashboard Cliente com favoritos e visitas
- [x] Sidebar dinâmica por tipo de usuário

### ✅ Gestão de Imóveis

- [x] Catálogo público com filtros avançados
- [x] Busca por localização, preço, tipo
- [x] Sistema de favoritos
- [x] Múltiplas fotos por imóvel

### ✅ Sistema de Leads

- [x] Chat IA para qualificação automática
- [x] Encaminhamento para corretores ativos
- [x] Status e rastreamento completo
- [x] Integração WhatsApp via N8N

### ✅ Automações

- [x] Workflow N8N completo
- [x] Timeout de 15 minutos
- [x] Fallback automático
- [x] Notificações por email e WhatsApp

## 🚀 Deploy e Produção

### 1. Build da Aplicação

```bash
npm run build
```

### 2. Configurar Proxy Reverso (Nginx)

```nginx
server {
    listen 80;
    server_name siqueicamposimoveis.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. Docker Compose (Opcional)

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: bdsitejuarez
      POSTGRES_USER: sitejuarez
      POSTGRES_PASSWORD: juarez123
```

## 📞 Informações de Contato

### Empresa

- **Nome**: Siqueira Campos Imóveis
- **WhatsApp**: (62) 9 8556-3505
- **Email**: SiqueiraCamposImoveisGoiania@gmail.com
- **Instagram**: @imoveissiqueiracampos
- **Proprietário**: Juarez

### Desenvolvedor

- **Empresa**: KRYONIX
- **Desenvolvedor**: Vitor Jayme Fernandes Ferreira
- **WhatsApp**: (17) 98180-5327
- **Instagram**: @kryon.ix

## 📝 Logs e Monitoramento

O sistema mantém logs completos de:

- Todas as ações dos usuários
- Conversas do chat com IA
- Leads criados e assumidos
- Erros e exceções
- Performance das APIs

## 🔧 Manutenção

### Backup Automático

```bash
# Criar backup do banco
pg_dump bdsitejuarez > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql bdsitejuarez < backup_20240101.sql
```

### Monitoramento

- Logs em tempo real via dashboard dev
- Alertas automáticos para erros críticos
- Métricas de performance e uso

## 🆘 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco**

   - Verificar DATABASE_URL no .env
   - Confirmar que PostgreSQL está rodando

2. **Chat IA não responde**

   - Verificar OPENAI_API_KEY
   - Confirmar saldo da conta OpenAI

3. **WhatsApp não envia**

   - Verificar configuração Evolution API
   - Testar webhook do N8N

4. **Login Google não funciona**
   - Verificar credenciais Google OAuth
   - Confirmar URL de callback

### Suporte

Para suporte técnico, entre em contato com o desenvolvedor via WhatsApp: (17) 98180-5327

---

**Desenvolvido com ❤️ pela KRYONIX**
