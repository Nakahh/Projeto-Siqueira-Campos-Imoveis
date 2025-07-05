#!/bin/bash

# Script de Monitoramento Automático - Siqueira Campos Imóveis
# Autor: KRYONIX Tecnologia

set -e

# Configurações
LOG_FILE="/var/log/siqueira-monitor.log"
ALERT_THRESHOLD_CPU=80
ALERT_THRESHOLD_MEM=85
ALERT_THRESHOLD_DISK=90
CHECK_INTERVAL=300 # 5 minutos

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Função de log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Verificar uso da CPU
check_cpu() {
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
    CPU_USAGE=${CPU_USAGE%.*} # Remove decimais
    
    if [ "$CPU_USAGE" -gt "$ALERT_THRESHOLD_CPU" ]; then
        log "⚠️ ALERTA: Uso de CPU alto: ${CPU_USAGE}%"
        send_alert "CPU" "$CPU_USAGE%"
        return 1
    else
        log "✅ CPU: ${CPU_USAGE}%"
        return 0
    fi
}

# Verificar uso de memória
check_memory() {
    MEM_USAGE=$(free | awk 'FNR==2{printf "%.0f", $3/$2*100}')
    
    if [ "$MEM_USAGE" -gt "$ALERT_THRESHOLD_MEM" ]; then
        log "⚠️ ALERTA: Uso de memória alto: ${MEM_USAGE}%"
        send_alert "MEMÓRIA" "$MEM_USAGE%"
        return 1
    else
        log "✅ Memória: ${MEM_USAGE}%"
        return 0
    fi
}

# Verificar uso do disco
check_disk() {
    DISK_USAGE=$(df / | awk 'FNR==2{print $5}' | sed 's/%//')
    
    if [ "$DISK_USAGE" -gt "$ALERT_THRESHOLD_DISK" ]; then
        log "⚠️ ALERTA: Uso de disco alto: ${DISK_USAGE}%"
        send_alert "DISCO" "$DISK_USAGE%"
        return 1
    else
        log "✅ Disco: ${DISK_USAGE}%"
        return 0
    fi
}

# Verificar serviços Docker
check_docker_services() {
    local failed_services=()
    
    # Lista de serviços esperados
    services=("postgres" "redis" "n8n" "evolution" "traefik")
    
    for service in "${services[@]}"; do
        if ! docker ps --format "table {{.Names}}" | grep -q "$service"; then
            failed_services+=("$service")
        fi
    done
    
    if [ ${#failed_services[@]} -gt 0 ]; then
        log "⚠️ ALERTA: Serviços Docker offline: ${failed_services[*]}"
        send_alert "DOCKER" "Serviços offline: ${failed_services[*]}"
        return 1
    else
        log "✅ Todos os serviços Docker estão rodando"
        return 0
    fi
}

# Verificar conectividade de rede
check_network() {
    if ping -c 1 google.com &> /dev/null; then
        log "✅ Conectividade de rede OK"
        return 0
    else
        log "⚠️ ALERTA: Problema de conectividade de rede"
        send_alert "REDE" "Sem conexão com a internet"
        return 1
    fi
}

# Verificar espaço em logs
check_log_size() {
    LOG_SIZE=$(du -m "$LOG_FILE" 2>/dev/null | cut -f1 || echo "0")
    
    if [ "$LOG_SIZE" -gt 100 ]; then
        log "📝 Arquivo de log grande (${LOG_SIZE}MB), fazendo rotação..."
        
        # Fazer backup do log atual
        mv "$LOG_FILE" "${LOG_FILE}.$(date +%Y%m%d)"
        gzip "${LOG_FILE}.$(date +%Y%m%d)"
        
        # Remover logs antigos (mais de 30 dias)
        find "$(dirname "$LOG_FILE")" -name "$(basename "$LOG_FILE").*.gz" -mtime +30 -delete
        
        log "📝 Rotação de logs concluída"
    fi
}

# Enviar alerta
send_alert() {
    local component=$1
    local details=$2
    local message="🚨 ALERTA SIQUEIRA CAMPOS: $component - $details"
    
    # Webhook (se configurado)
    if [ -n "$WEBHOOK_URL" ]; then
        curl -X POST "$WEBHOOK_URL" \
            -H "Content-Type: application/json" \
            -d "{\"text\":\"$message\"}" \
            2>/dev/null || true
    fi
    
    # Email (se configurado)
    if [ -n "$ALERT_EMAIL" ] && command -v mail &> /dev/null; then
        echo "$message" | mail -s "Alerta Sistema Siqueira Campos" "$ALERT_EMAIL" || true
    fi
    
    # Log local
    echo "$message" >> "${LOG_FILE}.alerts"
}

# Função de auto-reparo
auto_repair() {
    log "🔧 Iniciando procedimentos de auto-reparo..."
    
    # Restart serviços Docker se necessário
    if ! check_docker_services; then
        log "🔧 Tentando reiniciar serviços Docker..."
        docker-compose restart
        sleep 30
        
        if check_docker_services; then
            log "✅ Serviços Docker reiniciados com sucesso"
            send_alert "REPARO" "Serviços Docker reiniciados automaticamente"
        else
            log "❌ Falha ao reiniciar serviços Docker"
        fi
    fi
    
    # Limpar cache se memória alta
    MEM_USAGE=$(free | awk 'FNR==2{printf "%.0f", $3/$2*100}')
    if [ "$MEM_USAGE" -gt 90 ]; then
        log "🔧 Limpando cache do sistema..."
        sync && echo 3 > /proc/sys/vm/drop_caches
        log "✅ Cache do sistema limpo"
    fi
}

# Verificação de saúde completa
health_check() {
    log "🏥 Iniciando verificação de saúde do sistema..."
    
    local issues=0
    
    check_cpu || ((issues++))
    check_memory || ((issues++))
    check_disk || ((issues++))
    check_docker_services || ((issues++))
    check_network || ((issues++))
    
    if [ $issues -eq 0 ]; then
        log "✅ Sistema funcionando perfeitamente"
    else
        log "⚠️ $issues problemas detectados"
        
        # Auto-reparo se habilitado
        if [ "$AUTO_REPAIR" = "true" ]; then
            auto_repair
        fi
    fi
    
    check_log_size
    
    log "🏥 Verificação de saúde concluída"
    echo "---" >> $LOG_FILE
}

# Mostrar estatísticas
show_stats() {
    echo "=== ESTATÍSTICAS DO SISTEMA ==="
    echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}')"
    echo "Memória: $(free -h | awk 'FNR==2{printf "Usado: %s / Total: %s (%.2f%%)\n", $3, $2, $3*100/$2}')"
    echo "Disco: $(df -h / | awk 'FNR==2{printf "Usado: %s / Total: %s (%s)\n", $3, $2, $5}')"
    echo "Uptime: $(uptime -p)"
    echo "Carga: $(uptime | awk -F'load average:' '{print $2}')"
    echo ""
    echo "=== SERVIÇOS DOCKER ==="
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
}

# Menu principal
show_menu() {
    echo ""
    echo "=== MONITOR SIQUEIRA CAMPOS IMÓVEIS ==="
    echo "1. Verificação completa"
    echo "2. Mostrar estatísticas"
    echo "3. Modo contínuo (a cada $CHECK_INTERVAL segundos)"
    echo "4. Auto-reparo"
    echo "5. Ver últimos alertas"
    echo "6. Limpar logs"
    echo "7. Sair"
    echo ""
}

# Ver últimos alertas
show_alerts() {
    if [ -f "${LOG_FILE}.alerts" ]; then
        echo "=== ÚLTIMOS ALERTAS ==="
        tail -20 "${LOG_FILE}.alerts"
    else
        echo "Nenhum alerta registrado"
    fi
}

# Limpar logs
clean_logs() {
    read -p "Tem certeza que deseja limpar os logs? (y/N): " confirm
    if [[ $confirm == [yY] ]]; then
        > "$LOG_FILE"
        > "${LOG_FILE}.alerts"
        log "🧹 Logs limpos"
    fi
}

# Modo contínuo
continuous_mode() {
    log "🔄 Iniciando modo de monitoramento contínuo..."
    echo "Pressione Ctrl+C para parar"
    
    while true; do
        health_check
        sleep $CHECK_INTERVAL
    done
}

# Função principal
main() {
    # Criar diretório de logs se não existir
    mkdir -p "$(dirname "$LOG_FILE")"
    
    # Se argumentos forem passados, executa diretamente
    case "${1:-}" in
        "check")
            health_check
            exit 0
            ;;
        "stats")
            show_stats
            exit 0
            ;;
        "continuous")
            continuous_mode
            exit 0
            ;;
        "repair")
            auto_repair
            exit 0
            ;;
    esac
    
    # Menu interativo
    while true; do
        show_menu
        read -p "Escolha uma opção: " choice
        
        case $choice in
            1)
                health_check
                ;;
            2)
                show_stats
                ;;
            3)
                continuous_mode
                ;;
            4)
                auto_repair
                ;;
            5)
                show_alerts
                ;;
            6)
                clean_logs
                ;;
            7)
                log "👋 Monitor finalizado"
                exit 0
                ;;
            *)
                echo "Opção inválida"
                ;;
        esac
        
        echo ""
        read -p "Pressione Enter para continuar..."
    done
}

# Executar
main "$@"
