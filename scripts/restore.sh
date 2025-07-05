#!/bin/bash

# Script de Restore - Siqueira Campos Imóveis
# Autor: KRYONIX Tecnologia

set -e

# Configurações
BACKUP_DIR="/backups"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Função para listar backups disponíveis
list_backups() {
    log "Backups disponíveis:"
    echo ""
    echo "=== BANCO DE DADOS ==="
    ls -la $BACKUP_DIR/database_*.sql.gz 2>/dev/null | awk '{print $9, $5, $6, $7, $8}' || echo "Nenhum backup de banco encontrado"
    
    echo ""
    echo "=== UPLOADS ==="
    ls -la $BACKUP_DIR/uploads_*.tar.gz 2>/dev/null | awk '{print $9, $5, $6, $7, $8}' || echo "Nenhum backup de uploads encontrado"
    
    echo ""
    echo "=== CONFIGURAÇÕES ==="
    ls -la $BACKUP_DIR/configs_*.tar.gz 2>/dev/null | awk '{print $9, $5, $6, $7, $8}' || echo "Nenhum backup de configurações encontrado"
}

# Restore do banco de dados
restore_database() {
    local backup_file=$1
    
    if [ -z "$backup_file" ]; then
        error "Nome do arquivo de backup não fornecido"
        return 1
    fi
    
    if [ ! -f "$BACKUP_DIR/$backup_file" ]; then
        error "Arquivo de backup não encontrado: $backup_file"
        return 1
    fi
    
    log "Restaurando banco de dados de: $backup_file"
    
    # Confirmar ação
    echo -e "${YELLOW}ATENÇÃO: Esta operação irá sobrescrever o banco atual!${NC}"
    read -p "Deseja continuar? (y/N): " confirm
    
    if [[ $confirm != [yY] ]]; then
        log "Operação cancelada"
        return 0
    fi
    
    # Restore
    zcat "$BACKUP_DIR/$backup_file" | docker exec -i postgres psql -U $POSTGRES_USER $POSTGRES_DB
    
    log "Restore do banco concluído"
}

# Restore dos uploads
restore_uploads() {
    local backup_file=$1
    
    if [ -z "$backup_file" ]; then
        error "Nome do arquivo de backup não fornecido"
        return 1
    fi
    
    if [ ! -f "$BACKUP_DIR/$backup_file" ]; then
        error "Arquivo de backup não encontrado: $backup_file"
        return 1
    fi
    
    log "Restaurando uploads de: $backup_file"
    
    # Backup atual (segurança)
    if [ -d "./public/uploads" ]; then
        mv ./public/uploads ./public/uploads.bak.$(date +%s)
        log "Backup atual salvo como uploads.bak.*"
    fi
    
    # Restore
    tar -xzf "$BACKUP_DIR/$backup_file" -C ./
    
    log "Restore dos uploads concluído"
}

# Restore das configurações
restore_configs() {
    local backup_file=$1
    
    if [ -z "$backup_file" ]; then
        error "Nome do arquivo de backup não fornecido"
        return 1
    fi
    
    if [ ! -f "$BACKUP_DIR/$backup_file" ]; then
        error "Arquivo de backup não encontrado: $backup_file"
        return 1
    fi
    
    log "Restaurando configurações de: $backup_file"
    
    echo -e "${YELLOW}ATENÇÃO: Esta operação irá sobrescrever as configurações atuais!${NC}"
    read -p "Deseja continuar? (y/N): " confirm
    
    if [[ $confirm != [yY] ]]; then
        log "Operação cancelada"
        return 0
    fi
    
    # Restore
    tar -xzf "$BACKUP_DIR/$backup_file" -C ./
    
    log "Restore das configurações concluído"
}

# Menu principal
show_menu() {
    echo ""
    echo "=== SCRIPT DE RESTORE - SIQUEIRA CAMPOS IMÓVEIS ==="
    echo "1. Listar backups disponíveis"
    echo "2. Restaurar banco de dados"
    echo "3. Restaurar uploads"
    echo "4. Restaurar configurações"
    echo "5. Sair"
    echo ""
}

# Função principal
main() {
    while true; do
        show_menu
        read -p "Escolha uma opção: " choice
        
        case $choice in
            1)
                list_backups
                ;;
            2)
                echo ""
                read -p "Nome do arquivo de backup do banco (ex: database_20240101_120000.sql.gz): " db_file
                restore_database "$db_file"
                ;;
            3)
                echo ""
                read -p "Nome do arquivo de backup dos uploads (ex: uploads_20240101_120000.tar.gz): " uploads_file
                restore_uploads "$uploads_file"
                ;;
            4)
                echo ""
                read -p "Nome do arquivo de backup das configurações (ex: configs_20240101_120000.tar.gz): " configs_file
                restore_configs "$configs_file"
                ;;
            5)
                log "Saindo..."
                exit 0
                ;;
            *)
                error "Opção inválida"
                ;;
        esac
        
        echo ""
        read -p "Pressione Enter para continuar..."
    done
}

# Executar
main "$@"
