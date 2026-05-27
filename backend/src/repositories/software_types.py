from src.models.software_types import SoftwareType
from src.repositories.base_repository import SQLAlchemyRepository

class SoftwareTypeRepository(SQLAlchemyRepository):
    entity = SoftwareType