"""Testes de integração para `POST /api/users`.

Cobre RF-01, RF-02 e RF-03 da Feature 001.
"""


def test_rf01_email_duplicado_retorna_409(client):
    """RF-01: e-mail único → 409 em duplicidade."""
    payload = {"email": "alice@example.com", "password": "senha-forte-1"}
    r1 = client.post("/api/users", json=payload)
    assert r1.status_code == 201, r1.get_json()

    r2 = client.post("/api/users", json=payload)
    assert r2.status_code == 409
    body = r2.get_json()
    assert body["error"] == "email_already_exists"


def test_rf02_senha_curta_retorna_422(client):
    """RF-02: senha < 8 caracteres → 422 com details por campo."""
    r = client.post(
        "/api/users",
        json={"email": "bob@example.com", "password": "abc"},
    )
    assert r.status_code == 422
    body = r.get_json()
    assert body["error"] == "validation_error"
    assert "password" in body.get("details", {})


def test_rf02_email_invalido_retorna_422(client):
    """Bônus de validação: e-mail malformado também retorna 422."""
    r = client.post(
        "/api/users",
        json={"email": "nao-eh-um-email", "password": "senha-forte-1"},
    )
    assert r.status_code == 422
    body = r.get_json()
    assert "email" in body.get("details", {})


def test_rf03_cadastro_autentica_usuario(client):
    """RF-03: resposta inclui `Set-Cookie` de sessão."""
    r = client.post(
        "/api/users",
        json={"email": "carol@example.com", "password": "senha-forte-1"},
    )
    assert r.status_code == 201, r.get_json()
    cookies = r.headers.getlist("Set-Cookie")
    assert any("session" in c.lower() or "remember" in c.lower() for c in cookies)


def test_rf01_normalizacao_de_email(client):
    """Decisão de domínio: caixa/colocação diferente colide com a forma canônica."""
    a = client.post(
        "/api/users",
        json={"email": "Dave@Example.com", "password": "senha-forte-1"},
    )
    assert a.status_code == 201, a.get_json()
    b = client.post(
        "/api/users",
        json={"email": "dave@example.com", "password": "senha-forte-1"},
    )
    assert b.status_code == 409
