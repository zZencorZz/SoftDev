from src.schemas.software_types import SoftwareTypeCreateSchema, SoftwareTypeUpdateSchema, SoftwareTypeFilterSchema
from src.repositories.unit_of_work import IUnitOfWork

class SoftwareTypeService:
    
    @staticmethod
    async def create_software_type(uow: IUnitOfWork, data: SoftwareTypeCreateSchema):
        async with uow:
            new_software_type = await uow.software_types.create(data.clean_dict())
            await uow.commit()
            return new_software_type

    @staticmethod
    async def get_software_types_filter_by(uow: IUnitOfWork, filters: SoftwareTypeFilterSchema):
        async with uow:
            software_types = await uow.software_types.get_all_filter_by(**filters.clean_dict())
            return software_types or []

    @staticmethod
    async def get_software_type_filter_by(uow: IUnitOfWork, software_type_id: int):
        async with uow:
            software_type = await uow.software_types.get_one_filter_by(id=software_type_id)
            return software_type
        
    @staticmethod
    async def update_software_type(uow: IUnitOfWork, software_type_id: int, data: SoftwareTypeUpdateSchema):
        async with uow:
            upd_software_type = await uow.software_types.update(entity_id=software_type_id, **data.clean_dict())
            await uow.commit()
            return upd_software_type
        
    @staticmethod
    async def delete_software_type(uow: IUnitOfWork, software_type_id: int):
        async with uow:
            await uow.software_types.delete(entity_id=software_type_id)
            await uow.commit()