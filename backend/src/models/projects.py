from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Date, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import JSONB
from datetime import date
from typing import List

from src.models.base import BaseSQLModel
from src.enums.projects import ProjectStatus

class Project(BaseSQLModel):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    client_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    manager_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=True)

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)

    language_id: Mapped[int] = mapped_column(Integer, ForeignKey('languages.id'), nullable=True)
    platform_id: Mapped[int] = mapped_column(Integer, ForeignKey('platforms.id'), nullable=True)
    architecture_id: Mapped[int] = mapped_column(Integer, ForeignKey('architectures.id'), nullable=True)
    software_type_id: Mapped[int] = mapped_column(Integer, ForeignKey('software_types.id'), nullable=True)

    target_users_count: Mapped[int] = mapped_column(Integer, nullable=True)

    links: Mapped[dict] = mapped_column(JSONB, nullable=True, default=list)

    status: Mapped[ProjectStatus] = mapped_column(String(50), nullable=False, default=ProjectStatus.CREATED)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=True)
    deadline: Mapped[date] = mapped_column(Date, nullable=True)

    created_at: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    updated_at: Mapped[date] = mapped_column(Date, nullable=False, default=date.today, onupdate=date.today)

    client: Mapped["User"] = relationship("User", foreign_keys=[client_id], lazy="joined")
    manager: Mapped["User"] = relationship("User", foreign_keys=[manager_id], lazy="joined")
    
    architecture: Mapped["Architecture"] = relationship("Architecture", foreign_keys=[architecture_id], lazy="joined")
    software_type: Mapped["SoftwareType"] = relationship("SoftwareType", foreign_keys=[software_type_id], lazy="joined")
    language: Mapped["Language"] = relationship("Language", foreign_keys=[language_id], lazy="joined")
    platform: Mapped["Platform"] = relationship("Platform", foreign_keys=[platform_id], lazy="joined")

