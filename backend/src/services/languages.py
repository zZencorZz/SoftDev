from src.schemas.languages import LanguageCreateSchema, LanguageUpdateSchema, LanguageFilterSchema
from src.repositories.unit_of_work import IUnitOfWork

class LanguageService:
    
    @staticmethod
    async def create_language(uow: IUnitOfWork, data: LanguageCreateSchema):
        async with uow:
            new_language = await uow.languages.create(data.clean_dict())
            await uow.commit()
            return new_language

    @staticmethod
    async def get_languages_filter_by(uow: IUnitOfWork, filters: LanguageFilterSchema):
        async with uow:
            languages = await uow.languages.get_all_filter_by(**filters.clean_dict())
            return languages or []

    @staticmethod
    async def get_language_filter_by(uow: IUnitOfWork, language_id: int):
        async with uow:
            language = await uow.languages.get_one_filter_by(id=language_id)
            return language
        
    @staticmethod
    async def update_language(uow: IUnitOfWork, language_id: int, data: LanguageUpdateSchema):
        async with uow:
            upd_language = await uow.languages.update(entity_id=language_id, **data.clean_dict())
            await uow.commit()
            return upd_language
        
    @staticmethod
    async def delete_language(uow: IUnitOfWork, language_id: int):
        async with uow:
            await uow.languages.delete(entity_id=language_id)
            await uow.commit()