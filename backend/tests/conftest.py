"""Fixtures compartilhadas pelos testes.

- `app`: instância Flask configurada para TestingConfig.
- `client`: test client do Flask.
- `db_session`: sessão limpa por teste.
"""

from __future__ import annotations

from pathlib import Path

import pytest
from flask import Flask
from flask.testing import FlaskClient

from app import create_app
from app.extensions import db as _db

# Importar modelos para que `db.create_all()` enxergue suas tabelas.
# Adicione aqui sempre que um novo modelo for criado.
from app.models import user as _user_model  # noqa: F401

# `specs/openapi.yaml` é o contrato oficial; testes de contrato leem
# dele. O `pytest.ini` define `pythonpath = .` para que `app/` seja
# importável a partir daqui.
REPO_ROOT = Path(__file__).resolve().parents[2]
OPENAPI_PATH = REPO_ROOT / "specs" / "openapi.yaml"


@pytest.fixture(scope="session")
def app() -> Flask:
    app = create_app("testing")
    with app.app_context():
        _db.create_all()
    yield app
    with app.app_context():
        _db.session.remove()
        _db.drop_all()


@pytest.fixture()
def db_session(app: Flask):
    """Sessão com cleanup por teste."""
    with app.app_context():
        yield _db.session
        _db.session.rollback()
        # Limpa todas as tabelas entre testes.
        for table in reversed(_db.metadata.sorted_tables):
            _db.session.execute(table.delete())
        _db.session.commit()


@pytest.fixture()
def client(app: Flask, db_session) -> FlaskClient:
    """Client HTTP. Depende de `db_session` para garantir limpeza entre testes."""
    return app.test_client()
