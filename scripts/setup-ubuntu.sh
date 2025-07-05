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
#                    SIQUEIRA CAMPOS IMÓVEIS - SETUP AUTOMÁTICO               #
#                                                                              #
#  📱 Sistema Completo de Gestão Imobiliária                                   #
#  🏗️  Desenvolvido por: KRYONIX Tecnologia                                    #
#  🌐 Website: https://kryonix.com.br                                          #
#  📧 Contato: contato@kryonix.com.br                                          #
#  📞 WhatsApp: (62) 99999-9999                                               #
#                                                                              #
#  🎯 Instalação Automatizada para Ubuntu/Debian                               #
#  ⚡ Configuração Completa em Poucos Minutos                                   #
#                                                                              #
################################################################################

set -e

# ═══════════════════════════════════════════════════════════════════════════════
# 🎨 CONFIGURAÇÕES DE CORES E ESTILO
# ═══════════════════════════════════════════════════════════════════════════════

# Cores da KRYONIX
readonly KRYONIX_PRIMARY='\033[38;5;30m'     # Azul KRYONIX
readonly KRYONIX_SECONDARY='\033[38;5;94m'   # Marrom Siqueira
readonly KRYONIX_ACCENT='\033[38;5;220m'     # Dourado
readonly KRYONIX_SUCCESS='\033[38;5;46m'     # Verde
readonly KRYONIX_WARNING='\033[38;5;214m'    # Laranja
readonly KRYONIX_ERROR='\033[38;5;196m'      # Vermelho
readonly KRYONIX_INFO='\033[38;5;39m'        # Azul claro
readonly NC='\033[0m'                        # Reset
readonly BOLD='\033[1m'
readonly DIM='\033[2m'
readonly UNDERLINE='\033[4m'

# ═══════════════════════════════════════════════════════════════════════════════
# 🚀 CONFIGURAÇÕES DO PROJETO
# ═══════════════════════════════════════════════════════════════════════════════

readonly PROJECT_NAME="Siqueira Campos Imóveis"
readonly PROJECT_VERSION="1.0.0"
readonly KRYONIX_COMPANY="KRYONIX Tecnologia"
readonly KRYONIX_WEBSITE="https://kryonix.com.br"
readonly KRYONIX_EMAIL="contato@kryonix.com.br"
readonly KRYONIX_WHATSAPP="(62) 99999-9999"

readonly INSTALL_DIR="/opt/siqueira-campos"
readonly LOG_FILE="/var/log/siqueira-setup.log"
readonly BACKUP_DIR="/backups/siqueira-campos"

# ═══════════════════════════════════════════════════════════════════════════════
# 🎭 FUNÇÕES DE INTERFACE
# ═══════════════════════════════════════════════════════════════════════════════

# Banner principal
show_banner() {
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
    ║                        T E C N O L O G I A                                   ║
    ║                                                                              ║
    ╚══════════════════════════════════════════════════════════════════════════��═══╝
EOF
    echo -e "${NC}"
    
    echo -e "${KRYONIX_ACCENT}${BOLD}                    🏠 SIQUEIRA CAMPOS IMÓVEIS 🏠${NC}"
    echo -e "${KRYONIX_SECONDARY}                     Sistema de Gestão Imobiliária${NC}"
    echo ""
    echo -e "${KRYONIX_INFO}┌─────────────────────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${KRYONIX_INFO}│${NC} ${BOLD}📦 Versão:${NC} ${PROJECT_VERSION}                                                     ${KRYONIX_INFO}│${NC}"
    echo -e "${KRYONIX_INFO}│${NC} ${BOLD}🏗️  Desenvolvedor:${NC} ${KRYONIX_COMPANY}                                        ${KRYONIX_INFO}│${NC}"
    echo -e "${KRYONIX_INFO}│${NC} ${BOLD}🌐 Website:${NC} ${KRYONIX_WEBSITE}                                          ${KRYONIX_INFO}│${NC}"
    echo -e "${KRYONIX_INFO}│${NC} ${BOLD}📧 Email:${NC} ${KRYONIX_EMAIL}                                      ${KRYONIX_INFO}│${NC}"
    echo -e "${KRYONIX_INFO}│${NC} ${BOLD}📱 WhatsApp:${NC} ${KRYONIX_WHATSAPP}                                         ${KRYONIX_INFO}│${NC}"
    echo -e "${KRYONIX_INFO}└─────────────────────────────────────────────────────────────────────────────┘${NC}"
    echo ""
}

# Função de log formatada
log() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "SUCCESS")
            echo -e "${KRYONIX_SUCCESS}✅ [${timestamp}] ${message}${NC}"
            ;;
        "INFO")
            echo -e "${KRYONIX_INFO}ℹ️  [${timestamp}] ${message}${NC}"
            ;;
        "WARNING")
            echo -e "${KRYONIX_WARNING}⚠️  [${timestamp}] ${message}${NC}"
            ;;
        "ERROR")
            echo -e "${KRYONIX_ERROR}❌ [${timestamp}] ${message}${NC}"
            ;;
        "STEP")
            echo -e "${KRYONIX_PRIMARY}${BOLD}🚀 [${timestamp}] ${message}${NC}"
            ;;
    esac
    
    echo "[${timestamp}] [${level}] ${message}" >> "$LOG_FILE"
}

# Barra de progresso
show_progress() {
    local current=$1
    local total=$2
    local message=$3
    local width=50
    
    local percentage=$((current * 100 / total))
    local filled=$((current * width / total))
    local empty=$((width - filled))
    
    printf "\r${KRYONIX_ACCENT}["
    printf "%*s" $filled | tr ' ' '█'
    printf "%*s" $empty | tr ' ' '░'
    printf "] ${percentage}%% - ${message}${NC}"
    
    if [ $current -eq $total ]; then
        echo ""
    fi
}

# Spinner de loading
spinner() {
    local pid=$1
    local message=$2
    local chars="⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
    
    while kill -0 $pid 2>/dev/null; do
        for char in $(echo $chars | grep -o .); do
            printf "\r${KRYONIX_INFO}${char} ${message}${NC}"
            sleep 0.1
        done
    done
    printf "\r${KRYONIX_SUCCESS}✅ ${message} - Concluído${NC}\n"
}

# ═══════════════════════════════════════════════════════════════════════════════
# 🔍 VERIFICAÇÕES DO SISTEMA
# ═══════════════════════════════════════════════════════════════════════════════

check_system() {
    log "STEP" "Verificando compatibilidade do sistema..."
    
    # Verificar SO
    if ! command -v lsb_release &> /dev/null; then
        log "ERROR" "Sistema não suportado. Utilize Ubuntu 20.04+ ou Debian 11+"
        exit 1
    fi
    
    local os_name=$(lsb_release -si)
    local os_version=$(lsb_release -sr)
    
    log "INFO" "Sistema operacional: ${os_name} ${os_version}"
    
    # Verificar arquitetura
    local arch=$(uname -m)
    if [[ "$arch" != "x86_64" ]]; then
        log "WARNING" "Arquitetura não testada: ${arch}"
    fi
    
    # Verificar usuário root
    if [[ $EUID -ne 0 ]]; then
        log "ERROR" "Este script deve ser executado como root"
        log "INFO" "Execute: sudo $0"
        exit 1
    fi
    
    # Verificar memória RAM
    local ram_gb=$(free -g | awk 'NR==2{print $2}')
    if [[ $ram_gb -lt 2 ]]; then
        log "WARNING" "RAM insuficiente (${ram_gb}GB). Recomendado: 4GB+"
    fi
    
    # Verificar espaço em disco
    local disk_gb=$(df / | awk 'NR==2{print int($4/1024/1024)}')
    if [[ $disk_gb -lt 10 ]]; then
        log "ERROR" "Espaço em disco insuficiente (${disk_gb}GB). Mínimo: 10GB"
        exit 1
    fi
    
    log "SUCCESS" "Sistema compatível!"
}

# ════════════════════════════════════════════════════════��══════════════════════
# 📦 INSTALAÇÃO DE DEPENDÊNCIAS
# ═══════════════════════════════════════════════════════════════════════════════

install_dependencies() {
    log "STEP" "Instalando dependências do sistema..."
    
    # Atualizar sistema
    {
        apt update && apt upgrade -y
    } &
    spinner $! "Atualizando sistema"
    
    # Instalar dependências essenciais
    local packages=(
        "curl" "wget" "git" "unzip" "jq" "htop" "nano" "vim"
        "build-essential" "software-properties-common" "apt-transport-https"
        "ca-certificates" "gnupg" "lsb-release" "ufw" "fail2ban"
        "certbot" "python3-certbot-nginx"
    )
    
    {
        apt install -y "${packages[@]}"
    } &
    spinner $! "Instalando pacotes essenciais"
    
    log "SUCCESS" "Dependências instaladas!"
}

# Instalar Node.js
install_nodejs() {
    log "STEP" "Instalando Node.js 18 LTS..."
    
    {
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt install -y nodejs
    } &
    spinner $! "Configurando Node.js"
    
    # Verificar instalação
    local node_version=$(node --version)
    local npm_version=$(npm --version)
    
    log "SUCCESS" "Node.js instalado: ${node_version}"
    log "SUCCESS" "NPM instalado: ${npm_version}"
}

# Instalar Docker
install_docker() {
    log "STEP" "Instalando Docker Engine..."
    
    {
        # Remover versões antigas
        apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
        
        # Adicionar repositório oficial
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
        
        apt update
        apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        
        # Iniciar serviços
        systemctl enable docker
        systemctl start docker
        
        # Adicionar usuário ao grupo docker
        usermod -aG docker $SUDO_USER 2>/dev/null || true
    } &
    spinner $! "Configurando Docker"
    
    # Verificar instalação
    local docker_version=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
    log "SUCCESS" "Docker instalado: ${docker_version}"
}

# Instalar PostgreSQL
install_postgresql() {
    log "STEP" "Instalando PostgreSQL 15..."
    
    {
        # Adicionar repositório oficial
        wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
        echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list
        
        apt update
        apt install -y postgresql-15 postgresql-client-15 postgresql-contrib-15
        
        # Configurar PostgreSQL
        systemctl enable postgresql
        systemctl start postgresql
    } &
    spinner $! "Configurando PostgreSQL"
    
    log "SUCCESS" "PostgreSQL 15 instalado!"
}

# Instalar Nginx
install_nginx() {
    log "STEP" "Instalando Nginx..."
    
    {
        apt install -y nginx
        systemctl enable nginx
        systemctl start nginx
    } &
    spinner $! "Configurando Nginx"
    
    log "SUCCESS" "Nginx instalado!"
}

# ═══════════════════════════════════════════════════════════════════════════════
# 🔐 CONFIGURAÇÕES DE SEGURANÇA
# ═══════════════════════════════════════════════════════════════════════════════

configure_security() {
    log "STEP" "Configurando segurança do servidor..."
    
    # Configurar firewall
    {
        ufw --force reset
        ufw default deny incoming
        ufw default allow outgoing
        ufw allow ssh
        ufw allow 80/tcp
        ufw allow 443/tcp
        ufw --force enable
    } &
    spinner $! "Configurando firewall (UFW)"
    
    # Configurar fail2ban
    {
        cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
backend = systemd

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
EOF
        systemctl enable fail2ban
        systemctl restart fail2ban
    } &
    spinner $! "Configurando fail2ban"
    
    log "SUCCESS" "Segurança configurada!"
}

# ═══════════════════════════════════════════════════════════════════════════════
# 📁 SETUP DO PROJETO
# ══════════════════════════════════════════════���════════════════════════════════

setup_project() {
    log "STEP" "Configurando projeto Siqueira Campos..."
    
    # Criar diretórios
    mkdir -p "$INSTALL_DIR"
    mkdir -p "$BACKUP_DIR"
    mkdir -p "/var/log/siqueira-campos"
    
    # Configurar permissões
    chown -R $SUDO_USER:$SUDO_USER "$INSTALL_DIR"
    chmod 755 "$INSTALL_DIR"
    
    log "SUCCESS" "Estrutura do projeto criada!"
}

# ═══════════════════════════════════════════════════════════════════════════════
# 🎛️ MENU INTERATIVO
# ═══════════════════════════════════════════════════════════════════════════════

show_menu() {
    echo ""
    echo -e "${KRYONIX_PRIMARY}${BOLD}┌─────────────────────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${KRYONIX_PRIMARY}${BOLD}│                        🛠️  INSTALAÇÃO AUTOMÁTICA                            │${NC}"
    echo -e "${KRYONIX_PRIMARY}${BOLD}└─────────────────────────────────────────────────────────────────────────────┘${NC}"
    echo ""
    echo -e "${KRYONIX_INFO}1.${NC} 🚀 Instalação Completa (Recomendado)"
    echo -e "${KRYONIX_INFO}2.${NC} 📦 Apenas Dependências"
    echo -e "${KRYONIX_INFO}3.${NC} 🐳 Apenas Docker + Docker Compose"
    echo -e "${KRYONIX_INFO}4.${NC} 🔐 Configurar Segurança"
    echo -e "${KRYONIX_INFO}5.${NC} 📊 Verificar Sistema"
    echo -e "${KRYONIX_INFO}6.${NC} ❌ Sair"
    echo ""
}

# Instalação completa
full_installation() {
    local total_steps=8
    local current_step=0
    
    echo ""
    log "STEP" "Iniciando instalação completa..."
    echo ""
    
    # Passo 1
    ((current_step++))
    show_progress $current_step $total_steps "Verificando sistema"
    check_system
    
    # Passo 2
    ((current_step++))
    show_progress $current_step $total_steps "Instalando dependências"
    install_dependencies
    
    # Passo 3
    ((current_step++))
    show_progress $current_step $total_steps "Instalando Node.js"
    install_nodejs
    
    # Passo 4
    ((current_step++))
    show_progress $current_step $total_steps "Instalando Docker"
    install_docker
    
    # Passo 5
    ((current_step++))
    show_progress $current_step $total_steps "Instalando PostgreSQL"
    install_postgresql
    
    # Passo 6
    ((current_step++))
    show_progress $current_step $total_steps "Instalando Nginx"
    install_nginx
    
    # Passo 7
    ((current_step++))
    show_progress $current_step $total_steps "Configurando segurança"
    configure_security
    
    # Passo 8
    ((current_step++))
    show_progress $current_step $total_steps "Configurando projeto"
    setup_project
    
    echo ""
    log "SUCCESS" "Instalação completa finalizada!"
    show_completion()
}

# Tela de conclusão
show_completion() {
    clear
    echo -e "${KRYONIX_SUCCESS}${BOLD}"
    cat << 'EOF'
    ╔══════════════════════════════════════════════════════════════════════════════╗
    ║                                                                              ║
    ║    🎉  INSTALAÇÃO CONCLUÍDA COM SUCESSO!  🎉                                ║
    ║                                                                              ║
    ║    Sistema Siqueira Campos Imóveis está pronto para usar!                   ║
    ║                                                                              ║
    ╚══════════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    echo -e "${KRYONIX_INFO}${BOLD}📋 PRÓXIMOS PASSOS:${NC}"
    echo ""
    echo -e "${KRYONIX_ACCENT}1.${NC} Clone o repositório do projeto:"
    echo -e "   ${DIM}git clone https://github.com/kryonix/siqueira-campos.git${NC}"
    echo ""
    echo -e "${KRYONIX_ACCENT}2.${NC} Configure as variáveis de ambiente:"
    echo -e "   ${DIM}cp .env.example .env${NC}"
    echo ""
    echo -e "${KRYONIX_ACCENT}3.${NC} Execute o deploy com Docker:"
    echo -e "   ${DIM}docker-compose up -d${NC}"
    echo ""
    echo -e "${KRYONIX_INFO}${BOLD}📞 SUPORTE TÉCNICO KRYONIX:${NC}"
    echo -e "   ${KRYONIX_ACCENT}🌐 Website:${NC} ${KRYONIX_WEBSITE}"
    echo -e "   ${KRYONIX_ACCENT}📧 Email:${NC} ${KRYONIX_EMAIL}"
    echo -e "   ${KRYONIX_ACCENT}📱 WhatsApp:${NC} ${KRYONIX_WHATSAPP}"
    echo ""
    echo -e "${KRYONIX_SECONDARY}${BOLD}Obrigado por escolher a KRYONIX Tecnologia! 🚀${NC}"
    echo ""
}

# ═══════════════════════════════════════════════════════════════════════════════
# 🚀 FUNÇÃO PRINCIPAL
# ═══════════════════════════════════════════════════════════════════════════════

main() {
    # Criar log se não existir
    mkdir -p "$(dirname "$LOG_FILE")"
    touch "$LOG_FILE"
    
    # Iniciar log
    log "INFO" "═══════════════════════════════════════════════════════════════"
    log "INFO" "Iniciando setup do Siqueira Campos Imóveis"
    log "INFO" "Desenvolvido por: $KRYONIX_COMPANY"
    log "INFO" "═══════════════════════════════════════════════════════════════"
    
    while true; do
        show_banner
        show_menu
        
        echo -e "${KRYONIX_ACCENT}${BOLD}┌─ Escolha uma opção: ${NC}"
        read -p "└─ " choice
        
        case $choice in
            1)
                full_installation
                break
                ;;
            2)
                install_dependencies
                install_nodejs
                log "SUCCESS" "Dependências instaladas!"
                ;;
            3)
                install_docker
                ;;
            4)
                configure_security
                ;;
            5)
                check_system
                ;;
            6)
                log "INFO" "Setup cancelado pelo usuário"
                echo -e "${KRYONIX_INFO}Até logo! 👋${NC}"
                exit 0
                ;;
            *)
                log "WARNING" "Opção inválida: $choice"
                sleep 2
                ;;
        esac
        
        echo ""
        read -p "Pressione Enter para continuar..."
    done
}

# ════════════════════════════════��══════════════════════════════════════════════
# 🎬 EXECUÇÃO
# ═══════════════════════════════════════════════════════════════════════════════

# Trap para capturar interrupções
trap 'log "ERROR" "Setup interrompido pelo usuário"; exit 1' INT TERM

# Executar função principal
main "$@"

################################################################################
#                                                                              #
#                    🏗️  DESENVOLVIDO POR KRYONIX TECNOLOGIA                   #
#                         https://kryonix.com.br                              #
#                                                                              #
################################################################################
