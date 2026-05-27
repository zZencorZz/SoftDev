from pydantic import Field
from typing import Optional

from src.schemas.base_schema import BaseSchema

class PlatformSchema(BaseSchema):
    id: int
    name: str

class PlatformFilterSchema(BaseSchema):
    name: Optional[str] = Field(default=None, max_length=100, examples=["GitHub"])

class PlatformCreateSchema(BaseSchema):
    name: str = Field(max_length=100, examples=["Web"])

class PlatformUpdateSchema(BaseSchema):
    name: Optional[str] = Field(default=None, max_length=100, examples=["Android"])
