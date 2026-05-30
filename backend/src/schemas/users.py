from pydantic import Field, field_validator, EmailStr
from string import punctuation
from typing import Optional
from datetime import date

from src.schemas.base_schema import BaseSchema
from src.enums.users import UserRole

class UserSchema(BaseSchema):
    id: int
    username: str
    full_name: Optional[str] = Field(default=None)
    email: Optional[EmailStr] = Field(default=None)
    organization: Optional[str] = Field(default=None)
    role: UserRole
    created_at: date
    updated_at: date

class UserFilterSchema(BaseSchema):
    username: Optional[str] = Field(default=None, max_length=50, examples=["ZencorZ"])
    full_name: Optional[str] = Field(default=None)
    email: Optional[EmailStr] = Field(default=None, max_length=100)
    organization: Optional[str] = Field(default=None)
    role: Optional[UserRole] = Field(default=None)
    created_at: Optional[date] = Field(default=None)
    updated_at: Optional[date] = Field(default=None)

# Схема создания юзера для админ-панели, не используется для регистрации через /auth/register
class UserCreateSchema(BaseSchema):
    username: str = Field(max_length=50, examples=["ZencorZ"])
    password: str = Field(examples=["(p@SSword3.14)"])
    role: UserRole = Field(default=UserRole.USER)

    @field_validator('password')
    @classmethod
    def validate_password(cls, value: str) -> str:
        value = value.strip()

        if len(value) < 12:
            raise ValueError("Пароль должен быть не менее 12 символов.")
        
        checks = {
            'строчную букву': any(char.islower() for char in value),
            'цифру': any(char.isdigit() for char in value),
            'заглавную букву': any(char.isupper() for char in value),
            'специальный символ': any(char in punctuation for char in value)
        }

        for check, passed in checks.items():
            if not passed:
                raise ValueError(f"Пароль должен содержать хотя бы 1 {check}.")

        return value
    
class UserUpdateSchema(BaseSchema):
    username: Optional[str] = Field(default=None, max_length=50, examples=["ZencorZ"])
    password: Optional[str] = Field(default=None, examples=["(p@SSword3.14)"])
    organization: Optional[str] = Field(default=None)
    full_name: Optional[str] = Field(default=None)
    email: Optional[EmailStr] = Field(default=None, max_length=100)
    role: Optional[UserRole] = Field(default=None)

    @field_validator('password')
    @classmethod
    def validate_password(cls, value: str) -> str:
        value = value.strip()

        if len(value) < 12:
            raise ValueError("Пароль должен быть не менее 12 символов.")
        
        checks = {
            'строчную букву': any(char.islower() for char in value),
            'цифру': any(char.isdigit() for char in value),
            'заглавную букву': any(char.isupper() for char in value),
            'специальный символ': any(char in punctuation for char in value)
        }

        for check, passed in checks.items():
            if not passed:
                raise ValueError(f"Пароль должен содержать хотя бы 1 {check}.")

        return value