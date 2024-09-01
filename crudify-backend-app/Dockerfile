FROM node:20

WORKDIR /home/node/app

RUN chmod -R 777 /home/node/app
# Copiar apenas os arquivos de dependências primeiro
COPY package*.json ./

RUN npm cache clean --force
# Atualizar npm e instalar dependências
RUN npm install -g npm@10.8.2 && npm install --force
COPY . .
COPY prisma/schema.prisma ./prisma/

RUN npx prisma generate

EXPOSE 3000

# Comando para iniciar o aplicativo em modo de produção
#CMD ["npm", "run", "start:dev"]