from src.models.projects import Project, project_languages, project_platforms
from src.repositories.base_repository import SQLAlchemyRepository

class ProjectRepository(SQLAlchemyRepository):
    entity = Project        


class ProjectLanguageRepository(SQLAlchemyRepository):
    entity = project_languages

class ProjectPlatformRepository(SQLAlchemyRepository):
    entity = project_platforms