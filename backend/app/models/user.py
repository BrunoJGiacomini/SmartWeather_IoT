"""Modelo `User` (Feature 001 — Cadastro de Usuários).

Referência: specs/features/001-cadastro-usuarios/plan.md → seção 5
(Modelo de dados).
"""

from __future__ import annotations

from datetime import UTC, datetime

from flask_login import UserMixin
from sqlalchemy import BigInteger, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.extensions import db

# BigInteger não é autoincrement no SQLite; em produção (Postgres) será
# BIGINT nativo. Mantemos a portabilidade com `with_variant`.
BigIntPK = BigInteger().with_variant(Integer, "sqlite")


class User(db.Model, UserMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(BigIntPK, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(tz=UTC),
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"<User id={self.id} email={self.email!r}>"
