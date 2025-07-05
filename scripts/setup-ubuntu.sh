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
#                    SIQUEIRA CAMPOS IMÓVEIS - SETUP CORRIGIDO                #
#                                                                              #
#  📱 Sistema Completo de Gestão Imobiliária                                   #
#  🏗️  Desenvolvido por: KRYONIX Tecnologia                                    #
#  🌐 Website: https://kryonix.com.br                                          #
#  📧 Contato: contato@kryonix.com.br                                          #
#  📞 WhatsApp: (17) 98180-5327                                               #
#                                                                              #
#  ✅ VERSÃO CORRIGIDA - SEM ERROS DE CONEXÃO                                  #
#                                                                              #
################################################################################

set -e

# Cores KRYONIX
readonly KRYONIX_BLUE='\033[38;5;39m'
readonly KRYONIX_BROWN='\033[38;5;94m'
readonly KRYONIX_GOLD='\033[38;5;220m'
readonly KRYONIX_SUCCESS='\033[38;5;46m'
readonly KRYONIX_WARNING='\033[38;5;214m'
readonly KRYONIX_ERROR='\033[38;5;196m'
readonly NC='\033[0m'
readonly BOLD='\033[1m'

# Informações do projeto
readonly PROJECT_NAME="Siqueira Campos Imóveis"
readonly PROJECT_VERSION="1.0.0"
readonly COMPANY_NAME="KRYONIX Tecnologia"
readonly COMPANY_WEBSITE="https://kryonix.com.br"
readonly COMPANY_EMAIL="contato@kryonix.com.br"
readonly COMPANY_PHONE="(17) 98180-5327"

# Banner KRYONIX
show_banner() {
    clear
    echo -e "${KRYONIX_BLUE}${BOLD}"
    cat << 'EOF'
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │                                                                             │
    │  ██╗  ██╗██████╗ ██╗   ██╗ ██████╗ ███╗   ██╗██╗██╗  ██╗                  │
    │  ██║ ██╔╝██╔══██╗╚██╗ ██╔╝██╔═══██╗████╗  ██║██║╚██╗█��╔╝                  │
    │  █████╔╝ ██████╔╝ ╚████╔╝ ██║   ██║██╔██╗ ██║██║ ╚███╔╝                   │
    │  ██╔═██╗ ██╔══██╗  ╚██╔╝  ██║   ██║██║╚██╗██║██║ ██╔██╗                   │
    │  ██║  ██╗██║  ██║   ██║   ╚██████╔╝██║ ╚████║██║██╔╝ ██╗                  │
    │  ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝                  │
    │                                                                             │
    │                           T E C N O L O G I A                              │
    │                                                                             │
    └─────────────────────────────────────────────────────────────────────────────┘
EOF
    echo -e "${NC}"
    echo -e "${KRYONIX_GOLD}${BOLD}              🏠 SIQUEIRA CAMPOS IMÓVEIS - SETUP AUTOMÁTICO 🏠${NC}"
    echo -e "${KRYONIX_BROWN}                     Sistema de Gestão Imobiliária${NC}"
    echo -e "${KRYONIX_SUCCESS}                     ✅ VERSÃO CORRIGIDA SEM ERROS${NC}"
    echo ""
}

log() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%H:%M:%S')
    
    case $level in
        "SUCCESS") echo -e "${KRYONIX_SUCCESS}✅ [${timestamp}] ${message}${NC}" ;;
        "INFO")    echo -e "${KRYONIX_BLUE}ℹ️  [${timestamp}] ${message}${NC}" ;;
        "WARNING") echo -e "${KRYONIX_WARNING}⚠️  [${timestamp}] ${message}${NC}" ;;
        "ERROR")   echo -e "${KRYONIX_ERROR}❌ [${timestamp}] ${message}${NC}" ;;
        "STEP")    echo -e "${KRYONIX_GOLD}${BOLD}🚀 [${timestamp}] ${message}${NC}" ;;
    esac
}

# Verificar sistema
check_system() {
    log "STEP" "Verificando sistema..."
    
    if ! command -v curl &> /dev/null; then
        log "ERROR" "curl não encontrado. Instalando..."
        apt update && apt install -y curl
    fi
    
    log "SUCCESS" "Sistema verificado"
}

# Instalar Node.js
install_nodejs() {
    if command -v node &> /dev/null; then
        log "INFO" "Node.js já instalado: $(node --version)"
        return 0
    fi
    
    log "STEP" "Instalando Node.js 18..."
    
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
    
    log "SUCCESS" "Node.js instalado: $(node --version)"
}

# Instalar Docker
install_docker() {
    if command -v docker &> /dev/null; then
        log "INFO" "Docker já instalado: $(docker --version)"
        return 0
    fi
    
    log "STEP" "Instalando Docker..."
    
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    
    systemctl enable docker
    systemctl start docker
    
    log "SUCCESS" "Docker instalado: $(docker --version)"
}

# Configurar projeto
setup_project() {
    log "STEP" "Configurando projeto Siqueira Campos..."
    
    # Criar diretórios
    mkdir -p /opt/siqueira-campos
    mkdir -p /var/log/siqueira-campos
    mkdir -p /backups/siqueira-campos
    
    # Configurar .env para produção
    cat > /opt/siqueira-campos/.env << 'EOF'
# Configurações de Produção - Siqueira Campos Imóveis
NODE_ENV=production
DATABASE_URL="file:/opt/siqueira-campos/production.db"
JWT_SECRET=siqueira_producao_jwt_super_seguro_2024
PORT=3001
DOMAIN=siqueicamposimoveis.com.br

# Configure suas chaves de API
OPENAI_API_KEY=sua_chave_openai_aqui
GOOGLE_MAPS_API_KEY=sua_chave_google_maps_aqui

# Email SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=siqueiraecamposimoveisgoiania@gmail.com
EMAIL_PASS=sua_senha_email_aqui

# Informações da Empresa
EMPRESA_NOME="Siqueira Campos Imóveis"
EMPRESA_WHATSAPP="(62) 9 8556-3505"
EMPRESA_EMAIL="SiqueiraCamposImoveisGoiania@gmail.com"
EOF
    
    log "SUCCESS" "Projeto configurado"
}

# Menu principal
show_menu() {
    echo ""
    echo -e "${KRYONIX_BLUE}${BOLD}┌─────────────────────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${KRYONIX_BLUE}${BOLD}│                        🛠️  INSTALAÇÃO CORRIGIDA                             │${NC}"
    echo -e "${KRYONIX_BLUE}${BOLD}└─────────────────────────────────────────────────────────────────────────────┘${NC}"
    echo ""
    echo -e "${KRYONIX_SUCCESS}1.${NC} 🚀 Instalação Completa (Recomendado)"
    echo -e "${KRYONIX_SUCCESS}2.${NC} 📦 Apenas Node.js"
    echo -e "${KRYONIX_SUCCESS}3.${NC} 🐳 Apenas Docker"
    echo -e "${KRYONIX_SUCCESS}4.${NC} ⚙️  Configurar Projeto"
    echo -e "${KRYONIX_SUCCESS}5.${NC} ❌ Sair"
    echo ""
}

# Instalação completa
full_installation() {
    log "STEP" "Iniciando instalação completa..."
    
    check_system
    install_nodejs
    install_docker
    setup_project
    
    log "SUCCESS" "Instalação completa!"
    show_completion
}

# Tela de conclusão
show_completion() {
    echo ""
    echo -e "${KRYONIX_SUCCESS}${BOLD}┌─────────────────────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${KRYONIX_SUCCESS}${BOLD}│                     🎉 INSTALAÇÃO CONCLUÍDA! 🎉                           │${NC}"
    echo -e "${KRYONIX_SUCCESS}${BOLD}└─────────────────────────────────────────────────────────────────────────────┘${NC}"
    echo ""
    echo -e "${KRYONIX_BLUE}${BOLD}🚀 PRÓXIMOS PASSOS:${NC}"
    echo ""
    echo -e "${KRYONIX_GOLD}1.${NC} Clone o projeto:"
    echo -e "   ${KRYONIX_BLUE}git clone https://github.com/kryonix/siqueira-campos.git${NC}"
    echo ""
    echo -e "${KRYONIX_GOLD}2.${NC} Configure o ambiente:"
    echo -e "   ${KRYONIX_BLUE}cd siqueira-campos${NC}"
    echo -e "   ${KRYONIX_BLUE}cp .env.example .env${NC}"
    echo ""
    echo -e "${KRYONIX_GOLD}3.${NC} Execute o sistema:"
    echo -e "   ${KRYONIX_BLUE}npm install${NC}"
    echo -e "   ${KRYONIX_BLUE}npm run db:push${NC}"
    echo -e "   ${KRYONIX_BLUE}npm run db:seed${NC}"
    echo -e "   ${KRYONIX_BLUE}npm run dev${NC}"
    echo ""
    echo -e "${KRYONIX_BROWN}${BOLD}📞 Suporte KRYONIX:${NC}"
    echo -e "   🌐 Website: ${COMPANY_WEBSITE}"
    echo -e "   📧 Email: ${COMPANY_EMAIL}"
    echo -e "   📱 WhatsApp: ${COMPANY_PHONE}"
    echo ""
}

# Função principal
main() {
    while true; do
        show_banner
        show_menu
        
        read -p "Escolha uma opção: " choice
        
        case $choice in
            1)
                full_installation
                break
                ;;
            2)
                install_nodejs
                ;;
            3)
                install_docker
                ;;
            4)
                setup_project
                ;;
            5)
                log "INFO" "Saindo..."
                exit 0
                ;;
            *)
                log "WARNING" "Opção inválida"
                sleep 2
                ;;
        esac
        
        echo ""
        read -p "Pressione Enter para continuar..."
    done
}

# Verificar se é root
if [[ $EUID -ne 0 ]]; then
    echo -e "${KRYONIX_ERROR}Este script deve ser executado como root${NC}"
    echo -e "${KRYONIX_INFO}Execute: sudo $0${NC}"
    exit 1
fi

# Executar
main "$@"
