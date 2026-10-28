# Plano - Mapa geoespacial de Indaiatuba

> Slug: `26-10-2026-mapa-geoespacial-indaiatuba`
> Origem: conversa de discovery sobre geolocalização (PostGIS / Supabase /
> react-leaflet). O escopo foi **reduzido** para uma fatia **100% frontend,
> 100% mock**, por se tratar de um protótipo.
> Predecessora: `15-10-2026-conversao-prototipo-html-para-react` (feature 002).

## Objetivo

Substituir o mapa **SVG desenhado à mão** da rota `/mapa` por um mapa real
renderizado com **react-leaflet**, exibindo o município de **Indaiatuba (SP)**
como basemap e os **setores** do protótipo como polígonos georreferenciados,
com dados geográficos **totalmente mockados**.

O objetivo final é a **parada da paridade visual** da feature 002 para a rota
`/mapa`: a partir desta feature, o protótipo deixa de ser uma reprodução
fiel do `SmartWeather.html` nessa tela e passa a ser um mapa funcional.

- **Motivação (por quê):** o mapa atual é um SVG estático com 3 polígonos
  desenhados à mão em coordenadas de tela (`M60,60 L300,40 ...`). Ele não
  representa lugar nenhum, não permite pan/zoom e não tem basemap. O produto
  é um sistema de gestão de **áreas verdes urbanas** — o mapa é o eixo
  espacial da aplicação, e hoje é uma ilustração.
- **Contexto:**
  - O frontend já existe e está completo em React 19 + Vite 8 (`002`).
  - **Não existe** backend para setores: `specs/openapi.yaml` tem apenas
    `/api/health` e `/api/users`. O mapa hoje consome
    `frontend/src/mocks/sectors.js`.
  - A feature 002 fechou com "paridade total" comprovada por Playwright
    (6 fases, todas verdes). Esta feature **anula** esse selo **apenas** na
    rota `/mapa`.
  - O usuário deliverou a direção técnica: **react-leaflet** para renderizar
    o mapa, **dados mockados** para a geometria, mapa **de Indaiatuba**, e a
    seção selecionada **destacada** no mapa.

### Decisões delegateadas ao proponente (IA)

O usuário pediu explicitamente que, nas perguntas em aberto, a IA **usasse a
sua própria sugestão**, desde que isso ficasse **registrado no documento**.

Quatro questões estavam abertas. As duas primeiras foram resolvidas pela
IA, por delegação; as duas últimas foram **revistas pelo usuário** depois de
propostas pela IA:

| #   | Questão                                                        | Decisão adotada                                                                                                                                  | Justificativa                                                                                                                                                                                              | Marcação               |
| --- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| 1   | Cor do polígono: por `tipo` da área ou por status operacional? | **Status operacional** (🔴/🟡/🟢 derivado do campo `cor` do mock)                                                                                | O protótipo já usa `.poly.r / .y / .g` para prioridade e o `SectorPopup` mostra o pill de status com a mesma semântica. Colorir por `tipo` trocaria o significado da cor e quebraria a leitura do produto. | **Sugestão da IA**     |
| 2   | Estações IoT entram nesta fatia?                               | **Não.** Ficam para a fatia seguinte                                                                                                             | Mantém a fatia enxuta e evita a armadilha do ícone default do Leaflet sob Vite.                                                                                                                            | **Sugestão da IA**     |
| 3   | Qual o porte da suíte de testes?                               | **Mínima: 2 arquivos de teste, runner nativo do Node (`node:test`), zero dependência nova.** Vitest, Testing Library, jsdom e coverage **fora**. | O usuário revidou o excesso de testes: o objetivo é provar 2 invariantes baratos, não cobrir o framework. `node --test` já vem no Node 20+ e roda os testes puros sem DOM.                                 | **Decisão do usuário** |
| 4   | Vitest entra na spec?                                          | **Não**                                                                                                                                          | Substituído pela decisão 3. `vitest`, `@vitest/coverage-v8`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event` e `jsdom` **não** são instalados.                        | **Decisão do usuário** |

> **Aprovação pendente:** as decisões acima foram tomadas por delegação
> explícita do usuário. Se qualquer uma for revertida, o impacto está
> mapeado em §12 (Riscos e perguntas em aberto).

## Escopo

### Incluído

- Renderização do mapa base de Indaiatuba via **react-leaflet 5** + **Leaflet 1.9.4**.
- Basemap raster do **OpenStreetMap** com atribuição visível.
- Geometria **GeoJSON mockada** dos setores, georreferenciada dentro do
  município de Indaiatuba.
- Clique no setor → **seleção + destaque** (preenchimento e traço).
- Hover no setor → realce (feedback de descoberta).
- Preservação do **`SectorPopup` lateral** atual, agora como overlay sobre o mapa.
- Emissão de OS a partir do popup, preservando o setor selecionado.
- **Correção da inconsistência 3 vs 4 setores** (§ RF-06).
- **Gate de teste mínimo do frontend**, destravando `make test-frontend`
  com o **runner nativo do Node** (`node:test`), sem nenhuma dependência
  nova de teste.

### Fora de escopo

- **Backend, API, banco, PostGIS, Supabase.** Nenhuma rota nova, nenhuma
  alteração em `specs/openapi.yaml`, nenhuma tabela. (§ RNF-01)
- **Marcadores de estações IoT** no mapa — fatia seguinte.
- **Equipamentos e realocação** no mapa — fatia seguinte.
- **Edição de geometria** de setor em runtime (admin de shapes) — não existe
  hoje nenhum CRUD de setor.
- **Testes de componente / DOM** (Testing Library, jsdom), **métricas de
  cobertura** e **testes de renderização** — **fora de escopo**. O
  comportamento visual do mapa é validado por **smoke test manual**, não por
  automação de UI.
- **Testes de e2e / Playwright** — fora.
- **Mapa offline / download de tiles** — proibido pela política do OSM
  (§12, risco R-01).
- **MapLibre GL / tiles vetoriais** — não se justifica com 4 setores.
- **Estilização do mapa por tema escuro** — decisão de protótipo (§10).
- **Nenhuma alteração** em `frontend/src/components/MapView.jsx` além da
  remoção (o componente sai do fluxo).
- Não é objeto desta feature corrigir `make setup` / `make dev` (caminho
  POSIX `.venv/bin/python` no Windows) nem criar o template
  `specs/features/000-template` — pendências pré-existentes, registradas em
  §12.

## Requisitos funcionais e não funcionais

### RF-01 — Mapa base de Indaiatuba

- **Dado** o usuário autenticado na rota `/mapa`
- **Quando** a rota é renderizada
- **Então** o React renderiza um `MapContainer` do react-leaflet com:
  - `center={[-23.083, -47.221]}` — verificado por point-in-polygon contra o
    GeoJSON do IBGE: **o ponto está dentro do polígono municipal** de
    Indaiatuba (`codarea` 3520509).
  - `zoom={14}`.
  - Um `TileLayer` com
    `url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"` e
    `attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'`.
  - `scrollWheelZoom={false}` no estado inicial (ver RF-07).

### RF-02 — Setores renderizados como polígonos georreferenciados

- **Dado** o mock `frontend/src/mocks/sectors.js`
- **Quando** o mapa renderiza
- **Então** cada setor do mock é desenhado como um `Polygon` do Leaflet a
  partir de um `Feature` GeoJSON, e **todos os 4 setores** são visíveis
  simultaneamente no viewport inicial, dentro do município.

### RF-03 — Clique no setor seleciona e destaca

- **Dado** um setor visível no mapa
- **Quando** o usuário clica no polígono
- **Então**:
  - O setor passa a ser o **setor selecionado** (estado em `UiContext`,
    reaproveitando `selectedSectorId`).
  - O polígono selecionado é renderizado com `fillOpacity` **0.5** e
    `weight` **3**.
  - Os demais setores permanecem com `fillOpacity` **0.18** e `weight` **2**.
  - O `SectorPopup` abre com os dados do setor selecionado.
  - Clicar novamente no mesmo setor **mantém** a seleção (não há
    desseleção por clique — comportamento idêntico ao do SVG da feature 002).

### RF-04 — Hover no setor realça

- **Dado** um setor visível no mapa
- **Quando** o cursor entra no polígono
- **Então** aquele setor passa a `fillOpacity` **0.38** enquanto o cursor
  estiver sobre ele, e volta a **0.18** ao sair.
- Um setor **selecionado** mantém **0.5** mesmo sob hover (a seleção tem
  precedência sobre o hover).

### RF-05 — Popup lateral e emissão de OS preservados

- **Dado** um setor selecionado
- **Quando** o `SectorPopup` é exibido
- **Então** ele mantém o layout atual (`position: absolute; right: 16px;
top: 16px; width: 320px`), exibindo nome, pill de status, métricas,
  ocorrência e o botão **"+ Emitir Ordem de Serviço"**.
- **Quando** o botão é clicado
- **Então** o `NewOsModal` abre com o setor pré-selecionado
  (`initialSetor={setor.nome}`), exatamente como na feature 002.

### RF-06 — Fonte única de verdade dos setores

- **Dado** o mock `frontend/src/mocks/sectors.js` com 4 setores
- **Quando** o formulário de nova OS lista as opções de setor
- **Então** a lista vem **derivada** de `Object.values(SECTORS)`, e **não** de
  um array hardcoded.
- Consequência: o número de setores desenhados no mapa (4) é **igual** ao
  número de opções oferecidas na OS (4). A feature 002 tinha 3 polígonos no
  mapa e 4 opções na OS — "Parque da Criança" existia como setor de OS e
  como estação, **sem polígono**. Essa inconsistência é eliminada.

### RF-07 — Pan, zoom e scroll

- **Dado** o mapa renderizado
- **Quando** o usuário arrasta ou usa os controles de zoom
- **Então** o mapa responde normalmente.
- **Quando** o usuário rola a página com o cursor sobre o mapa
- **Então** a **página** rola (o mapa não captura o scroll).
- **Quando** o usuário clica/foca no mapa
- **Então** o zoom por scroll passa a ser habilitado naquele mapa.

### RF-08 — Degradação sem basemap

- **Dado** que os tiles do OSM não carregam (sem internet, ou rede
  bloqueada)
- **Quando** o mapa é renderizado
- **Então** os **polígonos dos setores continuam visíveis** sobre o fundo
  sólido do container (`.map` tem `background: var(--sf2)`), e a atribuição
  permanece visível.

### RNF-01 — Nenhuma alteração de contrato ou de backend

- `specs/openapi.yaml` **permanece intocado** (diff vazio).
- Nenhum arquivo em `backend/` é criado, alterado ou removido.
- Nenhuma requisição de rede é feita a qualquer API da aplicação.

### RNF-02 — Nenhuma dependência de serviço externo para o dado

- Toda a geometria vem de arquivo local mockado. O mapa funciona sem backend.
- O **único** recurso externo é o basemap raster do OSM (e ele degrada sem
  quebrar o app — RF-08).

### RNF-03 — Geometria dentro do limite municipal

- Todo vértice dos 4 polígonos mockados está dentro do polígono municipal do
  IBGE (`3520509`). Limites verificados na criação desta spec:
  - bbox do município: **lon −47,3056 … −47,0836** / **lat −23,2260 … −22,9979**
  - os 16 vértices propostos e os 4 centróides estão dentro.
- As áreas resultantes (15,9 ha / 14,4 ha / 14,6 ha / 4,1 ha) são coerentes
  com as métricas exibidas no popup.

### RNF-04 — Gate de teste do frontend

- `frontend/package.json` passa a expor o script `test` → `node --test`.
- `make test-frontend` executa sem erro e termina em verde.
- `npm test` roda em modo não-interativo, sem watch.
- A suíte tem **2 arquivos de teste** e **nenhuma dependência de teste
  instalada**: `vitest`, `@vitest/coverage-v8`, `@testing-library/react`,
  `@testing-library/jest-dom`, `@testing-library/user-event` e `jsdom`
  **ficam de fora**.

### RNF-05 — Lint e build verdes

- `npm run lint` → 0 erros, 0 avisos.
- `npm run build` → concludes com sucesso.

> **Alteração de 2026-10-26 (decisão do usuário):** a aplicação **não deve
> ser buildada** neste ambiente. O build de produção fica **dispensado**:
> o critério de aceite nº 2 e as validações de fase que dependem de
> `npm run build` não são executados, e o bundle é verificado pelo smoke test
> sobre `npm run dev` (o mesmo caminho de código, sem gerar `dist/`).

### RNF-06 — Compatibilidade de versões

- `react-leaflet@5.0.0` (peer `react ^19.0.0`) + `leaflet@1.9.4`.
  O projeto já está em React `19.2.8` — **compatível, sem downgrade**.
- Leaflet `2.0` (alpha, ESM-only) **não** deve ser adotado.

### RNF-07 — Atribuição visível

- A atribuição "© OpenStreetMap contributors" fica visível no mapa, no
  canto inferior direito, em nenhum momento escondida atrás de toggle ou
  fora da viewport (exigência da Tile Usage Policy do OSMF).

### RNF-08 — Movimento reduzido

- Sob `prefers-reduced-motion: reduce`, as animações de zoom e fade do
  Leaflet são desabilitadas (`zoomAnimation={false}`, `fadeAnimation={false}`),
  alinhando com o comportamento já adotado pelo protótipo nas demais telas.

## Regras de negócio

1. **Identidade do setor.** O setor é identificado pelo `id` (`a`, `b`, `c`,
   `d`) dentro do mock. O `nome` é único e é o valor exibido no popup e no
   formulário de OS.
2. **Cor = status operacional.** A cor do polígono vem do campo `cor` do
   mock (`r` / `y` / `g`), que representa a **prioridade/atraso do setor**
   (🔴 alta · 4d em atraso, 🟡 média · vence em 6d, 🟢 em dia). A cor **não**
   representa o tipo de área verde.
3. **Seleção exclusiva e estável.** No máximo um setor selecionado por vez.
   A seleção persiste enquanto o usuário estiver na rota `/mapa`.
4. **Precedência do destaque.** `selecionado` (0.5) > `hover` (0.38) >
   normal (0.18).
5. **OS herda o setor.** Toda OS emitida a partir do popup carrega o setor
   selecionado. O `NewOsModal` mantém o `setor` como **string** (mock de
   frontend) — a migração para FK é de outra feature.
6. **Derivação obrigatória.** `SECTOR_OPTIONS` é derivado de `SECTORS`.
   É proibido manter uma lista hardcoded de nomes de setor em qualquer
   arquivo.

## Arquitetura e decisões técnicas

### Stack (adicionada nesta feature)

| Pacote                                             | Versão  | Papel                                                |
| -------------------------------------------------- | ------- | ---------------------------------------------------- |
| `react-leaflet`                                    | `5.0.0` | Componentes React para o Leaflet                     |
| `leaflet`                                          | `1.9.4` | Motor de renderização do mapa                        |
| `node:test` + `node:assert` (built-in do Node 20+) | —       | Gate de teste do frontend — **sem dependência nova** |

> **Decisão do usuário:** a suíte de testes é **mínima** e usa apenas o
> runner nativo do Node (`node:test`), sem instalar Vitest, Testing Library,
> jsdom nem coverage. O `architecture.md` §5 declara \*"Testes frontend: Vitest
>
> - Testing Library"\* como decisão vigente — esta spec **diverge** desse ADR,
>   e a atualização do `architecture.md` fica como pendência (ver § Riscos
>   R-09).
>
> **Nota de compatibilidade:** o script é `node --test` **sem argumentos**,
> que faz o runner varrer o diretório atual recursivamente atrás de arquivos
> `*.test.js` (ignorando `node_modules`). A forma `node --test src` **não**
> funciona — o Node trata o argumento como arquivo a executar, não como
> diretório a varrer (comportamento verificado no Node v24.13.0).
> `node --test <arquivo>` também funciona, caso se prefira listar
> explicitamente os 2 arquivos.

### Estrutura de renderização

```
MapaPage
└── div.map                      (position: relative — mantém o layout da 002)
    ├── div.leaflet-map          (position: absolute; inset: 0)
    │   └── MapContainer         (react-leaflet)
    │       ├── TileLayer        (OSM)
    │       └── GeoJSON          (4 setores)
    └── SectorPopup              (DOM puro, position: absolute — sobrevive intacto)
```

- O `SectorPopup` é **DOM comum**, não um `Popup` do Leaflet. Ele continua
  posicionado por CSS e **não precisa ser reescrito**. O Leaflet renderiza
  seus layers fora do React, então misturar Elementos React e Leaflet no mesmo
  container exige cuidado de `z-index` — o `SectorPopup` já tem `z-index`
  suficiente por estar **fora** do container do Leaflet.

### Altura do container

O Leaflet **não** dimensiona o próprio container: ele exige altura
definida. O protótipo dimensionava o SVG por `height: auto` (razão
620/380). Para preservar a proporção original:

```css
.map {
  aspect-ratio: 620 / 380;
}
.leaflet-map {
  position: absolute;
  inset: 0;
}
```

O `aspect-ratio` reproduz exatamente o retângulo do SVG original.

### Armadilhas do react-leaflet 5 (verificadas no código-fonte)

Lidos em `react-leaflet@5.0.0/lib/GeoJSON.js`:

```js
export const GeoJSON = createPathComponent(
  function createGeoJSON({ data, ...options }, ctx) { ... },
  function updateGeoJSON(layer, props, prevProps) {
    if (props.style !== prevProps.style) {
      if (props.style == null) { layer.resetStyle(); }
      else { layer.setStyle(props.style); }
    }
  }
);
```

**Regra 1 — `data` e `onEachFeature` nunca são re-aplicados.**
`updateGeoJSON` só trata `style`. Trocar a geometria exige recriar a camada,
o que se faz trocando a **`key`** do componente `GeoJSON`.
→ O `key` será **constante** (`"setores-v1"`), já que o mock é estático.
Não incluir `selectedId` no `key`: recriaria as 4 camadas a cada clique sem
necessidade — o `setStyle` já resolve.

**Regra 2 — `style` é comparado por referência.**
`props.style !== prevProps.style` — uma arrow function inline cria
referência nova a cada render, o que faz `layer.setStyle(...)` rodar a cada
render. É **exatamente isso** que faz o destaque reagir à seleção.
→ **Proibido** envolver a função `style` em `useCallback` com `[]` ou
memoizá-la sem `selectedId`/`hoveredId` nas dependências: o destaque
**silenciosamente deixaria de funcionar**.

**Regra 3 — `className` devolvido pelo `style` não chega ao DOM.**
O Leaflet aplica `options.className` no `_initPath` (construtor); o
`resetStyle` posterior apenas altera `layer.options.className`, sem tocar no
elemento SVG.
→ **A cor de cada setor deve ser devolvida como `fillColor` / `color` dentro
da função `style`** — nunca como `className`.

### Conflito entre CSS e atributos SVG

O `global.css` atual define:

```css
.poly       { fill: var(--g); fill-opacity: 0.18; stroke: var(--g); stroke-width: 1.5; ... }
.poly:hover { fill-opacity: 0.38; }
.poly.sel   { fill-opacity: 0.5; stroke-width: 3; }
```

**Regras CSS vencem atributos SVG.** Se os paths do Leaflet receberem a
classe `.poly`, o `fill-opacity: 0.18` do CSS sobrescreveria o `fillOpacity`
definido pela função `style` → **o destaque nunca apareceria**.

→ Consequência: as classes CSS do mapa **não podem** definir
`fill-opacity` nem `stroke-width`. A opacidade e a espessura ficam
**exclusivamente** sob controle da função `style` (RF-03, RF-04).
O hover também é resolvido pela função `style` (via `hoveredId`), e não por
`:hover` de CSS, pelo mesmo motivo — assim a precedência
selecionado > hover > normal (Regra de negócio 4) é determinística.

### Cores

| `cor` | Variável CSS | Hex (protótipo) | Uso                           |
| ----- | ------------ | --------------- | ----------------------------- |
| `r`   | `--r`        | `#e5484d`       | 🔴 prioridade alta / atrasado |
| `y`   | `--y`        | `#e9a100`       | 🟡 prioridade média           |
| `g`   | `--g`        | `#10b981`       | 🟢 em dia                     |

> **Sugestão da IA:** as cores são **hardcoded** no `style` function, em vez
> de lidas de `var(--g)` em runtime. Motivo: `var(--x)` **não resolve** em
> atributo SVG (`fill="var(--g)"` é inválido), então a alternativa seria ler
> as variáveis via `getComputedStyle` e re-renderizar a cada troca de tema.
> Como o basemap raster é **claro** nos dois temas, a paridade de tema no
> mapa traria ganho visual pequeno e custo de complexidade alto.
> **Consequência aceita:** as cores do mapa não mudam com o tema escuro.

### Tile layer

- URL: `https://tile.openstreetmap.org/{z}/{x}/{y}.png` — **sem** o
  subdomínio `{s}`. A [Tile Usage Policy do OSMF](https://operations.osmfoundation.org/policies/tiles/)
  determina: _"Use the correct URL: https://tile.openstreetmap.org/{z}/{x}/{y}.png"_
  e alerta que _"Other subdomains or hostnames may be slower or withdrawn
  without notice"_. O `{s}` (a/b/c) é a forma legada.
- A URL fica em uma **constante** no módulo (a política recomenda
  _"avoid hard-coding the tile URL"_).
- Atribuição visível, conforme RNF-07.

### Interação e ciclo de vida

- `onEachFeature` roda **apenas na criação** da camada. Ele registra apenas
  o handler de `click` / `mouseover` / `mouseout`, que por sua vez chama
  setters de estado do React (estáveis, sem closure obsoleta). **Nunca**
  fechar `selectedId` dentro de `onEachFeature`.
- O Leaflet **não** detecta redimensionamento do container: ao redimensionar
  a janela, é preciso chamar `map.invalidateSize()`, senão os tiles ficam
  deslocados ou cortados.
- `scrollWheelZoom` começa desligado e é habilitado após interação com o
  mapa (RF-07), evitando que o mapa capture a rolagem da página.
- `zoomAnimation` / `fadeAnimation` desligados sob `prefers-reduced-motion`
  (RNF-08).

### O que **não** sobrevive a esta escolha

- **Tiles offline / download de área**: proibido pela política do OSM.
- **Tiles vetoriais e zoom muito profundo**: o Leaflet raster não tem o
  mesmo desempenho em zoom alto com muitos elementos.
- **Cor por tema**: (§ Cores, acima).
- **Editar geometria em runtime**: exigiria um editor de shapes que
  nenhuma biblioteca do Leaflet oferece nativamente.

## Arquivos a criar ou alterar

### Criar

| Caminho                                     | Responsabilidade                                                                                                                                                       |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/src/components/SectorMap.jsx`     | Componente do mapa: `MapContainer`, `TileLayer`, `GeoJSON`. Recebe `sectors`, `selectedId`, `onSelect`.                                                                |
| `frontend/src/hooks/useSectorMap.js`        | Hook `useSectorMap`: estado de hover, função `style` (resolução de cor/opacidade/peso) e handlers de clique/hover.                                                     |
| `frontend/src/utils/sectorMapStyle.js`      | Função **pura** `resolveSectorStyle({ sector, isSelected, isHovered })` → objeto de estilo. Isolar a lógica permite testá-la **sem DOM** e **sem framework de teste**. |
| `frontend/src/utils/sectorMapStyle.test.js` | Teste da função pura (runner nativo do Node).                                                                                                                          |
| `frontend/src/mocks/sectors.test.js`        | Teste de integridade do mock geoespacial (runner nativo do Node).                                                                                                      |

### Alterar

| Caminho                               | Mudança                                                                                                                                                           |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/package.json`               | Dependências `leaflet` e `react-leaflet`; scripts `test` (`node --test`) e `test:watch` (`node --test --watch`). **Nenhuma devDependency de teste é adicionada.** |
| `frontend/src/mocks/sectors.js`       | Cada setor ganha o campo `geojson` (Feature GeoJSON com `properties.id` e `geometry.Polygon`). Exporta também `SECTORS_FEATURE_COLLECTION` derivado.              |
| `frontend/src/utils/serviceOrders.js` | `SECTOR_OPTIONS` passa a ser derivado de `SECTORS` (importa de `../mocks/sectors.js`).                                                                            |
| `frontend/src/pages/MapaPage.jsx`     | Troca `MapView` por `SectorMap`; mantém `SectorPopup` e o cabeçalho existentes.                                                                                   |
| `frontend/src/styles/global.css`      | Novo bloco do mapa: `.leaflet-map`, `.map { aspect-ratio }`, `.leaflet-container`, e regras de cor dos setores **sem** `fill-opacity`/`stroke-width`.             |

### Remover

| Caminho                               | Motivo                                               |
| ------------------------------------- | ---------------------------------------------------- |
| `frontend/src/components/MapView.jsx` | Substituído por `SectorMap.jsx`. O SVG sai do fluxo. |

### Não alterar

- `specs/openapi.yaml` — nenhuma rota nova (RNF-01).
- `backend/**` — feature 100% frontend.
- `frontend/src/components/SectorPopup.jsx` — sobrevive sem alteração.
- `frontend/src/context/UiContext.jsx` — `selectedSectorId` já existe e é
  reutilizado.
- `specs/features/15-10-2026-conversao-prototipo-html-para-react/report.md`
  — feature **encerrada**; o impacto na paridade é registrado nesta spec.

## Modelo de dados e contratos de API

### Modelo de dados (mock)

```js
// frontend/src/mocks/sectors.js
export const SECTORS = {
  a: {
    id: "a",
    nome: "Parque do Mirim",
    cor: "r", // status operacional: r | y | g
    statusPill: "🔴 Prioridade alta · 4d em atraso",
    metricas: "12,4 ha · 24 °C · 68% umid.",
    ocorrencia: "⚠️ Roçadeira #102 inoperante",
    geojson: {
      type: "Feature",
      properties: { id: "a" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-47.2235, -23.0805],
            [-47.2198, -23.0798],
            [-47.2189, -23.0832],
            [-47.2228, -23.0841],
            [-47.2235, -23.0805], // fecho do anel
          ],
        ],
      },
    },
  },
  // b, c, d ...
};
```

**Geometria (verificada dentro do município — RNF-03).** Ordem dos vértices:
`[lon, lat]`, conforme RFC 7946. O anel é fechado (primeiro ponto repetido
no fim).

| Setor              | `id` | `cor` | Vértices `[lon, lat]`                                                                      | Área aprox. |
| ------------------ | ---- | ----- | ------------------------------------------------------------------------------------------ | ----------- |
| Parque do Mirim    | `a`  | `r`   | `[-47.2235,-23.0805]`, `[-47.2198,-23.0798]`, `[-47.2189,-23.0832]`, `[-47.2228,-23.0841]` | 15,9 ha     |
| Parque das Frutas  | `b`  | `y`   | `[-47.2165,-23.0785]`, `[-47.2128,-23.0776]`, `[-47.2121,-23.0808]`, `[-47.2159,-23.0817]` | 14,4 ha     |
| Praça da Liberdade | `c`  | `g`   | `[-47.2183,-23.0876]`, `[-47.2145,-23.0866]`, `[-47.2139,-23.0899]`, `[-47.2176,-23.0908]` | 14,6 ha     |
| Parque da Criança  | `d`  | `b`   | `[-47.2271,-23.0824]`, `[-47.2243,-23.0829]`, `[-47.2247,-23.0841]`, `[-47.2275,-23.0836]` | 4,1 ha      |

> **Sugestão da IA:** o 4º polígono ("Parque da Criança") foi adicionado para
> eliminar a inconsistência da feature 002 (RF-06). É uma faixa alongada,
> coerente com um setor de manutenção linear ao longo de uma avenida.

### Coleção derivada

```js
export const SECTORS_FEATURE_COLLECTION = {
  type: "FeatureCollection",
  features: Object.values(SECTORS).map((sector) => sector.geojson),
};
```

`properties` de cada Feature carrega **apenas** `id`. Todo o resto
(nome, cor, status, métricas) é lido do mock de setor pela chave — é isso
que impede divergência entre o que o mapa desenha e o que o popup mostra.

### Contrato de API

**Nenhuma alteração.** Esta feature não cria, altera nem remove nenhuma
rota.

- `specs/openapi.yaml` permanece idêntico (RNF-01).
- Nenhum teste de contrato (`backend/tests/contract/`) é criado ou alterado.
- Nenhuma chamada HTTP é emitida pelo mapa.

O "contrato" desta feature é o **formato GeoJSON** consumido pelo
`GeoJSON` do react-leaflet:

| Propriedade                       | Tipo                  | Observação                        |
| --------------------------------- | --------------------- | --------------------------------- |
| `type`                            | `"FeatureCollection"` | No nível raiz.                    |
| `features[].type`                 | `"Feature"`           | Um por setor.                     |
| `features[].properties.id`        | `string`              | Chave de join com `SECTORS`.      |
| `features[].geometry.type`        | `"Polygon"`           |                                   |
| `features[].geometry.coordinates` | `number[][][]`        | `[[[lon, lat], ...]]` — RFC 7946. |

## Fluxos e casos de borda

### Fluxo principal — selecionar e emitir OS

```
usuário clica no polígono
  → layer.on("click")            [registrado em onEachFeature]
  → setSelectedSectorId(id)      [UiContext]
  → re-render                    [nova função style → nova referência]
  → updateGeoJSON → layer.setStyle(style)
  → polígono selecionado: fillOpacity 0.5, weight 3
  → SectorPopup renderiza com o setor
  → clique em "+ Emitir Ordem de Serviço"
  → openModal(<NewOsModal initialSetor={setor.nome} />)
```

### Casos de borda

| #     | Caso                                            | Comportamento esperado                                                                                                                                                                     |
| ----- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| CE-01 | Tiles do OSM não carregam                       | Polígonos visíveis sobre o fundo `var(--sf2)`; atribuição presente; app sem erro (RF-08).                                                                                                  |
| CE-02 | Janela redimensionada                           | `map.invalidateSize()` é chamado; tiles realinhados, sem faixa em branco.                                                                                                                  |
| CE-03 | Usuário rola a página com o cursor sobre o mapa | A página rola; o mapa não captura o scroll até ser clicado (RF-07).                                                                                                                        |
| CE-04 | Nenhum setor selecionado                        | Nenhum popup exibido; todos os setores com `fillOpacity` 0.18.                                                                                                                             |
| CE-05 | Clique no setor já selecionado                  | A seleção é mantida; o popup permanece aberto.                                                                                                                                             |
| CE-06 | Usuário sai da rota `/mapa` e volta             | A seleção é preservada (estado em `UiContext`), coerente com a feature 002.                                                                                                                |
| CE-07 | `prefers-reduced-motion: reduce`                | Sem animação de zoom nem de fade (RNF-08).                                                                                                                                                 |
| CE-08 | `SECTORS` recebe um novo setor                  | Ele **automaticamente** aparece no mapa e na lista de setores do formulário de OS (Regra de negócio 6).                                                                                    |
| CE-09 | Tema escuro alternado em `/perfil`              | O basemap raster não muda (é sempre claro); as cores dos setores permanecem as mesmas (decisão § Cores). O `SectorPopup` e o restante do app **mantêm** a paridade de tema da feature 002. |
| CE-10 | Usuário clica no basemap (fora de um setor)     | Nada muda: a seleção é mantida (não há desseleção por clique).                                                                                                                             |
| CE-11 | Build de produção (`npm run build`)             | _(Dispensado em 2026-10-26 — a aplicação não deve ser buildada neste ambiente. O caminho verificado é o smoke test sobre `npm run dev`.)_                                                  |

### Erros esperados

| Situação                     | Tratamento                                                                                                |
| ---------------------------- | --------------------------------------------------------------------------------------------------------- |
| Tile 404 / rede indisponível | Nenhum erro em tela; tiles ausentes, geometria intacta. Leaflet dispara `tileerror`, tratado sem `throw`. |
| GeoJSON malformado no mock   | Detectado pelo teste de integridade do mock (Fase 2) — falha **antes** de chegar à tela.                  |

## Estratégia de testes

### Princípio

**Poucos testes, testes pequenos, testes que valem o custo.** O objetivo
desta feature é um protótipo visual; automatizar UI aqui custa mais do que
protegê. O que **vale** testar são as duas invariantes que quebram de forma
silenciosa e cara:

1. A **resolução de estilo** do polígono — é onde mora a regra de
   precedência (selecionado > hover > normal) e onde mora a armadilha do CSS
   × atributo SVG.
2. A **integridade do mock geoespacial** — é onde mora o risco de a
   geometria sair do município ou o FeatureCollection dessincronizar do
   `SECTORS`.

Todo o resto (renderização, clique, popup, scroll, resize) é verificado por
**smoke test manual**.

### Ferramentas

- **`node:test` + `node:assert`** — built-in do Node 20+.
- **Nenhuma dependência de teste.** Sem Vitest, sem Testing Library, sem
  jsdom, sem coverage.
- Os 2 arquivos de teste são **ESM puro**, sem JSX e sem import de código de
  navegador — por isso rodam sem DOM e sem mock.

### Níveis

| Nível    | Alvo                 | Como                                                                                                                                                                                                                                                                                                          | Nº de casos                       |
| -------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Unitário | `resolveSectorStyle` | `frontend/src/utils/sectorMapStyle.test.js` — função pura `(cor, isSelected, isHovered)` → `{ fillColor, color, fillOpacity, weight }`. Casos: normal, hover, selecionado, selecionado+hover, e os 3 valores de `cor`.                                                                                        | ~6 asserções em 1 teste           |
| Unitário | integridade do mock  | `frontend/src/mocks/sectors.test.js` — 4 setores; `properties.id` bate com a chave; anel fechado; todo vértice dentro da bbox municipal do IBGE (lon −47,3056…−47,0836, lat −23,2260…−22,9979); `SECTORS_FEATURE_COLLECTION.features.length === 4`; `SECTOR_OPTIONS` derivado (4 nomes, sem lista hardcoded). | ~5 asserções em 1 teste           |
| Manual   | visual               | Abrir `/mapa`: basemap carrega, 4 polígonos visíveis, clique destaca e abre o popup, OS emitida mantém o setor, scroll rola a página, resize realinha os tiles, sem rede os polígonos persistem.                                                                                                              | checklist (§ Critérios de aceite) |

### O que **não** é testado (de propósito)

- Renderização do `MapContainer` / `TileLayer` / `GeoJSON` — exigiria
  mockar o Leaflet e ainda assim não provaria nada que o smoke test não prove
  mais rápido.
- Clique, hover e emissão de OS — são 3 linhas de handler, no máximo.
- Qualquer métrica de cobertura. **Não há** meta de cobertura a ponto de
  justify mais testes.

### Ordem (TDD)

Nos 2 arquivos de teste, a asserção é escrita **antes** da implementação e
executada para falhar (vermelho) antes de passar (verde) — nos termos da
`constitution.md` R5 e da regra 2 do `AGENTS.md`. Nas fases de UI, o teste
aplica-se apenas à lógica pura; a verificação visual é manual.

## Critérios de aceite

A feature está pronta quando **todos** os itens abaixo forem verdadeiros:

1. `npm run lint` → **0 erros, 0 avisos**.
2. `npm run build` → **verde**. _(Dispensado em 2026-10-26 por decisão do
   usuário: a aplicação não deve ser buildada neste ambiente.)_
3. `npm test` → **verde**, com **2 arquivos de teste** e **zero dependências
   de teste** instaladas.
4. `make test-frontend` → **verde** (sem erro de script inexistente).
5. `git diff --stat specs/openapi.yaml` → **vazio**.
6. `git diff --stat backend/` → **vazio**.
7. A rota `/mapa` exibe o basemap de **Indaiatuba** com os **4 setores**
   desenhados dentro do município.
8. Clicar em um setor o **destaca** (`fillOpacity` 0.5, `weight` 3) e abre o
   `SectorPopup` com nome, status, métricas e ocorrência.
9. Passar o cursor sobre um setor o realça (`fillOpacity` 0.38) e um setor
   selecionado **mantém** 0.5 sob hover.
10. O botão "+ Emitir Ordem de Serviço" abre o `NewOsModal` com o setor
    correto pré-selecionado.
11. O formulário de nova OS oferece **exatamente os 4** setores do mapa.
12. Rolar a página com o cursor sobre o mapa **rola a página**.
13. Redimensionar a janela realinha os tiles (sem faixa em branco).
14. Sem internet, os **polígonos continuam visíveis**.
15. `prefers-reduced-motion: reduce` desabilita as animações do mapa.

## Fases de execução

### Fase 1 — Dependências e gate de teste do frontend

- Adicionar `leaflet` e `react-leaflet` às dependências de
  `frontend/package.json`.
- Criar os scripts `test` (`node --test`) e `test:watch`
  (`node --test --watch`). **Nenhuma devDependency de teste.**
- Criar `frontend/src/utils/sectorMapStyle.js` com a função pura
  `resolveSectorStyle` **e o teste** `sectorMapStyle.test.js`.
- **Validar:** `npm test` roda e termina em verde; `make test-frontend`
  também; `npm run lint` verde. (_`npm run build` dispensado em 2026-10-26 —
  a aplicação não deve ser buildada neste ambiente._)
- **Como validar:** `npm test` imprime 1 teste passando;
  `make test-frontend` retorna código 0.

### Fase 2 — Mock geoespacial

- Adicionar `geojson` aos 4 setores de `frontend/src/mocks/sectors.js`,
  com as coordenadas exatas da § Modelo de dados.
- Exportar `SECTORS_FEATURE_COLLECTION`.
- Derivar `SECTOR_OPTIONS` de `SECTORS` em `frontend/src/utils/serviceOrders.js`.
- Escrever `frontend/src/mocks/sectors.test.js` e vê-lo **falhar** antes da
  implementação.
- **Validar:** `npm test` verde com o teste de integridade do mock
  coberto; `npm run lint` verde.
- **Como validar:** `npm test` lista `sectors.test.js` verde; alterar
  deliberadamente uma coordenada para fora da bbox faz o teste **falhar**.

### Fase 3 — Componente do mapa

- Criar `frontend/src/hooks/useSectorMap.js` e
  `frontend/src/components/SectorMap.jsx`.
- Criar o bloco CSS do mapa em `frontend/src/styles/global.css`
  (`.leaflet-map`, `aspect-ratio` do `.map`, cores dos setores **sem**
  `fill-opacity`/`stroke-width`).
- **Validar:** `npm test` verde; `npm run lint` verde. (_`npm run build`
  dispensado em 2026-10-26 — a aplicação não deve ser buildada neste
  ambiente._)
- **Como validar:** `npm run dev` + abrir `/mapa`: basemap carrega, os 4
  polígonos aparecem, o clique destaca e abre o popup.

### Fase 4 — Integração na rota `/mapa`

- Alterar `frontend/src/pages/MapaPage.jsx` para usar `SectorMap`.
- Remover `frontend/src/components/MapView.jsx`.
- Ajustar `frontend/src/context/UiContext.jsx` **apenas se** necessário para
  o estado de hover (preferencialmente o hover fica local ao `SectorMap`).
- **Validar:** `npm test` verde; `npm run lint` verde. (_`npm run build`
  dispensado em 2026-10-26 — a aplicação não deve ser buildada neste
  ambiente._)
- **Como validar:** `npm run dev` + abrir `/mapa`: basemap carrega, 4
  polígonos visíveis, clique destaca e abre o popup.

### Fase 5 — Fechamento e validação

- Rodar `npm run lint`, `npm test` e `make test-frontend`. (_`npm run build`
  dispensado em 2026-10-26 — a aplicação não deve ser buildada neste
  ambiente._)
- Conferir os 15 critérios de aceite da § Critérios de aceite.
- Smoke test **manual** (navegador) em `/mapa`: carregar, clicar, destacar,
  emitir OS, redimensionar, sem-rede, `prefers-reduced-motion`.
- Atualizar este `relatorio.md` com evidências.
- **Validar:** todos os comandos verdes + os 15 critérios verificados.
- **Como validar:** output dos comandos colado no `relatorio.md`.

## Riscos e perguntas em aberto

| #    | Risco / pergunta                                                                                                                                                     | Impacto                                                                 | Mitigação / status                                                                                                                                                           |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-01 | **Basemap offline.** A Tile Usage Policy do OSM proíbe download/offline/prefetch em `tile.openstreetmap.org`.                                                        | Demonstração sem internet mostra só os polígonos.                       | **Aceito.** RF-08 garante degradação limpa (geometria visível, sem erro).                                                                                                    |
| R-02 | **Cores não seguem o tema escuro.**                                                                                                                                  | Inconsistência visual entre o mapa (claro) e o app (escuro).            | **Aceito por decisão de protótipo** (§ Cores). Reversível em feature futura, lendo as CSS variables via `getComputedStyle`.                                                  |
| R-03 | **Zoom 14 fixo.** Se as geometrias mudarem, o enquadramento pode ficar ruim.                                                                                         | Polígono fora da viewport.                                              | Constantes de center/zoom em um único ponto do módulo; ajuste é uma linha.                                                                                                   |
| R-04 | **`make setup` / `make dev` quebrados no Windows** (caminho POSIX `.venv/bin/python`) e `backend/.venv` inexistente.                                                 | Não impede o frontend, mas atrapalha o fluxo completo.                  | **Pré-existente, fora do escopo.** Registrado em §12 do `relatorio.md`.                                                                                                      |
| R-05 | **`specs/features/000-template` não existe** → `make new-feature` falha.                                                                                             | Impede criar features pelo tooling oficial.                             | **Pré-existente, fora do escopo.** Esta spec foi criada manualmente.                                                                                                         |
| R-06 | **`make test-frontend` chama `npm test`**, que não existia.                                                                                                          | Sem gate no frontend.                                                   | **Resolvido nesta feature** (Fase 1).                                                                                                                                        |
| R-07 | **A paridade visual da feature 002 termina na rota `/mapa`.**                                                                                                        | O selo de "paridade total" da 002 deixa de valer no conjunto.           | **Intencional e registrado.** O `report.md` da 002 **não** é editado (feature encerrada); a quebra fica documentada nesta spec.                                              |
| R-08 | **Geometria dos setores é fictícia.** Os nomes (Parque do Mirim, Parque das Frutas, Praça da Liberdade) não correspondem a áreas verdes reais de Indaiatuba.         | Se o cliente esperar o mapa real dos 25 setores municipais, não é isso. | **Aceito por decisão de escopo** (protótipo). Quando houver o vetor real, basta substituir as coordenadas no mock — o schema já é o final.                                   |
| R-09 | **`architecture.md` §5 declara "Testes frontend: Vitest + Testing Library"** como decisão vigente, mas esta spec usa apenas `node:test`.                             | Divergência entre doc e código.                                         | **Aceito por decisão do usuário.** Atualizar o `architecture.md` §5 é **pendência** (ver § Pendências do `relatorio.md`) — cabe um ADR curto, conforme `constitution.md` §4. |
| P-01 | **Ponto em aberto para o cliente:** a_basemap de OSM pode ser trocado por um provedor pago (MapTiler/Mapbox) quando o app for usado em produção com muitos usuários. | Continuidade do serviço.                                                | Fora do escopo do protótipo; registrado para decisão futura.                                                                                                                 |
| P-02 | **Ponto em aberto:** migrar o `setor` de string para FK e criar a tabela `setores` (com PostGIS) — a fase que transforma o protótipo em produto.                     | —                                                                       | Feature futura; o schema do mock já é compatível.                                                                                                                            |

## Aprovação

| Item                                      | Status                                                                                   |
| ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| Objetivo                                  | definido pelo usuário                                                                    |
| Escopo                                    | definido pelo usuário                                                                    |
| Decisões 1 e 2                            | **Sugestão da IA**, adotadas por delegação explícita do usuário — aguardando confirmação |
| Decisões 3 e 4 (porte da suíte de testes) | **Decisão do usuário** — suíte mínima, `node:test`, zero dependência de teste            |
| RNF-01 a RNF-08                           | **Sugestão da IA** (derivadas da análise do repositório)                                 |
| Geometria mockada                         | **Sugestão da IA** (coordenadas verificadas dentro do município)                         |
| Estrutura de arquivos                     | **Sugestão da IA** (alinhada ao `AGENTS.md` e ao `architecture.md`)                      |
