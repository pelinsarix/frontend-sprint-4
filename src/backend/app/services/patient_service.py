from app.models.patient import PatientCreate
from app.prisma_db import db

async def get_patient(patient_id: int):
    return await db.patient.find_unique(where={"id": patient_id})

async def get_patients():
    return await db.patient.find_many()

async def create_patient(patient: PatientCreate):
    return await db.patient.create(data=patient.dict())

async def update_patient(patient_id: int, patient: PatientCreate):
    return await db.patient.update(where={"id": patient_id}, data=patient.dict())

async def delete_patient(patient_id: int):
    return await db.patient.delete(where={"id": patient_id})