from src.schemas.users import UserCreateSchema, UserUpdateSchema, UserFilterSchema
from src.repositories.unit_of_work import IUnitOfWork
from src.enums.users import UserRole
from src.core.security import SecurityConfig
from src.core.exceptions import ForbiddenException

class UserService:

    @staticmethod
    async def create_user(uow: IUnitOfWork, data: UserCreateSchema):
        data.password = SecurityConfig.pwd_context.hash(data.password)
        async with uow:
            new_user = await uow.users.create(data.clean_dict())
            await uow.commit()
            return new_user

    @staticmethod
    async def get_users_filter_by(uow: IUnitOfWork, filters: UserFilterSchema):
        async with uow:
            users = await uow.users.get_all_filter_by(**filters.clean_dict())
            return users or []

    @staticmethod
    async def get_user_filter_by(uow: IUnitOfWork, user_id: int):
        async with uow:
            user = await uow.users.get_one_filter_by(id=user_id)
            return user
        
    @staticmethod
    async def update_user(uow: IUnitOfWork, user_id: int, data: UserUpdateSchema, user_sub: dict):
        if user_id != user_sub.get("user_id") and user_sub.get("user_role") != UserRole.ADMIN:
            raise ForbiddenException()
        if data.role and user_sub.get("user_role") != UserRole.ADMIN:
            raise ForbiddenException()
        if data.password:
            data.password = SecurityConfig.pwd_context.hash(data.password)
        async with uow:
            upd_user = await uow.users.update(entity_id=user_id, **data.clean_dict())
            await uow.commit()
            return upd_user
        
    @staticmethod 
    async def delete_user(uow: IUnitOfWork, user_id: int, user_sub: dict):
        if user_id != int(user_sub.get("user_id")) and user_sub.get("user_role") != UserRole.ADMIN:
            raise ForbiddenException()
        async with uow:
            await uow.users.delete(user_id)
            await uow.commit()