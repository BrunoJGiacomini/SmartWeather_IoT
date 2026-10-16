# Multi-stage: build do React + imagem Flask enxuta.
# Estágio 1: build do frontend (Node) → frontend/dist
# Estágio 2: backend Python servindo API + dist

# ---------- Stage 1: frontend build ----------
FROM node:20-alpine AS frontend-build

WORKDIR /app

# Copia apenas manifestos primeiro para cachear `npm install`.
COPY frontend/package.json frontend/package-lock.json* ./frontend/
RUN cd frontend && npm install --no-audit --no-fund

# Copia o resto do front e gera o build.
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# ---------- Stage 2: backend runtime ----------
FROM python:3.12-slim AS backend

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_ENV=production \
    SERVE_SPA=true \
    PIP_NO_CACHE_DIR=1

WORKDIR /app/backend

# Dependências primeiro, para cachear a camada.
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Código do backend.
COPY backend/ ./backend/

# Build do frontend vindo do estágio 1.
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Usuário não-root.
RUN useradd --create-home appuser
USER appuser

EXPOSE 8000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "wsgi:app"]