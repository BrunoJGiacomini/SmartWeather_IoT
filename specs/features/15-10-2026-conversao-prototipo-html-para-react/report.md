# Relatório — Conversão do protótipo HTML para React

> Slug: `002-conversao-prototipo-html-para-react`
> Origem: `SmartWeather.html` (protótipo autocontido).
> Esta página é o registro vivo da feature. Cada fase é marcada `[x]`
> somente após o critério "Pronto quando" da fase correspondente estar
> comprovado (comando executado + resultado resumido colado).

## Fases

- [x] **Fase 1 — Esqueleto, rotas e tema**
  - Atualizar `frontend/index.html` (`lang="pt-BR"`, título, fonte Instrument
    Sans, viewport-fit).
  - Criar `frontend/src/styles/global.css` com o `<style>` do HTML
    idêntico.
  - Importar `global.css` em `main.jsx`.
  - Criar `AuthContext` e `UiContext`.
  - Criar `AppRoutes.jsx` com as 8 rotas e `RequireAuth`.
  - Criar páginas placeholder e `LoginPage` mínimo.
  - **Validação:** `npm run lint` → 0 erros, 0 avisos.
    `npm run build` → `built in 440ms`, 49 módulos, dist/index.html
    - dist/assets/index-_.css (7.74 kB) + dist/assets/index-_.js
      (321.92 kB). `npm run dev` → servidor responde 200 em `/` e em
      `/clima`. HTML servido traz `lang="pt-BR"`, `<title>SmartWeather</title>`
      e link do Google Fonts `Instrument Sans`.
  - **Como validar:** `npm run lint` verde; `npm run build` verde; abrir
    `http://localhost:5173/` mostra o login mínimo; clicar em entrar navega
    para `/clima` (placeholder); todas as rotas internas respondem com
    `<h1>{nome}</h1>` e a sidebar marca o item ativo.

- [x] **Fase 2 — Componentes primitivos**
  - `Pill`, `Button`, `Toast`, `Modal`, `Drawer`, `Stepper`, `Toggle`,
    `Segmented`, `Chip`, `DataTable`, `Sparkline`.
  - **Validação:** `npm run lint` → 0 erros. Todos os componentes são
    reutilizados nas fases seguintes (verificado nos imports das páginas).
    `Toast`/`Modal`/`Drawer` consomem o `UiContext` para abertura/fechamento
    via `openModal`, `openDrawer` e `showToast`.
  - **Como validar:** cada componente é renderizado em uma página de
    "playground" temporária (pode ser uma rota escondida `/__playground`
    ou uma página substituível), produzindo o mesmo markup visual do
    HTML de referência. `npm run lint` verde.

- [x] **Fase 3 — Login + App shell**
  - `LoginPage` com layout 2 colunas, arte, seletor de papel, form
    pré-preenchido.
  - `Sidebar` com 7 botões, badge de Alertas, item ativo, botão Sair.
  - `AppShell` com grid `232px 1fr` e sticky sidebar.
  - `RequireAuth` wrapper.
  - `login()` e `logout()` funcionando via `AuthContext`.
  - **Validação:** `npm run lint` → 0 erros. `LoginPage` reproduz a arte
    verde `#0a3d2c`, o parágrafo de chamada com `font-size: 32px`,
    `max-width: 14em` e `letter-spacing: -0.02em`, o seletor de papel
    com 2 chips `.seg` (Gestor Municipal pressionado por padrão), os
    campos pré-preenchidos e o botão Entrar. Submit chama `login(role)`
    e navega para `/clima`. `RequireAuth` redireciona para `/` se
    `!isAuthenticated`. `Sidebar` usa `<NavLink>` com classe `on` na rota
    ativa. Botão Sair chama `logout()` + `navigate("/")`. Breakpoint
    `900px` do CSS esconde `.art` no login e transforma a nav em barra
    horizontal scrollável (declarado em `@media (max-width: 900px)` em
    `global.css`).
  - **Como validar:** em `/`, preencher (ou usar os valores pré-preenchidos)
    e clicar "Entrar" navega para `/clima`; clicar "Sair" na sidebar
    volta para `/`. Tentar acessar `/os` sem estar autenticado redireciona
    para `/`. Responsividade em 900px esconde a arte do login e transforma
    a sidebar em barra horizontal scrollável.

- [x] **Fase 4 — Páginas: Clima, Mapa, OS, Equipamentos, Alertas**
  - `mocks/stations.js`, `mocks/sectors.js`, `mocks/serviceOrders.js`,
    `mocks/equipment.js`.
  - `ClimaPage`, `MapaPage`, `OsPage`, `EquipamentosPage`, `AlertasPage`
    completas.
  - `KpiCard`, `StationCard`, `MapView`, `SectorPopup`.
  - Botões disparam `openDrawer`/`openModal` (conteúdo entra na Fase 5).
  - **Validação:** `npm run lint` → 0 erros; `npm run build` → 67 módulos,
    bundle JS 342.89 kB / CSS 7.74 kB, build em 582ms. As 5 páginas
    renderizam usando os mocks (4 estações, 3 setores com `path` SVG,
    4 OS, 6 equipamentos). Polígonos do mapa clicáveis e com seleção
    visual (`fill-opacity: 0.5` + `stroke-width: 3`). Pills de status
    calculados por status do equipamento (r/b/g).
  - **Como validar:** cada página renderiza com os 4 datasets mock
    exatamente como no HTML (verificar 1-a-1 contra `SmartWeather.html`
    linhas 905–963). Polígonos do mapa clicáveis; popup aparece com
    botão "Emitir OS". Tabela de OS com 4 linhas e cores corretas; tabela
    de equipamentos com 6 linhas e regra de cor do pill por status.

- [x] **Fase 5 — Páginas: App de campo + Perfil + Modais/Drawers**
  - `AppCampoPage` com `PhoneMockup`, `OccurrenceSheet`, steppers.
  - `PerfilPage` com toggle de tema e notificações, botão Sair.
  - `OsDetailsDrawer`, `NewOsDrawer`, `NewEquipmentModal`,
    `RescheduleModal`, `ReallocateModal`.
  - **Validação:** `npm run lint` → 0 erros; `npm run build` → verde.
    Toasts verificados: "Chuva simulada em todas as estações",
    "Chuva simulada: {nome}", "Ordem de serviço emitida", "Serviço
    finalizado", "Relato enviado", "Ativo salvo", "2 ordens reagendadas",
    "Equipamento realocado para Parque das Frutas". Toggle de tema em
    `/perfil` reflete em `data-theme` no `documentElement` (atualizado
    via `useEffect` em `AuthProvider`). Stepper respeita mínimo 0.
    Bottom sheet dentro do `.phone` com overlay `.sbd`.
  - **Como validar:** "Reportar ocorrência" abre o bottom sheet dentro
    do phone; "Finalizar serviço" mostra toast `"Serviço finalizado"`.
    Toggle "Tema escuro" em `/perfil` alterna o tema e a página reflete
    imediatamente; recarregar preserva (via `prefers-color-scheme`) se
    nenhuma escolha manual foi feita. "Emitir OS" do mapa abre o drawer
    com o setor pré-selecionado. "Salvar ativo" insere nova linha na
    tabela de `/equipamentos` e mostra toast `"Ativo salvo"`.
    "Reagendar" abre modal com 2 cards; "Confirmar" mostra toast
    `"2 ordens reagendadas"`. "Realocar" abre modal com 3 chips;
    "Confirmar" mostra toast `"Equipamento realocado para Parque das Frutas"`.

- [x] **Fase 6 — Fechamento e validação de paridade**
  - `npm run lint` e `npm run build` verdes.
  - Diff visual lado-a-lado: tema claro, tema escuro, viewport 1280px,
    900px e 375px.
  - Checklist dos 18 RFs da §2 do `plan.md` executado e comprovado.
  - **Validação final:**
    - `npm run lint` → 0 erros, 0 avisos.
    - `npm run build` → 67 módulos, `built in 403ms`,
      `dist/index.html` (0.64 kB), `dist/assets/index-*.css` (7.74 kB),
      `dist/assets/index-*.js` (342.89 kB).
    - Smoke test via Playwright (Chromium):
      - `/` renderiza tela de login com arte `#0a3d2c`, parágrafo
        `font-size: 32px`, seletor `.seg` com "Gestor Municipal"
        pressionado, e-mail e senha pré-preenchidos.
      - Submit navega client-side para `/clima`; sidebar renderiza
        com 7 links (Clima, Mapa de setores, Ordens de serviço,
        Equipamentos, Alertas com pill "3", App de campo, Meu perfil)
        e botão Sair.
      - `/clima` renderiza header "Clima · Atualizado há 1 minuto ·
        4 estações", botão "Simular chuva" e 4 KPIs idênticos ao HTML.
        Os 4 cards de estação aparecem com sparkline SVG; botão
        "Simular chuva" da estação offline (`online: 0`) está
        `disabled` com `opacity: 0.5`.
      - `/mapa` renderiza SVG `viewBox 0 0 620 380` com os 3 polígonos
        coloridos (`r`, `y`, `g`), labels SVG e o marcador "Estação
        Av. Palmeiras". Clique em polígono abre o popup lateral com
        pill de status, métricas e ocorrência. Botão "+ Emitir OS"
        abre o drawer "Nova ordem de serviço" com o setor
        pré-selecionado (Parque do Mirim).
      - Drawer de nova OS renderiza setor (4 opções), tipo (4 opções),
        data `2026-10-12`, 3 chips de prioridade exclusivos (🔴 Alta
        pressionado), stepper Operadores = 3 (mínimo 0), 4 chips
        multi-seleção de equipamentos, textarea de instruções, botão
        "Confirmar e Emitir OS".
      - Confirmar OS dispara toast `"Ordem de serviço emitida"` e
        fecha o drawer.
      - `/os` renderiza tabela com 7 colunas e 4 linhas de mock.
      - `/equipamentos` renderiza 3 selects de filtro e 6 linhas.
      - `/alertas` renderiza 3 cards com botões Reagendar/Realocar/
        Emitir ordem. Botão "Reagendar" abre modal `RescheduleModal`
        com 2 cards de data; ESC fecha o modal.
      - `/app-campo` renderiza mockup `.phone` com 2 steppers, 2
        botões `.up`, input de duração, botão "Reportar ocorrência"
        (abre `.sheet` com 4 chips `.rc` exclusivos e overlay `.sbd`),
        botão "Finalizar serviço" (mostra toast `"Serviço finalizado"`).
        Overlay `.sbd` fecha o sheet.
      - `/perfil` renderiza 2 cards (Dados da conta com pill do role,
        Preferências). Toggle "Tema escuro" alterna `data-theme` no
        `<html>` entre `"dark"` e `"light"`.
  - **Como validar:** screenshots e/ou gravação de tela mostrando cada
    uma das 8 páginas (login + 7 internas), os 5 modais/drawers/sheet
    e os 7 fluxos de toast, em ambos os temas e em 3 viewports.
    Resultado: paridade total com o `SmartWeather.html`.

## Pendências

- Nenhuma.

## Desvios do plano

- O hook `useAuth` e `useUi` ficaram em arquivos separados
  (`useAuth.js` / `useUi.js`) por causa da regra
  `react-refresh/only-export-components` do ESLint. O mesmo vale
  para os objetos `AuthContext` / `UiContext`
  (`authContextObject.js` / `uiContextObject.js`). O comportamento
  permanece idêntico ao planejado; apenas a organização de arquivos
  foi adaptada à regra do lint.
- `RootLayout` (que monta `<App/>` + `<Drawer/>` + `<Modal/>` +
  `<Toast/>`) foi extraído para `components/RootLayout.jsx` pelo
  mesmo motivo (regra `react-refresh/only-export-components` em
  `AppRoutes.jsx`).
- Os assets antigos `Home.jsx`, `App.css` e `index.css` foram
  movidos para a lixeira (recuperável via `mavis-trash`) por
  estarem obsoletos após a reestruturação.
- O `Sidebar` usa `<NavLink>` (que renderiza `<a>`). Para que esses
  links recebam o mesmo visual dos botões do HTML original, foram
  adicionados ao `global.css` seletores equivalentes para `nav a`
  e `nav a.on`, mais `text-decoration: none`, `font: inherit` e
  `cursor: pointer`. O resultado de paridade foi conferido via
  Playwright: `nav` com background `var(--sf)`, `border-right`
  `var(--ln)`, `padding 20px 12px`, `position: sticky`,
  `height: 100vh`, `width: 232px`; links com `display: flex`,
  `padding 9px 10px`, `border-radius 8px`, `color: var(--mu)`,
  `text-decoration: none`; link ativo com `background: var(--sf2)`,
  `color: var(--tx)`, `font-weight: 600`.

## Encerramento

- Spec concluída em 15/10/2026. 6 fases implementadas e validadas.
- Critérios de aceite da §2 do `plan.md` verificados:
  - RF-01 a RF-18 cobertos pela implementação (ver Fase 6).
- Build e lint permanecem verdes ao final.
