#!/bin/bash

# Script de Deploy Automatizado - Siqueira Campos Imóveis
# Autor: KRYONIX Tecnologia

set -e

# Configurações
DEPLOY_ENV=${1:-production}
BACKUP_BEFORE_DEPLOY=${BACKUP_BEFORE_DEPLOY:-true}
RUN_MIGRATIONS=${RUN_MIGRATIONS:-true}
RESTART_SERVICES=${RESTART_SERVICES:-true}

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Banner
show_banner() {
    echo -e "${BLUE}"
    echo "=================================="
    echo "   SIQUEIRA CAMPOS IMÓVEIS"
    echo "     Deploy Automatizado"
    echo "=================================="
    echo -e "${NC}"
}

# Verificar pré-requisitos
check_prerequisites() {
    log "Verificando pré-requisitos..."
    
    # Docker
    if ! command -v docker &> /dev/null; then
        error "Docker não está instalado"
        exit 1
    fi
    
    # Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose não está instalado"
        exit 1
    fi
    
    # Git
    if ! command -v git &> /dev/null; then
        error "Git não está instalado"
        exit 1
    fi
    
    # Arquivo .env
    if [ ! -f ".env.${DEPLOY_ENV}" ]; then
        error "Arquivo .env.${DEPLOY_ENV} não encontrado"
        exit 1
    fi
    
    log "Pré-requisitos verificados ✓"
}

# Backup antes do deploy
backup_before_deploy() {
    if [ "$BACKUP_BEFORE_DEPLOY" = "true" ]; then
        log "Fazendo backup antes do deploy..."
        
        if [ -f "scripts/backup.sh" ]; then
            bash scripts/backup.sh
        else
            warn "Script de backup não encontrado, pulando..."
        fi
    fi
}

# Atualizar código
update_code() {
    log "Atualizando código..."
    
    # Git pull
    git pull origin main
    
    # Verificar se há mudanças
    if [ -z "$(git diff HEAD~1 HEAD --name-only)" ]; then
        info "Nenhuma mudança detectada no código"
    else
        info "Mudanças detectadas:"
        git diff HEAD~1 HEAD --name-only | sed 's/^/  - /'
    fi
}

# Build das imagens
build_images() {
    log "Construindo imagens Docker..."
    
    if [ "$DEPLOY_ENV" = "production" ]; then
        docker-compose -f docker-compose.prod.yml build --no-cache
    else
        docker-compose build --no-cache
    fi
    
    log "Imagens construídas ✓"
}

# Executar migrações
run_migrations() {
    if [ "$RUN_MIGRATIONS" = "true" ]; then
        log "Executando migrações do banco..."
        
        # Esperar banco estar disponível
        log "Aguardando banco de dados..."
        
        if [ "$DEPLOY_ENV" = "production" ]; then
            docker-compose -f docker-compose.prod.yml run --rm app npx prisma migrate deploy
        else
            docker-compose run --rm app npx prisma migrate deploy
        fi
        
        log "Migrações executadas ✓"
    fi
}

# Deploy dos serviços
deploy_services() {
    log "Fazendo deploy dos serviços..."
    
    # Copiar arquivo de ambiente
    cp ".env.${DEPLOY_ENV}" .env
    
    # Down dos serviços existentes
    if [ "$DEPLOY_ENV" = "production" ]; then
        docker-compose -f docker-compose.prod.yml down
        
        # Up dos novos serviços
        docker-compose -f docker-compose.prod.yml up -d
    else
        docker-compose down
        docker-compose up -d
    fi
    
    log "Servi��os deployados ✓"
}

# Verificar saúde dos serviços
health_check() {
    log "Verificando saúde dos serviços..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:3001/api/status/health &> /dev/null; then
            log "Aplicação está respondendo ✓"
            break
        else
            info "Tentativa $attempt/$max_attempts - Aguardando aplicação..."
            sleep 5
            ((attempt++))
        fi
    done
    
    if [ $attempt -gt $max_attempts ]; then
        error "Aplicação não está respondendo após $max_attempts tentativas"
        return 1
    fi
    
    # Verificar outros serviços
    log "Verificando outros serviços..."
    
    # PostgreSQL
    if docker ps | grep -q postgres; then
        log "PostgreSQL: ✓"
    else
        warn "PostgreSQL: ✗"
    fi
    
    # Redis
    if docker ps | grep -q redis; then
        log "Redis: ✓"
    else
        warn "Redis: ✗"
    fi
    
    # N8N
    if docker ps | grep -q n8n; then
        log "N8N: ✓"
    else
        warn "N8N: ✗"
    fi
}

# Limpeza pós-deploy
cleanup() {
    log "Executando limpeza..."
    
    # Remover imagens órfãs
    docker image prune -f
    
    # Remover volumes órfãos
    docker volume prune -f
    
    # Remover redes órfãs
    docker network prune -f
    
    log "Limpeza concluída ✓"
}

# Rollback em caso de falha
rollback() {
    error "Deploy falhou, executando rollback..."
    
    # Reverter para commit anterior
    git reset --hard HEAD~1
    
    # Rebuild e redeploy
    build_images
    deploy_services
    
    error "Rollback executado"
}

# Notificar deploy
notify_deploy() {
    local status=$1
    local message="🚀 Deploy Siqueira Campos: $status"
    
    if [ -n "$WEBHOOK_URL" ]; then
        curl -X POST "$WEBHOOK_URL" \
            -H "Content-Type: application/json" \
            -d "{\"text\":\"$message\"}" \
            2>/dev/null || true
    fi
    
    if [ -n "$ALERT_EMAIL" ] && command -v mail &> /dev/null; then
        echo "$message" | mail -s "Deploy Siqueira Campos" "$ALERT_EMAIL" || true
    fi
}

# Função principal
main() {
    local start_time=$(date +%s)
    
    show_banner
    
    info "Iniciando deploy para ambiente: $DEPLOY_ENV"
    
    # Executar etapas
    check_prerequisites
    backup_before_deploy
    update_code
    build_images
    
    # Deploy com tratamento de erro
    if deploy_services && run_migrations && health_check; then
        cleanup
        
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        
        log "Deploy concluído com sucesso em ${duration}s ✓"
        notify_deploy "SUCESSO - Deploy concluído em ${duration}s"
        
        # Mostrar informações finais
        echo ""
        info "=== INFORMAÇÕES DO DEPLOY ==="
        info "Ambiente: $DEPLOY_ENV"
        info "Duração: ${duration}s"
        info "Data: $(date)"
        info "Commit: $(git rev-parse --short HEAD)"
        echo ""
        info "URLs disponíveis:"
        info "- Principal: https://${DOMAIN:-localhost}"
        info "- Admin: https://admin.${DOMAIN:-localhost}"
        info "- Status: https://${DOMAIN:-localhost}/status"
        
    else
        rollback
        notify_deploy "FALHA - Rollback executado"
        exit 1
    fi
}

# Trap para capturar erros
trap 'error "Deploy interrompido"; exit 1' INT TERM

# Executar
main "$@"
