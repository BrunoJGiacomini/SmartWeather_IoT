# AGENTS.md — Instruções para agentes de IA

> Este arquivo é lido por agentes de IA (Copilot, Claude, Cursor, Aider,
> Gemini CLI, etc.) antes de sugerir mudanças. Leia-o inteiro antes de
> tocar no código. Regras aqui têm prioridade sobre comportamento padrão.

## 0. Princípios inegociáveis

1. **Spec antes de código.** Nenhum código novo sem `plan.md` aprovado
   para a fase atual.
2. **Testes antes da implementação.** Escreva o teste, veja falhar,
   implemente, veja passar.
3. **Nada marcado como pronto sem evidência.** Comandos executados e
   resultado colado no `report.md`.
4. **Contrato é fonte da verdade.** Mudar `specs/openapi.yaml` é mudar
   a verdade do produto; trate como mudança de escopo.

## 1. Antes de qualquer tarefa

Leia, **na ordem**:

1. `specs/constitution.md` — regras do jogo.
2. `specs/architecture.md` — decisões técnicas, naming, fluxo dev/prod.
3. `specs/features/<id>-<slug>/plan.md` — a feature inteira.
4. `specs/features/<id>-<slug>/report.md` — o que já foi feito e o que
   falta.

Só então leia o código dos arquivos que vai editar.

## 2. Fluxo por fase

```
ler plano → escrever testes que falham → implementar mínimo → verificar → relatar → próxima fase
```

Em cada fase:

1. Releia o trecho correspondente do `plan.md`.
2. Escreva/ajuste testes (`backend/tests/...`).
3. Rode a suíte relevante e confirme que **falham** (TDD red).
4. Implemente.
5. Rode `make spec-lint`, `make lint`, `make test`, `make test-contract`.
6. Atualize `report.md` no mesmo commit: checklists, evidências,
   decisões, pendências.
7. Se houve desvio do plano, atualize `plan.md` e registre em
   "Desvios do plano" no `report.md`.

## 3. Estrutura de pastas (resumo)

```
specs/
  constitution.md
  architecture.md
  openapi.yaml
  features/
    000-template/        # template
    NNN-<slug>/
      plan.md
      report.md
backend/
  app/
    __init__.py          # application factory create_app()
    config.py
    extensions.py
    models/              # SQLAlchemy
    schemas/             # Marshmallow
    api/                 # blueprints /api/*
    services/            # regras de negócio (puro Python)
    utils/
    spa.py               # serve frontend/dist
  migrations/
  tests/{contract,integration,unit}/
  wsgi.py
frontend/
  src/
    api/{client.js,generated/}
    components/ pages/ hooks/ context/ routes/ utils/
    App.jsx main.jsx
  tests/
  package.json vite.config.js orval.config.js
```

## 4. Comandos úteis

```bash
make setup                 # instala deps do back e do front
make dev                   # sobe Flask (5000) + Vite (5173)
make spec-lint             # Spectral em specs/openapi.yaml
make gen-client            # regenera frontend/src/api/generated
make test                  # pytest
make test-contract         # Schemathesis
make lint                  # ruff + eslint
make build                 # build de produção do front
make docker-up             # docker compose up --build (porta 8000)
make new-feature name=002-minha-feature
```

## 5. Convenções

- Backend: services para regra de negócio; blueprints só orquestram.
- Frontend: hooks com prefixo `use`; componentes `PascalCase`.
- Mensagens de commit: inglês, descritivas (`feat(users): add password
min length validation`).
- Docstrings: inglês no código, português nas specs.

## 6. O que **NÃO** fazer

- ❌ Implementar sem teste correspondente.
- ❌ Editar `openapi.yaml` sem atualizar `plan.md` e registrar desvio.
- ❌ Colocar regra de negócio em `@bp.route`.
- ❌ "Vou rodar isso depois" — rode agora ou marque como pendência no
  `report.md`.
- ❌ Marcar checklist como `[x]` sem ter visto o teste/verificação
  rodar verde.
- ❌ Inventar comandos que não estão no `Makefile` ou nos arquivos de
  workflow — se precisar, adicione ao `Makefile` antes.
- ❌ Instalar pacotes/libs sem permissão.
- ❌ Mânter arquivos de teste/smoke (após criá-lo e executá-lo realize sua exclusão).

## 7. Quando ficar bloqueado

1. Releia a fase atual do `plan.md`.
2. Se a dúvida é sobre escopo/contrato, **pergunte ao humano** em vez
   de assumir.
3. Se é decisão técnica (não muda contrato), proponha em
   `specs/architecture.md` (ADR curto) e siga.
4. Registre qualquer bloqueio na seção "Pendências" do `report.md`.
