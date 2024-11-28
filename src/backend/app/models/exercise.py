from typing import Optional
from pydantic import BaseModel

class ExerciseBase(BaseModel):
    """
    Modelo base para representar um exercício, contendo os dados principais para descrever o exercício.

    **Atributos**:
        - `name` (str): Nome do exercício.
        - `path` (Optional[str]): Caminho para o arquivo de mídia (como um vídeo) associado ao exercício. Pode ser nulo.
        - `youtube_link` (Optional[str]): Link para um vídeo explicativo do exercício no YouTube. Pode ser nulo.
        - `instructions` (str): Instruções detalhadas para a execução correta do exercício.

    **Exemplo**:
    ```json
    {
        "name": "Flexão de Braço",
        "path": "/exercises/flexao_braço.mp4",
        "youtube_link": "https://youtu.be/example",
        "instructions": "Mantenha o corpo reto e flexione os braços para abaixar o corpo."
    }
    ```

    A classe fornece um exemplo no `schema_extra` para referência durante a documentação automática.
    """

    name: str
    path: Optional[str]
    youtube_link: Optional[str]
    instructions: str

    class Config:
        schema_extra = {
            "example": {
                "name": "Flexão de Braço",
                "path": "/exercises/flexao_braço.mp4",
                "youtube_link": "https://youtu.be/example",
                "instructions": "Mantenha o corpo reto e flexione os braços para abaixar o corpo."
            }
        }

class ExerciseCreate(ExerciseBase):
    """
    Modelo para criação de um novo exercício.

    Herda de `ExerciseBase`, incluindo todos os atributos necessários para definir um exercício.

    Esse modelo é utilizado ao inserir um novo exercício no sistema e pode ser expandido para incluir validações específicas para criação no futuro.
    """
    pass


class Exercise(ExerciseBase):
    """
    Modelo para representar um exercício completo, incluindo o identificador único (`id`).

    **Atributos adicionais**:
        - `id` (int): Identificador único do exercício no sistema.

    **Exemplo**:
    ```json
    {
        "id": 1,
        "name": "Flexão de Braço",
        "path": "/exercises/flexao_braço.mp4",
        "youtube_link": "https://youtu.be/example",
        "instructions": "Mantenha o corpo reto e flexione os braços para abaixar o corpo."
    }
    ```

    Este modelo é utilizado para retornar os dados completos de um exercício ao cliente, como em uma listagem ou ao obter detalhes de um exercício específico.

    **Configurações de ORM**:
        - `orm_mode` (bool): Ativado para permitir que o modelo opere em modo ORM, facilitando a integração com ORM, como SQLAlchemy.
    """
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": 1,
                "name": "Flexão de Braço",
                "path": "/exercises/flexao_braço.mp4",
                "youtube_link": "https://youtu.be/example",
                "instructions": "Mantenha o corpo reto e flexione os braços para abaixar o corpo."
            }
        }