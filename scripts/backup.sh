#!/bin/bash

# Script de Backup Automatizado - Siqueira Campos Imóveis
# Autor: KRYONIX Tecnologia

set -e

# Configurações
BACKUP_DIR="/backups"
DATE=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=30

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função de log
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Criar diretório de backup se não existir
mkdir -p $BACKUP_DIR

log "Iniciando backup automatizado..."

# Backup do banco PostgreSQL
backup_database() {
    log "Fazendo backup do banco de dados..."
    
    if docker ps | grep -q postgres; then
        docker exec postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB | gzip > "$BACKUP_DIR/database_$DATE.sql.gz"
        log "Backup do banco concluído: database_$DATE.sql.gz"
    else
        error "Container PostgreSQL não está rodando"
        return 1
    fi
}

# Backup dos arquivos de upload
backup_uploads() {
    log "Fazendo backup dos arquivos de upload..."
    
    if [ -d "./public/uploads" ]; then
        tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" ./public/uploads
        log "Backup dos uploads concluído: uploads_$DATE.tar.gz"
    else
        warn "Diretório de uploads não encontrado"
    fi
}

# Backup de configurações
backup_configs() {
    log "Fazendo backup das configurações..."
    
    tar -czf "$BACKUP_DIR/configs_$DATE.tar.gz" \
        .env* \
        docker-compose.yml \
        ecosystem.config.js \
        prisma/ \
        2>/dev/null || true
        
    log "Backup das configurações concluído: configs_$DATE.tar.gz"
}

# Limpeza de backups antigos
cleanup_old_backups() {
    log "Limpando backups antigos (mais de $RETENTION_DAYS dias)..."
    
    find $BACKUP_DIR -name "*.gz" -type f -mtime +$RETENTION_DAYS -delete
    find $BACKUP_DIR -name "*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
    
    log "Limpeza concluída"
}

# Verificar espaço em disco
check_disk_space() {
    AVAILABLE_SPACE=$(df $BACKUP_DIR | tail -1 | awk '{print $4}')
    REQUIRED_SPACE=1048576 # 1GB em KB
    
    if [ $AVAILABLE_SPACE -lt $REQUIRED_SPACE ]; then
        error "Espaço insuficiente em disco. Disponível: ${AVAILABLE_SPACE}KB, Necessário: ${REQUIRED_SPACE}KB"
        return 1
    fi
}

# Enviar notificação (opcional)
send_notification() {
    local status=$1
    local message=$2
    
    if [ -n "$WEBHOOK_URL" ]; then
        curl -X POST "$WEBHOOK_URL" \
            -H "Content-Type: application/json" \
            -d "{\"text\":\"🔄 Backup Siqueira Campos: $status - $message\"}" \
            2>/dev/null || true
    fi
}

# Função principal
main() {
    local start_time=$(date +%s)
    
    # Verificações preliminares
    check_disk_space
    
    # Executar backups
    backup_database
    backup_uploads
    backup_configs
    
    # Limpeza
    cleanup_old_backups
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    log "Backup concluído com sucesso em ${duration}s"
    send_notification "SUCESSO" "Backup concluído em ${duration}s"
}

# Executar backup
main "$@"
