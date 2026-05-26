from pydantic import Field
from typing import Optional
from datetime import date

from src.schemas.base_schema import BaseSchema
from src.schemas.users import UserSchema
from src.schemas.projects import ShortProjectSchema

class ReviewSchema(BaseSchema):
    id: int = Field(default=None)
    project_id: int = Field(default=None)
    client_id: int = Field(default=None)
    rating: int = Field(default=None)
    comment: Optional[str] = Field(default=None)
    created_at: date = Field(default=None)
    updated_at: date = Field(default=None)

    client: UserSchema = Field(default=None)
    project: ShortProjectSchema = Field(default=None)

class ReviewFilterSchema(BaseSchema):
    project_id: Optional[int] = Field(default=None, examples=[1])
    client_id: Optional[int] = Field(default=None, examples=[1])
    rating: Optional[int] = Field(default=None, gt=0, le=5, examples=[5])
    created_at: Optional[date] = Field(default=None)
    updated_at: Optional[date] = Field(default=None)

class ReviewCreateSchema(BaseSchema):
    project_id: int = Field(examples=[1])
    rating: int = Field(default=None, gt=0, le=5, examples=[5])
    comment: Optional[str] = Field(default=None, examples=["Отличный проект!"])

class ReviewUpdateSchema(BaseSchema):
    rating: Optional[int] = Field(default=None, gt=0, le=5, examples=[1])
    comment: Optional[str] = Field(default=None,examples=["Ужасный проект!"])