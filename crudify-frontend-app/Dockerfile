FROM node:18-alpine AS build

WORKDIR /home/node/app

COPY package*.json ./

RUN chmod -R 777 /home/node/app
RUN npm cache clean --force
RUN npm install --force

EXPOSE 3001

# Comando para iniciar a aplicação em modo de produção
#CMD ["npm", "start", "dev"]