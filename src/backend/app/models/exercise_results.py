from typing import List
from datetime import datetime
from pydantic import BaseModel

class ExerciseExecutionBase(BaseModel):
    """
    Modelo base para a execução de um exercício, contendo os dados fundamentais que descrevem uma execução realizada por um paciente.

    **Atributos**:
        - `patient_id` (int): Identificador único do paciente que executou o exercício.
        - `exercise_id` (int): Identificador único do exercício que foi executado.
        - `result` (dict): Dicionário contendo os resultados da execução do exercício, como métricas ou parâmetros específicos.
        - `execution_date` (datetime): Data e hora da execução do exercício.

    Esta classe serve como base para os modelos de criação (`ExerciseExecutionCreate`) e retorno (`ExerciseExecution`) das execuções de exercício.
    """

    patient_id: int
    exercise_id: int
    result: dict
    execution_date: datetime


class ExerciseExecutionCreate(ExerciseExecutionBase):
    """
    Modelo para criação de uma nova execução de exercício.

    Herda de `ExerciseExecutionBase` e contém os mesmos atributos.
    
    Este modelo é utilizado na entrada de dados ao criar uma nova execução de exercício, e pode ser expandido no futuro para incluir validações específicas para criação.
    """
    pass


class ExerciseExecution(ExerciseExecutionBase):
    """
    Modelo para representar uma execução de exercício no sistema, incluindo um identificador único (`id`).

    **Atributos adicionais**:
        - `id` (int): Identificador único da execução de exercício no sistema. 

    Este modelo é utilizado para retornar os dados de uma execução de exercício ao cliente, como na listagem ou na obtenção de detalhes de uma execução específica.

    **Configurações de ORM**:
        - `orm_mode` (bool): Define se o modelo deve operar em modo ORM, permitindo a leitura direta de objetos do ORM (Object-Relational Mapping) como SQLAlchemy.
    """
    id: int

    class Config:
        orm_mode = True