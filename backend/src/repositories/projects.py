from src.models.projects import Project
from src.repositories.base_repository import SQLAlchemyRepository

class ProjectRepository(SQLAlchemyRepository):
    entity = Project        
