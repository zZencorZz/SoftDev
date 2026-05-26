from src.schemas.platforms import PlatformCreateSchema, PlatformUpdateSchema, PlatformFilterSchema
from src.repositories.unit_of_work import IUnitOfWork

class PlatformService:
    
    @staticmethod
    async def create_platform(uow: IUnitOfWork, data: PlatformCreateSchema):
        async with uow:
            new_platform = await uow.platforms.create(data.clean_dict())
            await uow.commit()
            return new_platform

    @staticmethod
    async def get_platforms_filter_by(uow: IUnitOfWork, filters: PlatformFilterSchema):
        async with uow:
            platforms = await uow.platforms.get_all_filter_by(**filters.clean_dict())
            return platforms or []

    @staticmethod
    async def get_platform_filter_by(uow: IUnitOfWork, platform_id: int):
        async with uow:
            platform = await uow.platforms.get_one_filter_by(id=platform_id)
            return platform
        
    @staticmethod
    async def update_platform(uow: IUnitOfWork, platform_id: int, data: PlatformUpdateSchema):
        async with uow:
            upd_platform = await uow.platforms.update(entity_id=platform_id, **data.clean_dict())
            await uow.commit()
            return upd_platform
        
    @staticmethod
    async def delete_platform(uow: IUnitOfWork, platform_id: int):
        async with uow:
            await uow.platforms.delete(entity_id=platform_id)
            await uow.commit()