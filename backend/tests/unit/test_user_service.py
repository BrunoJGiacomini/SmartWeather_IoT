"""Testes unitários do `UserService`.

Cobre a normalização de e-mail e o hash de senha **sem** precisar de
banco real: usamos SQLite em memória via a fixture `app` e a fixture
`db_session` para cleanup automático entre testes.
"""

from __future__ import annotations

from app.services.errors import EmailAlreadyExistsError
from app.services.user_service import UserService


def test_create_user_normaliza_email_minusculo(app, db_session):
    user = UserService.create_user(
        session=db_session,
        email="  [email protected]  ",
        password="senha-forte-1",
    )
    assert user.email == "[email protected]"
    assert user.password_hash != "senha-forte-1"


def test_create_user_duplicado_dispara_email_already_exists(app, db_session):
    UserService.create_user(
        session=db_session,
        email="[email protected]",
        password="senha-forte-1",
    )
    raised = False
    try:
        UserService.create_user(
            session=db_session,
            email="[email protected]",
            password="senha-forte-2",
        )
    except EmailAlreadyExistsError:
        raised = True
    assert raised, "esperava EmailAlreadyExistsError"


def test_password_e_armazenado_com_hash(app, db_session):
    user = UserService.create_user(
        session=db_session,
        email="[email protected]",
        password="minha-senha-segura",
    )
    # werkzeug gera um hash visivelmente diferente da senha plana.
    assert user.password_hash.startswith(("pbkdf2:", "scrypt:", "argon2:"))
    assert user.password_hash != "minha-senha-segura"
