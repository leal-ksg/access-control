## Requisitos
- [PostgreSQL](https://www.postgresql.org)
- [Node](https://nodejs.org/en)

## Instalação

### Backend
- Crie um usuário no PostgreSQL para o projeto
    - Importante mudar a senha no comando abaixo
    ```bash
    sudo -iu postgres psql
    ```
    ```bash
    create user access_control with password 'mude_esta_senha';
    create database access_control owner access_control;
    \q
    ```
- Crie um arquivo `.env`:
    - Utilize a mesma senha anterior
    ```bash
    echo DATABASE_URL="postgresql://access_control:SUA_SENHA@localhost:5432/access_control" > ./.env
    ```
    