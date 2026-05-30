from src.schemas.architectures import ArchitectureCreateSchema, ArchitectureUpdateSchema, ArchitectureFilterSchema
from src.repositories.unit_of_work import IUnitOfWork

class ArchitectureService:
    
    @staticmethod
    async def create_architecture(uow: IUnitOfWork, data: ArchitectureCreateSchema):
        async with uow:
            new_architecture = await uow.architectures.create(data.clean_dict())
            await uow.commit()
            return new_architecture

    @staticmethod
    async def get_architectures_filter_by(uow: IUnitOfWork, filters: ArchitectureFilterSchema):
        async with uow:
            architectures = await uow.architectures.get_all_filter_by(**filters.clean_dict())
            return architectures or []

    @staticmethod
    async def get_architecture_filter_by(uow: IUnitOfWork, architecture_id: int):
        async with uow:
            architecture = await uow.architectures.get_one_filter_by(id=architecture_id)
            return architecture
        
    @staticmethod
    async def update_architecture(uow: IUnitOfWork, architecture_id: int, data: ArchitectureUpdateSchema):
        async with uow:
            upd_architecture = await uow.architectures.update(entity_id=architecture_id, **data.clean_dict())
            await uow.commit()
            return upd_architecture
        
    @staticmethod
    async def delete_architecture(uow: IUnitOfWork, architecture_id: int):
        async with uow:
            await uow.architectures.delete(entity_id=architecture_id)
            await uow.commit()