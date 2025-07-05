#!/bin/bash
set -e

# Docker Entrypoint - Siqueira Campos Imóveis
# Inicialização segura para produção

echo "🚀 Iniciando Siqueira Campos Imóveis..."

# Aguardar banco de dados
echo "⏳ Aguardando banco de dados..."
until pg_isready -h ${DATABASE_HOST:-postgres} -p ${DATABASE_PORT:-5432} -U ${POSTGRES_USER:-postgres}; do
  echo "🔄 Banco de dados não disponível, aguardando..."
  sleep 2
done

echo "✅ Banco de dados conectado!"

# Executar migrações se necessário
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "🔄 Executando migrações do banco..."
  npx prisma migrate deploy
  echo "✅ Migrações concluídas!"
fi

# Executar seed se necessário (apenas em desenvolvimento)
if [ "$NODE_ENV" = "development" ] && [ "$RUN_SEED" = "true" ]; then
  echo "🌱 Executando seed do banco..."
  npx prisma db seed
  echo "✅ Seed concluído!"
fi

# Gerar Prisma Client (garantia)
echo "🔄 Gerando Prisma Client..."
npx prisma generate

# Verificar variáveis críticas
required_vars=("DATABASE_URL" "JWT_SECRET")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ ERRO: Variável $var não definida!"
    exit 1
  fi
done

echo "✅ Todas as variáveis críticas definidas!"

# Criar diretórios se não existirem
mkdir -p /app/uploads /app/logs /app/backups

# Configurar permissões
chmod 755 /app/uploads /app/logs /app/backups

echo "🎯 Configuração concluída, iniciando aplicação..."

# Executar comando passado
exec "$@"
