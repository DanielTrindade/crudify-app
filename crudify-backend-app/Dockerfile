FROM node:20

WORKDIR /app

# Copiar apenas os arquivos de dependências primeiro
COPY package*.json ./

RUN npm cache clean --force
# Atualizar npm e instalar dependências
RUN npm install -g npm@10.8.2 && npm install
# Copiar o resto dos arquivos do projeto
COPY . .

COPY prisma/schema.prisma ./prisma/

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

# Comando para iniciar o aplicativo em modo de produção
CMD ["npm", "run", "start:prod"]