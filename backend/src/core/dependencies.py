from typing import Annotated, Any
from fastapi import Depends, HTTPException, Security, status

from src.core.database import async_session_maker
from src.core.security import SecurityConfig
from src.repositories.unit_of_work import IUnitOfWork, UnitOfWork
from src.services.auth import AuthService
from src.core.exceptions import AuthException, ForbiddenException, AuthException

def get_uow() -> IUnitOfWork:
    return UnitOfWork(session_factory=async_session_maker)
UOWdep = Annotated[IUnitOfWork, Depends(get_uow)]

def get_auth_service() -> AuthService:
    return AuthService()
AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]

async def get_current_user(
    auth_service: AuthServiceDep,
    token: Annotated[Any, Security(SecurityConfig.oauth2_scheme)]
) -> dict:
    try:
        return await auth_service.get_user_data_from_token(token)
    except AuthException as e:
        raise AuthException(message=e.message)
UserDep = Annotated[dict, Depends(get_current_user)]

async def get_current_admin(
    auth_service: AuthServiceDep,
    token: Annotated[Any, Security(SecurityConfig.oauth2_scheme)]
) -> dict:
    try:
        return await auth_service.verify_admin_access(token)
    except AuthException as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=e.message
        )
    except ForbiddenException:
        raise ForbiddenException(message="Требуются права администратора")
AdminDep = Annotated[dict, Depends(get_current_admin)]