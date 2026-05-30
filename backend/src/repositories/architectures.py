from src.models.architectures import Architecture
from src.repositories.base_repository import SQLAlchemyRepository

class ArchitectureRepository(SQLAlchemyRepository):
    entity = Architecture