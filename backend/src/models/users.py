from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, Date, Numeric
from datetime import date

from src.models.base import BaseSQLModel
from src.enums.users import UserRole

class User(BaseSQLModel):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=True)
    organization: Mapped[str] = mapped_column(String(100), nullable=True)
    role: Mapped[UserRole] = mapped_column(String(20), nullable=False, default=UserRole.USER)
    created_at: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    updated_at: Mapped[date] = mapped_column(Date, nullable=False, default=date.today, onupdate=date.today)
