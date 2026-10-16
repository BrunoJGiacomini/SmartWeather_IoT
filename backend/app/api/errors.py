"""Handler global de erros.

Garante que toda resposta de erro da API siga o schema `Error`
definido em `specs/openapi.yaml`:

    { "error": "...", "details": { ... } }
"""

from __future__ import annotations

from flask import Flask, jsonify
from marshmallow import ValidationError
from werkzeug.exceptions import HTTPException


def _error(message: str, details: dict | None = None, status: int = 400):
    payload = {"error": message}
    if details:
        payload["details"] = details
    response = jsonify(payload)
    response.status_code = status
    return response


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(ValidationError)
    def _on_validation(err: ValidationError):
        # Marshmallow devolve {field: [mensagens]} em err.messages
        return _error(
            "validation_error",
            details=err.messages,
            status=422,
        )

    @app.errorhandler(HTTPException)
    def _on_http(err: HTTPException):
        return _error(
            err.description or err.name.lower().replace(" ", "_"),
            status=err.code or 500,
        )

    @app.errorhandler(Exception)
    def _on_unhandled(err: Exception):  # pragma: no cover
        app.logger.exception("Unhandled error: %s", err)
        return _error("internal_server_error", status=500)
