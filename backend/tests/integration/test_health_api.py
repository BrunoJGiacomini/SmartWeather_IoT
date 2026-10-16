"""Testes de integração para `GET /api/health`."""


def test_health_retorna_200_com_status_ok(client):
    r = client.get("/api/health")
    assert r.status_code == 200
    body = r.get_json()
    assert body["status"] == "ok"
    assert "version" in body
