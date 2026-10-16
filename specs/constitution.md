# Constituição do Projeto

> Este documento é **curto, estável e de alto nível**. Mudanças aqui são raras
> e devem ser feitas com consciência — ele governa como o time (humano ou IA)
> trabalha, não o que está sendo construído.

## 1. Spec-Driven Development (SDD)

1. **A especificação vem primeiro.** Nenhum código é escrito antes do
   `specs/features/<id>-<slug>/plan.md` correspondente existir e estar
   aprovado para a fase atual.
2. **`specs/openapi.yaml` é a fonte da verdade do contrato HTTP.** O backend
   obedece ao OpenAPI; o frontend gera seu cliente a partir dele.
3. **Cada feature tem exatamente dois documentos:**
   - `plan.md` — descreve a feature inteira, escrito **antes** de codar.
   - `report.md` — relato vivo, atualizado ao fim de **cada fase**.
4. **Idioma:** documentação e specs em **português do Brasil**. Código,
   nomes de variáveis, mensagens de commit e logs técnicos em **inglês**.

## 2. Regras inegociáveis

| #   | Regra                                                                                                                                        |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | Toda rota exposta em `openapi.yaml` **tem teste de contrato** em `backend/tests/contract/`.                                                  |
| R2  | Regra de negócio mora em `backend/app/services/`. Endpoints em `api/` apenas orquestram HTTP ↔ service.                                      |
| R3  | O contrato (`openapi.yaml`) **não muda sem atualizar o `plan.md`**. Toda mudança de contrato é registrada em `report.md → Desvios do plano`. |
| R4  | Toda tarefa referencia um requisito (`RF-xx` ou `RNF-xx`). Nenhuma tarefa órfã.                                                              |
| R5  | **Testes antes do código.** Nenhum PR é aceito com cobertura diminuída.                                                                      |
| R6  | Ao fim de cada fase: `make lint && make test` rodam verdes e o `report.md` é atualizado **no mesmo commit**.                                 |
| R7  | `plan.md` e código **nunca divergem sem registro** em `report.md → Desvios do plano`.                                                        |
| R8  | Nada é marcado como concluído sem **evidência real** (comando executado + resultado resumido colado no relatório).                           |

## 3. Fluxo de trabalho por fase

```
planejar → testar primeiro → implementar → verificar → relatar → próxima fase
```

Para cada fase da feature:

1. Releia o trecho correspondente do `plan.md`.
2. Escreva/ajuste os **testes** que falham antes da implementação.
3. Implemente o mínimo para fazer os testes passarem.
4. Rode `make spec-lint`, `make lint`, `make test`, `make test-contract`.
5. Atualize o `report.md` da feature: checklists, evidências, decisões, pendências.
6. Se a fase exigiu desviar do plano, atualize `plan.md` e registre em "Desvios do plano".

## 4. Versionamento de docs

- `constitution.md` é versionado, raramente alterado; mudanças viram commit
  com prefixo `docs(constitution):`.
- `architecture.md` acumula decisões técnicas (ADRs curtos); a data de cada
  decisão fica explícita.
- `openapi.yaml` segue versionamento semântico próprio dentro do campo
  `info.version`.

## 5. Anti-padrões proibidos

- ❌ Implementar antes de escrever teste.
- ❌ "Vou atualizar a doc depois" — a doc é parte do critério de pronto.
- ❌ Editar o OpenAPI "rapidinho" sem rastreio.
- ❌ Lógica de negócio dentro de blueprints (`@bp.route`).
- ❌ Marcar checklist `[x]` sem comando executado.
