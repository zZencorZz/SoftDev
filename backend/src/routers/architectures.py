from typing import List
from fastapi import APIRouter, Depends

from src.services.architectures import ArchitectureService
from src.core.dependencies import UOWdep, AdminDep
from src.schemas.architectures import ArchitectureCreateSchema, ArchitectureUpdateSchema, ArchitectureSchema, ArchitectureFilterSchema

router = APIRouter(prefix='/architectures', tags=['Architectures'])

@router.post('/', status_code=201, response_model=ArchitectureSchema)
async def create_architecture(
    uow: UOWdep, 
    data: ArchitectureCreateSchema, 
    admin_sub: AdminDep
):
    return await ArchitectureService.create_architecture(uow, data)

@router.get('/', status_code=200, response_model=List[ArchitectureSchema])
async def get_architectures(
    uow: UOWdep, 
    filters: ArchitectureFilterSchema = Depends()
):
    return await ArchitectureService.get_architectures_filter_by(uow, filters)

@router.get('/{architecture_id}', status_code=200, response_model=ArchitectureSchema)
async def get_architecture(
    uow: UOWdep, 
    architecture_id: int
):
    return await ArchitectureService.get_architecture_filter_by(uow, architecture_id)

@router.put('/{architecture_id}', status_code=200, response_model=ArchitectureSchema)
async def update_architecture(
    uow: UOWdep, 
    architecture_id: int, 
    data: ArchitectureUpdateSchema, 
    admin_sub: AdminDep
):
    return await ArchitectureService.update_architecture(uow, architecture_id, data)

@router.delete('/{architecture_id}', status_code=204)
async def delete_architecture(
    uow: UOWdep, 
    architecture_id: int, 
    admin_sub: AdminDep
):
    return await ArchitectureService.delete_architecture(uow, architecture_id)