from typing import List
from fastapi import APIRouter, Depends

from src.services.reviews import ReviewService
from src.core.dependencies import UOWdep, UserDep
from src.schemas.reviews import ReviewCreateSchema, ReviewUpdateSchema, ReviewSchema, ReviewFilterSchema

router = APIRouter(prefix='/reviews', tags=['Reviews'])

@router.post('/', status_code=201, response_model=ReviewSchema)
async def create_review(
    uow: UOWdep, 
    data: ReviewCreateSchema, 
    user_sub: UserDep
):
    return await ReviewService.create_review(uow, data, user_sub)

@router.get('/', status_code=200, response_model=List[ReviewSchema])
async def get_reviews(
    uow: UOWdep, 
    filters: ReviewFilterSchema = Depends()
):
    return await ReviewService.get_reviews_filter_by(uow, filters)

@router.get('/{review_id}', status_code=200, response_model=ReviewSchema)
async def get_review(
    uow: UOWdep, 
    review_id: int
):
    return await ReviewService.get_review_filter_by(uow, review_id)

@router.put('/{review_id}', status_code=200, response_model=ReviewSchema)
async def update_review(
    uow: UOWdep, 
    review_id: int, 
    data: ReviewUpdateSchema, 
    user_sub: UserDep
):
    return await ReviewService.update_review(uow, review_id, data, user_sub)

@router.delete('/{review_id}', status_code=204)
async def delete_review(
    uow: UOWdep, 
    review_id: int, 
    user_sub: UserDep
):
    return await ReviewService.delete_review(uow, review_id, user_sub)