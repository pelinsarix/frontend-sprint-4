from fastapi import APIRouter, HTTPException
from typing import List
from app.services.patient_service import get_patients, create_patient, get_patient, update_patient, delete_patient
from app.models.patient import PatientCreate, Patient

router = APIRouter()

@router.get("/patients", response_model=List[Patient], tags=["Pacientes"], 
            summary="Lista todos os pacientes", 
            description="Retorna uma lista com todos os pacientes cadastrados no sistema.")
async def read_patients():
    """
    Fetches and returns a list of all patients registered in the system.
    
    Raises:
        HTTPException (502): If there is an internal server error during data retrieval.
        
    Returns:
        List[Patient]: List of patients with details as per Patient model.
    """
    try:
        return await get_patients()
    except Exception:
        raise HTTPException(status_code=502, detail="Internal server error: unable to get patients")

@router.post("/patients", response_model=Patient, tags=["Pacientes"], 
             summary="Cria um novo paciente", 
             description="Adiciona um novo paciente ao sistema com as informações fornecidas.")
async def create_new_patient(patient: PatientCreate):
    """
    Adds a new patient to the system with the provided details.
    
    Args:
        patient (PatientCreate): Details of the patient to be created.
        
    Raises:
        HTTPException (502): If there is a connection error during creation.
        HTTPException (400): If there is another error with the request or data.

    Returns:
        Patient: The newly created patient object.
    """
    try:
        new_patient = await create_patient(patient)
        return new_patient
    except ConnectionError:
        raise HTTPException(status_code=502, detail="Internal server error: unable to create patient")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
@router.get("/patients/{patient_id}", response_model=Patient, tags=["Pacientes"], 
            summary="Obtém um paciente pelo ID", 
            description="Retorna os dados de um paciente específico com base no ID fornecido.")
async def read_patient(patient_id: int):
    """
    Retrieves a patient by its ID.
    
    Args:
        patient_id (int): The unique identifier of the patient.
        
    Raises:
        HTTPException (404): If the patient is not found.
        HTTPException (502): If there is an internal server error.
        
    Returns:
        Patient: The patient data corresponding to the given ID.
    """
    try:
        patient= await get_patient(patient_id)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        return patient
    except Exception:
        raise HTTPException(status_code=502, detail="Internal server error: unable to get patient")

@router.put("/patients/{patient_id}", response_model=Patient, tags=["Pacientes"], 
            summary="Atualiza os dados de um paciente", 
            description="Atualiza as informações de um paciente específico com base no ID e dados fornecidos.")
async def update_existing_patient(patient_id: int, patient: PatientCreate):
    """
    Updates the details of an existing patient based on its ID.
    
    Args:
        patient_id (int): The unique identifier of the patient to update.
        patient (PatientCreate): Updated data for the patient.
        
    Raises:
        HTTPException (404): If the patient is not found or update fails.
        HTTPException (502): If there is an internal server error during update.
        
    Returns:
        Patient: The updated patient data.
    """
    try:
        updated_patient = await update_patient(patient_id, patient)
        if not updated_patient:
            raise HTTPException(status_code=404, detail="Patient not found or update failed")
        return updated_patient
    except Exception:
        raise HTTPException(status_code=502, detail="Internal server error: unable to update patient")  

@router.delete("/patients/{patient_id}", response_model=Patient, tags=["Pacientes"], 
               summary="Remove um paciente", 
               description="Deleta um paciente específico do sistema com base no ID fornecido.")
async def delete_existing_patient(patient_id: int):
    """
    Deletes a patient based on its ID.
    
    Args:
        patient_id (int): The unique identifier of the patient to delete.
        
    Raises:
        HTTPException (404): If the patient is not found or deletion fails.
        HTTPException (502): If there is an internal server error during deletion.
        
    Returns:
        Patient: The data of the deleted patient.
    """
    try:
        deleted_patient = await delete_patient(patient_id)
        if not deleted_patient:
            raise HTTPException(status_code=404, detail="Patient not found or delete failed")
        return deleted_patient
    except Exception:
        raise HTTPException(status_code=502, detail="Internal server error: unable to delete patient")