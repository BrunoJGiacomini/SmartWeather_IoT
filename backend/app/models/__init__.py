"""Modelos SQLAlchemy.

Importe seus modelos aqui para que o Alembic (Flask-Migrate) consiga
enxergá-los durante `flask db migrate`. Exemplo:

    from app.models.user import User
"""

from __future__ import annotations

# Garante que o Alembic enxerga os modelos ao rodar `flask db migrate`.
# Adicione imports explícitos conforme features forem adicionadas:
# from app.models.user import User  # noqa: F401
