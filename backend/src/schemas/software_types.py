from pydantic import Field
from typing import Optional

from src.schemas.base_schema import BaseSchema

class SoftwareTypeSchema(BaseSchema):
    id: int
    name: str

class SoftwareTypeFilterSchema(BaseSchema):
    name: Optional[str] = Field(default=None, max_length=100, examples=["Маркетплейс"])

class SoftwareTypeCreateSchema(BaseSchema):
    name: str = Field(max_length=100, examples=["Маркетплейс"])

class SoftwareTypeUpdateSchema(BaseSchema):
    name: Optional[str] = Field(default=None, max_length=100, examples=["Маркетплейс"])
