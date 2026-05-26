from pydantic import Field, ConfigDict
from typing import Optional
from datetime import date

from src.schemas.base_schema import BaseSchema

class LanguageSchema(BaseSchema):
    id: int
    name: str

class LanguageFilterSchema(BaseSchema):
    name: Optional[str] = Field(default=None, max_length=100, examples=["Python"])

class LanguageCreateSchema(BaseSchema):
    name: str = Field(max_length=100, examples=["Python"])

class LanguageUpdateSchema(BaseSchema):
    name: Optional[str] = Field(default=None, max_length=100, examples=["Python"])
