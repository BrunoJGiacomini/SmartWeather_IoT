"""Endpoint `POST /api/users` (Feature 001 — Cadastro).

Este arquivo é apenas **orquestração HTTP ↔ service**. Toda regra de
negócio vive em `app/services/user_service.py`.
"""

from __future__ import annotations

from http import HTTPStatus

from flask import Blueprint, jsonify, request
from flask_login import login_user
from marshmallow import ValidationError

from app.extensions import db
from app.schemas.user import UserCreateSchema, UserSchema
from app.services.errors import EmailAlreadyExistsError
from app.services.user_service import UserService

users_bp = Blueprint("users", __name__)

_user_create_schema = UserCreateSchema()
_user_schema = UserSchema()


@users_bp.post("/users")
def create_user():
    payload = _get_payload()
    try:
        user = UserService.create_user(
            session=db.session,
            email=payload["email"],
            password=payload["password"],
        )
    except EmailAlreadyExistsError:
        return jsonify({"error": "email_already_exists"}), HTTPStatus.CONFLICT

    # RF-03: autenticar imediatamente após cadastro.
    login_user(user)

    return jsonify(_user_schema.dump(user)), HTTPStatus.CREATED


def _get_payload() -> dict:
    """Lê e valida o JSON do request. Falhas de validação viram 422."""
    data = request.get_json(silent=True)
    if data is None:
        raise ValidationError({"body": ["payload must be a JSON object"]})
    # Validação via Marshmallow. ValidationError é capturada pelo
    # handler global e convertida em 422 com `details` por campo.
    return _user_create_schema.load(data)
