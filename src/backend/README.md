## Requisitos

Antes de começar, certifique-se de ter:

- **Python 3.11**

## Instalação

1. Clone este repositório para sua máquina local:

    ```bash
    git clone https://github.com/....git
    ```

2. Acesse o diretório do backend:

    ```bash
    cd src/backend
    ```

3. Crie um ambiente virtual para gerenciar as dependências:

    ```bash
    python -m venv venv
    ```

4. Ative o ambiente virtual:

    - No **Windows**:
        ```bash
        venv\Scripts\activate
        ```
    - No **Mac/Linux**:
        ```bash
        source venv/bin/activate
        ```

5. Instale as dependências necessárias:

    ```bash
    pip install -r requirements.txt
    ```

## Configuração do Prisma ORM

O Prisma é utilizado como ORM (Object-Relational Mapper) para interagir com o banco de dados.

1. Instale o **Prisma CLI** globalmente (caso ainda não tenha):

    ```bash
    npm install -g prisma
    ```

2. Gere o cliente Prisma para uso no projeto:

    ```bash
    python3 -m prisma generate
    ```

3. Aplique o esquema Prisma ao banco de dados:

    ```bash
    python3 -m prisma db push
    ```

   Esse comando sincroniza o esquema Prisma com o seu banco de dados.

4. Rode prisma generate para gerar o client prisma

    ```bash
    prisma generate
    ```


## Executando a Aplicação

Para rodar a aplicação FastAPI, utilize o servidor Uvicorn:

```bash
uvicorn app.main:app --reload
```

- O parâmetro `--reload` ativa o recarregamento automático durante o desenvolvimento.

A aplicação estará disponível em [http://127.0.0.1:8000](http://127.0.0.1:8000).
