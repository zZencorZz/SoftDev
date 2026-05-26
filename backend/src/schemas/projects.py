from pydantic import Field, ConfigDict
from typing import Optional
from datetime import date

from src.schemas.base_schema import BaseSchema
from src.enums.projects import ProjectStatus
from src.schemas.platforms import PlatformSchema
from src.schemas.languages import LanguageSchema

class ShortProjectSchema(BaseSchema):
    id: int
    name: str

class ProjectSchema(BaseSchema):
    id: int
    client_id: int
    manager_id: Optional[int] = Field(default=None)
    name: str
    description: Optional[str] = Field(default=None)
    status: ProjectStatus
    price: Optional[float] = Field(default=None, ge=0)
    created_at: date
    updated_at: date

class ProjectFilterSchema(BaseSchema):
    client_id: Optional[int] = Field(default=None)
    manager_id: Optional[int] = Field(default=None)
    name: Optional[str] = Field(default=None, max_length=100)
    status: Optional[ProjectStatus] = Field(default=None)
    price: Optional[float] = Field(default=None, ge=0)
    created_at: Optional[date] = Field(default=None)
    updated_at: Optional[date] = Field(default=None)


class ProjectCreateSchema(BaseSchema):
    name: str = Field(max_length=100, examples=["Новый проект"])
    description: Optional[str] = Field(default=None, max_length=255, examples=["Описание проекта"])

    model_config = ConfigDict(extra="forbid")
    
class ProjectCreateManagerSchema(ProjectCreateSchema):
    client_id: int = Field(..., examples=[1])
    price: Optional[float] = Field(default=None, ge=0, examples=[1000.00])
    status: Optional[ProjectStatus] = Field(default=ProjectStatus.CREATED)

    model_config = ConfigDict(extra="ignore")


class ProjectUpdateSchema(BaseSchema):
    name: Optional[str] = Field(default=None, max_length=100, examples=["Обновленный проект"])
    description: Optional[str] = Field(default=None, max_length=255, examples=["Обновленное описание проекта"])

    model_config = ConfigDict(extra="forbid")

class ProjectUpdateManagerSchema(ProjectUpdateSchema):
    manager_id: Optional[int] = Field(default=None, examples=[2])
    price: Optional[float] = Field(default=None, ge=0, examples=[1500.00])
    status: Optional[ProjectStatus] = Field(default=None)
    
    model_config = ConfigDict(extra="ignore")