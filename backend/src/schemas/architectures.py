from pydantic import Field
from typing import Optional

from src.schemas.base_schema import BaseSchema

class ArchitectureSchema(BaseSchema):
    id: int
    name: str

class ArchitectureFilterSchema(BaseSchema):
    name: Optional[str] = Field(default=None, max_length=100, examples=["Microservices"])

class ArchitectureCreateSchema(BaseSchema):
    name: str = Field(max_length=100, examples=["Microservices"])

class ArchitectureUpdateSchema(BaseSchema):
    name: Optional[str] = Field(default=None, max_length=100, examples=["Microservices"])
