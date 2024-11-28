from app.models.exercise import ExerciseCreate
from app.prisma_db import db

async def get_exercise(exercise_id: int):
    return await db.exercise.find_unique(where={"id": exercise_id})

async def get_exercises():
    return await db.exercise.find_many()

async def create_exercise(exercise: ExerciseCreate):
    return await db.exercise.create(data=exercise.dict())

async def update_exercise(exercise_id: int, exercise: ExerciseCreate):
    return await db.exercise.update(where={"id": exercise_id}, data=exercise.dict())

async def delete_exercise(exercise_id: int):
    return await db.exercise.delete(where={"id": exercise_id})