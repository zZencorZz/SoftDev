from src.schemas.reviews import ReviewCreateSchema, ReviewUpdateSchema, ReviewFilterSchema
from src.repositories.unit_of_work import IUnitOfWork
from src.core.exceptions import ForbiddenException
from src.enums.users import UserRole

class ReviewService:

    @staticmethod
    async def create_review(uow: IUnitOfWork, data: ReviewCreateSchema, user_sub: dict):
        async with uow:
            data = data.model_copy(update={"client_id": user_sub.get("user_id")})
            if user_sub.get("user_role") != UserRole.USER:
                raise ForbiddenException()
            print(data)
            new_review = await uow.reviews.create(data.clean_dict())
            await uow.commit()
            return new_review

    @staticmethod
    async def get_reviews_filter_by(uow: IUnitOfWork, filters: ReviewFilterSchema):
        async with uow:
            all_reviews = await uow.reviews.get_all_filter_by(**filters.clean_dict())
            return all_reviews

    @staticmethod
    async def get_review_filter_by(uow: IUnitOfWork, review_id: int):
        async with uow:
            review = await uow.reviews.get_one_filter_by(id=review_id)
            return review
        
    @staticmethod
    async def update_review(uow: IUnitOfWork, review_id: int, data: ReviewUpdateSchema, user_sub: dict):
        async with uow:
            review = await uow.reviews.get_one_filter_by(id=review_id)
            if review.client_id != int(user_sub.get("user_id")) and user_sub.get("user_role") != UserRole.ADMIN:
                raise ForbiddenException()

            upd_review = await uow.reviews.update(entity_id=review_id, **data.clean_dict())
            await uow.commit()
            return upd_review
        
    @staticmethod 
    async def delete_review(uow: IUnitOfWork, review_id: int, user_sub: dict):
        async with uow:
            review = await uow.reviews.get_one_filter_by(id=review_id)
            if review.client_id != int(user_sub.get("user_id")) and user_sub.get("user_role") != UserRole.ADMIN:
                raise ForbiddenException()
            del_review = await uow.reviews.delete(review_id)
            await uow.commit()