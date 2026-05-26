from src.models.languages import Language
from src.repositories.base_repository import SQLAlchemyRepository

class LanguageRepository(SQLAlchemyRepository):
    entity = Language