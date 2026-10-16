# Makefile — atalhos para o fluxo Spec-Driven Development.
#
# Uso:
#   make setup         # prepara backend (venv, deps) e frontend (npm install)
#   make dev           # sobe Flask + Vite em paralelo
#   make spec-lint     # Spectral no openapi.yaml
#   make gen-client    # regenera frontend/src/api/generated via orval
#   make test          # pytest (unit + integration)
#   make test-contract # schemathesis contra openapi.yaml
#   make lint          # ruff (backend) + eslint (frontend)
#   make build         # build de produção do frontend
#   make docker-up     # docker compose up --build
#   make new-feature name=002-minha-feature

# ---------- Config ----------
PYTHON        ?= python3
PIP           ?= $(PYTHON) -m pip
VENV_DIR      ?= .venv
VENV_PYTHON   := $(VENV_DIR)/bin/python
VENV_PIP      := $(VENV_DIR)/bin/pip
NPM           ?= npm

SPEC_FILE      = specs/openapi.yaml
SPECTRAL       = npx --yes @stoplight/spectral-cli

# ---------- Setup ----------
.PHONY: setup
setup: backend-setup frontend-setup

.PHONY: backend-setup
backend-setup:
	cd backend && $(PIP) install -r requirements-dev.txt

.PHONY: frontend-setup
frontend-setup:
	cd frontend && $(NPM) install

# ---------- Dev ----------
.PHONY: dev
dev:
	@echo "Subindo Flask (5000) + Vite (5173). Ctrl-C para parar."
	@$(MAKE) -j2 dev-backend dev-frontend

.PHONY: dev-backend
dev-backend:
	cd backend && $(VENV_PYTHON) -m flask --app wsgi run --debug --port 5000

.PHONY: dev-frontend
dev-frontend:
	cd frontend && $(NPM) run dev

# ---------- Spec / cliente ----------
.PHONY: spec-lint
spec-lint:
	$(SPECTRAL) lint $(SPEC_FILE)

.PHONY: gen-client
gen-client:
	cd frontend && $(NPM) run gen:client

# ---------- Tests ----------
.PHONY: test
test:
	cd backend && $(VENV_PYTHON) -m pytest

.PHONY: test-contract
test-contract:
	cd backend && $(VENV_PYTHON) -m pytest tests/contract

.PHONY: test-frontend
test-frontend:
	cd frontend && $(NPM) test

# ---------- Lint / format ----------
.PHONY: lint
lint: lint-backend lint-frontend

.PHONY: lint-backend
lint-backend:
	cd backend && $(VENV_PYTHON) -m ruff check .
	cd backend && $(VENV_PYTHON) -m ruff format --check .

.PHONY: lint-frontend
lint-frontend:
	cd frontend && $(NPM) run lint

# ---------- Build / deploy ----------
.PHONY: build
build:
	cd frontend && $(NPM) run build

.PHONY: docker-up
docker-up:
	docker compose up --build

.PHONY: docker-down
docker-down:
	docker compose down -v

# ---------- Features ----------
.PHONY: new-feature
new-feature:
	@if [ -z "$(name)" ]; then \
		echo "Uso: make new-feature name=002-minha-feature"; exit 1; \
	fi
	@mkdir -p specs/features/$(name)
	@cp specs/features/000-template/plan.md specs/features/$(name)/plan.md
	@cp specs/features/000-template/report.md specs/features/$(name)/report.md
	@echo "Feature $(name) criada em specs/features/$(name)/. Edite plan.md."