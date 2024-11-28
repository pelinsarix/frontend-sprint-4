from pydantic import BaseModel
from typing import List, Optional

class PatientBase(BaseModel):
    """
    Modelo base para representar um paciente, contendo as informações principais de identificação e status.

    **Atributos**:
        - `name` (str): Nome completo do paciente.
        - `age` (int): Idade do paciente.
        - `status` (str): Status do paciente (por exemplo, "ativo" ou "inativo").

    **Exemplo**:
    ```json
    {
        "name": "Maria da Silva",
        "age": 28,
        "status": "ativo"
    }
    ```

    O exemplo fornecido no `schema_extra` auxilia na documentação automática e serve como referência para estrutura de dados.
    """

    name: str
    age: int
    status: str

    class Config:
        schema_extra = {
            "example": {
                "name": "Maria da Silva",
                "age": 28,
                "status": "ativo"
            }
        }

class PatientCreate(PatientBase):
    """
    Modelo utilizado para a criação de um novo paciente.

    Este modelo herda os atributos de `PatientBase` e é utilizado ao inserir um novo paciente no sistema, contendo apenas os dados essenciais para registro.
    """
    pass


class Patient(PatientBase):
    """
    Modelo completo para representar um paciente, incluindo o identificador único (`id`) e uma lista de exercícios associados.

    **Atributos adicionais**:
        - `id` (int): Identificador único do paciente no sistema.
        - `exercises` (Optional[List[int]]): Lista opcional de IDs de exercícios associados ao paciente, onde cada ID representa um exercício específico.

    **Exemplo**:
    ```json
    {
        "id": 1,
        "name": "Maria da Silva",
        "age": 28,
        "status": "ativo",
        "exercises": [101, 102, 103]
    }
    ```

    Este modelo é utilizado ao retornar informações detalhadas de um paciente ao cliente, incluindo dados adicionais como os exercícios que ele realiza.

    **Configurações de ORM**:
        - `orm_mode` (bool): Habilitado para permitir a conversão direta entre objetos ORM e o modelo Pydantic, facilitando a integração com ORMs, como SQLAlchemy.
    """
    id: int
    exercises: Optional[List[int]] = []

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": 1,
                "name": "Maria da Silva",
                "age": 28,
                "status": "ativo",
                "exercises": [101, 102, 103]
            }
        }
