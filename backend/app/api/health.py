"""Endpoint `GET /api/health`.

Liveness probe declarado em `specs/openapi.yaml`.
"""

from __future__ import annotations

from flask import Blueprint, jsonify

# Lê a mesma versão declarada em openapi.yaml.
OPENAPI_VERSION = "0.1.0"

health_bp = Blueprint("health", __name__)


@health_bp.get("/health")
def get_health():
    return jsonify({"status": "ok", "version": OPENAPI_VERSION}), 200
