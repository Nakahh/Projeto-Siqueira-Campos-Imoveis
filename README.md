# 🏠 Sistema Siqueira Campos Imóveis

<div align="center">

![Status](https://img.shields.io/badge/Status-100%25%20Funcional-success)
![Versão](https://img.shields.io/badge/Versão-1.0.0-blue)
![Desenvolvido por](https://img.shields.io/badge/Desenvolvido%20por-KRYONIX-orange)

**Sistema Completo de Gestão Imobiliária**

[🚀 Instalação Rápida](#-instalação-rápida) •
[📋 Funcionalidades](#-funcionalidades) •
[🔧 Configuração](#-configuração) •
[📞 Suporte](#-suporte)

</div>

---

## ✅ **STATUS: 100% FUNCIONAL NO BUILDER.IO**

O sistema está **totalmente operacional** e pronto para uso. Todos os erros foram corrigidos e o ambiente está configurado para desenvolvimento.

### 🎯 **Acesso Rápido**

- **🌐 URL:** http://localhost:8080
- **👤 Login Admin:** admin@siqueicamposimoveis.com.br (senha: 123456)
- **🔧 Status:** http://localhost:8080/api/health

---

## 🚀 **Instalação Rápida**

### ⚡ **Método 1: Builder.io (Atual)**

```bash
# Já está rodando! Acesse:
http://localhost:8080

# Para testar a API:
curl http://localhost:8080/api/health
```

### 🐳 **Método 2: Docker Local**

```bash
# Clonar e executar
git clone <repositorio>
cd siqueira-campos
docker-compose up -d
```

### 📦 **Método 3: NPM Local**

```bash
# Instalar dependências
npm install

# Configurar banco
npm run db:generate
npm run db:push
npm run db:seed

# Executar
npm run dev
```

---

## 📋 **Funcionalidades**

### 🏠 **Site Público**

- ✅ Landing page moderna
- ✅ Catálogo de imóveis com filtros
- ✅ Páginas individuais com galeria
- ✅ Chat IA integrado
- ✅ Formulários de contato
- ✅ PWA instalável

### 👨‍💼 **6 Dashboards Personalizados**

- ✅ **Admin:** Financeiro + relatórios
- ✅ **Corretor:** Imóveis + leads + comissões
- ✅ **Assistente:** Suporte administrativo
- ✅ **Cliente:** Favoritos + histórico
- ✅ **Marketing:** Campanhas + analytics
- ✅ **Desenvolvedor:** Logs + monitoramento

### 🤖 **Automações Inteligentes**

- ✅ Chat IA com OpenAI
- ✅ WhatsApp automation
- ✅ N8N workflows
- ✅ Email automático

### 🔧 **Integrações**

- ✅ Google Maps
- ✅ Meta API (Facebook/Instagram)
- ✅ Google OAuth
- ✅ SMTP email

---

## 👥 **Usuários de Teste**

| Tipo              | Email                            | Senha  | Acesso   |
| ----------------- | -------------------------------- | ------ | -------- |
| **Admin**         | admin@siqueicamposimoveis.com.br | 123456 | Completo |
| **Corretor**      | ana@siqueicamposimoveis.com.br   | 123456 | Vendas   |
| **Cliente**       | joao@cliente.com                 | 123456 | Portal   |
| **Desenvolvedor** | dev@kryonix.com.br               | 123456 | Sistema  |

---

## 🔧 **Configuração**

### 📄 **Variáveis de Ambiente (.env)**

As principais configurações já estão definidas:

```env
# Banco de Dados
DATABASE_URL="file:./dev.db"

# Segurança
JWT_SECRET=siqueira_campos_jwt_secret_super_seguro_2024

# OpenAI (configure sua chave)
OPENAI_API_KEY=sua_chave_openai_aqui

# Google Maps (configure sua chave)
GOOGLE_MAPS_API_KEY=sua_chave_google_maps_aqui
```

### 🗄️ **Banco de Dados**

O sistema usa **SQLite** para desenvolvimento (arquivo `dev.db`):

```bash
# Comandos úteis
npm run db:studio    # Interface visual do banco
npm run db:seed      # Recriar dados de teste
npm run db:reset     # Resetar banco completo
```

---

## 🛠️ **Comandos Essenciais**

```bash
# Desenvolvimento
npm run dev          # Iniciar servidor
npm run build        # Build para produção
npm test             # Executar testes

# Banco de Dados
npm run db:generate  # Gerar cliente Prisma
npm run db:push      # Aplicar mudanças no schema
npm run db:seed      # Popular com dados de teste
npm run db:studio    # Interface visual

# Docker
docker-compose up -d                    # Subir containers
docker-compose --profile postgres up   # Com PostgreSQL
docker-compose logs -f                  # Ver logs

# Scripts KRYONIX
bash scripts/setup-ubuntu.sh           # Setup completo Ubuntu
bash scripts/deploy.sh production      # Deploy produção
bash scripts/backup.sh                 # Backup manual
```

---

## 📱 **Progressive Web App (PWA)**

O sistema é instalável como aplicativo:

### 📲 **Mobile (Android/iOS)**

1. Acesse http://localhost:8080
2. Menu do navegador → "Adicionar à tela inicial"
3. App instalado com ícone próprio

### 💻 **Desktop**

1. Chrome/Edge → Ícone de instalação na barra
2. "Instalar Siqueira Campos Imóveis"

---

## 🧪 **Testes**

```bash
# Executar todos os testes
npm test

# Testes com interface visual
npm run test:ui

# Cobertura de testes
npm run test:coverage

# Testes específicos
npm test Login.test.tsx
```

---

## 📊 **Monitoramento**

### 🔍 **Status do Sistema**

- **Dashboard:** http://localhost:8080/status
- **Health Check:** http://localhost:8080/api/health

### 📈 **Métricas Disponíveis**

- CPU, Memória, Disco
- Status dos serviços
- Tempo de resposta
- Logs em tempo real

---

## 🚀 **Deploy em Produção**

### 🌐 **Opção 1: Script Automático**

```bash
# Ubuntu/Debian
curl -fsSL https://raw.githubusercontent.com/kryonix/siqueira-campos/main/scripts/install.sh | bash
```

### 🐳 **Opção 2: Docker Produção**

```bash
# Usar configuração de produção
docker-compose -f docker-compose.prod.yml up -d
```

### ☁️ **Opção 3: Portainer**

```bash
# Usar arquivo portainer-stack.yml
```

---

## 🛡️ **Segurança**

### 🔒 **Recursos Implementados**

- ✅ JWT com expiração de 7 dias
- ✅ Senhas criptografadas (bcrypt)
- ✅ Rate limiting (100 req/15min)
- ✅ Headers de segurança (Helmet)
- ✅ CORS configurado
- ✅ Validação de inputs

### 🔑 **Boas Práticas**

- Trocar `JWT_SECRET` em produção
- Configurar `CORS_ORIGIN` específico
- Usar HTTPS em produção
- Backup regular do banco

---

## 📚 **Documentação Completa**

- 📖 [README Completo](./README-COMPLETO.md) - Documentação detalhada
- 📋 [README Executivo](./README-EXECUTIVO.md) - Para gestores
- 🔧 [Tutorial N8N](./docs/TUTORIAL-N8N.md) - Configurar automações
- 📊 [Relatório Final](./RELATORIO-CONSOLIDADO-FINAL.md) - Status do projeto

---

## 🏗️ **Tecnologias Utilizadas**

### 🎨 **Frontend**

- React 18 + TypeScript
- Vite (build otimizado)
- Tailwind CSS + Radix UI
- Framer Motion (animações)
- PWA (Progressive Web App)

### ⚙️ **Backend**

- Node.js 18 + Express
- Prisma ORM + SQLite/PostgreSQL
- JWT + bcryptjs
- Rate limiting + Helmet

### 🐳 **DevOps**

- Docker + Docker Compose
- Scripts automatizados
- Health checks
- Backup automático

---

## 📞 **Suporte**

<div align="center">

### 🏗️ **Desenvolvido por KRYONIX Tecnologia**

[![Website](https://img.shields.io/badge/Website-kryonix.com.br-blue)](https://kryonix.com.br)
[![Email](https://img.shields.io/badge/Email-contato@kryonix.com.br-red)](mailto:contato@kryonix.com.br)
[![WhatsApp](<https://img.shields.io/badge/WhatsApp-(17)%2098180--5327-green>)](https://wa.me/5517981805327)

**Especialistas em Soluções Digitais para Imobiliárias**

</div>

### 📋 **Canais de Suporte**

| Canal           | Contato                                  | Horário        |
| --------------- | ---------------------------------------- | -------------- |
| 🌐 **Website**  | [kryonix.com.br](https://kryonix.com.br) | 24/7           |
| 📧 **Email**    | contato@kryonix.com.br                   | 24h resposta   |
| 📱 **WhatsApp** | (17) 98180-5327                          | Seg-Sex 8h-18h |

### 🛠️ **Serviços Inclusos**

- ✅ Suporte técnico 30 dias
- ✅ Documentação completa
- ✅ Scripts de deploy
- ✅ Backup automatizado

---

## 📄 **Licença**

Este projeto foi desenvolvido exclusivamente para **Siqueira Campos Imóveis** pela **KRYONIX Tecnologia**.

- ✅ Uso comercial autorizado
- ✅ Código fonte incluído
- ✅ Suporte técnico incluído
- ✅ Atualizações por 12 meses

---

<div align="center">

**🎉 Sistema 100% Funcional e Pronto para Uso!**

_Desenvolvido com ❤️ e excelência técnica pela equipe KRYONIX_

**© 2024 KRYONIX Tecnologia - Todos os direitos reservados**

</div>
