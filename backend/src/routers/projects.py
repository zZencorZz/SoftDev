from typing import List
from fastapi import APIRouter, Depends

from src.services.projects import ProjectService
from src.core.dependencies import UOWdep, UserDep, AdminDep
from src.schemas.projects import (ProjectCreateSchema,
                                  ProjectUpdateSchema, 
                                  ProjectSchema, 
                                  ProjectFilterSchema)

router = APIRouter(prefix='/projects', tags=['Projects'])

@router.post('/', status_code=201, response_model=ProjectSchema)
async def create_project(
    uow: UOWdep, 
    data: ProjectCreateSchema, 
    user_sub: UserDep
):
    return await ProjectService.create_project(uow, data, user_sub)

@router.get('/', status_code=200, response_model=List[ProjectSchema])
async def get_projects(
    uow: UOWdep, 
    filters: ProjectFilterSchema = Depends()
):
    return await ProjectService.get_projects_filter_by(uow, filters)

@router.get('/{project_id}', status_code=200, response_model=ProjectSchema)
async def get_project(
    uow: UOWdep, 
    project_id: int
):
    return await ProjectService.get_project_filter_by(uow, project_id)

@router.put('/{project_id}', status_code=200, response_model=ProjectSchema)
async def update_project(
    uow: UOWdep, 
    project_id: int, 
    data: ProjectUpdateSchema, 
    user_sub: UserDep
):
    return await ProjectService.update_project(uow, project_id, data, user_sub)

@router.delete('/{project_id}', status_code=204)
async def delete_project(
    uow: UOWdep, 
    project_id: int, 
    admin_sub: AdminDep
):
    return await ProjectService.delete_project(uow, project_id, admin_sub)