FROM node:18

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Limpar cache e instalar dependências
RUN npm cache clean --force
RUN npm install

# Copiar o resto dos arquivos do projeto
COPY . .


# Construir a aplicação
RUN npm run build

EXPOSE 3001

# Comando para iniciar a aplicação em modo de produção
CMD ["npm", "start"]