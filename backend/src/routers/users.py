from typing import List
from fastapi import APIRouter, Depends

from src.services.users import UserService
from src.schemas.users import UserCreateSchema, UserUpdateSchema, UserSchema, UserFilterSchema
from src.core.dependencies import UOWdep, UserDep, AdminDep

router = APIRouter(prefix='/users', tags=['Users'])

@router.post('/', status_code=201, response_model=UserSchema)
async def create_user(
    uow: UOWdep, 
    data: UserCreateSchema, 
    admin_sub: AdminDep
):
    return await UserService.create_user(uow, data)

@router.get("/me", status_code=200, response_model=UserSchema)
async def get_me(
    uow: UOWdep, 
    user_sub: UserDep
):
    return await UserService.get_user_filter_by(uow, user_sub.get("user_id"))

@router.get('/', status_code=200, response_model=List[UserSchema])
async def get_users(
    uow: UOWdep, 
    filters: UserFilterSchema = Depends()
):
    return await UserService.get_users_filter_by(uow, filters)

@router.get('/{user_id}', status_code=200, response_model=UserSchema)
async def get_user(
    uow: UOWdep, 
    user_id: int
):
    return await UserService.get_user_filter_by(uow, user_id)

@router.put('/{user_id}', status_code=200, response_model=UserSchema)
async def update_user(
    uow: UOWdep, 
    user_id: int, 
    data: UserUpdateSchema, 
    user_sub: UserDep
):
    return await UserService.update_user(uow, user_id, data, user_sub)

@router.delete('/{user_id}', status_code=204)
async def delete_user(
    uow: UOWdep, 
    user_id: int, 
    user_sub: UserDep
):
    return await UserService.delete_user(uow, user_id, user_sub)