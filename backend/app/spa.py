"""Serve o build estático do React em produção.

Em produção, o Flask é o único processo exposto. Ele responde a `/api/*`
(normal) e a qualquer outro path retorna o `index.html` do React, que
faz o roteamento client-side.

Referência: specs/architecture.md §4 (Fluxo de desenvolvimento vs produção).
"""

from __future__ import annotations

import os

from flask import Flask, send_from_directory
from werkzeug.exceptions import NotFound


def register_spa(app: Flask) -> None:
    dist_dir = app.config["FRONTEND_DIST"]
    index_path = os.path.join(dist_dir, "index.html")

    if not os.path.isfile(index_path):
        app.logger.warning(
            "SERVE_SPA=true mas %s não existe. Rode `make build` antes.",
            index_path,
        )

    @app.get("/", defaults={"path": ""})
    @app.get("/<path:path>")
    def spa(path: str):
        # Se o arquivo existe no dist, serve ele; senão, fallback p/ SPA.
        full_path = os.path.join(dist_dir, path)
        if path and os.path.isfile(full_path):
            return send_from_directory(dist_dir, path)
        if os.path.isfile(index_path):
            return send_from_directory(dist_dir, "index.html")
        raise NotFound(description="frontend build not found")
