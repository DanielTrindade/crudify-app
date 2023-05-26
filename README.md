# Crudify-app

Uma aplicação que implementa um CRUD com sistema de login,que utiliza o framework NestJS no backend e o framework NextJS no frontend. O NestJS é uma estrutura de desenvolvimento de aplicativos em Node.js que oferece recursos para construir APIs e serviços robustos. Já o NextJS é um framework de React que facilita a criação de aplicativos web do lado do cliente, com recursos como renderização do lado do servidor e pré-renderização estática. Ao combinar o NestJS no backend e o NextJS no frontend, é possível desenvolver uma aplicação completa, escalável e eficiente, com uma arquitetura moderna e com bom desempenho.

## Documentação da API

A documentação completa da API estará disponível na rota [/api](http://localhost:3000/api) assim que o projeto for executado. Nessa documentação, você encontrará detalhes de todas as rotas disponíveis, incluindo os endpoints, os parâmetros esperados, os payloads necessários e exemplos de respostas.


## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- Node.js (versão 14 ou superior)
- npm (geralmente vem com o Node.js)
- Docker
- Banco de dados PostgreSQL

## Configuração
Para configurar e roda o backend da aplicação siga os passos a seguir:
1. Clone o repositório:

   ```bash
   git clone https://github.com/DanielTrindade/crudify-app.git
2. Navegue até a pasta do diretório do backend:
   ```bash
   cd crudify-app\crudify-backend-app
3. instale as dependências:
   ```bash
   npm install
 
#### Executando o backend da aplicação:
1. Dentro da pasta suba o docker do banco de dados:
   ```base
   docker-compose up
2. Execute as migrações do banco de dados:
   ```base
   npx prisma migrate dev
3. Rode o seed para popular o banco com alguns dados:
   ```bash
   npx prisma db seed
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run start:dev
