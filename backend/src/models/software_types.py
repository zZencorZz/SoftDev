from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String

from src.models.base import BaseSQLModel

class SoftwareType(BaseSQLModel):
    __tablename__ = "software_types"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)