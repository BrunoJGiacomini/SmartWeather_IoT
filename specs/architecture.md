# Arquitetura

> Decisões técnicas estáveis. Cada bloco abaixo é um mini-ADR. Ao adicionar
> uma decisão nova, use o template no fim do arquivo.

## 1. Camadas (backend)

```
HTTP request
   ↓
[ api/      ]  Blueprints Flask. Parse de payload, validação de entrada
   ↓           via Marshmallow, mapeamento HTTP → chamada de service,
               formatação de resposta. **Sem regra de negócio aqui.**
[ services/ ]  Regras de negócio puras: recebem dados já validados
   ↓           (dataclasses / objetos de domínio), retornam resultados.
[ models/   ]  Modelos SQLAlchemy. Persistência. Sem validação de UI.
[ db        ]
```

**Fluxo de erro padrão** — toda resposta de erro da API segue o schema
`Error` definido em `specs/openapi.yaml`:

```json
{
  "error": "human readable message",
  "details": { "field": ["motivo"] }
}
```

Status HTTP segue convenções REST:

- `400` payload malformado
- `401` não autenticado
- `403` autenticado mas sem permissão
- `404` recurso inexistente
- `409` conflito de estado (ex.: e-mail duplicado)
- `422` violação de regra de validação (campo a campo)
- `500` erro inesperado (logado com traceback)

## 2. Convenções de nomenclatura

| Item              | Convenção            | Exemplo              |
| ----------------- | -------------------- | -------------------- |
| Pacotes Python    | `snake_case`         | `app.services.user`  |
| Classes           | `PascalCase`         | `UserService`        |
| Funções/variáveis | `snake_case`         | `create_user`        |
| Constantes        | `UPPER_SNAKE`        | `MAX_PASSWORD_LEN`   |
| Blueprints        | sufixo `_bp`         | `users_bp`           |
| Endpoints         | `kebab-case` no path | `/api/user-profiles` |
| Schemas OpenAPI   | `PascalCase`         | `UserCreate`         |
| Componentes React | `PascalCase`         | `UserForm`           |
| Hooks React       | prefixo `use`        | `useCreateUser`      |

## 3. Autenticação

- **Sessão por cookie httpOnly**, `SameSite=Lax` em produção, `Secure` quando
  o request é HTTPS. Backend emite cookie após login/cadastro bem-sucedido.
- **Sem JWT no cliente.** O frontend nunca toca em tokens.
- Logout = backend limpa cookie + invalida sessão server-side.

## 4. Fluxo de desenvolvimento vs. produção

|          | Dev                                | Produção                                              |
| -------- | ---------------------------------- | ----------------------------------------------------- |
| Backend  | `flask run` na porta 5000          | Gunicorn (4 workers) servindo via WSGI                |
| Frontend | Vite dev server na porta 5173      | Build estático em `frontend/dist`, servido pelo Flask |
| API      | `/api` servido pelo Flask          | `/api` servido pelo Flask                             |
| Proxy    | Vite → `http://localhost:5000/api` | Flask serve o `dist/` no catch-all (`spa.py`)         |
| Banco    | PostgreSQL via docker-compose      | PostgreSQL gerenciado                                 |
| Testes   | SQLite em memória                  | n/a                                                   |

Em produção, **um único processo Flask** serve a API e o frontend estático.
Em dev, há dois processos; o proxy do Vite elimina o problema de CORS.

## 5. Decisões de ferramentas (ferramentas e por quê)

| Decisão              | Escolha                   | Por quê (registrado)                                                                                                                                                  |
| -------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework web        | Flask                     | Time tem experiência, leve, application factory casa bem com SDD.                                                                                                     |
| ORM                  | Flask-SQLAlchemy          | Padrão de mercado, integração nativa com Flask-Migrate.                                                                                                               |
| Migrações            | Flask-Migrate (Alembic)   | Padrão SQLAlchemy; gera revisões auditáveis.                                                                                                                          |
| Validação            | Marshmallow               | Schemas reaproveitáveis em testes e na serialização OpenAPI.                                                                                                          |
| Testes               | pytest                    | Padrão Python; ecossistema grande.                                                                                                                                    |
| Testes de contrato   | Schemathesis              | Gera casos a partir do OpenAPI e valida respostas; melhor cobertura que `openapi-core` para fuzzing.                                                                  |
| Lint/format backend  | Ruff                      | Substitui flake8+isort+black, rápido, único binário.                                                                                                                  |
| Servidor produção    | Gunicorn                  | Padrão para deploy Flask.                                                                                                                                             |
| Frontend framework   | React 18 (sem TypeScript) | Requisito do projeto.                                                                                                                                                 |
| Bundler              | Vite                      | Dev server rápido, HMR, build otimizado.                                                                                                                              |
| Roteamento           | React Router 6            | Padrão de mercado.                                                                                                                                                    |
| Server state         | TanStack Query 5          | Cache, retries, invalidação; casa com fetchers do orval.                                                                                                              |
| Cliente gerado       | **orval**                 | Gera fetchers + tipos prontos para TanStack Query, com base no OpenAPI 3.1. Alternativa `openapi-typescript` foi descartada por exigir escrever fetchers manualmente. |
| Lint OpenAPI         | Spectral (Stoplight)      | Conjunto de regras maduro (spectral:oas).                                                                                                                             |
| Testes frontend      | Vitest + Testing Library  | Alinhado ao ecossistema Vite; API similar a Jest.                                                                                                                     |
| Lint/format frontend | ESLint + Prettier         | Padrão de mercado React.                                                                                                                                              |
| Container            | Docker multi-stage        | Imagem final enxuta só com Python + dist do React.                                                                                                                    |
| Banco produção       | PostgreSQL 16             | Robusto, JSONB nativo, excelente com SQLAlchemy.                                                                                                                      |

> Mudanças nessas escolhas devem ser propostas via PR com atualização deste
> arquivo e entrada em "Desvios do plano" do report da feature afetada.

## 6. Variáveis de ambiente (resumo)

| Variável       | Default (dev)                              | Descrição                             |
| -------------- | ------------------------------------------ | ------------------------------------- |
| `FLASK_ENV`    | `development`                              | `development` / `production` / `test` |
| `DATABASE_URL` | `postgresql+psycopg://app:app@db:5432/app` | URL SQLAlchemy                        |
| `SECRET_KEY`   | (obrigatório em prod)                      | Chave de sessão/cookie                |
| `CORS_ORIGINS` | `http://localhost:5173`                    | Origens permitidas em dev             |
| `SERVE_SPA`    | `false`                                    | `true` em produção para servir o dist |

Veja `backend/.env.example` para a lista completa e comentada.

## 7. Template de ADR (para novas decisões)

```markdown
### ADR-XXXX — <título da decisão>

- **Data:** YYYY-MM-DD
- **Contexto:** qual problema estávamos resolvendo.
- **Decisão:** o que escolhemos.
- **Alternativas consideradas:** outras opções e por que não.
- **Consequências:** trade-offs assumidos.
```
