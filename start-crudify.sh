#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color
BLUE='\033[0;34m'
CYAN='\033[0;36m'

# Função para exibir mensagem de erro e sair
error_exit() {
    echo -e "${RED}🚫 ERROR: $1${NC}" >&2
    exit 1
}

# Função para verificar se o Docker está rodando
check_docker() {
    echo -e "${BLUE}🔍 Verificando se o Docker está rodando...${NC}"
    if ! docker info >/dev/null 2>&1; then
        error_exit "Docker não está rodando. Por favor, inicie o Docker e tente novamente."
    fi
    echo -e "${GREEN}✅ Docker está rodando!${NC}"
}

# Função para verificar se as portas necessárias estão disponíveis
check_ports() {
    echo -e "${BLUE}🔍 Verificando portas necessárias...${NC}"
    local ports=(3000 3001 9000 16543)
    for port in "${ports[@]}"; do
        if lsof -i :$port >/dev/null 2>&1; then
            error_exit "Porta $port já está em uso. Por favor, libere esta porta e tente novamente."
        fi
    done
    echo -e "${GREEN}✅ Todas as portas necessárias estão disponíveis!${NC}"
}

# Função para verificar e criar diretórios necessários
setup_directories() {
    echo -e "${BLUE}📁 Configurando diretórios...${NC}"
    local dirs=("crudify-backend-app" "crudify-frontend-app")
    for dir in "${dirs[@]}"; do
        if [ ! -d "$dir" ]; then
            error_exit "Diretório $dir não encontrado!"
        fi
    done
    echo -e "${GREEN}✅ Diretórios verificados com sucesso!${NC}"
}

# Função para verificar arquivos .env
check_env_files() {
    echo -e "${BLUE}📝 Verificando arquivos .env...${NC}"
    if [ ! -f "./crudify-backend-app/.env" ]; then
        echo -e "${YELLOW}⚠️  Arquivo .env não encontrado no backend, copiando do .env.example...${NC}"
        cp "./crudify-backend-app/.env.example" "./crudify-backend-app/.env" || error_exit "Falha ao copiar .env do backend"
    fi
    echo -e "${GREEN}✅ Arquivos .env verificados!${NC}"
}

# Função para limpar containers antigos
cleanup_containers() {
    echo -e "${BLUE}🧹 Limpando ambiente anterior...${NC}"
    docker-compose down -v >/dev/null 2>&1
    echo -e "${GREEN}✅ Ambiente limpo!${NC}"
}

# Função para construir e iniciar os containers
start_containers() {
    echo -e "${BLUE}🚀 Iniciando construção dos containers...${NC}"
    
    echo -e "${CYAN}📦 Construindo e iniciando containers...${NC}"
    docker-compose up --build -d || error_exit "Falha ao iniciar containers"
    
    echo -e "${GREEN}✅ Containers iniciados com sucesso!${NC}"
}

# Função para monitorar logs
monitor_logs() {
    echo -e "${BLUE}📊 Monitorando logs dos serviços...${NC}"
    
    echo -e "${YELLOW}⏳ Aguardando serviços iniciarem...${NC}"
    sleep 10

    # Verificar status dos containers
    local services=("dev_crudify_postgres" "dev_crudify_backend" "dev_crudify_frontend" "dev_crudify_pgadmin" "dev_crudify_portainer")
    
    for service in "${services[@]}"; do
        if [ "$(docker container inspect -f '{{.State.Status}}' $service 2>/dev/null)" == "running" ]; then
            echo -e "${GREEN}✅ $service está rodando${NC}"
        else
            echo -e "${RED}❌ $service não está rodando${NC}"
        fi
    done
}

# Função para verificar saúde dos containers
check_container_health() {
    echo -e "\n${BLUE}🏥 Verificando saúde dos containers...${NC}"
    
    # Verificar especialmente o Postgres que tem healthcheck
    local postgres_health=$(docker inspect --format='{{.State.Health.Status}}' dev_crudify_postgres 2>/dev/null)
    if [ "$postgres_health" == "healthy" ]; then
        echo -e "${GREEN}✅ Postgres está saudável${NC}"
    else
        echo -e "${YELLOW}⚠️  Postgres ainda está inicializando...${NC}"
    fi
}

# Função para exibir informações de acesso
show_access_info() {
    echo -e "\n${CYAN}🌟 Informações de Acesso:${NC}"
    echo -e "${GREEN}📱 Frontend: ${BLUE}http://localhost:3001${NC}"
    echo -e "${GREEN}⚙️  Backend: ${BLUE}http://localhost:3000${NC}"
    echo -e "${GREEN}🛢️  PgAdmin: ${BLUE}http://localhost:16543${NC}"
    echo -e "${GREEN}🐳 Portainer: ${BLUE}http://localhost:9000${NC}"
    echo -e "\n${YELLOW}🔧 Credenciais PgAdmin:${NC}"
    echo -e "Email: admin@admin.com"
    echo -e "Senha: admin"
    echo -e "\n${YELLOW}🔧 Credenciais Postgres:${NC}"
    echo -e "Usuario: myuser"
    echo -e "Senha: mypassword"
    echo -e "Database: crudify-db"
}

# Função para monitorar uso de recursos
monitor_resources() {
    echo -e "\n${BLUE}📈 Monitorando uso de recursos:${NC}"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
}

# Função principal
main() {
    echo -e "${CYAN}🚀 Iniciando deploy do Crudify...${NC}"
    
    check_docker
    check_ports
    setup_directories
    check_env_files
    cleanup_containers
    start_containers
    monitor_logs
    check_container_health
    monitor_resources
    show_access_info
    
    echo -e "\n${GREEN}✨ Deploy concluído com sucesso!${NC}"
    echo -e "${YELLOW}📝 Para ver os logs em tempo real, use: docker-compose logs -f${NC}"
}

# Executa a função principal
main