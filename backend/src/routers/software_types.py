from typing import List
from fastapi import APIRouter, Depends

from src.services.software_types import SoftwareTypeService
from src.core.dependencies import UOWdep, AdminDep
from src.schemas.software_types import SoftwareTypeCreateSchema, SoftwareTypeUpdateSchema, SoftwareTypeSchema, SoftwareTypeFilterSchema

router = APIRouter(prefix='/software_types', tags=['SoftwareTypes'])

@router.post('/', status_code=201, response_model=SoftwareTypeSchema)
async def create_software_type(
    uow: UOWdep, 
    data: SoftwareTypeCreateSchema, 
    admin_sub: AdminDep
):
    return await SoftwareTypeService.create_software_type(uow, data)

@router.get('/', status_code=200, response_model=List[SoftwareTypeSchema])
async def get_software_types(
    uow: UOWdep, 
    filters: SoftwareTypeFilterSchema = Depends()
):
    return await SoftwareTypeService.get_software_types_filter_by(uow, filters)

@router.get('/{software_type_id}', status_code=200, response_model=SoftwareTypeSchema)
async def get_software_type(
    uow: UOWdep, 
    software_type_id: int
):
    return await SoftwareTypeService.get_software_type_filter_by(uow, software_type_id)

@router.put('/{software_type_id}', status_code=200, response_model=SoftwareTypeSchema)
async def update_software_type(
    uow: UOWdep, 
    software_type_id: int, 
    data: SoftwareTypeUpdateSchema, 
    admin_sub: AdminDep
):
    return await SoftwareTypeService.update_software_type(uow, software_type_id, data)

@router.delete('/{software_type_id}', status_code=204)
async def delete_software_type(
    uow: UOWdep, 
    software_type_id: int, 
    admin_sub: AdminDep
):
    return await SoftwareTypeService.delete_software_type(uow, software_type_id)