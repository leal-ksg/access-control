## Requisitos
- [PostgreSQL](https://www.postgresql.org)
- [Node](https://nodejs.org/en)

## Instalação

### Backend
- Crie um usuário no PostgreSQL para o projeto
    - Entre no PostgreSQL:
        ```bash
        sudo -iu postgres psql
        ```
    - Crie o usuário e permita que ele crie bancos de dados:
        ```bash
        create user access_control with password 'mude_esta_senha';
        alter user access_control createdb;
        \q
        ```
    - Importante: altere "mude_esta_senha" para uma senha segura
- Configure o arquivo `.env`:
    ```bash
    cp ./backend/.env.example ./backend/.env
    ```
    - Edite o arquivo, utilizando a mesma senha anterior
- Instale as dependências:
    ```bash
    cd backend && npm i
    ```
- Gere o Prisma Client:
    ```bash
    npx prisma generate
    ```
- Execute as migrations do banco:
    ```bash
    npx prisma migrate dev
    ```

## Execução
- Inicie o backend em modo de desenvolvimento:
    ```bash
    cd backend && npm run dev
    ```