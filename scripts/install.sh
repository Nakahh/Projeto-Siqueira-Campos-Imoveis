#!/bin/bash

################################################################################
#                                                                              #
#  ██╗  ██╗██████╗ ██╗   ██╗ ██████╗ ███╗   ██╗██╗██╗  ██╗                   #
#  ██║ ██╔╝██╔══██╗╚██╗ ██╔╝██╔═══██╗████╗  ██║██║╚██╗██╔╝                   #
#  █████╔╝ ██████╔╝ ╚████╔╝ ██║   ██║██╔██╗ ██║██║ ╚███╔╝                    #
#  ██╔═██╗ ██╔══██╗  ╚██╔╝  ██║   ██║██║╚██╗██║██║ ██╔██╗                    #
#  ██║  ██╗██║  ██║   ██║   ╚██████╔╝██║ ╚████║██║██╔╝ ██╗                   #
#  ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝                   #
#                                                                              #
#              🚀 SIQUEIRA CAMPOS IMÓVEIS - INSTALAÇÃO RÁPIDA 🚀              #
#                                                                              #
################################################################################

set -e

# Cores KRYONIX
KRYONIX_BLUE='\033[38;5;39m'
KRYONIX_BROWN='\033[38;5;94m'
KRYONIX_GOLD='\033[38;5;220m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'
BOLD='\033[1m'

# Informações do projeto
PROJECT_NAME="Siqueira Campos Imóveis"
KRYONIX_COMPANY="KRYONIX Tecnologia"
KRYONIX_WEBSITE="https://kryonix.com.br"
GITHUB_REPO="https://github.com/kryonix/siqueira-campos.git"

# Banner KRYONIX
show_banner() {
    clear
    echo -e "${KRYONIX_BLUE}${BOLD}"
    cat << 'EOF'
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │                                                                             │
    │  ██╗  ██╗██████╗ ██╗   ██╗ ██████╗ ███╗   ██╗██╗██╗  ██╗                  │
    │  ██║ ██╔╝██╔══██╗╚██╗ ██╔╝██╔═══██╗████╗  ██║██║╚██╗██╔╝                  │
    │  █████╔╝ █���████╔╝ ╚████╔╝ ██║   ██║██╔██╗ ██║██║ ╚███╔╝                   │
    │  ██╔═██╗ ██╔══██╗  ╚██╔╝  ██║   ██║██║╚██╗██║██║ ██╔██╗                   │
    │  ██║  ██╗██║  ██║   ██║   ╚██████╔╝██║ ╚████║██║██╔╝ ██╗                  │
    │  ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝                  │
    │                                                                             │
    │                           T E C N O L O G I A                              │
    │                                                                             │
    └─────────────────────────────────────────────────────────────────────────────┘
EOF
    echo -e "${NC}"
    echo -e "${KRYONIX_GOLD}${BOLD}              🏠 SIQUEIRA CAMPOS IMÓVEIS - INSTALAÇÃO RÁPIDA 🏠${NC}"
    echo -e "${KRYONIX_BROWN}                    Sistema Completo de Gestão Imobiliária${NC}"
    echo ""
    echo -e "${KRYONIX_BLUE}⚡ Instalação automática em poucos comandos ⚡${NC}"
    echo ""
}

log() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%H:%M:%S')
    
    case $level in
        "SUCCESS") echo -e "${GREEN}✅ [${timestamp}] ${message}${NC}" ;;
        "INFO")    echo -e "${KRYONIX_BLUE}ℹ️  [${timestamp}] ${message}${NC}" ;;
        "WARNING") echo -e "${YELLOW}⚠️  [${timestamp}] ${message}${NC}" ;;
        "ERROR")   echo -e "${RED}❌ [${timestamp}] ${message}${NC}" ;;
        "STEP")    echo -e "${KRYONIX_GOLD}${BOLD}🚀 [${timestamp}] ${message}${NC}" ;;
    esac
}

# Verificar se é Ubuntu/Debian
check_os() {
    if ! command -v lsb_release &> /dev/null; then
        log "ERROR" "Sistema não suportado. Use Ubuntu 20.04+ ou Debian 11+"
        exit 1
    fi
    
    local os_name=$(lsb_release -si)
    log "INFO" "Sistema detectado: ${os_name} $(lsb_release -sr)"
}

# Instalar Docker se não existir
install_docker() {
    if ! command -v docker &> /dev/null; then
        log "STEP" "Instalando Docker..."
        
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        rm get-docker.sh
        
        # Adicionar usuário ao grupo docker
        sudo usermod -aG docker $USER
        
        log "SUCCESS" "Docker instalado!"
    else
        log "INFO" "Docker já instalado: $(docker --version)"
    fi
}

# Instalar Docker Compose se não existir
install_docker_compose() {
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log "STEP" "Instalando Docker Compose..."
        
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        
        log "SUCCESS" "Docker Compose instalado!"
    else
        log "INFO" "Docker Compose já instalado"
    fi
}

# Instalar Git se não existir
install_git() {
    if ! command -v git &> /dev/null; then
        log "STEP" "Instalando Git..."
        sudo apt update && sudo apt install -y git
        log "SUCCESS" "Git instalado!"
    else
        log "INFO" "Git já instalado: $(git --version)"
    fi
}

# Clone do repositório
clone_project() {
    log "STEP" "Clonando projeto do GitHub..."
    
    local project_dir="siqueira-campos"
    
    if [ -d "$project_dir" ]; then
        log "WARNING" "Diretório já existe. Removendo..."
        rm -rf "$project_dir"
    fi
    
    git clone "$GITHUB_REPO" "$project_dir"
    cd "$project_dir"
    
    log "SUCCESS" "Projeto clonado!"
}

# Configurar ambiente
setup_environment() {
    log "STEP" "Configurando ambiente..."
    
    # Copiar arquivo de exemplo
    if [ -f ".env.example" ]; then
        cp .env.example .env
        log "INFO" "Arquivo .env criado a partir do exemplo"
    fi
    
    # Criar diretórios necessários
    mkdir -p uploads backups logs
    
    log "SUCCESS" "Ambiente configurado!"
}

# Iniciar containers
start_containers() {
    log "STEP" "Iniciando containers Docker..."
    
    # Build e start
    docker-compose up -d --build
    
    log "SUCCESS" "Containers iniciados!"
    
    # Aguardar serviços ficarem prontos
    log "INFO" "Aguardando serviços ficarem prontos..."
    sleep 30
    
    # Executar migrações
    log "STEP" "Executando migrações do banco..."
    docker-compose exec -T app npm run db:migrate
    
    # Executar seed
    log "STEP" "Populando banco com dados de exemplo..."
    docker-compose exec -T app npm run db:seed
    
    log "SUCCESS" "Sistema configurado com dados de exemplo!"
}

# Verificar saúde do sistema
check_health() {
    log "STEP" "Verificando saúde do sistema..."
    
    local health_url="http://localhost:3001/api/health"
    local max_attempts=10
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$health_url" &> /dev/null; then
            log "SUCCESS" "Sistema funcionando corretamente!"
            return 0
        else
            log "INFO" "Tentativa $attempt/$max_attempts - Aguardando sistema..."
            sleep 5
            ((attempt++))
        fi
    done
    
    log "WARNING" "Sistema pode não estar totalmente pronto"
}

# Mostrar informações finais
show_completion() {
    echo ""
    echo -e "${KRYONIX_GOLD}${BOLD}┌─────────────────────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${KRYONIX_GOLD}${BOLD}│                     🎉 INSTALAÇÃO CONCLUÍDA! 🎉                           │${NC}"
    echo -e "${KRYONIX_GOLD}${BOLD}└─────────────────────────────────────────────────────────────────────────────┘${NC}"
    echo ""
    echo -e "${KRYONIX_BLUE}${BOLD}🌐 Sistema disponível em:${NC}"
    echo -e "   ${KRYONIX_GOLD}•${NC} Principal: http://localhost:3001"
    echo -e "   ${KRYONIX_GOLD}•${NC} Status: http://localhost:3001/status"
    echo ""
    echo -e "${KRYONIX_BLUE}${BOLD}👥 Usuários de teste:${NC}"
    echo -e "   ${KRYONIX_GOLD}•${NC} Admin: admin@siqueicamposimoveis.com.br (senha: 123456)"
    echo -e "   ${KRYONIX_GOLD}•${NC} Corretor: ana@siqueicamposimoveis.com.br (senha: 123456)"
    echo -e "   ${KRYONIX_GOLD}•${NC} Cliente: joao@cliente.com (senha: 123456)"
    echo ""
    echo -e "${KRYONIX_BLUE}${BOLD}🛠️ Comandos úteis:${NC}"
    echo -e "   ${KRYONIX_GOLD}•${NC} Ver logs: docker-compose logs -f"
    echo -e "   ${KRYONIX_GOLD}•${NC} Parar: docker-compose down"
    echo -e "   ${KRYONIX_GOLD}•${NC} Reiniciar: docker-compose restart"
    echo -e "   ${KRYONIX_GOLD}•${NC} Backup: npm run backup"
    echo ""
    echo -e "${KRYONIX_BROWN}${BOLD}📞 Suporte KRYONIX:${NC}"
    echo -e "   ${KRYONIX_GOLD}•${NC} Website: ${KRYONIX_WEBSITE}"
    echo -e "   ${KRYONIX_GOLD}•${NC} Email: contato@kryonix.com.br"
    echo -e "   ${KRYONIX_GOLD}•${NC} WhatsApp: (62) 99999-9999"
    echo ""
    echo -e "${KRYONIX_BLUE}Obrigado por escolher a KRYONIX Tecnologia! 🚀${NC}"
    echo ""
}

# Função principal
main() {
    show_banner
    
    log "STEP" "Iniciando instalação do ${PROJECT_NAME}..."
    
    # Verificações e instalações
    check_os
    install_git
    install_docker
    install_docker_compose
    
    # Setup do projeto
    clone_project
    setup_environment
    start_containers
    check_health
    
    # Finalização
    show_completion
    
    log "SUCCESS" "Instalação completa! Sistema pronto para uso! 🎉"
}

# Trap para interrupções
trap 'log "ERROR" "Instalação interrompida"; exit 1' INT TERM

# Executar
main "$@"
