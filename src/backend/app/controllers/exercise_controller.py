from fastapi import APIRouter, HTTPException
from typing import List
from app.services.exercise_service import get_exercises, create_exercise, get_exercise, update_exercise, delete_exercise
from app.models.exercise import ExerciseCreate, Exercise

router = APIRouter()

@router.get("/exercises", response_model=List[Exercise], tags=["Exercícios"], 
            summary="Lista todos os exercícios", 
            description="Retorna uma lista de todos os exercícios cadastrados no sistema.")
async def read_exercises():
    """
    Fetches and returns a list of all exercises registered in the system.
    
    Raises:
        HTTPException (502): If there is an internal server error during data retrieval.
        
    Returns:
        List[Exercise]: List of exercises with details as per Exercise model.
    """
    try:
        return await get_exercises()
    except Exception:
        raise HTTPException(status_code=502, detail="Internal server error: unable to get exercises")

@router.post("/exercises", response_model=Exercise, tags=["Exercícios"], 
             summary="Cria um novo exercício", 
             description="Adiciona um novo exercício ao sistema com as informações fornecidas.")
async def create_new_exercise(exercise: ExerciseCreate):
    """
    Adds a new exercise to the system with provided details.
    
    Args:
        exercise (ExerciseCreate): Details of the exercise to be created.
        
    Raises:
        HTTPException (502): If there is a connection error during creation.
        HTTPException (400): If there is another error with the request or data.

    Returns:
        Exercise: The newly created exercise object.
    """
    try:
        new_exercise = await create_exercise(exercise)
        return new_exercise
    except ConnectionError:
        raise HTTPException(status_code=502, detail="Internal server error: unable to create exercise")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/exercises/{exercise_id}", response_model=Exercise, tags=["Exercícios"], 
            summary="Obtém um exercício pelo ID", 
            description="Retorna os dados de um exercício específico com base no ID fornecido.")
async def read_exercise(exercise_id: int):
    """
    Retrieves an exercise by its ID.
    
    Args:
        exercise_id (int): The unique identifier of the exercise.
        
    Raises:
        HTTPException (404): If the exercise is not found.
        HTTPException (502): If there is an internal server error.
        
    Returns:
        Exercise: The exercise data corresponding to the given ID.
    """
    try:
        exercise = await get_exercise(exercise_id)
        if not exercise:
            raise HTTPException(status_code=404, detail="Exercise not found")
        return exercise
    except Exception:
        raise HTTPException(status_code=502, detail="Internal server error: unable to get exercise")

@router.put("/exercises/{exercise_id}", response_model=Exercise, tags=["Exercícios"], 
            summary="Atualiza os dados de um exercício", 
            description="Atualiza as informações de um exercício específico com base no ID e dados fornecidos.")
async def update_existing_exercise(exercise_id: int, exercise: ExerciseCreate):
    """
    Updates the details of an existing exercise based on its ID.
    
    Args:
        exercise_id (int): The unique identifier of the exercise to update.
        exercise (ExerciseCreate): Updated data for the exercise.
        
    Raises:
        HTTPException (404): If the exercise is not found or update fails.
        HTTPException (502): If there is an internal server error during update.
        
    Returns:
        Exercise: The updated exercise data.
    """
    try:
        updated_exercise = await update_exercise(exercise_id, exercise)
        if not updated_exercise:
            raise HTTPException(status_code=404, detail="Exercise not found or update failed")
        return updated_exercise
    except Exception:
        raise HTTPException(status_code=502, detail="Internal server error: unable to update exercise")

@router.delete("/exercises/{exercise_id}", response_model=Exercise, tags=["Exercícios"], 
               summary="Remove um exercício", 
               description="Deleta um exercício específico do sistema com base no ID fornecido.")
async def delete_existing_exercise(exercise_id: int):
    """
    Deletes an exercise based on its ID.
    
    Args:
        exercise_id (int): The unique identifier of the exercise to delete.
        
    Raises:
        HTTPException (404): If the exercise is not found or deletion fails.
        HTTPException (502): If there is an internal server error during deletion.
        
    Returns:
        Exercise: The data of the deleted exercise.
    """
    try:
        deleted_exercise = await delete_exercise(exercise_id)
        if not deleted_exercise:
            raise HTTPException(status_code=404, detail="Exercise not found or delete failed")
        return deleted_exercise
    except Exception:
        raise HTTPException(status_code=502, detail="Internal server error: unable to delete exercise")