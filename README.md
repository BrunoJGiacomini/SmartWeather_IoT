# SmartWeather

Monolito **Flask (Python) + React (JavaScript)** organizado para
**Spec-Driven Development (SDD)**. O backend serve a API sob `/api` e, em
produção, também serve o build estático do frontend.

> Veja [`specs/constitution.md`](./specs/constitution.md) para as regras
> de trabalho e [`AGENTS.md`](./AGENTS.md) para instruções de agentes
> de IA.

## Stack

- **Backend:** Flask 3 + Flask-SQLAlchemy + Flask-Migrate + Marshmallow,
  testes com pytest e Schemathesis, lint com Ruff, Gunicorn em produção.
- **Frontend:** React 18 + Vite + React Router 6 + TanStack Query 5,
  cliente HTTP gerado pelo orval a partir do `openapi.yaml`.
- **Banco:** PostgreSQL 16 (produção), SQLite em memória (testes).
- **Infra:** Docker multi-stage, docker-compose, GitHub Actions.

## Estrutura

```
specs/        # fonte da verdade (constitution, architecture, openapi, features)
backend/      # Flask app, models, services, api, tests
frontend/     # React + Vite
.github/      # CI
Dockerfile    # build multi-stage (front + back)
docker-compose.yml
Makefile
AGENTS.md     # instruções para agentes de IA
```

## Pré-requisitos

- Python 3.12+
- Node.js 20+
- (Opcional) Docker + docker compose

## Setup rápido

```bash
make setup         # backend (pip install -r requirements-dev.txt) + frontend (npm install)
make dev           # sobe Flask na 5000 e Vite na 5173 em paralelo
```

Abra `http://localhost:5173`. As chamadas a `/api/*` são proxy-adas pelo
Vite para `http://localhost:5000`.

## Comandos principais

| Comando                          | O que faz                                           |
|----------------------------------|-----------------------------------------------------|
| `make setup`                     | Instala deps de backend e frontend                  |
| `make dev`                       | Sobe back e front em paralelo                       |
| `make spec-lint`                 | Lint do OpenAPI com Spectral                        |
| `make gen-client`                | Regenera o cliente frontend (orval) a partir do OpenAPI |
| `make test`                      | Roda pytest (unit + integration)                    |
| `make test-contract`             | Roda Schemathesis contra `specs/openapi.yaml`       |
| `make test-frontend`             | Roda Vitest                                         |
| `make lint`                      | Ruff (backend) + ESLint (frontend)                  |
| `make build`                     | Build de produção do frontend                       |
| `make docker-up`                 | Sobe app + PostgreSQL na porta 8000                 |
| `make new-feature name=NNN-slug` | Cria nova pasta em `specs/features/` a partir do template |

## Subir com Docker (produção local)

```bash
make docker-up
# aplicação em http://localhost:8000
# API em     http://localhost:8000/api/health
```

## Como criar uma nova feature

1. Copie o template:
   ```bash
   make new-feature name=002-login-senha
   ```
2. Edite `specs/features/002-login-senha/plan.md` cobrindo as seções
   obrigatórias (visão, requisitos, casos de borda, decisões técnicas,
   modelo de dados, contrato, fases).
3. Atualize `specs/openapi.yaml` com os novos paths/schemas (registre o
   desvio no `report.md`).
4. Implemente fase a fase, escrevendo testes antes do código e
   atualizando `report.md` ao fim de cada uma.

## Estrutura de uma feature

Toda feature mora em `specs/features/NNN-slug/` com **exatamente dois**
arquivos:

- `plan.md` — escrito **antes** de codar, descreve a feature inteira.
- `report.md` — atualizado ao fim de **cada fase**, com checklists,
  evidências, decisões, pendências e desvios.

Detalhes em [`AGENTS.md`](./AGENTS.md) §2.

## Licença

<!-- Adicione aqui a licença do projeto quando aplicável. -->