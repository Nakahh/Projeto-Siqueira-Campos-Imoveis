# Dockerfile - Siqueira Campos Imóveis
# Ambiente de Desenvolvimento
# Desenvolvido por KRYONIX Tecnologia

FROM node:18-alpine

# Metadados
LABEL maintainer="KRYONIX Tecnologia <contato@kryonix.com.br>"
LABEL description="Sistema Siqueira Campos Imóveis - Desenvolvimento"
LABEL version="1.0.0"

# Instalar dependências do sistema
RUN apk add --no-cache \
    bash \
    curl \
    git \
    sqlite \
    openssl

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci

# Gerar Prisma Client
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Criar diretórios necessários
RUN mkdir -p uploads logs backups

# Expor porta
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3001/api/health || exit 1

# Comando padrão
CMD ["npm", "run", "start"]
