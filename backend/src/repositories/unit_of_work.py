from abc import ABC, abstractmethod
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from . import *

class IUnitOfWork(ABC):

    messages: MessageRepository
    projects: ProjectRepository
    reviews: ReviewRepository
    users: UserRepository
    languages: LanguageRepository
    platforms: PlatformRepository
    architectures: ArchitectureRepository
    software_types: SoftwareTypeRepository

    @abstractmethod
    async def __aenter__(self):
        raise NotImplementedError()

    @abstractmethod
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        raise NotImplementedError()

    @abstractmethod
    async def commit(self):
        raise NotImplementedError()
    
    @abstractmethod
    async def rollback(self):
        raise NotImplementedError()
    
class UnitOfWork(IUnitOfWork):

    def __init__(self, session_factory: async_sessionmaker[AsyncSession]):
        self._session_factory = session_factory

    async def __aenter__(self):
        self.session = self._session_factory()

        self.messages = MessageRepository(self.session)
        self.projects = ProjectRepository(self.session)
        self.reviews = ReviewRepository(self.session)
        self.users = UserRepository(self.session)
        self.languages = LanguageRepository(self.session)
        self.platforms = PlatformRepository(self.session)
        self.architectures = ArchitectureRepository(self.session)
        self.software_types = SoftwareTypeRepository(self.session)
        
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        try:
            if exc_type:
                await self.rollback()
            else:
                await self.commit()
        finally:
            await self.session.close()

    async def commit(self):
        await self.session.commit()

    async def rollback(self):
        await self.session.rollback()