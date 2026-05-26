from abc import ABC, abstractmethod
from sqlalchemy import select, insert, update, delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Type, List, Any, Dict, Optional

from src.models.base import BaseSQLModel
from src.core.exceptions import UniqueException, DatabaseException, NotFoundException

class AbstractRepository(ABC):
       
    @abstractmethod
    async def create(self, entity):
        raise NotImplementedError()
    
    @abstractmethod
    async def get_all_filter_by(self, **kwargs):
        raise NotImplementedError()

    @abstractmethod
    async def get_one_filter_by(self, **kwargs):
        raise NotImplementedError()

    @abstractmethod
    async def update(self, entity_id: int, **kwargs):
        raise NotImplementedError()

    @abstractmethod
    async def delete(self, entity_id: int):
        raise NotImplementedError()

class SQLAlchemyRepository(AbstractRepository):

    entity: Type[BaseSQLModel]

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def _execute(self, stmt):
        try:
            result = await self.session.execute(stmt)
            return result

        except IntegrityError as e:
            await self.session.rollback()
            error_msg = str(e.orig)
            
            sqlstate = getattr(e.orig, "sqlstate", None)

            pg_constraint = getattr(e.orig, "constraint_name", None)
            error_msg = str(e.orig).lower()

            if sqlstate == "23505":
                violated_constraint = "unknown_constraint"
                if pg_constraint:
                    violated_constraint = pg_constraint
                elif hasattr(UniqueException, 'MAPPING') and UniqueException.MAPPING:
                    for constraint in UniqueException.MAPPING.keys():
                        if constraint.lower() in error_msg:
                            violated_constraint = constraint
                            break
                raise UniqueException(constraint_name=violated_constraint)
            
            elif sqlstate == "23503":
                raise DatabaseException(f"Нарушение целостности связей БД (Foreign Key). Детали: {e.orig}")

            raise DatabaseException(f"Ошибка базы данных (SQLSTATE {sqlstate}): {e.orig}")

    async def create(self, entity: dict):
        stmt = insert(self.entity).values(**entity).returning(self.entity)
        result = await self._execute(stmt)
        entity = result.scalars().first()
        await self.session.refresh(entity)
        return entity

    async def get_all_filter_by(self, **kwargs):
        stmt = select(self.entity).filter_by(**kwargs)
        result = await self._execute(stmt)
        entities = list(result.scalars().all())
        return entities

    async def get_one_filter_by(self, **kwargs):
        stmt = select(self.entity).filter_by(**kwargs)
        result = await self._execute(stmt)
        entity = result.scalars().first()
        if not entity:
            raise NotFoundException(model_name=self.entity.__name__)
        return entity

    async def update(self, entity_id: int, **kwargs):
        stmt = update(self.entity).filter_by(id=entity_id).values(**kwargs).returning(self.entity)
        result = await self._execute(stmt)
        entity = result.scalars().first()
        if not entity:
            raise NotFoundException(model_name=self.entity.__name__)
        await self.session.refresh(entity)
        return entity

    async def delete(self, entity_id: int):
        stmt = delete(self.entity).filter_by(id=entity_id).returning(self.entity.id)
        result = await self._execute(stmt)
        deleted_id = result.scalar_one_or_none()
        if not deleted_id:
            raise NotFoundException(model_name=self.entity.__name__)
        return deleted_id