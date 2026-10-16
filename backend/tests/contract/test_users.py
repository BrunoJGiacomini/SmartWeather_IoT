"""Testes de contrato para `POST /api/users`.

Validação contra `specs/openapi.yaml` via Schemathesis.

Requisitos cobertos: RF-01, RF-02, RF-03 (Feature 001).
"""

from __future__ import annotations

import schemathesis

from tests.conftest import OPENAPI_PATH

schema = schemathesis.openapi.openapi_version(str(OPENAPI_PATH))


@schema.parametrize()
def test_users_post_is_compliant(case):
    """Cada caso gerado pelo Schemathesis deve passar contra o test client."""
    case.call_and_validate()
