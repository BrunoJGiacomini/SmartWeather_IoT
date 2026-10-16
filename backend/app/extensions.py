"""Instâncias singleton de extensões Flask.

Mantemos as instâncias aqui para evitar ciclos de import e garantir
que `db.init_app(app)` seja chamado apenas no factory.
"""

from __future__ import annotations

from flask_cors import CORS
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()
cors = CORS()
login_manager = LoginManager()
