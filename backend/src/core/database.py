import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine

load_dotenv()

class DatabaseConfig:
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_USER = os.getenv('DB_USER')
    DB_HOST = os.getenv('DB_HOST')
    DB_PORT = os.getenv('DB_PORT')
    DB_NAME = os.getenv('DB_NAME')
    DB_URL = f"postgresql+asyncpg://neondb_owner:npg_qn1VoiWCJvP5@ep-solitary-shadow-ap1ql7u5.c-7.us-east-1.aws.neon.tech/neondb"

async_engine = create_async_engine(DatabaseConfig.DB_URL)
async_session_maker = async_sessionmaker(async_engine, expire_on_commit=False, class_=AsyncSession)