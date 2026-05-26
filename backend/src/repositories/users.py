from src.models.users import User
from src.repositories.base_repository import SQLAlchemyRepository

class UserRepository(SQLAlchemyRepository):
    entity = User