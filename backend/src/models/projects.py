from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Date, ForeignKey, Numeric, Table, Column
from sqlalchemy.dialects.postgresql import JSONB
from datetime import date
from typing import List

from src.models.base import BaseSQLModel
from src.enums.projects import ProjectStatus, ArchitectureType

project_languages = Table(
    "project_languages",
    BaseSQLModel.metadata,
    Column("project_id", Integer, ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True),
    Column("language_id", Integer, ForeignKey("languages.id", ondelete="CASCADE"), primary_key=True),
)

project_platforms = Table(
    "project_platforms",
    BaseSQLModel.metadata,
    Column("project_id", Integer, ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True),
    Column("platform_id", Integer, ForeignKey("platforms.id", ondelete="CASCADE"), primary_key=True),
)

class Project(BaseSQLModel):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    client_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    manager_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=True)

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)

    software_type: Mapped[str] = mapped_column(String(100), nullable=True)
    architecture_type: Mapped[ArchitectureType] = mapped_column(String(100), nullable=True)
    target_users_count: Mapped[int] = mapped_column(Integer, nullable=True)

    links: Mapped[dict] = mapped_column(JSONB, nullable=True, default=dict)

    status: Mapped[ProjectStatus] = mapped_column(String(50), nullable=False, default=ProjectStatus.CREATED)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=True)
    deadline: Mapped[date] = mapped_column(Date, nullable=True)

    created_at: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    updated_at: Mapped[date] = mapped_column(Date, nullable=False, default=date.today, onupdate=date.today)

    client: Mapped["User"] = relationship("User", foreign_keys=[client_id], lazy="joined")
    manager: Mapped["User"] = relationship("User", foreign_keys=[manager_id], lazy="joined")
    languages: Mapped[List["Language"]] = relationship(secondary=project_languages, lazy="selectin")
    platforms: Mapped[List["Platform"]] = relationship(secondary=project_platforms, lazy="selectin")

