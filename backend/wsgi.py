"""Entry point WSGI para Gunicorn em produção.

Uso:
    gunicorn -w 4 -b 0.0.0.0:8000 wsgi:app
"""

from __future__ import annotations

import os

from app import create_app

app = create_app(os.getenv("FLASK_ENV", "production"))
