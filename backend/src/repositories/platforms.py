from src.models.platforms import Platform
from src.repositories.base_repository import SQLAlchemyRepository

class PlatformRepository(SQLAlchemyRepository):
    entity = Platform
