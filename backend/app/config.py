"""Configurações por ambiente.

Lê `DATABASE_URL`, `SECRET_KEY`, `CORS_ORIGINS`, `SERVE_SPA` do ambiente
quando existirem, com defaults seguros para dev/test.
"""

from __future__ import annotations

import os
from datetime import timedelta


class BaseConfig:
    """Defaults comuns a todos os ambientes."""

    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-change-me")
    JSON_SORT_KEYS: bool = False

    # Sessão/cookie
    SESSION_COOKIE_HTTPONLY: bool = True
    SESSION_COOKIE_SAMESITE: str = "Lax"
    SESSION_COOKIE_SECURE: bool = False
    PERMANENT_SESSION_LIFETIME: timedelta = timedelta(days=7)

    # Banco: default usa o driver psycopg3. Em testes, sobrescrevemos
    # para SQLite em memória.
    SQLALCHEMY_DATABASE_URI: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://app:app@db:5432/app",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False

    # Frontend build path (onde o Vite gera dist/)
    FRONTEND_DIST: str = os.getenv(
        "FRONTEND_DIST",
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")),
    )
    SERVE_SPA: bool = os.getenv("SERVE_SPA", "false").lower() == "true"

    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:5173")


class DevelopmentConfig(BaseConfig):
    DEBUG: bool = True


class TestingConfig(BaseConfig):
    TESTING: bool = True
    DEBUG: bool = False
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///:memory:"
    SERVE_SPA: bool = False
    WTF_CSRF_ENABLED: bool = False


class ProductionConfig(BaseConfig):
    DEBUG: bool = False
    SESSION_COOKIE_SECURE: bool = True


_CONFIG_MAP: dict[str, type[BaseConfig]] = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
}


def get_config(name: str) -> type[BaseConfig]:
    """Resolve a classe de configuração pelo nome."""
    try:
        return _CONFIG_MAP[name]
    except KeyError as exc:
        raise ValueError(
            f"Configuração '{name}' desconhecida. Opções: {sorted(_CONFIG_MAP)}"
        ) from exc
