from enum import StrEnum

class UserRole(StrEnum):
    ADMIN = 'admin'
    USER = 'user'

class TokenType(StrEnum):
    ACCESS = 'access'
    REFRESH = 'refresh'