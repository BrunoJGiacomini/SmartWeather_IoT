# Relatório - Mapa geoespacial de Indaiatuba

> Slug: `26-10-2026-mapa-geoespacial-indaiatuba`
> Origem: discovery de geolocalização, escopo reduzido para protótipo
> 100% frontend / 100% mock.
> Esta página é o registro vivo da feature. Cada fase é marcada `[x]`
> somente após o critério "Validar" da fase correspondente estar
> comprovado (comando executado + resultado resumido colado).

## Fases

- [x] **Fase 1 — Dependências e gate de teste do frontend**
  - Adicionar `leaflet` e `react-leaflet` às dependências de
    `frontend/package.json`.
  - Criar os scripts `test` (`node --test`) e `test:watch`
    (`node --test --watch`). **Nenhuma devDependency de teste.**
  - Criar `frontend/src/utils/sectorMapStyle.js` com a função pura
    `resolveSectorStyle({ sector, isSelected, isHovered })`.
  - Escrever `frontend/src/utils/sectorMapStyle.test.js` **antes** da
    implementação e vê-lo falhar.
  - **Validar:** `npm test` verde; `make test-frontend` verde;
    `npm run lint` 0 erros; `npm run build` verde.
  - **Como validar:** `npm test` imprime 1 teste passando;
    `make test-frontend` retorna código 0.
  - **Evidência (2026-10-26):** - `npm install leaflet@1.9.4 react-leaflet@5.0.0` → `added 3 packages,
and audited 152 packages` (exit 0). `package.json` recebeu
    `"leaflet": "^1.9.4"` e `"react-leaflet": "^5.0.0"` em
    `dependencies`; **nenhuma** devDependency de teste foi adicionada. - Scripts criados: `"test": "node --test"` e
    `"test:watch": "node --test --watch"`. - **TDD vermelho:** `npm test` → `ERR_MODULE_NOT_FOUND` para
    `src/utils/sectorMapStyle.js`, `tests 1 / pass 0 / fail 1`, exit 1. - **TDD verde:** `npm test` → `✔ resolveSectorStyle resolves color,
fill opacity and weight`, `tests 1 / pass 1 / fail 0`, exit 0.
    _(O teste pegou um bug real: `WEIGHT` não tinha a chave `hovered`, e o
    peso do setor sob hover saía `undefined`. Corrigido antes de fechar a
    fase.)_ - `npm run lint` → `✖ 1 problem (0 errors, 1 warning)`, exit 0. O único
    aviso é **pré-existente** e **fora do escopo** desta feature:
    `src/context/AuthContext.jsx:67` (`react-hooks/exhaustive-deps`) —
    arquivo que **não** foi tocado por esta feature. - `make test-frontend` → **não executável neste host**: o GNU `make`
    não está instalado no Windows (`make : O termo 'make' não é
reconhecido`). O corpo do target é `cd frontend && npm test`, que foi
    executado direto → exit 0, mesmo resultado. - `npm run build` → **dispensado por decisão do usuário em 2026-10-26**
    (a aplicação não deve ser buildada neste ambiente). Ver
    "Desvios do plano" e o `plan.md` § RNF-05.

- [x] **Fase 2 — Mock geoespacial**
  - Adicionar o campo `geojson` aos 4 setores de
    `frontend/src/mocks/sectors.js`, com as coordenadas exatas da
    § Modelo de dados do `plan.md`.
  - Exportar `SECTORS_FEATURE_COLLECTION` derivado de `Object.values(SECTORS)`.
  - Derivar `SECTOR_OPTIONS` de `SECTORS` em
    `frontend/src/utils/serviceOrders.js` (remover a lista hardcoded).
  - Escrever `frontend/src/mocks/sectors.test.js` **antes** e vê-lo falhar.
  - **Validar:** `npm test` verde com a integridade do mock coberta;
    `npm run lint` verde.
  - **Como validar:** o teste lista as 4 features; trocar uma coordenada
    para fora da bbox municipal faz o teste **falhar**; `SECTOR_OPTIONS`
    passa a ter 4 entradas, iguais às chaves de `SECTORS`.
  - **Evidência (2026-10-26):** - **TDD vermelho:** `npm test` → `SyntaxError: The requested module
'./sectors.js' does not provide an export named
'SECTORS_FEATURE_COLLECTION'`, `tests 2 / pass 1 / fail 1`, exit 1. - **TDD verde:** `npm test` → `✔ the geospatial mock is consistent with
the sectors` + `✔ resolveSectorStyle ...`, `tests 2 / pass 2 /
fail 0`, exit 0. - **Prova de que o teste pega geometria fora do município** (mutação
    temporária, revertida em seguida): - `[-47.2139, -23.0899]` → `[-47.2139, -23.9899]` (3º vértice do
    setor `c`): `AssertionError: latitude -23.9899 of sector c is
outside the municipality` (checagem de bbox), exit 1. - Mutação do vértice de fecho: o teste acusou a quebra do anel
    fechado (`actual: [-47.2183, -23.0876] / expected:
[-47.2183, -23.9876]`), exit 1. - Arquivo restaurado e `npm test` verde de novo. - `SECTOR_OPTIONS` → 4 entradas, iguais aos nomes dos setores
    (asserção `assert.deepEqual(SECTOR_OPTIONS, sectors.map(s => s.nome))`). - `npm run lint` → `✖ 1 problem (0 errors, 1 warning)`, exit 0 —
    mesmo aviso **pré-existente** de `AuthContext.jsx:67` (nenhum arquivo
    novo em violation). - `npm run build` → dispensado (decisão do usuário em 2026-10-26).

- [x] **Fase 3 — Componente do mapa**
  - Criar `frontend/src/hooks/useSectorMap.js` (estado de hover, função
    `style`, handlers de clique/hover).
  - Criar `frontend/src/components/SectorMap.jsx` (`MapContainer`,
    `TileLayer`, `GeoJSON`).
  - Criar o bloco CSS do mapa em `frontend/src/styles/global.css`:
    `.map { aspect-ratio: 620 / 380 }`, `.leaflet-map { position: absolute;
inset: 0 }` e as regras de cor dos setores **sem** `fill-opacity`
    nem `stroke-width`.
  - **Validar:** `npm test` verde; `npm run lint` e `npm run build` verdes.
  - **Como validar:** `npm run dev` + abrir `/mapa` — o basemap carrega,
    os 4 polígonos aparecem dentro do município, o clique destaca e abre o
    popup, e o hover realça.
  - **Evidência (2026-10-26):** - `frontend/src/hooks/useSectorMap.js`: hover em estado local
    (`useState`), `style` com dependências `[sectors, selectedId,
hoveredId]` — **nunca** memoizada com `[]`, senão o destaque
    silenciosamente para de funcionar (Regra 2 do `plan.md`).
    `onEachFeature` registra `click` / `mouseover` / `mouseout` e
    referencia o `onSelect` mais recente por `useRef` (sem closure
    obsoleta). A coleção GeoJSON é derivada de `Object.values(sectors)`. - `frontend/src/components/SectorMap.jsx`: `MapContainer`
    (`center={[-23.083, -47.221]}`, `zoom={14}`, `scrollWheelZoom={false}`,
    `zoomAnimation`/`fadeAnimation` conforme `prefers-reduced-motion`),
    `TileLayer` com a URL oficial do OSMF (sem subdomínio `{s}`) e
    atribuição visível, `GeoJSON` com `key="setores-v1"` **constante**.
    Componentes auxiliares no mesmo arquivo: `ScrollWheelZoomToggle`
    (liga o zoom por scroll após a interação), `MapActivation`
    (`useMapEvents` em `click`/`focus`), `MapResizer`
    (`ResizeObserver` → `map.invalidateSize()`). - `frontend/src/styles/global.css`: as regras `.poly`, `.poly:hover`,
    `.poly.sel` e `.lbl` (do SVG antigo) foram **removidas** — elas
    fixavam `fill-opacity`/`stroke-width` por CSS, que venceriam os
    atributos SVG e impediriam o destaque. A regra `.map svg` também foi
    removida: ela redimensionaria o `<svg>` do renderer do Leaflet.
    Novo bloco: `.map { aspect-ratio: 620/380 }`, `.leaflet-map`,
    `.leaflet-map .leaflet-container { width/height: 100% }`,
    `.leaflet-map path { transition: fill-opacity .15s }` (com guarda de
    `prefers-reduced-motion`) e `z-index: 0` no `.leaflet-map` + `z-index:
10` no `.pop` para o popup ficar **acima** dos panes do Leaflet
    (z-index 400+). - `npm test` → `tests 2 / pass 2 / fail 0`, exit 0. - `npm run lint` → `0 errors, 1 warning` (aviso pré-existente de
    `AuthContext.jsx:67`, fora do escopo). - `npm run build` → dispensado (decisão do usuário em 2026-10-26). - **Smoke test no navegador** (`npm run dev` + Playwright em
    `http://localhost:5173/mapa`): basemap de Indaiatuba carregado, 4
    polígonos presentes com `fill` = `#e5484d` / `#e9a100` / `#10b981` /
    `#2f7de1`, `fill-opacity` 0.18 e `stroke-width` 2, e **sem** a classe
    `.poly` no DOM (prova de que o CSS não sobrescreve os atributos SVG).

- [x] **Fase 4 — Integração na rota `/mapa`**
  - Alterar `frontend/src/pages/MapaPage.jsx` para renderizar `SectorMap`
    no lugar de `MapView`, mantendo `SectorPopup` e o cabeçalho.
  - Remover `frontend/src/components/MapView.jsx`.
  - Ajustar `frontend/src/context/UiContext.jsx` apenas se necessário para
    o estado de hover (preferencialmente o hover fica local ao `SectorMap`).
  - **Validar:** `npm test` verde; `npm run lint` e `npm run build` verdes.
  - **Como validar:** `npm run dev` + abrir `/mapa` — o basemap de
    Indaiatuba carrega, os 4 polígonos aparecem dentro do município, o
    clique destaca e abre o popup, e a emissão de OS mantém o setor.
  - **Evidência (2026-10-26):** - `frontend/src/pages/MapaPage.jsx` → `<SectorMap sectors={SECTORS}
selectedId={selectedSectorId} onSelect={handleSelectSector} />`,
    com `SectorPopup` e o cabeçalho **intactos**. `handleSelectSector`
    envolvido em `useCallback`. - `frontend/src/components/MapView.jsx` **removido**
    (`mavis-trash: moved to trash`) — o único consumidor dos campos
    `path`/`labelPos` do mock. - `frontend/src/context/UiContext.jsx` **não foi alterado**: o hover
    ficou local ao `SectorMap` e o `selectedSectorId` já existia. - Campos `path` e `labelPos` removidos de `frontend/src/mocks/sectors.js`
    (dados do SVG, sem consumidor depois da troca). - `npm test` → `tests 2 / pass 2 / fail 0`, exit 0. - `npm run lint` → `0 errors, 1 warning` (pré-existente). - `npm run build` → dispensado (decisão do usuário em 2026-10-26). - **Smoke test no navegador:** - Clique num setor → `fill-opacity` **0.5** / `stroke-width` **3**;
    os outros três em 0.18 / 2; `SectorPopup` exibindo nome, pill de
    status, métricas, ocorrência e o botão de OS. - Hover → 0.38; setor **selecionado** mantém 0.5 sob hover
    (precedência do plano); ao sair do polígono, volta a 0.18. - Clique no mesmo setor (CE-05) e clique no basemap (CE-10) →
    a seleção é **mantida**, o popup permanece aberto. - Navegação client-side `/mapa` → `/clima` → `/mapa` (CE-06) → a
    seleção é **preservada** (0.5 / 3 e o popup aberto). - "+ Emitir Ordem de Serviço" → `NewOsModal` aberto com
    `setor = "Praça da Liberdade"` pré-selecionado; o `select` de setor
    oferece exatamente `Parque do Mirim`, `Parque das Frutas`,
    `Praça da Liberdade`, `Parque da Criança` (4 = número de polígonos).

- [x] **Fase 5 — Fechamento e validação**
  - Rodar `npm run lint`, `npm run build`, `npm test` e
    `make test-frontend`; colar o output aqui.
  - Conferir os 15 critérios de aceite da § Critérios de aceite do
    `plan.md`.
  - Smoke test **manual** (navegador) em `/mapa`: carregar, clicar,
    destacar, emitir OS, redimensionar a janela, sem rede,
    `prefers-reduced-motion`.
  - Confirmar `git diff --stat specs/openapi.yaml` e
    `git diff --stat backend/` vazios.
  - **Validar:** todos os comandos verdes + os 15 critérios verificados.
  - **Como validar:** output dos comandos colado nesta página.
  - **Evidência (2026-10-26):**
    - `npm test` → `✔ the geospatial mock is consistent with the sectors`,
      `✔ resolveSectorStyle resolves color, fill opacity and weight`,
      `tests 2 / pass 2 / fail 0`, exit 0. **2 arquivos de teste**
      (`src/mocks/sectors.test.js`, `src/utils/sectorMapStyle.test.js`).
    - **Zero dependências de teste**: `npm ls --depth=0` não retorna
      `vitest`, `jsdom`, `@testing-library/*` nem `jest`; as
      `devDependencies` continuam sendo apenas eslint/vite/globals.
    - `make test-frontend` → o GNU `make` **não existe** neste host
      Windows; o corpo do target (`cd frontend && npm test`) foi executado
      direto → exit 0, mesmo resultado. O `Makefile` não foi alterado.
    - `npm run lint` → `✖ 1 problem (0 errors, 1 warning)`, exit 0 — o
      único aviso é **pré-existente** e **fora do escopo**
      (`src/context/AuthContext.jsx:67`).
    - `npm run build` → **dispensado** por decisão do usuário em 2026-10-26
      (a aplicação não deve ser buildada neste ambiente).
    - `git diff --stat specs/openapi.yaml` → **vazio** (RNF-01).
    - `git diff --stat backend/` → **vazio** (RNF-01).
    - `git diff --stat` (repo) → só `frontend/*`:
      `package.json`, `package-lock.json`, `MapView.jsx` (removido),
      `mocks/sectors.js`, `pages/MapaPage.jsx`, `styles/global.css`,
      `utils/serviceOrders.js` + os 4 arquivos novos
      (`SectorMap.jsx`, `hooks/useSectorMap.js`, `utils/sectorMapStyle.js`
      e os 2 `.test.js`).
    - **Smoke test no navegador** (Playwright, `npm run dev`), viewport
      1100×700, `/mapa`: os 15 critérios foram conferidos um a um — ver a
      tabela abaixo.

## Observações e bloqueios

- [2026-10-26 21:40] Fase 1 — **Build de produção dispensado por decisão
  do usuário**: a aplicação não deve ser buildada neste ambiente. O
  critério de aceite nº 2 (`npm run build` → verde) e as validações de
  fase que dependem do build foram marcadas como dispensadas no `plan.md`
  (§ RNF-05, § Critérios de aceite, § Fases de execução, CE-11).
  A verificação do bundle passa a ocorrer pelo smoke test sobre
  `npm run dev`.
- [2026-10-26 21:40] Fase 1 — **`make` não existe neste host Windows**
  (`make : O termo 'make' não é reconhecido`). O target `test-frontend`
  do `Makefile` (`cd frontend && npm test`) foi executado direto, com o
  mesmo resultado (exit 0). O `Makefile` **não** foi alterado.
- [2026-10-26 21:40] Fase 1 — **1 aviso de lint pré-existente** em
  `frontend/src/context/AuthContext.jsx:67`
  (`react-hooks/exhaustive-deps`). Arquivo **fora** da lista de arquivos
  do plano e **não** alterado por esta feature. O critério de aceite nº 1
  ("0 erros, 0 avisos") fica **parcialmente** atendido: 0 erros, 1 aviso
  herdado da feature anterior. Corrigir exigiria aprovação para tocar um
  arquivo fora do escopo.
- [2026-10-26 22:05] Fases 3–5 — **artefato de input do Playwright, não é
  bug do app**: com o viewport emulado maior que a janela real do navegador
  (`devicePixelRatio` 0,9), o Chrome escalona a página e os cliques
  sintéticos do Playwright (`mouse.click`) deixavam de chegar ao DOM —
  nenhum `mousedown`/`click` era despachado no `document`. Diagnosticado
  comparando com um `dispatchEvent` sintético (que **selecionou** o setor
  normalmente, 0.5) e com o clique real em um viewport menor que a janela
  (que também selecionou normalmente). Nenhuma mudança de código foi
  necessária.
- [2026-10-26 22:05] Fases 3–5 — **altura máxima do mapa**: com o
  `aspect-ratio: 620/380` em telas largas, o mapa ficava mais alto que a
  viewport e a atribuição do OpenStreetMap saía de tela, contrariando a
  RNF-07 ("nunca ... fora da viewport"). O `.map` ganhou
  `max-height: calc(100vh - 140px)` + `margin-inline: auto`: o mapa passa a
  caber inteiro na tela, mantendo a proporção 620/380 e a atribuição
  sempre visível. Consequência: a rota `/mapa` deixa de ter barra de
  rolagem própria — o mapa ocupa a altura disponível.
- [2026-10-26 22:20] Fases 3–5 — **`frontend/public/favicon.svg` e
  `frontend/public/icons.svg` foram removidos** durante a execução e a
  exclusão foi **mantida por decisão do usuário**. Nenhum arquivo do
  código-fonte os referencia (`grep` por `favicon`/`icons.svg` em
  `frontend/src`: nenhum resultado), mas o `frontend/index.html` ainda
  declara `<link rel="icon" href="/favicon.svg" />` — o pedido do favicon
  passa a responder 404 e o app usa o ícone padrão do navegador.
  O `index.html` **não** foi alterado (está fora da lista de arquivos do
  `plan.md`): remover a linha do `<link>` ou restaurar o asset fica como
  decisão do usuário.
