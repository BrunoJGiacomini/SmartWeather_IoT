"""Service `UserService` (Feature 001 — Cadastro de Usuários).

Implementa as regras RF-01 (e-mail único) e RF-02 (normalização).
RF-03 (autenticação) é responsabilidade do `auth_service`, chamado
pelo endpoint **após** este service retornar com sucesso.
"""

from __future__ import annotations

from typing import Protocol

from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash

from app.models.user import User
from app.services.errors import EmailAlreadyExistsError


class _SessionLike(Protocol):
    """Protocol mínimo da sessão SQLAlchemy que o service consome."""

    def add(self, instance: object) -> None: ...
    def commit(self) -> None: ...
    def rollback(self) -> None: ...


def _normalize_email(email: str) -> str:
    """Decisão de domínio: e-mail sempre em minúsculas antes de persistir."""
    return email.strip().lower()


class UserService:
    @staticmethod
    def create_user(session: _SessionLike, *, email: str, password: str) -> User:
        """Cria um usuário aplicando hash na senha e normalizando o e-mail.

        Raises:
            EmailAlreadyExistsError: se o e-mail (já normalizado) já existir.
        """
        normalized = _normalize_email(email)

        user = User(
            email=normalized,
            password_hash=generate_password_hash(password),
        )
        session.add(user)
        try:
            session.commit()
        except IntegrityError:
            session.rollback()
            raise EmailAlreadyExistsError(normalized) from None

        return user
