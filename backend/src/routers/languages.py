from typing import List
from fastapi import APIRouter, Depends

from src.services.languages import LanguageService
from src.core.dependencies import UOWdep, AdminDep
from src.schemas.languages import LanguageCreateSchema, LanguageUpdateSchema, LanguageSchema, LanguageFilterSchema

router = APIRouter(prefix='/languages', tags=['Languages'])

@router.post('/', status_code=201, response_model=LanguageSchema)
async def create_language(
    uow: UOWdep, 
    data: LanguageCreateSchema, 
    admin_sub: AdminDep
):
    return await LanguageService.create_language(uow, data)

@router.get('/', status_code=200, response_model=List[LanguageSchema])
async def get_languages(
    uow: UOWdep, 
    filters: LanguageFilterSchema = Depends()
):
    return await LanguageService.get_languages_filter_by(uow, filters)

@router.get('/{language_id}', status_code=200, response_model=LanguageSchema)
async def get_language(
    uow: UOWdep, 
    language_id: int
):
    return await LanguageService.get_language_filter_by(uow, language_id)

@router.put('/{language_id}', status_code=200, response_model=LanguageSchema)
async def update_language(
    uow: UOWdep, 
    language_id: int, 
    data: LanguageUpdateSchema, 
    admin_sub: AdminDep
):
    return await LanguageService.update_language(uow, language_id, data)

@router.delete('/{language_id}', status_code=204)
async def delete_language(
    uow: UOWdep, 
    language_id: int, 
    admin_sub: AdminDep
):
    return await LanguageService.delete_language(uow, language_id)