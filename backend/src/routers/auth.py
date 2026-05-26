from fastapi import APIRouter, Form, Cookie

from src.services.auth import AuthService
from src.schemas.auth import RegisterSchema, LoginSchema
from src.core.dependencies import UOWdep

router = APIRouter(prefix='/auth', tags=['Auth'])

@router.post('/register', status_code=201)
async def register(uow: UOWdep, data: RegisterSchema):
    return await AuthService().registration(uow, data)

@router.post('/login', status_code= 200)
async def login(uow: UOWdep, data: LoginSchema = Form(...)):
    return await AuthService().login(uow, data)

@router.post('/refresh', status_code=200)
async def refresh(uow: UOWdep, refresh_token: str = Cookie(None)):
    return await AuthService().refresh_token(uow, refresh_token)

