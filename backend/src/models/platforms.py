from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String

from src.models.base import BaseSQLModel

class Platform(BaseSQLModel):
    __tablename__ = "platforms"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

