# Access Control

Sistema para gerenciamento e controle de acesso aos armários do PIPA IFmakeRS. A solução permite gerenciar usuários e permissões, registrar acessos e integrar o sistema web com dispositivos eletrônicos responsáveis pelo controle físico dos armários.

## Licença

Este projeto está licenciado sob a [licença MIT](./LICENSE).

## Links rápidos
- [Instalação](#instalação)
- [Execução](#execução)

## Funcionalidades

- Usuários:
    - Autenticação de usuários
    - Gerenciamento de usuários
    - Gerenciamento de permissões de acesso

- Armários:
    - Gerenciamento de armários
    - Controle de acesso aos armários

- Logs:
    - Registro dos acessos realizados

- Demais:
    - Integração entre o sistema web e os dispositivos Arduino
    - Comunicação com os dispositivos utilizando MQTT

## Tecnologias

### Backend

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma
- MQTT
- Bcrypt
- JSON Web Token (JWT)
- Zod
- Swagger UI
- CORS
- Cookie Parser
- dotenv

### Frontend

- React
- React Router
- Tailwind CSS
- Vite
- Lucide React

## Pré-requisitos
- Node.js
- npm
- PostgreSQL
- Git
- MQTT broker
- Arduino
- Mecanismo físico de liberação do armário

## Instalação

### 1. Clone o projeto

```bash
git clone https://github.com/leal-ksg/access-control
cd access-control
```

### 2. Configure o PostgreSQL

Entre no PostgreSQL:
```bash
sudo -iu postgres psql
```

Crie o usuário e permita que ele crie bancos de dados, possibilitando que o Prisma gere o banco de dados posteriormente durante a execução das migrations:
```bash
CREATE USER access_control WITH PASSWORD 'mude_esta_senha';
ALTER USER access_control CREATEDB;
\q
```
> **Importante**: altere "mude_esta_senha" para uma senha segura

### 3. Configure o Backend

Entre no diretório e instale as dependências:
```bash
cd backend
npm i
```

Copie o arquivo de variáveis de ambiente:
```bash
cp .env.example .env
```
> **Importante**: a senha do PostgreSQL deve ser a mesma definida na etapa anterior

Gere o Prisma Client:
```bash
npx prisma generate
```

Execute as migrations:
```bash
npx prisma migrate dev
```

### Visualização do banco de dados

Para visualizar e gerenciar os dados do banco através do Prisma Studio:
```bash
npx prisma studio
```
Isso abrirá o Prisma Studio no navegador padrão

### 4. Configure o Frontend

Entre no diretório e instale as dependências:
```bash
cd frontend
npm i
```

## Execução

Inicie o backend em modo de desenvolvimento:
```bash
cd backend
npm run dev
```

Com o backend em execução, a documentação das rotas pode ser acessada através do [Swagger](#urls-e-portas)

Inicie o frontend em modo de desenvolvimento:
```bash
cd frontend
npm run dev
```

Alternativa: execute ambos com Linux + [tmux](https://github.com/tmux/tmux/wiki):
```bash
chmod +x ./start.sh
./start.sh
```

## URLs e portas

### Frontend
http://localhost:5173/

### Backend
http://localhost:3000

### Swagger
http://localhost:3000/docs

### Prisma Studio
http://localhost:51212