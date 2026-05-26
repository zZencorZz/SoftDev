from pydantic import Field, field_validator
from string import punctuation

from src.schemas.base_schema import BaseSchema

class RegisterSchema(BaseSchema):
    username: str = Field(max_length=50, examples=["ZencorZ"])
    password: str = Field(examples=["(p@SSword3.14)"])

    @field_validator('password')
    @classmethod
    def validate_password(cls, value: str) -> str:
        value = value.strip()

        if len(value) < 12:
            raise ValueError("Пароль должен быть не менее 12 символов.")
        
        checks = {
            'цифру': any(char.isdigit() for char in value),
            'заглавную букву': any(char.isupper() for char in value),
            'строчную букву': any(char.islower() for char in value),
            'специальный символ': any(char in punctuation for char in value)
        }

        for check, passed in checks.items():
            if not passed:
                raise ValueError(f"Пароль должен содержать хотя бы 1 {check}.")

        return value
    
class LoginSchema(BaseSchema):
    username: str = Field(max_length=50, examples=["ZencorZ"])
    password: str = Field(examples=["(p@SSword3.14)"])