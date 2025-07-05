#!/bin/bash

################################################################################
#                                                                              #
#  ██╗  ██╗██████╗ ██╗   ██╗ ██████╗ ███╗   ██╗██╗██╗  ██╗                   #
#  ██║ ██╔╝██╔══██╗╚██╗ ██╔╝██╔═══██╗████╗  ██║██║╚██╗██╔╝                   #
#  █████╔╝ ██████╔╝ ╚████╔╝ ██║   ██║██╔██╗ ██║██║ ╚█��█╔╝                    #
#  ██╔═██╗ ██╔══██╗  ╚██╔╝  ██║   ██║██║╚██╗██║██║ ██╔██╗                    #
#  ██║  ██╗██║  ██║   ██║   ╚██████╔╝██║ ╚████║██║██╔╝ ██╗                   #
#  ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝                   #
#                                                                              #
#                🚀 SIQUEIRA CAMPOS IMÓVEIS - DEPLOY AUTOMÁTICO 🚀            #
#                                                                              #
#                    Desenvolvido por KRYONIX Tecnologia                      #
#                        https://kryonix.com.br                               #
#                                                                              #
################################################################################

set -e

# ═══════════════════════════════════════════════════════════════════════════════
# 🎨 CONFIGURAÇÕES DE CORES E IDENTIDADE VISUAL KRYONIX
# ═══════════════════════════════════════════════════════════════════════════════

readonly KRYONIX_PRIMARY='\033[38;5;39m'      # Azul KRYONIX
readonly KRYONIX_SECONDARY='\033[38;5;94m'    # Marrom Siqueira
readonly KRYONIX_ACCENT='\033[38;5;220m'      # Dourado
readonly KRYONIX_SUCCESS='\033[38;5;46m'      # Verde
readonly KRYONIX_WARNING='\033[38;5;214m'     # Laranja
readonly KRYONIX_ERROR='\033[38;5;196m'       # Vermelho
readonly KRYONIX_INFO='\033[38;5;45m'         # Ciano
readonly NC='\033[0m'
readonly BOLD='\033[1m'
readonly DIM='\033[2m'
readonly UNDERLINE='\033[4m'

# ═══════════════════════════════════════════════════════════════════════════════
# 🏢 INFORMAÇÕES DA EMPRESA E PROJETO
# ═════════════════════════════════════════════════════════════════════════��═════

readonly PROJECT_NAME="Siqueira Campos Imóveis"
readonly PROJECT_VERSION="1.0.0"
readonly COMPANY_NAME="KRYONIX Tecnologia"
readonly COMPANY_WEBSITE="https://kryonix.com.br"
readonly COMPANY_EMAIL="contato@kryonix.com.br"
readonly COMPANY_PHONE="(62) 99999-9999"
readonly SUPPORT_CHAT="https://wa.me/5562999999999"

# ═══════════════════════════════════════════════════════════════════════════════
# ⚙️ CONFIGURAÇÕES DE DEPLOY
# ═══════════════════════════════════════════════════════════════════════════════

readonly DEPLOY_ENV=${1:-production}
readonly BACKUP_BEFORE_DEPLOY=${BACKUP_BEFORE_DEPLOY:-true}
readonly RUN_MIGRATIONS=${RUN_MIGRATIONS:-true}
readonly RESTART_SERVICES=${RESTART_SERVICES:-true}
readonly HEALTH_CHECK_TIMEOUT=300
readonly LOG_FILE="/var/log/siqueira-deploy.log"

# ══════════════════════════════════════════════════════════���════════════════════
# 🎭 FUNÇÕES DE INTERFACE VISUAL
# ═══════════════════════════════════════════════════════════════════════════════

# Banner principal com logo KRYONIX
show_kryonix_banner() {
    clear
    echo -e "${KRYONIX_PRIMARY}${BOLD}"
    cat << 'EOF'
    ╔══════════════════════════════════════════════════════════════════════════════╗
    ║                                                                              ║
    ║  ██╗  ██╗██████╗ ██╗   ██╗ ██████╗ ███╗   ██╗██╗██╗  ██╗                   ║
    ║  ██║ ██╔╝██╔══██╗╚██╗ ██╔╝██╔═══██╗████╗  ██║██║╚██╗██╔╝                   ║
    ║  █████╔╝ ██████╔╝ ╚████╔╝ ██║   ██║██╔██╗ ██║██║ ╚███╔╝                    ║
    ║  ██╔═██╗ ██╔══██╗  ╚██╔╝  ██║   ██║██║╚██╗██║██║ ██╔██╗                    ║
    ║  ██║  ██╗██║  ██║   ██║   ╚██████╔╝██║ ╚████║██║██╔╝ ██╗                   ║
    ║  ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝                   ║
    ║                                                                              ║
    ║                           T E C N O L O G I A                               ║
    ║                                                                              ║
    ╚══════════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    echo -e "${KRYONIX_ACCENT}${BOLD}                   🏠 SIQUEIRA CAMPOS IMÓVEIS 🏠${NC}"
    echo -e "${KRYONIX_SECONDARY}                     Deploy Automático - v${PROJECT_VERSION}${NC}"
    echo -e "${KRYONIX_INFO}                       Ambiente: ${DEPLOY_ENV^^}${NC}"
    echo ""
    
    echo -e "${KRYONIX_PRIMARY}┌─────────────────────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${KRYONIX_PRIMARY}│${NC} ${BOLD}🏗️  Desenvolvido por:${NC} ${COMPANY_NAME}                                        ${KRYONIX_PRIMARY}│${NC}"
    echo -e "${KRYONIX_PRIMARY}│${NC} ${BOLD}🌐 Website:${NC} ${COMPANY_WEBSITE}                                          ${KRYONIX_PRIMARY}│${NC}"
    echo -e "${KRYONIX_PRIMARY}│${NC} ${BOLD}📧 Suporte:${NC} ${COMPANY_EMAIL}                                      ${KRYONIX_PRIMARY}│${NC}"
    echo -e "${KRYONIX_PRIMARY}│${NC} ${BOLD}📱 WhatsApp:${NC} ${COMPANY_PHONE}                                         ${KRYONIX_PRIMARY}│${NC}"
    echo -e "${KRYONIX_PRIMARY}└─────────────────────────────────────────────────────────────────────────────┘${NC}"
    echo ""
}

# Log formatado com timestamp
log() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "SUCCESS")
            echo -e "${KRYONIX_SUCCESS}${BOLD}✅ [${timestamp}] ${message}${NC}"
            ;;
        "INFO")
            echo -e "${KRYONIX_INFO}ℹ️  [${timestamp}] ${message}${NC}"
            ;;
        "WARNING")
            echo -e "${KRYONIX_WARNING}⚠️  [${timestamp}] ${message}${NC}"
            ;;
        "ERROR")
            echo -e "${KRYONIX_ERROR}${BOLD}❌ [${timestamp}] ${message}${NC}"
            ;;
        "STEP")
            echo -e "${KRYONIX_ACCENT}${BOLD}🚀 [${timestamp}] ${message}${NC}"
            ;;
        "DEPLOY")
            echo -e "${KRYONIX_PRIMARY}${BOLD}🎯 [${timestamp}] ${message}${NC}"
            ;;
    esac
    
    # Log para arquivo
    echo "[${timestamp}] [${level}] ${message}" >> "$LOG_FILE"
}

# Barra de progresso estilizada
show_progress() {
    local current=$1
    local total=$2
    local message=$3
    local width=50
    
    local percentage=$((current * 100 / total))
    local filled=$((current * width / total))
    local empty=$((width - filled))
    
    printf "\r${KRYONIX_ACCENT}${BOLD}["
    printf "%*s" $filled | tr ' ' '█'
    printf "%*s" $empty | tr ' ' '░'
    printf "] ${percentage}%% ${NC}- ${KRYONIX_INFO}${message}${NC}"
    
    if [ $current -eq $total ]; then
        echo ""
    fi
}

# Spinner animado
spinner() {
    local pid=$1
    local message=$2
    local chars="⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
    local delay=0.1
    
    while kill -0 $pid 2>/dev/null; do
        for char in $(echo $chars | grep -o .); do
            printf "\r${KRYONIX_INFO}${char} ${message}${NC}"
            sleep $delay
        done
    done
    printf "\r${KRYONIX_SUCCESS}✅ ${message} ${NC}- ${KRYONIX_SUCCESS}Concluído${NC}\n"
}

# ═══════════════════════════════════════════════════════════════════════════════
# 🔍 VALIDAÇÕES E VERIFICAÇÕES
# ═══════════════════════════════════════════════════════════════════════════════

# Verificar pré-requisitos
check_prerequisites() {
    log "STEP" "Verificando pré-requisitos do sistema..."
    
    local missing_tools=()
    
    # Docker
    if ! command -v docker &> /dev/null; then
        missing_tools+=("docker")
    fi
    
    # Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        missing_tools+=("docker-compose")
    fi
    
    # Git
    if ! command -v git &> /dev/null; then
        missing_tools+=("git")
    fi
    
    # jq para manipular JSON
    if ! command -v jq &> /dev/null; then
        missing_tools+=("jq")
    fi
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        log "ERROR" "Ferramentas necessárias não encontradas: ${missing_tools[*]}"
        log "INFO" "Execute o script de setup primeiro: bash scripts/setup-ubuntu.sh"
        exit 1
    fi
    
    # Verificar arquivo de ambiente
    if [ ! -f ".env.${DEPLOY_ENV}" ]; then
        log "ERROR" "Arquivo .env.${DEPLOY_ENV} não encontrado"
        log "INFO" "Crie o arquivo baseado em .env.example"
        exit 1
    fi
    
    # Verificar Docker daemon
    if ! docker info &> /dev/null; then
        log "ERROR" "Docker daemon não está rodando"
        log "INFO" "Execute: sudo systemctl start docker"
        exit 1
    fi
    
    log "SUCCESS" "Todos os pré-requisitos verificados ✓"
}

# Verificar integridade do código
check_code_integrity() {
    log "STEP" "Verificando integridade do código..."
    
    # Verificar se estamos em um repositório Git
    if ! git rev-parse --git-dir &> /dev/null; then
        log "WARNING" "Não é um repositório Git válido"
        return 0
    fi
    
    # Verificar branch atual
    local current_branch=$(git branch --show-current)
    log "INFO" "Branch atual: ${current_branch}"
    
    # Verificar se há mudanças não commitadas
    if ! git diff-index --quiet HEAD --; then
        log "WARNING" "Há mudanças não commitadas no código"
        log "INFO" "Arquivos modificados:"
        git diff --name-only | sed 's/^/  - /'
    fi
    
    # Verificar último commit
    local last_commit=$(git log -1 --format="%h - %s (%an, %ar)")
    log "INFO" "Último commit: ${last_commit}"
    
    log "SUCCESS" "Integridade do código verificada ✓"
}

# ═══════════════════════════════════════════════════════════════════════════════
# 💾 BACKUP E SEGURANÇA
# ═══════════════════════════════════════════════════════════════════════════════

# Backup antes do deploy
backup_before_deploy() {
    if [ "$BACKUP_BEFORE_DEPLOY" != "true" ]; then
        log "INFO" "Backup antes do deploy desabilitado"
        return 0
    fi
    
    log "STEP" "Executando backup antes do deploy..."
    
    if [ -f "scripts/backup.sh" ]; then
        {
            bash scripts/backup.sh
        } &
        spinner $! "Criando backup de segurança"
        
        if [ $? -eq 0 ]; then
            log "SUCCESS" "Backup de segurança criado ✓"
        else
            log "WARNING" "Falha no backup - continuando deploy"
        fi
    else
        log "WARNING" "Script de backup não encontrado"
    fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# 🔄 FUNÇÕES DE DEPLOY
# ═══════════════════════════════════════════════════════════════════════════════

# Atualizar código do repositório
update_code() {
    log "STEP" "Atualizando código do repositório..."
    
    if git rev-parse --git-dir &> /dev/null; then
        {
            git fetch origin
            git pull origin main
        } &
        spinner $! "Sincronizando com repositório"
        
        # Verificar se houve mudanças
        local changes=$(git diff HEAD~1 HEAD --name-only | wc -l)
        if [ $changes -gt 0 ]; then
            log "INFO" "Detectadas ${changes} mudanças no código"
            git diff HEAD~1 HEAD --name-only | sed 's/^/  - /'
        else
            log "INFO" "Nenhuma mudança detectada no código"
        fi
    else
        log "INFO" "Não é um repositório Git - pulando atualização"
    fi
    
    log "SUCCESS" "Código atualizado ✓"
}

# Build das imagens Docker
build_images() {
    log "STEP" "Construindo imagens Docker..."
    
    local compose_file="docker-compose.yml"
    if [ "$DEPLOY_ENV" = "production" ]; then
        compose_file="docker-compose.prod.yml"
    fi
    
    {
        docker-compose -f "$compose_file" build --no-cache
    } &
    spinner $! "Compilando aplicação"
    
    # Limpar imagens órfãs
    {
        docker image prune -f
    } &
    spinner $! "Limpando imagens órfãs"
    
    log "SUCCESS" "Imagens construídas ✓"
}

# Executar migrações do banco
run_migrations() {
    if [ "$RUN_MIGRATIONS" != "true" ]; then
        log "INFO" "Migrações desabilitadas"
        return 0
    fi
    
    log "STEP" "Executando migrações do banco de dados..."
    
    local compose_file="docker-compose.yml"
    if [ "$DEPLOY_ENV" = "production" ]; then
        compose_file="docker-compose.prod.yml"
    fi
    
    # Aguardar banco estar disponível
    {
        timeout 60 bash -c 'until docker-compose exec -T postgres pg_isready; do sleep 2; done'
    } &
    spinner $! "Aguardando banco de dados"
    
    # Executar migrações
    {
        docker-compose -f "$compose_file" exec -T app npx prisma migrate deploy
    } &
    spinner $! "Aplicando migrações"
    
    if [ $? -eq 0 ]; then
        log "SUCCESS" "Migrações executadas ✓"
    else
        log "ERROR" "Falha nas migrações"
        return 1
    fi
}

# Deploy dos serviços
deploy_services() {
    log "STEP" "Fazendo deploy dos serviços..."
    
    local compose_file="docker-compose.yml"
    if [ "$DEPLOY_ENV" = "production" ]; then
        compose_file="docker-compose.prod.yml"
    fi
    
    # Copiar arquivo de ambiente
    cp ".env.${DEPLOY_ENV}" .env
    log "INFO" "Arquivo de ambiente configurado: .env.${DEPLOY_ENV}"
    
    # Parar serviços existentes
    {
        docker-compose -f "$compose_file" down
    } &
    spinner $! "Parando serviços existentes"
    
    # Iniciar novos serviços
    {
        docker-compose -f "$compose_file" up -d
    } &
    spinner $! "Iniciando novos serviços"
    
    log "SUCCESS" "Serviços deployados ✓"
}

# Verificar saúde dos serviços
health_check() {
    log "STEP" "Verificando saúde dos serviços..."
    
    local health_url="http://localhost:3001/api/status/health"
    local max_attempts=$((HEALTH_CHECK_TIMEOUT / 10))
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$health_url" | jq -e '.status == "healthy"' &> /dev/null; then
            log "SUCCESS" "Aplicação respondendo corretamente ✓"
            break
        else
            show_progress $attempt $max_attempts "Aguardando aplicação ficar pronta"
            sleep 10
            ((attempt++))
        fi
    done
    
    if [ $attempt -gt $max_attempts ]; then
        log "ERROR" "Aplicação não respondeu dentro do tempo limite"
        return 1
    fi
    
    # Verificar outros serviços
    log "INFO" "Verificando status dos containers..."
    
    local services=("postgres" "redis" "app")
    for service in "${services[@]}"; do
        if docker ps --format "table {{.Names}}" | grep -q "$service"; then
            log "SUCCESS" "${service}: ✓ Online"
        else
            log "WARNING" "${service}: ✗ Offline"
        fi
    done
}

# ═══════════════════════════════════════════════════════════════════════════════
# 🧹 LIMPEZA E OTIMIZAÇÃO
# ═══════════════════════════════════════════════════════════════════════════════

cleanup() {
    log "STEP" "Executando limpeza do sistema..."
    
    {
        # Remover imagens órfãs
        docker image prune -f
        
        # Remover volumes órfãos
        docker volume prune -f
        
        # Remover redes órfãs
        docker network prune -f
        
        # Limpar cache do sistema
        docker system prune -f
    } &
    spinner $! "Otimizando recursos"
    
    log "SUCCESS" "Limpeza concluída ✓"
}

# ═══════════════════════════════════════════════════════════════════════════════
# 🔄 ROLLBACK E RECUPERAÇÃO
# ═══════════════════════════════════════════════════════════════════════════════

rollback() {
    log "ERROR" "Deploy falhou - executando rollback..."
    
    if git rev-parse --git-dir &> /dev/null; then
        {
            git reset --hard HEAD~1
        } &
        spinner $! "Revertendo código"
        
        # Rebuild e redeploy
        build_images
        deploy_services
        
        log "SUCCESS" "Rollback executado ✓"
    else
        log "WARNING" "Rollback automático não disponível (não é um repositório Git)"
    fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# 📢 NOTIFICAÇÕES
# ═══════════════════════════════════════════════════════════════════════════════

notify_deploy() {
    local status=$1
    local duration=$2
    local message="🚀 Deploy Siqueira Campos: $status"
    
    if [ -n "$duration" ]; then
        message="${message} (${duration}s)"
    fi
    
    # Webhook (Slack, Discord, etc.)
    if [ -n "$WEBHOOK_URL" ]; then
        curl -X POST "$WEBHOOK_URL" \
            -H "Content-Type: application/json" \
            -d "{\"text\":\"$message\"}" \
            2>/dev/null || true
    fi
    
    # Email
    if [ -n "$ALERT_EMAIL" ] && command -v mail &> /dev/null; then
        echo "$message" | mail -s "Deploy Siqueira Campos" "$ALERT_EMAIL" || true
    fi
    
    log "INFO" "Notificação enviada: $status"
}

# ═══════════════════════════════════════════════════════════════════════════════
# 🎯 TELA DE CONCLUSÃO
# ═══════════════════════════════════════════════════════════════════════════════

show_completion() {
    local duration=$1
    
    clear
    echo -e "${KRYONIX_SUCCESS}${BOLD}"
    cat << 'EOF'
    ╔══════════════════════════════════════════════════════════════════════════════╗
    ║                                                                              ║
    ║    🎉  DEPLOY CONCLUÍDO COM SUCESSO!  🎉                                    ║
    ║                                                                              ║
    ║    Sistema Siqueira Campos Imóveis atualizado e funcionando!                ║
    ║                                                                              ║
    ╚══════════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    echo -e "${KRYONIX_INFO}${BOLD}📊 RESUMO DO DEPLOY:${NC}"
    echo -e "   ${KRYONIX_ACCENT}•${NC} Ambiente: ${DEPLOY_ENV^^}"
    echo -e "   ${KRYONIX_ACCENT}•${NC} Duração: ${duration}s"
    echo -e "   ${KRYONIX_ACCENT}•${NC} Data: $(date '+%d/%m/%Y %H:%M:%S')"
    if git rev-parse --git-dir &> /dev/null; then
        echo -e "   ${KRYONIX_ACCENT}•${NC} Commit: $(git rev-parse --short HEAD)"
    fi
    echo ""
    
    echo -e "${KRYONIX_INFO}${BOLD}🌐 URLS DISPONÍVEIS:${NC}"
    echo -e "   ${KRYONIX_ACCENT}•${NC} Principal: https://${DOMAIN:-localhost}"
    echo -e "   ${KRYONIX_ACCENT}•${NC} Admin: https://admin.${DOMAIN:-localhost}"
    echo -e "   ${KRYONIX_ACCENT}•${NC} Status: https://${DOMAIN:-localhost}/status"
    echo -e "   ${KRYONIX_ACCENT}•${NC} API: https://${DOMAIN:-localhost}/api"
    echo ""
    
    echo -e "${KRYONIX_INFO}${BOLD}🛠️ COMANDOS ÚTEIS:${NC}"
    echo -e "   ${KRYONIX_ACCENT}•${NC} Ver logs: docker-compose logs -f"
    echo -e "   ${KRYONIX_ACCENT}•${NC} Status: bash scripts/monitor.sh"
    echo -e "   ${KRYONIX_ACCENT}•${NC} Backup: bash scripts/backup.sh"
    echo -e "   ${KRYONIX_ACCENT}•${NC} Restart: docker-compose restart"
    echo ""
    
    echo -e "${KRYONIX_PRIMARY}${BOLD}📞 SUPORTE KRYONIX:${NC}"
    echo -e "   ${KRYONIX_ACCENT}•${NC} Website: ${COMPANY_WEBSITE}"
    echo -e "   ${KRYONIX_ACCENT}•${NC} Email: ${COMPANY_EMAIL}"
    echo -e "   ${KRYONIX_ACCENT}•${NC} WhatsApp: ${COMPANY_PHONE}"
    echo ""
    
    echo -e "${KRYONIX_SECONDARY}${BOLD}Obrigado por confiar na KRYONIX Tecnologia! 🚀${NC}"
    echo ""
}

# ═══════════════════════════════════════════════════════════════════════════════
# 🚀 FUNÇÃO PRINCIPAL
# ═══════════════════════════════════════════════════════════════════════════════

main() {
    local start_time=$(date +%s)
    
    # Criar log se não existir
    mkdir -p "$(dirname "$LOG_FILE")"
    touch "$LOG_FILE"
    
    # Banner inicial
    show_kryonix_banner
    
    # Log inicial
    log "DEPLOY" "Iniciando deploy para ambiente: ${DEPLOY_ENV^^}"
    log "INFO" "Desenvolvido por: ${COMPANY_NAME}"
    log "INFO" "Projeto: ${PROJECT_NAME} v${PROJECT_VERSION}"
    
    # Executar etapas do deploy
    if check_prerequisites && \
       check_code_integrity && \
       backup_before_deploy && \
       update_code && \
       build_images && \
       deploy_services && \
       run_migrations && \
       health_check; then
        
        # Deploy bem-sucedido
        cleanup
        
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        
        log "SUCCESS" "Deploy concluído com sucesso em ${duration}s ✓"
        notify_deploy "✅ SUCESSO" "$duration"
        
        show_completion "$duration"
        
    else
        # Deploy falhou
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        
        rollback
        notify_deploy "❌ FALHA" "$duration"
        
        log "ERROR" "Deploy falhou após ${duration}s"
        exit 1
    fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# 🎬 EXECUÇÃO
# ═══════════════════════════════════════════════════════════════════════════════

# Trap para capturar interrupções
trap 'log "ERROR" "Deploy interrompido pelo usuário"; exit 1' INT TERM

# Validar argumentos
if [[ ! "$DEPLOY_ENV" =~ ^(development|staging|production)$ ]]; then
    echo -e "${KRYONIX_ERROR}Ambiente inválido: $DEPLOY_ENV${NC}"
    echo -e "${KRYONIX_INFO}Use: development, staging ou production${NC}"
    exit 1
fi

# Executar função principal
main "$@"

################################################################################
#                                                                              #
#                    🏗️  DESENVOLVIDO POR KRYONIX TECNOLOGIA                   #
#                         https://kryonix.com.br                              #
#                                                                              #
################################################################################
