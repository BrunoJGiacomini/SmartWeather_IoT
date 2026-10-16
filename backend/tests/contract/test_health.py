"""Testes de contrato para `GET /api/health`.

Garante que o endpoint declarado em `specs/openapi.yaml` é satisfeito
pelo backend. Schemathesis lê o YAML e valida o response shape.

Requisito coberto: liveness do monolito (sem RF específico na feature 001).
"""

from __future__ import annotations

import schemathesis

from tests.conftest import OPENAPI_PATH

schema = schemathesis.openapi.openapi_version(str(OPENAPI_PATH))


@schema.parametrize()
def test_health_is_compliant(case):
    """Cada caso gerado pelo Schemathesis deve passar contra o test client."""
    case.call_and_validate()
