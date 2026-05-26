from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, Date, Text, ForeignKey
from datetime import date

from src.models.base import BaseSQLModel

class Review(BaseSQLModel):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    client_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'))
    project_id: Mapped[int] = mapped_column(Integer, ForeignKey('projects.id'))
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[date] = mapped_column(Date, default=date.today)
    updated_at: Mapped[date] = mapped_column(Date, default=date.today, onupdate=date.today)

    client: Mapped["User"] = relationship("User", foreign_keys=[client_id], lazy="joined")
    project: Mapped["Project"] = relationship("Project", foreign_keys=[project_id], lazy="joined")
