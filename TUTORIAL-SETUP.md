# 🚀 Tutorial Completo - Sistema Siqueira Campos Imóveis

## 📋 Índice

1. [Preparação do Ambiente](#1-preparação-do-ambiente)
2. [Configuração do Banco de Dados](#2-configuração-do-banco-de-dados)
3. [Configuração do Projeto](#3-configuração-do-projeto)
4. [Configuração do N8N](#4-configuração-do-n8n)
5. [Configuração do WhatsApp (Evolution API)](#5-configuração-do-whatsapp)
6. [Configuração do Google OAuth](#6-configuração-do-google-oauth)
7. [Deploy e Produção](#7-deploy-e-produção)
8. [Testes Completos](#8-testes-completos)

---

## 1. Preparação do Ambiente

### 1.1 Instalar Dependências

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y nodejs npm postgresql postgresql-contrib nginx

# CentOS/RHEL
sudo yum install -y nodejs npm postgresql postgresql-server nginx

# Verificar versões
node --version  # Deve ser 18+
npm --version
psql --version
```

### 1.2 Configurar PostgreSQL

```bash
# Iniciar PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Criar usuário e banco
sudo -u postgres psql

-- No console do PostgreSQL:
CREATE USER sitejuarez WITH PASSWORD 'juarez123';
CREATE DATABASE bdsitejuarez OWNER sitejuarez;
GRANT ALL PRIVILEGES ON DATABASE bdsitejuarez TO sitejuarez;
\q

# Testar conexão
psql -h localhost -U sitejuarez -d bdsitejuarez
```

---

## 2. Configuração do Banco de Dados

### 2.1 Configurar Prisma

```bash
# No diretório do projeto
npm install
npx prisma generate
npx prisma migrate dev --name init
```

### 2.2 Criar Usuários de Teste

```sql
-- Conectar ao banco
psql -h localhost -U sitejuarez -d bdsitejuarez

-- Inserir usuários de teste
INSERT INTO usuarios (nome, email, senha, tipo, ativo, whatsapp) VALUES
('Admin Sistema', 'admin@siqueicamposimoveis.com.br', '$2b$12$K8YjFWQ7Zmw5cQGN0Xy1KO8B5M2Lk3Nx4Pv9Q7R8S6T1U0V2W3X4Y5', 'ADMIN', true, '(62) 9 8556-3505'),
('Corretor Principal', 'corretor@siqueicamposimoveis.com.br', '$2b$12$K8YjFWQ7Zmw5cQGN0Xy1KO8B5M2Lk3Nx4Pv9Q7R8S6T1U0V2W3X4Y5', 'CORRETOR', true, '(62) 9 9999-1001'),
('Assistente', 'assistente@siqueicamposimoveis.com.br', '$2b$12$K8YjFWQ7Zmw5cQGN0Xy1KO8B5M2Lk3Nx4Pv9Q7R8S6T1U0V2W3X4Y5', 'ASSISTENTE', true, '(62) 9 9999-1002'),
('Cliente Teste', 'cliente@teste.com.br', '$2b$12$K8YjFWQ7Zmw5cQGN0Xy1KO8B5M2Lk3Nx4Pv9Q7R8S6T1U0V2W3X4Y5', 'CLIENTE', true, '(62) 9 9999-2001'),
('Marketing', 'marketing@siqueicamposimoveis.com.br', '$2b$12$K8YjFWQ7Zmw5cQGN0Xy1KO8B5M2Lk3Nx4Pv9Q7R8S6T1U0V2W3X4Y5', 'MARKETING', true, '(62) 9 9999-3001'),
('Desenvolvedor', 'dev@kryonix.com.br', '$2b$12$K8YjFWQ7Zmw5cQGN0Xy1KO8B5M2Lk3Nx4Pv9Q7R8S6T1U0V2W3X4Y5', 'DESENVOLVEDOR', true, '(17) 9 8180-5327');

-- Senha para todos os usuários: 123456
```

### 2.3 Inserir Imóveis de Teste

```sql
-- Inserir imóveis de exemplo
INSERT INTO imoveis (titulo, descricao, endereco, bairro, tipo, transacao, preco, preco_aluguel, area, quartos, banheiros, vagas, status, destaque, corretor_id, fotos) VALUES
('Casa Moderna no Setor Bueno', 'Linda casa com 3 quartos, piscina e área gourmet', 'Rua das Palmeiras, 123', 'Setor Bueno', 'CASA', 'AMBOS', 850000, 4500, 280, 3, 2, 2, 'DISPONIVEL', true, 2, ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800']),

('Apartamento Luxo no Setor Oeste', 'Apartamento de alto padrão com vista panorâmica', 'Avenida T-4, 567', 'Setor Oeste', 'APARTAMENTO', 'VENDA', 750000, NULL, 120, 2, 2, 1, 'DISPONIVEL', true, 2, ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800']),

('Terreno Comercial Centro', 'Excelente terreno para investimento comercial', 'Rua Central, 890', 'Centro', 'TERRENO', 'VENDA', 450000, NULL, 500, 0, 0, 0, 'DISPONIVEL', false, 2, ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800']),

('Kitnet Universitária', 'Kitnet mobiliada próxima à UFG', 'Rua Universitária, 234', 'Setor Universitário', 'KITNET', 'ALUGUEL', 180000, 800, 35, 1, 1, 1, 'DISPONIVEL', false, 2, ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800']),

('Sobrado Jardim América', 'Sobrado espaçoso com quintal amplo', 'Rua das Flores, 345', 'Jardim América', 'CASA', 'VENDA', 520000, NULL, 200, 3, 2, 2, 'DISPONIVEL', false, 2, ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800']);
```

---

## 3. Configuração do Projeto

### 3.1 Instalar e Configurar

```bash
# Clonar e instalar
git clone <repository-url>
cd siqueira-campos-imoveis
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações
```

### 3.2 Configurar .env

```env
# Banco de Dados
DATABASE_URL="postgresql://sitejuarez:juarez123@localhost:5432/bdsitejuarez?schema=public"

# Segurança
JWT_SECRET=seu_jwt_secret_muito_seguro_aqui
JWT_EXPIRES_IN=7d
COOKIE_SECRET=seu_cookie_secret_aqui

# OpenAI para Chat IA
OPENAI_API_KEY=sk-sua_chave_openai_aqui

# Google OAuth
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Evolution API (WhatsApp)
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_TOKEN=seu_token_evolution_aqui

# N8N
N8N_WEBHOOK_URL=http://localhost:5678/webhook

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app_gmail
```

### 3.3 Executar Aplicação

```bash
# Desenvolvimento
npm run dev

# Acessar em: http://localhost:3000
```

---

## 4. Configuração do N8N

### 4.1 Instalar N8N

```bash
# Instalar globalmente
npm install -g n8n

# Ou via Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### 4.2 Configurar Credenciais

```bash
# Iniciar N8N
n8n start

# Acessar: http://localhost:5678
```

**No N8N Interface:**

1. **Criar conta admin**
2. **Adicionar Credenciais PostgreSQL:**

   - Host: localhost
   - Database: bdsitejuarez
   - User: sitejuarez
   - Password: juarez123
   - Port: 5432

3. **Adicionar Credenciais OpenAI:**

   - API Key: sua_chave_openai

4. **Adicionar Credenciais Evolution API:**

   - Base URL: http://localhost:8080
   - API Key: seu_token_evolution

5. **Adicionar Credenciais SMTP:**
   - Host: smtp.gmail.com
   - Port: 587
   - User: seu_email@gmail.com
   - Password: sua_senha_app

### 4.3 Importar Workflow

1. **Ir para N8N → Workflows**
2. **Clicar em "Import"**
3. **Upload do arquivo:** `n8n-lead-imobiliaria-completo.json`
4. **Configurar credenciais** nos nós
5. **Ativar o workflow**

### 4.4 Testar Webhooks

```bash
# Testar webhook lead-site
curl -X POST http://localhost:5678/webhook/lead-site \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Teste",
    "telefone": "62999999999",
    "mensagem": "Quero ver apartamento"
  }'
```

---

## 5. Configuração do WhatsApp

### 5.1 Evolution API

```bash
# Clonar Evolution API
git clone https://github.com/EvolutionAPI/evolution-api.git
cd evolution-api

# Configurar Docker
cp .env.example .env
# Editar configurações

# Executar
docker-compose up -d

# Verificar: http://localhost:8080/manager
```

### 5.2 Conectar WhatsApp

1. **Acessar Evolution Manager**
2. **Criar Instância** para cada corretor
3. **Escanear QR Code** com WhatsApp
4. **Configurar Webhook** para N8N:
   ```
   URL: http://localhost:5678/webhook/resposta-corretor
   Events: message
   ```

### 5.3 Testar Integration

```bash
# Testar envio de mensagem
curl -X POST http://localhost:8080/message/sendText \
  -H "Content-Type: application/json" \
  -H "apikey: SEU_TOKEN" \
  -d '{
    "number": "5562999999999",
    "text": "Teste de integração"
  }'
```

---

## 6. Configuração do Google OAuth

### 6.1 Google Cloud Console

1. **Acessar:** https://console.cloud.google.com
2. **Criar projeto:** "Siqueira Campos Imóveis"
3. **Ativar APIs:** Google+ API
4. **Criar credenciais OAuth 2.0:**
   - Authorized origins: `http://localhost:3000`
   - Authorized redirects: `http://localhost:3000/api/auth/google/callback`

### 6.2 Configurar no .env

```env
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

### 6.3 Testar Login Google

1. **Acessar:** http://localhost:3000/login
2. **Clicar:** "Entrar com Google"
3. **Autorizar** aplicação
4. **Verificar** criação do usuário no banco

---

## 7. Deploy e Produção

### 7.1 Build da Aplicação

```bash
# Build do frontend e backend
npm run build

# Testar build
npm start
```

### 7.2 Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/siqueiracampos
```

```nginx
server {
    listen 80;
    server_name siqueicamposimoveis.com.br;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Uploads
    location /uploads/ {
        alias /var/www/siqueiracampos/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/siqueiracampos /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7.3 Configurar SSL (Let's Encrypt)

```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx

# Gerar certificado
sudo certbot --nginx -d siqueicamposimoveis.com.br

# Renovação automática
sudo crontab -e
# Adicionar linha:
0 12 * * * /usr/bin/certbot renew --quiet
```

### 7.4 Configurar PM2

```bash
# Instalar PM2
npm install -g pm2

# Criar ecosystem
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [
    {
      name: "siqueira-campos-api",
      script: "dist/server/index.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
```

```bash
# Iniciar com PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

---

## 8. Testes Completos

### 8.1 Criar Dados de Teste

```bash
# Script para popular banco
node scripts/seed-database.js
```

### 8.2 Testes de Funcionalidade

#### 8.2.1 Teste de Login

```bash
# Teste admin
Email: admin@siqueicamposimoveis.com.br
Senha: 123456

# Teste corretor
Email: corretor@siqueicamposimoveis.com.br
Senha: 123456

# Teste cliente
Email: cliente@teste.com.br
Senha: 123456
```

#### 8.2.2 Teste Chat IA

1. **Acessar site:** http://localhost:3000
2. **Abrir chat** (ícone flutuante)
3. **Conversar:**
   ```
   Usuário: "Olá, quero alugar um apartamento"
   IA: Resposta automática + coleta dados
   ```

#### 8.2.3 Teste Fluxo Lead → WhatsApp

1. **Chat IA** qualifica lead
2. **Sistema** cria lead no banco
3. **N8N** envia para corretores via WhatsApp
4. **Corretor** responde "ASSUMIR"
5. **Sistema** atualiza status

#### 8.2.4 Teste Dashboard

1. **Login como admin:** Visualizar estatísticas
2. **Login como corretor:** Configurar WhatsApp
3. **Login como cliente:** Adicionar favoritos

### 8.3 Testes de Performance

```bash
# Teste de carga com Apache Bench
ab -n 1000 -c 10 http://localhost:3000/api/imoveis

# Monitorar recursos
htop
```

### 8.4 Backup e Restore

```bash
# Backup diário
pg_dump bdsitejuarez > backup_$(date +%Y%m%d).sql

# Restore
psql bdsitejuarez < backup_20240101.sql
```

---

## 9. Troubleshooting

### 9.1 Problemas Comuns

**❌ Erro: Cannot connect to database**

```bash
# Verificar PostgreSQL
sudo systemctl status postgresql
sudo systemctl start postgresql

# Testar conexão
psql -h localhost -U sitejuarez -d bdsitejuarez
```

**❌ Erro: OpenAI API quota exceeded**

```bash
# Verificar saldo: https://platform.openai.com/usage
# Adicionar créditos ou trocar chave
```

**❌ Erro: Evolution API not responding**

```bash
# Verificar container
docker ps
docker logs evolution-api

# Reiniciar
docker-compose restart
```

**❌ Erro: N8N workflow not triggering**

```bash
# Verificar webhooks
curl -X POST http://localhost:5678/webhook-test/lead-site

# Verificar logs N8N
tail -f ~/.n8n/logs/n8n.log
```

### 9.2 Logs do Sistema

```bash
# Logs da aplicação
tail -f ~/.pm2/logs/siqueira-campos-api-out.log

# Logs do banco
sudo tail -f /var/log/postgresql/postgresql-*.log

# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 10. Contatos e Suporte

### 📞 Empresa

- **WhatsApp:** (62) 9 8556-3505
- **Email:** SiqueiraCamposImoveisGoiania@gmail.com
- **Instagram:** @imoveissiqueiracampos

### 💻 Desenvolvedor

- **Empresa:** KRYONIX
- **Desenvolvedor:** Vitor Jayme Fernandes Ferreira
- **WhatsApp:** (17) 98180-5327
- **Instagram:** @kryon.ix

---

## ✅ Checklist Final

- [ ] PostgreSQL configurado e funcionando
- [ ] Aplicação executando em http://localhost:3000
- [ ] N8N rodando em http://localhost:5678
- [ ] Evolution API conectada ao WhatsApp
- [ ] Workflow N8N importado e ativo
- [ ] Usuários de teste criados
- [ ] Imóveis de exemplo inseridos
- [ ] Chat IA respondendo
- [ ] Login Google funcionando
- [ ] Dashboards carregando
- [ ] Sistema de leads operacional
- [ ] Nginx configurado (produção)
- [ ] SSL configurado (produção)
- [ ] PM2 rodando (produção)
- [ ] Backups configurados

**🎉 Sistema Completo e Funcionando!**

---

**Desenvolvido com ❤️ pela KRYONIX**
