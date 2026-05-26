import os
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
from passlib.context import CryptContext

load_dotenv()

class SecurityConfig:
    secret_key: str = os.getenv("SECRET_KEY", "your_default_secret_key")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: timedelta = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)))
    refresh_token_expire_days: timedelta = timedelta(days=int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 10080)))
    oauth2_scheme: OAuth2PasswordBearer = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)
    pwd_context: CryptContext = CryptContext(schemes=["sha256_crypt"], deprecated="auto")