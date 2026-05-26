from datetime import datetime
from jwt import PyJWT

from src.schemas.auth import RegisterSchema, LoginSchema
from src.repositories.unit_of_work import IUnitOfWork
from src.enums.users import TokenType
from src.enums.users import UserRole
from src.core.security import SecurityConfig
from src.core.exceptions import ForbiddenException, AuthException

class AuthService:
    def __init__(self):
        self._jwt = PyJWT()

    async def registration(self, uow: IUnitOfWork, data: RegisterSchema):
        data.password = SecurityConfig.pwd_context.hash(data.password)

        async with uow:
            new_user = await uow.users.create(data.clean_dict())
            await uow.commit()
        
            return self._generate_user_tokens(new_user.id, new_user.role)

    async def login(self, uow: IUnitOfWork, data: LoginSchema) -> dict:
        async with uow:
            user = await uow.users.get_one_filter_by(username=data.username)

            if not user or not SecurityConfig.pwd_context.verify(data.password, user.password):
                raise AuthException(message="Неверные учетные данные")
            
            return self._generate_user_tokens(user.id, user.role)
             
    async def get_user_data_from_token(self, token: str):
        payload = self._decode_jwt(token)

        if payload['type'] != TokenType.ACCESS:
            raise AuthException(message="Неверный тип токена")
        
        user_id = payload.get('sub')
        if not user_id:
            raise AuthException(message="ID пользователя отсутствует в токене")
        
        user_role = payload.get('role')
        if not user_role:
            raise AuthException(message="Роль пользователя отсутствует в токене")
        
        return {
            "user_id": int(user_id), 
            "user_role": user_role
        }
    
    async def verify_admin_access(self, token: str):
        user_data = await self.get_user_data_from_token(token)
        if user_data['user_role'] != UserRole.ADMIN:
            raise ForbiddenException(message="Требуются права администратора")
        return user_data

    async def refresh_token(self, refresh_token: str) -> dict:
        payload = self._decode_jwt(refresh_token)

        if payload['type'] != TokenType.REFRESH:
            raise AuthException()
        
        user_id = payload.get('sub')
        if not user_id:
            raise AuthException()
        
        return self._generate_user_tokens(int(user_id), payload.get('role'))
        
    # Хелпер функции для работы с токенами
    def _generate_user_tokens(self, user_id: int, role: UserRole) -> dict:
        access = self._generate_token(user_id, role, TokenType.ACCESS)
        refresh = self._generate_token(user_id, role, TokenType.REFRESH)
        return {
                "access_token": access, 
                "refresh_token": refresh, 
                "token_type": "bearer"
            }

    def _generate_token(self, user_id: int, role: UserRole, token_type: TokenType) -> str:
        expires = (
            SecurityConfig.access_token_expire_minutes
            if token_type == TokenType.ACCESS
            else SecurityConfig.refresh_token_expire_days
        )
        expires_time = datetime.now() + expires
        
        payload = {
            "sub": str(user_id),
            "role": role,
            "type": token_type,
            "exp": expires_time,          
        }

        return self._encode_jwt(payload)
    
    def _encode_jwt(self, payload: dict) -> str:
        return self._jwt.encode(
            payload, 
            key=SecurityConfig.secret_key, 
            algorithm=SecurityConfig.algorithm)
    
    def _decode_jwt(self, token: str) -> dict:
        try:
            data = self._jwt.decode(
                token, 
                key=SecurityConfig.secret_key, 
                algorithms=[SecurityConfig.algorithm])
            if not data:
                raise AuthException(message="Токен пустой или некорректный")
            return data
        except Exception as e:
            raise AuthException(message=str(e))