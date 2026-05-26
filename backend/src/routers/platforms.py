from typing import List
from fastapi import APIRouter, Depends

from src.services.platforms import PlatformService
from src.core.dependencies import UOWdep, AdminDep
from src.schemas.platforms import PlatformCreateSchema, PlatformUpdateSchema, PlatformSchema, PlatformFilterSchema

router = APIRouter(prefix='/platforms', tags=['Platforms'])

@router.post('/', status_code=201, response_model=PlatformSchema)
async def create_platform(
    uow: UOWdep, 
    data: PlatformCreateSchema, 
    admin_sub: AdminDep
):
    return await PlatformService.create_platform(uow, data)

@router.get('/', status_code=200, response_model=List[PlatformSchema])
async def get_platforms(
    uow: UOWdep, 
    filters: PlatformFilterSchema = Depends()
):
    return await PlatformService.get_platforms_filter_by(uow, filters)

@router.get('/{platform_id}', status_code=200, response_model=PlatformSchema)
async def get_platform(
    uow: UOWdep, 
    platform_id: int
):
    return await PlatformService.get_platform_filter_by(uow, platform_id)

@router.put('/{platform_id}', status_code=200, response_model=PlatformSchema)
async def update_platform(
    uow: UOWdep, 
    platform_id: int, 
    data: PlatformUpdateSchema, 
    admin_sub: AdminDep
):
    return await PlatformService.update_platform(uow, platform_id, data)

@router.delete('/{platform_id}', status_code=204)
async def delete_platform(
    uow: UOWdep, 
    platform_id: int, 
    admin_sub: AdminDep
):
    return await PlatformService.delete_platform(uow, platform_id)