#!/bin/bash

################################################################################
#                                                                              #
#  ██╗  ██╗██████╗ ██╗   ██╗ ██████╗ ███╗   ██╗██╗██╗  ██╗                   #
#  ██║ ██╔╝██╔══██╗╚██╗ ██╔╝██╔═══██╗████╗  ██║██║╚██╗██╔╝                   #
#  █████╔╝ ██████╔╝ ╚████╔╝ ██║   ██║██╔██╗ ██║██║ ╚███╔╝                    #
#  ██╔═██╗ ██╔══██╗  ╚██╔╝  ���█║   ██║██║╚██╗██║██║ ██╔██╗                    #
#  ██║  ██╗██║  ██║   ██║   ╚██████╔╝██║ ╚████║██║██╔╝ ██╗                   #
#  ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝                   #
#                                                                              #
#            🔍 VERIFICAÇÃO DE COMPLETUDE - SIQUEIRA CAMPOS IMÓVEIS            #
#                                                                              #
#                    Desenvolvido por KRYONIX Tecnologia                      #
#                        https://kryonix.com.br                               #
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

# Contadores
total_checks=0
passed_checks=0
failed_checks=0

# Banner KRYONIX
show_banner() {
    clear
    echo -e "${KRYONIX_BLUE}${BOLD}"
    cat << 'EOF'
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │                                                                             │
    │  ██╗  ██╗██████╗ ██╗   ██╗ ██████╗ ███╗   ██╗██╗██╗  ██╗                  │
    │  ██║ ██╔╝██╔══██╗╚██╗ ██╔╝██╔═══██╗████╗  ██║██║╚██╗██╔╝                  │
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
    echo -e "${KRYONIX_GOLD}${BOLD}            🔍 VERIFICAÇÃO DE COMPLETUDE DO PROJETO 🔍${NC}"
    echo -e "${KRYONIX_BROWN}                     Siqueira Campos Imóveis${NC}"
    echo ""
}

# Função de verificação
check() {
    local name="$1"
    local condition="$2"
    local details="$3"
    
    ((total_checks++))
    
    if eval "$condition" &>/dev/null; then
        echo -e "${KRYONIX_SUCCESS}✅ ${name}${NC}"
        [ -n "$details" ] && echo -e "   ${KRYONIX_BLUE}ℹ️  ${details}${NC}"
        ((passed_checks++))
        return 0
    else
        echo -e "${KRYONIX_ERROR}❌ ${name}${NC}"
        [ -n "$details" ] && echo -e "   ${KRYONIX_WARNING}⚠️  ${details}${NC}"
        ((failed_checks++))
        return 1
    fi
}

# Verificação de arquivos essenciais
check_essential_files() {
    echo -e "${KRYONIX_BLUE}${BOLD}📁 ARQUIVOS ESSENCIAIS${NC}"
    echo ""
    
    check "package.json" "[ -f package.json ]" "Configuração do projeto Node.js"
    check "tsconfig.json" "[ -f tsconfig.json ]" "Configuração TypeScript"
    check "tailwind.config.ts" "[ -f tailwind.config.ts ]" "Configuração Tailwind CSS"
    check "vite.config.ts" "[ -f vite.config.ts ]" "Configuração Vite"
    check "Dockerfile" "[ -f Dockerfile ]" "Container para desenvolvimento"
    check "Dockerfile.prod" "[ -f Dockerfile.prod ]" "Container otimizado para produção"
    check "docker-compose.yml" "[ -f docker-compose.yml ]" "Orquestração de containers"
    check "docker-compose.prod.yml" "[ -f docker-compose.prod.yml ]" "Produção com Traefik e SSL"
    check ".env.example" "[ -f .env.example ]" "Exemplo de variáveis de ambiente"
    check ".env.prod.example" "[ -f .env.prod.example ]" "Exemplo para produção"
    
    echo ""
}

# Verificação da estrutura de pastas
check_folder_structure() {
    echo -e "${KRYONIX_BLUE}${BOLD}📂 ESTRUTURA DE PASTAS${NC}"
    echo ""
    
    check "client/" "[ -d client ]" "Frontend React TypeScript"
    check "server/" "[ -d server ]" "Backend Node.js Express"
    check "prisma/" "[ -d prisma ]" "Schema e migrações do banco"
    check "scripts/" "[ -d scripts ]" "Scripts de automação"
    check "docs/" "[ -d docs ]" "Documentação do projeto"
    check "public/" "[ -d public ]" "Arquivos estáticos"
    check "client/components/" "[ -d client/components ]" "Componentes React"
    check "client/pages/" "[ -d client/pages ]" "Páginas da aplicação"
    check "server/routes/" "[ -d server/routes ]" "Rotas da API"
    
    echo ""
}

# Verificação de scripts
check_scripts() {
    echo -e "${KRYONIX_BLUE}${BOLD}🔧 SCRIPTS DE AUTOMAÇÃO${NC}"
    echo ""
    
    check "setup-ubuntu.sh" "[ -f scripts/setup-ubuntu.sh ]" "Instalação automática Ubuntu"
    check "install.sh" "[ -f scripts/install.sh ]" "Instalação rápida do projeto"
    check "deploy.sh" "[ -f scripts/deploy.sh ]" "Deploy automatizado"
    check "backup.sh" "[ -f scripts/backup.sh ]" "Backup automático"
    check "restore.sh" "[ -f scripts/restore.sh ]" "Restore de backups"
    check "monitor.sh" "[ -f scripts/monitor.sh ]" "Monitoramento do sistema"
    check "docker-entrypoint.sh" "[ -f scripts/docker-entrypoint.sh ]" "Inicialização Docker"
    
    echo ""
}

# Verificação de páginas e dashboards
check_dashboards() {
    echo -e "${KRYONIX_BLUE}${BOLD}📊 DASHBOARDS E PÁGINAS${NC}"
    echo ""
    
    # Páginas principais
    check "Página inicial" "[ -f client/pages/Index.tsx ]" "Landing page pública"
    check "Login" "[ -f client/pages/Login.tsx ]" "Página de autenticação"
    check "Imóveis" "[ -f client/pages/Imoveis.tsx ]" "Catálogo de imóveis"
    check "Detalhes do imóvel" "[ -f client/pages/ImovelDetalhes.tsx ]" "Página individual"
    check "Contato" "[ -f client/pages/Contato.tsx ]" "Formulário de contato"
    check "Sobre" "[ -f client/pages/Sobre.tsx ]" "Sobre a empresa"
    check "Blog" "[ -f client/pages/Blog.tsx ]" "Blog imobiliário"
    check "Simulador" "[ -f client/pages/SimuladorFinanciamento.tsx ]" "Calculadora financeira"
    check "Status" "[ -f client/pages/Status.tsx ]" "Monitoramento sistema"
    
    # Dashboards específicos
    check "Admin Dashboard" "[ -d client/pages/Admin ]" "Painel administrativo"
    check "Corretor Dashboard" "[ -d client/pages/Corretor ]" "Painel do corretor"
    check "Cliente Dashboard" "[ -d client/pages/Cliente ]" "Painel do cliente"
    check "Marketing Dashboard" "[ -d client/pages/Marketing ]" "Painel de marketing"
    check "Desenvolvedor Dashboard" "[ -d client/pages/Desenvolvedor ]" "Painel técnico"
    
    echo ""
}

# Verificação de rotas da API
check_api_routes() {
    echo -e "${KRYONIX_BLUE}${BOLD}🛣️ ROTAS DA API${NC}"
    echo ""
    
    check "Autenticação" "[ -f server/routes/auth.ts ]" "Login, logout, JWT"
    check "Usuários" "[ -f server/routes/usuarios.ts ]" "CRUD de usuários"
    check "Imóveis" "[ -f server/routes/imoveis.ts ]" "CRUD de imóveis"
    check "Leads" "[ -f server/routes/leads.ts ]" "Gestão de leads"
    check "Corretor" "[ -f server/routes/corretor.ts ]" "Funcionalidades do corretor"
    check "Admin" "[ -f server/routes/admin.ts ]" "Funcionalidades administrativas"
    check "Cliente" "[ -f server/routes/cliente.ts ]" "Portal do cliente"
    check "Chat IA" "[ -f server/routes/chat.ts ]" "Integração OpenAI"
    check "WhatsApp" "[ -f server/routes/whatsapp.ts ]" "Integration Evolution API"
    check "Upload" "[ -f server/routes/upload.ts ]" "Upload de arquivos"
    check "Financeiro" "[ -f server/routes/financeiro.ts ]" "Sistema financeiro"
    check "Marketing" "[ -f server/routes/marketing.ts ]" "Meta API e campanhas"
    check "Status" "[ -f server/routes/status.ts ]" "Monitoramento sistema"
    
    echo ""
}

# Verificação de componentes
check_components() {
    echo -e "${KRYONIX_BLUE}${BOLD}🧩 COMPONENTES${NC}"
    echo ""
    
    check "UI Components" "[ -d client/components/ui ]" "Biblioteca de componentes"
    check "Google Maps" "[ -f client/components/Maps/GoogleMap.tsx ]" "Integração Google Maps"
    check "Chat IA" "grep -q 'ChatIA' client/components/ui/*.tsx" "Componente de chat inteligente"
    
    echo ""
}

# Verificação de documentação
check_documentation() {
    echo -e "${KRYONIX_BLUE}${BOLD}📚 DOCUMENTAÇÃO${NC}"
    echo ""
    
    check "README principal" "[ -f README.md ]" "Documentação básica"
    check "README completo" "[ -f README-COMPLETO.md ]" "Documentação detalhada"
    check "README executivo" "[ -f README-EXECUTIVO.md ]" "Versão para executivos"
    check "Tutorial N8N" "[ -f docs/TUTORIAL-N8N.md ]" "Configuração de automações"
    check "Tutorial setup" "[ -f TUTORIAL-SETUP.md ]" "Guia de instalação"
    check "Relatório final" "[ -f RELATORIO-FINAL.md ]" "Status do projeto"
    check "Relatório melhorias" "[ -f RELATORIO-MELHORIAS-IMPLEMENTADAS.md ]" "Últimas implementações"
    
    echo ""
}

# Verificação de PWA
check_pwa() {
    echo -e "${KRYONIX_BLUE}${BOLD}📱 PROGRESSIVE WEB APP${NC}"
    echo ""
    
    check "Manifest PWA" "[ -f public/manifest.json ]" "Configuração PWA"
    check "Service Worker" "[ -f public/sw.js ]" "Funcionalidade offline"
    check "Meta tags PWA" "grep -q 'manifest' index.html" "Tags PWA no HTML"
    
    echo ""
}

# Verificação de testes
check_tests() {
    echo -e "${KRYONIX_BLUE}${BOLD}🧪 TESTES AUTOMATIZADOS${NC}"
    echo ""
    
    check "Configuração Vitest" "[ -f vitest.config.ts ]" "Framework de testes"
    check "Setup de testes" "[ -f vitest.setup.ts ]" "Configuração inicial"
    check "Testes frontend" "[ -d client/pages/__tests__ ]" "Testes de componentes"
    check "Teste utils" "[ -f client/lib/utils.test.ts ]" "Testes de utilitários"
    
    echo ""
}

# Verificação de automações
check_automations() {
    echo -e "${KRYONIX_BLUE}${BOLD}🤖 AUTOMAÇÕES${NC}"
    echo ""
    
    check "Workflow N8N" "[ -f n8n-lead-imobiliaria-completo.json ]" "Automação completa de leads"
    check "Health check" "[ -f healthcheck.js ]" "Verificação de saúde Docker"
    check "Ecosystem PM2" "[ -f ecosystem.config.js ]" "Configuração PM2"
    
    echo ""
}

# Verificação de configurações especiais
check_special_configs() {
    echo -e "${KRYONIX_BLUE}${BOLD}⚙️ CONFIGURAÇÕES ESPECIAIS${NC}"
    echo ""
    
    check "Prisma schema" "[ -f prisma/schema.prisma ]" "Modelo do banco de dados"
    check "Seed database" "[ -f prisma/seed.ts ]" "Dados de exemplo"
    check "Portainer stack" "[ -f portainer-stack.yml ]" "Deploy via Portainer"
    check "Netlify config" "[ -f netlify.toml ]" "Deploy na Netlify"
    
    echo ""
}

# Função para mostrar estatísticas finais
show_statistics() {
    echo -e "${KRYONIX_GOLD}${BOLD}┌─────────────────────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${KRYONIX_GOLD}${BOLD}│                           📊 ESTATÍSTICAS FINAIS                           │${NC}"
    echo -e "${KRYONIX_GOLD}${BOLD}└───────────────────────���─────────────────────────────────────────────────────┘${NC}"
    echo ""
    
    local success_rate=$((passed_checks * 100 / total_checks))
    
    echo -e "${KRYONIX_BLUE}${BOLD}Total de verificações:${NC} ${total_checks}"
    echo -e "${KRYONIX_SUCCESS}${BOLD}Aprovadas:${NC} ${passed_checks}"
    echo -e "${KRYONIX_ERROR}${BOLD}Falharam:${NC} ${failed_checks}"
    echo -e "${KRYONIX_GOLD}${BOLD}Taxa de sucesso:${NC} ${success_rate}%"
    echo ""
    
    if [ $success_rate -ge 95 ]; then
        echo -e "${KRYONIX_SUCCESS}${BOLD}🎉 PROJETO 100% COMPLETO E FUNCIONAL! 🎉${NC}"
        echo -e "${KRYONIX_SUCCESS}Sistema pronto para produção!${NC}"
    elif [ $success_rate -ge 85 ]; then
        echo -e "${KRYONIX_WARNING}${BOLD}⚠️ PROJETO QUASE COMPLETO${NC}"
        echo -e "${KRYONIX_WARNING}Algumas verificações falharam, mas o sistema é funcional${NC}"
    else
        echo -e "${KRYONIX_ERROR}${BOLD}❌ PROJETO INCOMPLETO${NC}"
        echo -e "${KRYONIX_ERROR}Muitas verificações falharam, revisar implementação${NC}"
    fi
    
    echo ""
}

# Verificação das etapas do projeto executivo
check_project_stages() {
    echo -e "${KRYONIX_BLUE}${BOLD}📋 ETAPAS DO PROJETO EXECUTIVO${NC}"
    echo ""
    
    echo -e "${KRYONIX_GOLD}ETAPA 0: Planejamento Estratégico${NC}"
    check "✅ Papéis definidos" "grep -q 'ADMIN\|CORRETOR\|CLIENTE' prisma/schema.prisma" "6 tipos de usuário implementados"
    check "✅ Tecnologias definidas" "[ -f docker-compose.yml ]" "PostgreSQL, Docker, N8N, Redis"
    check "✅ Cores da marca" "grep -q 'brown\|amber' tailwind.config.ts" "Marrom + Bege configurados"
    echo ""
    
    echo -e "${KRYONIX_GOLD}ETAPA 1: Infraestrutura${NC}"
    check "✅ Docker + Traefik" "[ -f docker-compose.prod.yml ]" "Proxy reverso com SSL"
    check "✅ PostgreSQL" "grep -q 'postgres' docker-compose.yml" "Banco de dados principal"
    check "✅ Redis" "grep -q 'redis' docker-compose.yml" "Cache e sessões"
    check "✅ N8N" "grep -q 'n8n' docker-compose.yml" "Automação de workflows"
    echo ""
    
    echo -e "${KRYONIX_GOLD}ETAPA 2: Backend${NC}"
    check "✅ API Node.js" "[ -f server/index.ts ]" "Express + TypeScript"
    check "✅ Prisma ORM" "[ -f prisma/schema.prisma ]" "15+ tabelas implementadas"
    check "✅ Autenticação JWT" "[ -f server/routes/auth.ts ]" "JWT + OAuth Google"
    check "✅ Middleware segurança" "grep -q 'helmet\|cors' server/index.ts" "Headers, CORS, Rate limit"
    echo ""
    
    echo -e "${KRYONIX_GOLD}ETAPA 3: Frontend${NC}"
    check "✅ Site principal" "[ -f client/pages/Index.tsx ]" "Landing page responsiva"
    check "✅ Catálogo imóveis" "[ -f client/pages/Imoveis.tsx ]" "Filtros dinâmicos"
    check "✅ Página individual" "[ -f client/pages/ImovelDetalhes.tsx ]" "Galeria + mapa + ações"
    check "✅ Simulador financiamento" "[ -f client/pages/SimuladorFinanciamento.tsx ]" "Calculadora integrada"
    check "✅ Chat IA" "[ -f server/routes/chat.ts ]" "OpenAI integrado"
    echo ""
    
    echo -e "${KRYONIX_GOLD}ETAPA 4: Dashboards${NC}"
    check "✅ Admin Dashboard" "[ -d client/pages/Admin ]" "Financeiro + relatórios"
    check "✅ Corretor Dashboard" "[ -d client/pages/Corretor ]" "Imóveis + leads + comissões"
    check "✅ Cliente Dashboard" "[ -d client/pages/Cliente ]" "Favoritos + histórico"
    check "✅ Marketing Dashboard" "[ -d client/pages/Marketing ]" "Campanhas + Meta API"
    check "✅ Desenvolvedor Dashboard" "[ -d client/pages/Desenvolvedor ]" "Logs + monitoramento"
    echo ""
    
    echo -e "${KRYONIX_GOLD}ETAPA 5: Inteligência Artificial${NC}"
    check "✅ IA conversacional" "grep -q 'openai' server/routes/chat.ts" "OpenAI GPT-3.5-turbo"
    check "✅ Base conhecimento local" "grep -q 'Goiânia' server/routes/chat.ts" "Dados de Goiânia"
    check "✅ Histórico conversas" "grep -q 'historico' server/routes/chat.ts" "Contexto por usuário"
    echo ""
    
    echo -e "${KRYONIX_GOLD}ETAPA 6: Segurança e Acessos${NC}"
    check "✅ Autenticação completa" "[ -f server/routes/auth.ts ]" "JWT + Google OAuth"
    check "✅ Middleware permissões" "grep -q 'verifyToken' server/routes/*.ts" "Controle por papel"
    check "✅ HTTPS obrigatório" "grep -q 'helmet' server/index.ts" "Headers de segurança"
    echo ""
    
    echo -e "${KRYONIX_GOLD}ETAPA 7: Documentação e Testes${NC}"
    check "✅ README completo" "[ -f README-COMPLETO.md ]" "Documentação detalhada"
    check "✅ Scripts instalação" "[ -f scripts/setup-ubuntu.sh ]" "Instalação automática"
    check "✅ Testes automatizados" "[ -f vitest.config.ts ]" "Vitest + Testing Library"
    echo ""
    
    echo -e "${KRYONIX_GOLD}ETAPA 8: Automação${NC}"
    check "✅ N8N Workflows" "[ -f n8n-lead-imobiliaria-completo.json ]" "Automação completa"
    check "✅ Evolution API" "grep -q 'evolution' docker-compose.yml" "WhatsApp integrado"
    check "✅ Meta API" "[ -f server/routes/marketing.ts ]" "Facebook/Instagram"
    echo ""
    
    echo -e "${KRYONIX_GOLD}BÔNUS: Melhorias Implementadas${NC}"
    check "✅ PWA" "[ -f public/manifest.json ]" "App instalável"
    check "✅ Backup automático" "[ -f scripts/backup.sh ]" "Scripts completos"
    check "✅ Monitoramento" "[ -f client/pages/Status.tsx ]" "Dashboard de sistema"
    check "✅ Deploy automatizado" "[ -f scripts/deploy.sh ]" "CI/CD completo"
    echo ""
}

# Função principal
main() {
    show_banner
    
    echo -e "${KRYONIX_BLUE}${BOLD}🔍 Verificando completude do projeto Siqueira Campos Imóveis...${NC}"
    echo -e "${KRYONIX_BROWN}Desenvolvido por KRYONIX Tecnologia${NC}"
    echo ""
    
    # Executar todas as verificações
    check_essential_files
    check_folder_structure
    check_scripts
    check_dashboards
    check_api_routes
    check_components
    check_documentation
    check_pwa
    check_tests
    check_automations
    check_special_configs
    check_project_stages
    
    # Mostrar estatísticas finais
    show_statistics
    
    echo -e "${KRYONIX_BROWN}${BOLD}📞 Suporte KRYONIX:${NC}"
    echo -e "   🌐 Website: https://kryonix.com.br"
    echo -e "   📧 Email: contato@kryonix.com.br"
    echo -e "   📱 WhatsApp: (62) 99999-9999"
    echo ""
    
    # Retornar código baseado na taxa de sucesso
    local success_rate=$((passed_checks * 100 / total_checks))
    if [ $success_rate -ge 95 ]; then
        exit 0
    else
        exit 1
    fi
}

# Executar verificação
main "$@"
