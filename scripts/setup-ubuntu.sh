#!/bin/bash

# Script de Instalação Automática - Siqueira Campos Imóveis
# Sistema: Ubuntu/Debian
# Autor: KRYONIX - Vitor Jayme Fernandes Ferreira

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções auxiliares
print_step() {
    echo -e "${BLUE}[PASSO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCESSO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERRO]${NC} $1"
}

# Verificar se é root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_error "Este script não deve ser executado como root!"
        exit 1
    fi
}

# Atualizar sistema
update_system() {
    print_step "Atualizando sistema..."
    sudo apt update -y
    sudo apt upgrade -y
    print_success "Sistema atualizado"
}

# Instalar dependências básicas
install_dependencies() {
    print_step "Instalando dependências básicas..."
    
    sudo apt install -y \
        curl \
        wget \
        git \
        unzip \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release \
        build-essential
    
    print_success "Dependências básicas instaladas"
}

# Instalar Node.js
install_nodejs() {
    print_step "Instalando Node.js 18..."
    
    # Remover versões antigas
    sudo apt remove -y nodejs npm
    
    # Adicionar repositório NodeSource
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    # Verificar instalação
    node_version=$(node --version)
    npm_version=$(npm --version)
    
    print_success "Node.js $node_version e npm $npm_version instalados"
}

# Instalar PostgreSQL
install_postgresql() {
    print_step "Instalando PostgreSQL..."
    
    sudo apt install -y postgresql postgresql-contrib
    
    # Iniciar e habilitar PostgreSQL
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    # Configurar usuário do banco
    sudo -u postgres psql -c "CREATE USER sitejuarez WITH PASSWORD 'juarez123';"
    sudo -u postgres psql -c "CREATE DATABASE bdsitejuarez OWNER sitejuarez;"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE bdsitejuarez TO sitejuarez;"
    
    print_success "PostgreSQL instalado e configurado"
}

# Instalar Redis
install_redis() {
    print_step "Instalando Redis..."
    
    sudo apt install -y redis-server
    
    # Configurar Redis
    sudo sed -i 's/supervised no/supervised systemd/' /etc/redis/redis.conf
    
    # Iniciar e habilitar Redis
    sudo systemctl restart redis
    sudo systemctl enable redis
    
    print_success "Redis instalado e configurado"
}

# Instalar Docker
install_docker() {
    print_step "Instalando Docker..."
    
    # Remover versões antigas
    sudo apt remove -y docker docker-engine docker.io containerd runc
    
    # Adicionar repositório Docker
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Adicionar usuário ao grupo docker
    sudo usermod -aG docker $USER
    
    # Iniciar e habilitar Docker
    sudo systemctl start docker
    sudo systemctl enable docker
    
    print_success "Docker instalado"
}

# Instalar Docker Compose
install_docker_compose() {
    print_step "Instalando Docker Compose..."
    
    # Baixar Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    
    # Dar permissão de execução
    sudo chmod +x /usr/local/bin/docker-compose
    
    # Criar link simbólico
    sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
    
    print_success "Docker Compose instalado"
}

# Configurar Nginx
install_nginx() {
    print_step "Instalando e configurando Nginx..."
    
    sudo apt install -y nginx
    
    # Configuração básica do Nginx
    sudo tee /etc/nginx/sites-available/siqueira-campos << EOF
server {
    listen 80;
    server_name siqueicamposimoveis.com.br www.siqueicamposimoveis.com.br;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}

server {
    listen 80;
    server_name app.siqueicamposimoveis.com.br;
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}

server {
    listen 80;
    server_name cliente.siqueicamposimoveis.com.br;
    
    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

    # Habilitar site
    sudo ln -sf /etc/nginx/sites-available/siqueira-campos /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Testar configuração
    sudo nginx -t
    
    # Reiniciar Nginx
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    
    print_success "Nginx configurado"
}

# Instalar Certbot para SSL
install_certbot() {
    print_step "Instalando Certbot para SSL..."
    
    sudo apt install -y certbot python3-certbot-nginx
    
    print_success "Certbot instalado"
    print_warning "Para obter certificado SSL, execute:"
    print_warning "sudo certbot --nginx -d siqueicamposimoveis.com.br -d www.siqueicamposimoveis.com.br"
}

# Configurar PM2
install_pm2() {
    print_step "Instalando PM2..."
    
    sudo npm install -g pm2
    
    # Configurar startup do PM2
    pm2 startup
    
    print_success "PM2 instalado"
}

# Criar diretórios do projeto
create_directories() {
    print_step "Criando diretórios do projeto..."
    
    # Criar diretório principal
    mkdir -p /opt/siqueira-campos
    mkdir -p /opt/siqueira-campos/logs
    mkdir -p /opt/siqueira-campos/uploads
    mkdir -p /opt/siqueira-campos/backups
    
    # Dar permissões
    sudo chown -R $USER:$USER /opt/siqueira-campos
    
    print_success "Diretórios criados"
}

# Configurar firewall
setup_firewall() {
    print_step "Configurando firewall..."
    
    # Habilitar UFW
    sudo ufw --force enable
    
    # Permitir SSH
    sudo ufw allow ssh
    
    # Permitir HTTP e HTTPS
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    
    # Permitir portas da aplicação (apenas localhost)
    sudo ufw allow from 127.0.0.1 to any port 3000
    sudo ufw allow from 127.0.0.1 to any port 3001
    sudo ufw allow from 127.0.0.1 to any port 3002
    sudo ufw allow from 127.0.0.1 to any port 3003
    
    # Permitir PostgreSQL (apenas localhost)
    sudo ufw allow from 127.0.0.1 to any port 5432
    
    # Permitir Redis (apenas localhost)
    sudo ufw allow from 127.0.0.1 to any port 6379
    
    print_success "Firewall configurado"
}

# Função principal
main() {
    echo "=================================================="
    echo "    INSTALAÇÃO SIQUEIRA CAMPOS IMÓVEIS"
    echo "    Desenvolvido por: KRYONIX"
    echo "    Versão: 1.0"
    echo "=================================================="
    echo ""
    
    check_root
    
    print_step "Iniciando instalação..."
    
    # Execução dos passos
    update_system
    install_dependencies
    install_nodejs
    install_postgresql
    install_redis
    install_docker
    install_docker_compose
    install_nginx
    install_certbot
    install_pm2
    create_directories
    setup_firewall
    
    echo ""
    echo "=================================================="
    print_success "INSTALAÇÃO CONCLUÍDA!"
    echo "=================================================="
    echo ""
    echo "PRÓXIMOS PASSOS:"
    echo "1. Clone o repositório do projeto em /opt/siqueira-campos"
    echo "2. Configure o arquivo .env"
    echo "3. Execute: npm install"
    echo "4. Execute: npm run db:push && npm run db:seed"
    echo "5. Execute: npm run build"
    echo "6. Inicie com PM2: pm2 start ecosystem.config.js"
    echo ""
    echo "CONFIGURAÇÕES IMPORTANTES:"
    echo "- PostgreSQL: Usuario: sitejuarez | Senha: juarez123 | DB: bdsitejuarez"
    echo "- Nginx configurado para proxy reverso"
    echo "- SSL: Execute 'sudo certbot --nginx' para configurar"
    echo "- Firewall UFW ativo com portas necessárias liberadas"
    echo ""
    echo "CONTATO:"
    echo "- WhatsApp: (17) 98180-5327"
    echo "- Instagram: @kryon.ix"
    echo "- Empresa: KRYONIX"
    echo ""
    echo "=================================================="
}

# Executar função principal
main "$@"
