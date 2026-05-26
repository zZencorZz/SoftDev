from src.models.reviews import Review
from src.repositories.base_repository import SQLAlchemyRepository

class ReviewRepository(SQLAlchemyRepository):
    entity = Review