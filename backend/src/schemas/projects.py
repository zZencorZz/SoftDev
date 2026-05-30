from pydantic import Field, ConfigDict
from typing import Optional, List
from datetime import date

from src.schemas.base_schema import BaseSchema
from src.enums.projects import ProjectStatus, LinkName
from src.schemas.users import UserSchema
from src.schemas.platforms import PlatformSchema
from src.schemas.languages import LanguageSchema
from src.schemas.architectures import ArchitectureSchema
from src.schemas.software_types import SoftwareTypeSchema

class LinkSchema(BaseSchema):
    name: LinkName = Field(examples=[LinkName.GITHUB])
    url: str = Field(examples=["https://github.com"])

class ShortProjectSchema(BaseSchema):
    id: int
    name: str

class ProjectSchema(BaseSchema):
    id: int
    client: UserSchema
    manager: Optional[UserSchema] = Field(default=None)

    name: str
    description: Optional[str] = Field(default=None)

    language: Optional[LanguageSchema] = Field(default=None)
    platform: Optional[PlatformSchema] = Field(default=None)
    architecture: Optional[ArchitectureSchema] = Field(default=None)
    software_type: Optional[SoftwareTypeSchema] = Field(default=None)

    target_users_count: Optional[int] = Field(default=None)

    links: Optional[List[LinkSchema]] = Field(default=None)

    status: ProjectStatus
    price: Optional[float] = Field(default=None, ge=0)
    deadline: Optional[date] = Field(default=None)

    created_at: date
    updated_at: date

class ProjectFilterSchema(BaseSchema):
    client_id: Optional[int] = Field(default=None)
    manager_id: Optional[int] = Field(default=None)

    name: Optional[str] = Field(default=None, max_length=100)

    language_id: Optional[int] = Field(default=None)
    platform_id: Optional[int] = Field(default=None)
    architecture_id: Optional[int] = Field(default=None)
    software_type_id: Optional[int] = Field(default=None)

    status: Optional[ProjectStatus] = Field(default=None)
    price: Optional[float] = Field(default=None, ge=0)
    deadline: Optional[date] = Field(default=None)

    created_at: Optional[date] = Field(default=None)
    updated_at: Optional[date] = Field(default=None)

class ProjectCreateSchema(BaseSchema):
    name: str = Field(max_length=100, examples=["Новый проект"])
    description: Optional[str] = Field(default=None, max_length=255, examples=["Описание нового проекта"])

    language_id: Optional[int] = Field(default=None)
    platform_id: Optional[int] = Field(default=None)
    architecture_id: Optional[int] = Field(default=None)
    software_type_id: Optional[int] = Field(default=None)

    target_users_count: Optional[int] = Field(default=None)

    links: Optional[List[LinkSchema]] = Field(default=None)

    price: Optional[float] = Field(default=None, ge=0)
    deadline: Optional[date] = Field(default=None)

class ProjectUpdateSchema(BaseSchema):
    name: Optional[str] = Field(default=None, max_length=100, examples=["Обновленный проект"])
    description: Optional[str] = Field(default=None, max_length=255, examples=["Обновленное описание проекта"])

    language_id: Optional[int] = Field(default=None)
    platform_id: Optional[int] = Field(default=None)
    architecture_id: Optional[int] = Field(default=None)
    software_type_id: Optional[int] = Field(default=None)

    target_users_count: Optional[int] = Field(default=None)

    links: Optional[List[LinkSchema]] = Field(default=None)

    price: Optional[float] = Field(default=None, ge=0)
    deadline: Optional[date] = Field(default=None)

    model_config = ConfigDict(extra="forbid")
