from src.models.messages import Message
from src.repositories.base_repository import SQLAlchemyRepository

class MessageRepository(SQLAlchemyRepository):
    entity = Message