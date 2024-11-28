from fastapi import FastAPI
from app.prisma_db import db
from contextlib import asynccontextmanager
from app.controllers import patient_controller
from app.controllers import exercise_controller
from app.controllers import compiler_controller

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Gerencia o ciclo de vida da aplicação, incluindo a conexão e desconexão do banco de dados.
    Esta função define um gerenciador de contexto assíncrono para controlar o ciclo de vida do FastAPI,
    garantindo que a conexão com o banco de dados seja estabelecida antes do início da aplicação e fechada
    quando a aplicação for finalizada.
    **Parâmetros**:
        - `app` (FastAPI): Instância da aplicação FastAPI.
    **Fluxo**:
        1. Conecta-se ao banco de dados.
        2. Aguarda o encerramento da aplicação.
        3. Desconecta-se do banco de dados.
    **Exemplo**:
    ```python
    async with lifespan(app):
        # A aplicação estará em execução e conectada ao banco de dados.
    ```
    """
    await db.connect()
    yield
    await db.disconnect()

# Criação da aplicação FastAPI com configurações iniciais

app = FastAPI(
    title="API do VitalyCare",
    description="API para gerenciamento de pacientes e exercícios personalizados a partir do compilador.",
    version="1.0.0",
    lifespan=lifespan
)

# Inclui as rotas dos controladores
app.include_router(compiler_controller.router)
app.include_router(patient_controller.router)
app.include_router(exercise_controller.router)