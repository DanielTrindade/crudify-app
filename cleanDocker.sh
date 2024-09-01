#!/bin/bash

# Parar todos os contêineres
echo "Parando todos os contêineres..."
docker stop $(docker ps -aq)

# Remover contêineres parados
echo "Removendo contêineres parados..."
docker rm $(docker ps -aq)

# Remover imagens não utilizadas
echo "Removendo imagens não utilizadas..."
docker image prune -a -f

# Remover volumes não utilizados
echo "Removendo volumes não utilizados..."
docker volume prune -f

# Remover redes não utilizadas
echo "Removendo redes não utilizadas..."
docker network prune -f

echo "Limpeza do Docker concluída!"