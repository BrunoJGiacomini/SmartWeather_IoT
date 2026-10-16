"""Testes de integração.

Validam o comportamento ponta-a-ponta da API: status codes, payload de
resposta, efeitos colaterais observáveis. Diferem dos testes de contrato
porque checam **comportamento** (ex.: e-mail duplicado → 409), não só
shape.
"""
