# 🔄 Tutorial Completo N8N - Siqueira Campos Imóveis

## 📋 Índice

1. [Instalação do N8N](#instalação-do-n8n)
2. [Configuração Inicial](#configuração-inicial)
3. [Importação do Workflow](#importação-do-workflow)
4. [Configuração Evolution API](#configuração-evolution-api)
5. [Configuração OpenAI](#configuração-openai)
6. [Teste do Sistema](#teste-do-sistema)
7. [Monitoramento](#monitoramento)
8. [Troubleshooting](#troubleshooting)

---

## 🚀 Instalação do N8N

### Opção 1: Instalação com Docker (Recomendado)

```bash
# 1. Criar diretório do N8N
mkdir -p /opt/siqueira-campos/n8n
cd /opt/siqueira-campos/n8n

# 2. Criar docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=localhost
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=sitejuarez
      - DB_POSTGRESDB_PASSWORD=juarez123
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=siqueira123
      - WEBHOOK_URL=https://n8n.siqueicamposimoveis.com.br
      - GENERIC_TIMEZONE=America/Sao_Paulo
      - N8N_ENCRYPTION_KEY=siqueiran8nkey2024!@#
    volumes:
      - n8n_data:/home/node/.n8n
    network_mode: "host"

volumes:
  n8n_data:
EOF

# 3. Iniciar N8N
docker-compose up -d

# 4. Verificar se está rodando
docker-compose logs -f
```

### Opção 2: Instalação NPM Global

```bash
# 1. Instalar N8N globalmente
npm install -g n8n

# 2. Configurar variáveis de ambiente
export DB_TYPE=postgresdb
export DB_POSTGRESDB_HOST=localhost
export DB_POSTGRESDB_PORT=5432
export DB_POSTGRESDB_DATABASE=n8n
export DB_POSTGRESDB_USER=sitejuarez
export DB_POSTGRESDB_PASSWORD=juarez123
export N8N_BASIC_AUTH_ACTIVE=true
export N8N_BASIC_AUTH_USER=admin
export N8N_BASIC_AUTH_PASSWORD=siqueira123
export WEBHOOK_URL=https://n8n.siqueicamposimoveis.com.br
export GENERIC_TIMEZONE=America/Sao_Paulo

# 3. Iniciar N8N
n8n start
```

---

## ⚙️ Configuração Inicial

### 1. Criar Base de Dados N8N no PostgreSQL

```bash
# Conectar ao PostgreSQL
sudo -u postgres psql

# Criar database para N8N
CREATE DATABASE n8n OWNER sitejuarez;
GRANT ALL PRIVILEGES ON DATABASE n8n TO sitejuarez;
\q
```

### 2. Acessar Interface Web

1. Abra o navegador em: `http://localhost:5678`
2. Faça login com:
   - **Usuário:** admin
   - **Senha:** siqueira123

### 3. Configuração Inicial N8N

1. **Primeiro Acesso:**

   - Clique em "Continue" nas telas de boas-vindas
   - Configure seu usuário administrador
   - Defina configurações de empresa (opcional)

2. **Configurações Gerais:**
   - Vá em `Settings` → `General`
   - Configure timezone: `America/Sao_Paulo`
   - Configure webhook URL: `https://n8n.siqueicamposimoveis.com.br`

---

## 📥 Importação do Workflow

### 1. Importar Workflow do Arquivo

1. **Acessar Workflows:**

   - Clique em "Workflows" no menu lateral
   - Clique em "Import from file"

2. **Selecionar Arquivo:**

   - Navegue até o arquivo `n8n-lead-imobiliaria-completo.json`
   - Clique em "Import"

3. **Verificar Importação:**
   - O workflow "Lead Imobiliária Completo" deve aparecer
   - Clique no workflow para abrir

### 2. Configurar Credenciais

O workflow precisa das seguintes credenciais:

#### A. Credencial HTTP (Para API do Sistema)

1. Clique em qualquer nó HTTP no workflow
2. Clique em "Create New Credential"
3. Configure:
   - **Name:** `Siqueira Campos API`
   - **Authentication:** `Generic Credential Type`
   - **Generic Auth Type:** `Header Auth`
   - **Name:** `Authorization`
   - **Value:** `Bearer SEU_JWT_TOKEN_AQUI`

#### B. Credencial PostgreSQL

1. Vá em `Settings` → `Credentials`
2. Clique em "Add Credential"
3. Selecione "Postgres"
4. Configure:
   - **Name:** `Siqueira Postgres`
   - **Host:** `localhost`
   - **Port:** `5432`
   - **Database:** `bdsitejuarez`
   - **User:** `sitejuarez`
   - **Password:** `juarez123`

---

## 📱 Configuração Evolution API

### 1. Instalar Evolution API

```bash
# 1. Clonar repositório
git clone https://github.com/EvolutionAPI/evolution-api.git
cd evolution-api

# 2. Instalar dependências
npm install

# 3. Configurar arquivo .env
cp .env.example .env

# 4. Editar configurações
nano .env
```

### 2. Configurar .env Evolution API

```env
# Servidor
SERVER_PORT=8080
CORS_ORIGIN=*
DEL_INSTANCE=false

# Base de dados
DATABASE_CONNECTION_URI=postgresql://sitejuarez:juarez123@localhost:5432/evolution?schema=public
DATABASE_SAVE_DATA_INSTANCE=true
DATABASE_SAVE_DATA_NEW_MESSAGE=true
DATABASE_SAVE_MESSAGE_UPDATE=true

# Redis
REDIS_URI=redis://localhost:6379

# Autenticação
AUTHENTICATION_API_KEY=siqueira_evolution_key_2024

# Webhook
WEBHOOK_URL=http://localhost:5678/webhook/whatsapp

# Logs
LOG_LEVEL=info
LOG_COLOR=true
```

### 3. Iniciar Evolution API

```bash
# Opção 1: Desenvolvimento
npm run start:dev

# Opção 2: Produção
npm run build
npm run start:prod

# Opção 3: PM2
pm2 start ecosystem.config.js
```

### 4. Configurar Instância WhatsApp

```bash
# 1. Criar instância para cada corretor
curl -X POST http://localhost:8080/instance/create \
  -H "Content-Type: application/json" \
  -H "apikey: siqueira_evolution_key_2024" \
  -d '{
    "instanceName": "corretor1",
    "qrcode": true,
    "integration": "WHATSAPP-BAILEYS"
  }'

# 2. Gerar QR Code
curl -X GET http://localhost:8080/instance/connect/corretor1 \
  -H "apikey: siqueira_evolution_key_2024"

# 3. Configurar webhook
curl -X POST http://localhost:8080/webhook/set/corretor1 \
  -H "Content-Type: application/json" \
  -H "apikey: siqueira_evolution_key_2024" \
  -d '{
    "webhook": {
      "url": "http://localhost:5678/webhook/whatsapp",
      "by_events": true,
      "base64": false
    },
    "events": [
      "APPLICATION_STARTUP",
      "QRCODE_UPDATED",
      "MESSAGES_UPSERT",
      "CONNECTION_UPDATE"
    ]
  }'
```

---

## 🤖 Configuração OpenAI

### 1. Obter API Key

1. Acesse: https://platform.openai.com/api-keys
2. Crie uma nova API key
3. Copie a chave gerada

### 2. Configurar no N8N

1. **Criar Credencial OpenAI:**

   - Vá em `Settings` → `Credentials`
   - Clique em "Add Credential"
   - Selecione "OpenAI"
   - Configure:
     - **Name:** `OpenAI Siqueira`
     - **API Key:** `sua_api_key_aqui`

2. **Configurar no Workflow:**
   - Abra o workflow importado
   - Localize os nós "OpenAI"
   - Selecione a credencial criada

### 3. Configurar Prompts

No nó OpenAI do workflow, configure o prompt:

```
Você é um assistente virtual especializado em imóveis da Siqueira Campos Imóveis em Goiânia.

Informações da empresa:
- Nome: Siqueira Campos Imóveis
- Cidade: Goiânia-GO
- WhatsApp: (62) 9 8556-3505
- Instagram: @imoveissiqueiracampos
- Email: SiqueiraCamposImoveisGoiania@gmail.com

Sua função é:
1. Atender clientes interessados em imóveis
2. Coletar informações: nome, telefone, tipo de imóvel, orçamento
3. Responder dúvidas sobre imóveis disponíveis
4. Agendar visitas quando apropriado
5. Encaminhar para corretores quando necessário

Sempre seja cordial, profissional e helpful. Mantenha conversas focadas em imóveis.

Mensagem do cliente: {{ $json.message }}
```

---

## 🧪 Teste do Sistema

### 1. Teste do Chat IA

1. **Acesse o site:** http://localhost:3000
2. **Clique no chat flutuante**
3. **Envie uma mensagem:** "Olá, tenho interesse em apartamentos"
4. **Verifique resposta da IA**

### 2. Teste do Workflow N8N

1. **Acesse N8N:** http://localhost:5678
2. **Abra o workflow**
3. **Clique em "Execute Workflow"**
4. **Monitore execução:**
   - Verde: Sucesso
   - Vermelho: Erro
   - Amarelo: Em execução

### 3. Teste WhatsApp

1. **Conectar WhatsApp:**

   - Escaneie QR code gerado
   - Aguarde confirmação de conexão

2. **Teste de Mensagem:**
   - Envie mensagem para número conectado
   - Verifique se chegou no N8N
   - Confirme criação de lead no sistema

### 4. Teste Completo do Fluxo

```bash
# 1. Criar lead via API (simular chat)
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Teste",
    "telefone": "(62) 99999-9999",
    "email": "joao@teste.com",
    "mensagem": "Interessado em apartamento",
    "origem": "CHAT_IA"
  }'

# 2. Verificar logs N8N
# 3. Verificar se mensagem foi enviada no WhatsApp
# 4. Simular resposta do corretor
# 5. Verificar atualização no sistema
```

---

## 📊 Monitoramento

### 1. Dashboard N8N

1. **Acesse:** http://localhost:5678
2. **Vá em "Executions"**
3. **Monitore:**
   - Execuções bem-sucedidas
   - Execuções com erro
   - Tempo de execução
   - Frequência de execução

### 2. Logs da Evolution API

```bash
# Ver logs em tempo real
docker logs -f evolution-api

# Verificar status das instâncias
curl -X GET http://localhost:8080/instance/fetchInstances \
  -H "apikey: siqueira_evolution_key_2024"
```

### 3. Logs do Sistema

```bash
# Logs da aplicação principal
tail -f /opt/siqueira-campos/logs/main-combined.log

# Logs de erro
tail -f /opt/siqueira-campos/logs/main-error.log

# Logs do PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### 4. Verificação de Saúde

```bash
# Status N8N
curl http://localhost:5678/healthz

# Status Evolution API
curl http://localhost:8080/

# Status aplicação principal
curl http://localhost:3000/health
```

---

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. N8N não inicia

```bash
# Verificar logs
docker-compose logs n8n

# Problemas comuns:
# - Porta 5678 em uso
# - Conexão com PostgreSQL
# - Permissões de volume

# Soluções:
sudo netstat -tulpn | grep 5678
sudo systemctl status postgresql
docker-compose down && docker-compose up -d
```

#### 2. Evolution API desconecta

```bash
# Verificar instâncias
curl -X GET http://localhost:8080/instance/fetchInstances \
  -H "apikey: siqueira_evolution_key_2024"

# Reconectar instância
curl -X GET http://localhost:8080/instance/connect/corretor1 \
  -H "apikey: siqueira_evolution_key_2024"

# Reiniciar se necessário
curl -X POST http://localhost:8080/instance/restart/corretor1 \
  -H "apikey: siqueira_evolution_key_2024"
```

#### 3. Webhook não funciona

```bash
# Verificar configuração
curl -X GET http://localhost:8080/webhook/find/corretor1 \
  -H "apikey: siqueira_evolution_key_2024"

# Reconfigurar webhook
curl -X POST http://localhost:8080/webhook/set/corretor1 \
  -H "Content-Type: application/json" \
  -H "apikey: siqueira_evolution_key_2024" \
  -d '{
    "webhook": {
      "url": "http://localhost:5678/webhook/whatsapp",
      "by_events": true
    }
  }'
```

#### 4. OpenAI não responde

```bash
# Verificar créditos da API
curl https://api.openai.com/v1/usage \
  -H "Authorization: Bearer sua_api_key"

# Testar conexão
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer sua_api_key"
```

### Comandos Úteis

```bash
# Reiniciar todos os serviços
sudo systemctl restart postgresql redis nginx
docker-compose restart
pm2 restart all

# Verificar portas em uso
sudo netstat -tulpn | grep -E ":(3000|3001|3002|5432|6379|5678|8080)"

# Limpar logs
sudo truncate -s 0 /opt/siqueira-campos/logs/*.log

# Backup do banco N8N
pg_dump -h localhost -U sitejuarez -d n8n > /opt/siqueira-campos/backups/n8n_backup_$(date +%Y%m%d).sql

# Restaurar backup
psql -h localhost -U sitejuarez -d n8n < /opt/siqueira-campos/backups/n8n_backup_YYYYMMDD.sql
```

---

## 📞 Suporte

### Contato Desenvolvedor

- **WhatsApp:** (17) 98180-5327
- **Instagram:** @kryon.ix
- **Empresa:** KRYONIX

### Documentação Adicional

- **N8N Docs:** https://docs.n8n.io/
- **Evolution API:** https://github.com/EvolutionAPI/evolution-api
- **OpenAI API:** https://platform.openai.com/docs

---

## ✅ Checklist Final

- [ ] N8N instalado e funcionando
- [ ] PostgreSQL configurado
- [ ] Evolution API conectada
- [ ] WhatsApp configurado e conectado
- [ ] OpenAI API configurada
- [ ] Workflow importado e ativo
- [ ] Teste completo realizado
- [ ] Monitoramento configurado
- [ ] Backup configurado

**🎉 Sistema N8N Configurado com Sucesso!**
