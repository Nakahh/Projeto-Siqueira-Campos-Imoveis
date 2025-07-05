# Multi-stage build para produção
FROM node:18-alpine AS base

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
FROM base AS deps
RUN npm ci --only=production && npm cache clean --force

# Build da aplicação
FROM base AS builder
COPY . .
RUN npm ci
RUN npx prisma generate
RUN npm run build

# Imagem de produção
FROM node:18-alpine AS runner
WORKDIR /app

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public

# Criar diretório de uploads
RUN mkdir -p /app/uploads && chown -R nextjs:nodejs /app/uploads

# Mudar para usuário não-root
USER nextjs

# Expor porta
EXPOSE 3000

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Comando de inicialização
CMD ["node", "dist/server/node-build.mjs"]
