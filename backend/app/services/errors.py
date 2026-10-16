"""Exceções de domínio.

Erros próprios do service são exceções Python comuns; quem chama
(service caller) traduz para HTTP status code apropriado.
"""

from __future__ import annotations


class EmailAlreadyExistsError(Exception):
    """E-mail já cadastrado. Vira 409 no handler de API."""
