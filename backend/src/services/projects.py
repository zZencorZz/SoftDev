from src.schemas.projects import (ProjectCreateSchema, 
                                  ProjectUpdateSchema, 
                                  ProjectFilterSchema)
from src.repositories.unit_of_work import IUnitOfWork
from src.enums.users import UserRole
from src.core.exceptions import ForbiddenException

class ProjectService:
    
    @staticmethod
    async def create_project(uow: IUnitOfWork, data: ProjectCreateSchema, user_sub: dict):
        async with uow:
            data = data.clean_dict()
            data.update({"client_id": user_sub.get("user_id")})
            new_project = await uow.projects.create(data)
            await uow.commit()
            return new_project

    @staticmethod
    async def get_projects_filter_by(uow: IUnitOfWork, filters: ProjectFilterSchema):
        async with uow:
            projects = await uow.projects.get_all_filter_by(**filters.clean_dict())
            return projects or []

    @staticmethod
    async def get_project_filter_by(uow: IUnitOfWork, project_id: int):
        async with uow:
            project = await uow.projects.get_one_filter_by(id=project_id)
            return project
        
    @staticmethod
    async def update_project(uow: IUnitOfWork, project_id: int, data: ProjectUpdateSchema, user_sub: dict):
        async with uow:
            project = await uow.projects.get_one_filter_by(id=project_id)
            upd_project = await uow.projects.update(entity_id=project_id, **data.clean_dict())
            await uow.commit()
            return upd_project
        
    @staticmethod 
    async def delete_project(uow: IUnitOfWork, project_id: int, admin_sub: dict):
        async with uow:
            await uow.projects.delete(project_id)
            await uow.commit()