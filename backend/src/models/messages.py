from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, ForeignKey, Text, DateTime
from datetime import datetime

from src.models.base import BaseSQLModel

class Message(BaseSQLModel):
    __tablename__ = 'messages'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_user_sender: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'))
    id_user_recipient: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'))
    id_project: Mapped[int] = mapped_column(Integer, ForeignKey('projects.id'), nullable=True)
    message_text: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)