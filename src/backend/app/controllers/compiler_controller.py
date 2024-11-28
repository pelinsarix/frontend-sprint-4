from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel

from app.compilador.analisador_lexico.analisador_lexico import AnalisadorLexico
from app.compilador.analisador_lexico.classes_auxiliares import LexicalException
from app.compilador.analisador_sintatico.analisador_sintatico import AnalisadorSintatico
from app.compilador.analisador_sintatico.classes_auxiliares import SyntaxException

router = APIRouter()

class CompilationRequest(BaseModel):
    """
    Model for compilation requests.
    
    Attributes:
        source_code (str): Source code to be analyzed/compiled
    """
    source_code: str
    
    class Config:
        schema_extra = {
            "example": {
                "source_code": "number1 : 5\nnumber2 RECEBA 10\n"
            }
        }

class TokenResponse(BaseModel):
    """
    Model to represent a token in the API response.
    
    Attributes:
        type (str): Token type
        value (str): Token value
        line (int): Line where the token was found
    """
    type: str
    value: str
    line: int

def token_to_dict(token) -> Dict[str, Any]:
    """
    Converts a Token object to a dictionary.
    
    Args:
        token: Token object from lexical analyzer
        
    Returns:
        Dict[str, Any]: Dictionary representing the token
    """
    return {
        "type": token.tipo,
        "value": token.valor,
        "line": token.linha
    }

@router.post("/lexical-analysis", 
            response_model=List[TokenResponse],
            tags=["Compiler"],
            summary="Performs lexical analysis",
            description="Receives source code and returns a list of identified tokens.")
async def lexical_analysis(request: CompilationRequest):
    """
    Endpoint to perform lexical analysis of the source code.
    
    Args:
        request (CompilationRequest): Request containing the source code
        
    Returns:
        List[TokenResponse]: List of found tokens
        
    Raises:
        HTTPException: If there's an error in lexical analysis
    """
    try:
        analyzer = AnalisadorLexico(request.source_code)
        tokens = analyzer.getTokens()
        return [token_to_dict(token) for token in tokens]
    except LexicalException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

@router.post("/compile",
            tags=["Compiler"],
            summary="Performs complete compilation",
            description="Receives source code and performs the complete compilation process (currently only lexical analysis and partial syntactic analysis).")
async def compile_code(request: CompilationRequest):
    """
    Main compilation endpoint. Currently performs lexical and partial syntactic analysis.
    
    Args:
        request (CompilationRequest): Request containing the source code
        
    Returns:
        Dict: Compilation result containing tokens and syntax tree
        
    Raises:
        HTTPException: If there's an error in any compilation step
    """
    try:
        # Lexical Analysis
        lexical_analyzer = AnalisadorLexico(request.source_code)
        tokens = lexical_analyzer.getTokens()
        
        # Syntactic Analysis
        syntactic_analyzer = AnalisadorSintatico(tokens)
        syntax_tree = syntactic_analyzer.analisar()
        
        # Prepare response
        return {
            "tokens": [token_to_dict(token) for token in tokens],
            "syntax_tree": str(syntax_tree)  # For now, just string representation
        }
        
    except LexicalException as e:
        raise HTTPException(status_code=400, detail=f"Lexical error: {str(e)}")
    except SyntaxException as e:
        raise HTTPException(status_code=400, detail=f"Syntactic error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")