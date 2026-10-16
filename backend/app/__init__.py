"""Application factory do monolito Flask.

Padrão Application Factory (`create_app()`) para permitir múltiplas
instâncias com configurações diferentes (testes, dev, produção) sem
efeitos colaterais globais.
"""

from __future__ import annotations

import os

from flask import Flask

from app.config import get_config
from app.extensions import cors, db, login_manager, migrate
from app.spa import register_spa


def create_app(config_name: str | None = None) -> Flask:
    """Cria e configura uma instância da aplicação Flask.

    Args:
        config_name: nome da configuração ("development", "testing",
            "production"). Se None, usa `FLASK_ENV` ou `development`.
    """
    app = Flask(__name__, instance_relative_config=False)

    env = config_name or os.getenv("FLASK_ENV", "development")
    app.config.from_object(get_config(env))

    # Extensões precisam ser inicializadas no app concreto.
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=True,
    )
    login_manager.init_app(app)

    # Blueprints da API sob /api.
    from app.api.health import health_bp
    from app.api.users import users_bp

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(users_bp, url_prefix="/api")

    # Handler de erro padrão — toda resposta de erro usa o schema
    # `Error` definido em specs/openapi.yaml.
    from app.api.errors import register_error_handlers

    register_error_handlers(app)

    # Em produção, servimos o build estático do React via catch-all.
    if app.config["SERVE_SPA"]:
        register_spa(app)

    # Flask-Login: carregador de usuário a partir do id armazenado na sessão.
    from app.models.user import User

    @login_manager.user_loader
    def _load_user(user_id: str):  # pragma: no cover
        try:
            return db.session.get(User, int(user_id))
        except (TypeError, ValueError):
            return None

    return app
