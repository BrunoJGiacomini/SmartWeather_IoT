"""Schemas Marshmallow para `User`.

Referência: specs/features/001-cadastro-usuarios/plan.md → RF-02.
"""

from __future__ import annotations

from marshmallow import Schema, fields, validate


class UserCreateSchema(Schema):
    """Payload de entrada para `POST /api/users`."""

    email = fields.Email(required=True, validate=validate.Length(max=255))
    password = fields.String(
        required=True,
        validate=validate.Length(min=8, max=128),
        load_only=True,
    )


class UserSchema(Schema):
    """Serialização padrão de saída de `User`."""

    id = fields.Integer()
    email = fields.Email()
    created_at = fields.DateTime()
