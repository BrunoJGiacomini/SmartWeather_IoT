# Conversão do protótipo HTML para React

> Slug: `15-10-2026-conversao-prototipo-html-para-react`
> Origem: arquivo único `SmartWeather.html` (protótipo autocontido, CSS + JS
> inline, fonte `Instrument Sans` do Google Fonts). Esta feature reproduz
> **fielmente** esse protótipo em React 19 + React Router 7, sem alterar
> paleta, tipografia, textos, dados, ícones, espaçamentos, modais, drawers,
> sheets, toasts ou qualquer outro detalhe visual/funcional do HTML original.

## 1. Visão geral

**Objetivo:** Portar integralmente o protótipo estático `SmartWeather.html`
para uma SPA React, com uma rota para cada "view" do HTML, todos os
componentes de UI reaproveitáveis, todos os modais/drawers/sheets, e o mesmo
_tema_ (claro/escuro com `prefers-color-scheme` + `data-theme`), as mesmas
_variáveis CSS_ e a mesma _paleta_ do original. O resultado deve ser
**pixel-equivalente** ao HTML quando renderizado no navegador.

**Motivação (por quê):** O `SmartWeather.html` é o protótipo de produto
aprovado pelo cliente. Para que o time possa evoluir a UI com a arquitetura
React já estabelecida no projeto (rotas, layout, hooks, TanStack Query,
cliente gerado via orval) sem perder o que foi validado, o protótipo precisa
existir como código React real, não como arquivo HTML avulso. A feature
estabelece a base de UI que será consumida pelas features de backend (login,
OS, equipamentos, alertas, perfil, etc.).

**Contexto:**

- O frontend já existe em `frontend/` com React 19, React Router 7, Vite 8,
  ESLint. Hoje só há uma rota placeholder (`/` → `Home.jsx`).
- O `index.html` do Vite está com `<title>frontend</title>` e `<html lang="en">`
  e deve virar `<title>SmartWeather</title>` + `<html lang="pt-BR">` (igual
  ao protótipo).
- O `index.css` e `App.css` estão vazios. Todo o CSS do protótipo será
  convertido para CSS modular organizado em `frontend/src/styles/` ou
  equivalente (ver §4 Decisões técnicas).
- O HTML importa `Instrument Sans` do Google Fonts — esse import deve
  permanecer no `frontend/index.html` (ou ser movido para `main.jsx`).
- Esta feature **não consome backend** ainda. Todos os dados exibidos são
  _mocks_ idênticos aos do HTML (`ST`, `OS`, `EQ`, `SEC` no JS original).
- Próxima feature (003) começará a substituir esses mocks por chamadas
  reais à API, mas isso está **fora do escopo desta feature**.

**Fora de escopo:**

- Implementar backend, banco, OpenAPI ou autenticação real (já tratado em
  features 001 e seguintes).
- Trocar a fonte `Instrument Sans` por outra.
- Adicionar, remover ou reformular páginas, textos, cores, ícones ou
  comportamentos. **Tudo que está no HTML vai; o que não está no HTML não
  vai.**
- Refatorar CSS para Tailwind, CSS-in-JS, CSS Modules, etc. Mantém-se
  CSS plano com variáveis (decisão em §4).
- Internacionalização (i18n). Todo texto continua em PT-BR.
- Responsividade além dos 2 breakpoints já existentes no HTML
  (`max-width: 900px` e `max-width: 560px`).
- Animações além das já presentes no HTML (transição de drawer 0.25s,
  transição de sheet 0.25s, transição de toggle 0.15s).
- Modo offline / PWA / service worker.

## 2. Requisitos

### RF-01 — Login replica o layout do HTML

- **Dado** o protótipo HTML na rota/tela inicial
- **Quando** o usuário acessa `/` **e** não está autenticado
- **Então** o React renderiza a **tela de login** com:
  - Grid de 2 colunas (`1fr 1fr`).
  - Coluna esquerda (`.art`) com `background: #0a3d2c; color: #fff; padding: 48px;`,
    exibindo: - `<b>SmartWeather</b>` (font-size 20px) - `<p>` "Saiba onde cuidar primeiro, antes que o mato e a chuva decidam
    por você." (font-size 32px, line-height 1.2, max-width 14em,
    letter-spacing -0.02em) - `<span class="sm" style="opacity:0.7">Áreas verdes urbanas · Clima em
tempo real · Equipes em campo</span>`
  - Coluna direita com `<form>` (max-width 380px, gap 14px, margin auto,
    padding 32px) contendo:
    - `<h1>Entrar</h1>` (font-size 24px, letter-spacing -0.02em)
    - `<span class="mu">Acesse com sua conta da prefeitura ou empresa.</span>`
    - **Seletor de papel** (`.seg` com 2 botões, grid `1fr 1fr`):
      - "Gestor Municipal" → `aria-pressed="true"` por padrão,
        `<b>Gestor Municipal</b><br><span class="sm mu">Painel e planejamento</span>`.
      - "Fiscal Operacional" → `aria-pressed="false"`,
        `<b>Fiscal Operacional</b><br><span class="sm mu">Campo e ordens</span>`.
      - Trocar o papel altera `aria-pressed` dos botões.
    - Campo `<label>E-mail<input type="email" value="marina.souza@prefeitura.gov.br" required /></label>`.
    - Campo `<label>Senha<input type="password" value="senha1234" required /></label>`.
    - Botão `<button class="btn w">Entrar</button>` (largura total).
  - Em viewport `≤ 900px`, a coluna `.art` some (`display: none`) e o
    grid vira `1fr`.

### RF-02 — Login transita para o app shell

- **Dado** a tela de login renderizada e o form preenchido
- **Quando** o usuário clica em "Entrar" (submit do form)
- **Então** o React esconde a tela de login (`#login`) e exibe o app shell
  (`#app`) com `display: grid` e grid-template-columns `232px 1fr`,
  navegando para a rota `/clima`.
- A transição **não** recarrega a página (é client-side).

### RF-03 — App shell (sidebar + main) replica o HTML

- **Dado** o usuário autenticado
- **Quando** qualquer rota interna é acessada
- **Então** o React renderiza o app shell com:
  - `<nav id="nav">` (largura 232px, `background: var(--sf)`,
    `border-right: 1px solid var(--ln)`, `padding: 20px 12px`, sticky top,
    height 100vh) contendo:
    - `.logo` com `<span style="color:var(--g)">●</span> SmartWeather`
      (font-weight 700, font-size 18px, gap 8px, padding 4px 10px 20px).
    - Botões de navegação (um para cada rota), na ordem:
      1. "Clima" → `/clima`
      2. "Mapa de setores" → `/mapa`
      3. "Ordens de serviço" → `/os`
      4. "Equipamentos" → `/equipamentos`
      5. "Alertas" → `/alertas` (com `<span class="pill r">3</span>` à direita)
      6. "App de campo" → `/app-campo`
      7. "Meu perfil" → `/perfil`
    - Espaçador `<div class="sp"></div>` (flex: 1).
    - Botão "Sair" (onclick = logout, mesmo do HTML).
    - Botão da rota ativa recebe `class="on"` (background `var(--sf2)`,
      color `var(--tx)`, font-weight 600).
  - `<main id="main">` (padding 28px 32px, max-width 1200px) com `Outlet`
    do React Router exibindo a view ativa.
  - Em viewport `≤ 900px`, nav vira horizontal (`flex-direction: row`,
    `overflow-x: auto`, padding 8px) e logo/sp escondidos; main vira
    `padding: 20px 16px`.

### RF-04 — View `/clima` (Clima) replica o HTML

- **Dado** o usuário autenticado em `/clima`
- **Quando** a rota é renderizada
- **Então** a view exibe, **idêntica** ao HTML:
  - `<div class="hd">` com:
    - `<div><h1>Clima</h1><span class="mu">Atualizado há 1 minuto · 4 estações</span></div>`
    - `<button class="btn o" onclick="toast('Chuva simulada em todas as estações')">Simular chuva</button>`
  - Grid de 4 KPIs (`.grid.g4`, margin-bottom 16px):
    - "Temperatura média" / "24,5 °C" / "↑ 1,2° vs. ontem"
    - "Umidade relativa" / "68%" / "Estável"
    - "Chuva acumulada" / "12,4 mm" / "Últimas 24 h"
    - "Vento" / "14 km/h" / "Rajadas de 22 km/h"
  - Grid de 2 colunas (`.grid.g2`) com 4 cards de estação (`.card`).
    Cada card contém:
    - Header com `<h2>` do nome + `<span class="pill g|r">` (🟢/🔴 + status).
    - `<div style="display:flex;justify-content:space-between;align-items:end;margin:16px 0">`
      com `<b style="font-size:26px">` (temperatura) + sparkline SVG.
    - `<button class="btn o">Simular chuva</button>` (desabilitado se
      estação estiver offline).
  - Dados das estações (mock idêntico ao HTML, com `online: 0|1`):
    - Parque das Frutas — 24,5 °C — Online · há 1 min — `[22,23,24,24,25,25]` — online=1
    - Parque do Mirim — 23,1 °C — Online · há 2 min — `[21,22,22,23,23,23]` — online=1
    - Praça da Liberdade — 25,8 °C — Online · há 1 min — `[23,24,25,26,26,26]` — online=1
    - Parque da Criança — "—" — Offline · há 2 h — `[24,24,25,25,25,25]` — online=0
  - Sparkline: SVG inline (largura = `(N-1)*14`, altura 30, polyline com
    pontos normalizados entre min/max do array, stroke verde se online,
    `var(--mu)` se offline). Ver §4 Decisões para fórmula exata.

### RF-05 — View `/mapa` (Mapa de setores) replica o HTML

- **Dado** o usuário autenticado em `/mapa`
- **Quando** a rota é renderizada
- **Então** a view exibe:
  - `<div class="hd">` com `<h1>Mapa de setores</h1>` e
    `<span class="mu">Clique em um setor para ver ocorrências e emitir ordem.</span>`.
  - Container `.map` (position relative, background `var(--sf2)`,
    border-radius 12px, border 1px solid `var(--ln)`, overflow hidden) com
    SVG `viewBox="0 0 620 380"`, `role="img"`, `aria-label="Mapa dos setores"`.
  - 3 polígonos (`<path class="poly cor [sel]">`) clicáveis, com `tabindex="0"`
    e `onkeydown` para Enter:
    - **Parque do Mirim** (cor `r`, vermelho): `d="M60,60 L300,40 L340,170 L120,200Z"`,
      label em `x=170, y=120`.
    - **Parque das Frutas** (cor `y`, amarelo): `d="M380,50 L560,70 L540,180 L360,170Z"`,
      label em `x=450, y=120`.
    - **Praça da Liberdade** (cor `g`, verde): `d="M150,230 L400,215 L430,330 L170,345Z"`,
      label em `x=290, y=280`.
  - Marcador da estação:
    - `<circle cx="520" cy="300" r="6" fill="var(--b)"/>`
    - `<text class="lbl" x="530" y="304">Estação Av. Palmeiras</text>`
  - Popup (`.pop`) posicionado `right:16px; top:16px; width:320px;` que
    aparece (`display:flex`) quando um setor está selecionado. Conteúdo:
    - `<h2>{nome do setor}</h2>`
    - `<span class="pill {cor}">{texto de status}</span>` (ver tabela §5)
    - `<span class="sm mu">{métricas}</span>`
    - `<div class="occ">{ocorrência}</div>`
    - `<button class="btn w" onclick="newOS('{nome}')">+ Emitir Ordem de Serviço</button>`
  - Estado de seleção persistido enquanto o usuário está na rota (useState
    local do componente).
  - Hover em polígono aumenta `fill-opacity` para 0.38; selecionado
    `fill-opacity: 0.5` + `stroke-width: 3`.

### RF-06 — View `/os` (Ordens de serviço) replica o HTML

- **Dado** o usuário autenticado em `/os`
- **Quando** a rota é renderizada
- **Então** a view exibe:
  - `<div class="hd">` com `<h1>Ordens de serviço</h1>` e
    `<button class="btn" onclick="newOS()">+ Nova ordem</button>`.
  - Tabela (`.card.tw`, padding 6px) com colunas:
    `ID / Setor | Serviço | Status | Recursos alocados | Prioridade | Agendada | (vazio)`.
  - 4 linhas (mock idêntico):
    - **OS-1042** · Parque do Mirim · Roçagem · Em andamento ·
      "4 operadores · 2 roçadeiras Stihl" · cor `r` (🔴) · "Alta · vence em 2d" ·
      12/10/2026
    - **OS-1043** · Parque das Frutas · Poda de árvores · Agendada ·
      "3 operadores · 1 motosserra Husqvarna" · cor `y` (🟡) ·
      "Média · vence em 6d" · 15/10/2026
    - **OS-1039** · Parque da Criança · Limpeza de canteiros · Concluída ·
      "2 operadores · 1 soprador Stihl" · cor `g` (🟢) · "Concluída" ·
      28/09/2026
    - **OS-1044** · Praça da Liberdade · Irrigação · Aguardando chuva ·
      "2 operadores" · cor `b` (🔵) · "Baixa · vence em 12d" · 21/10/2026
  - Última coluna de cada linha: `<button class="btn o" onclick="openOS(i)">Ver detalhes</button>`.
  - Linhas usam `<tr>` com `<td>` e `border-bottom: 1px solid var(--ln)`;
    a última linha não tem border-bottom.
  - `<th>` com cor `var(--mu)`, font-size 12px, font-weight 500.

### RF-07 — View `/equipamentos` (Equipamentos e ativos) replica o HTML

- **Dado** o usuário autenticado em `/equipamentos`
- **Quando** a rota é renderizada
- **Então** a view exibe:
  - `<div class="hd">` com `<h1>Equipamentos e ativos</h1>` e
    `<button class="btn" onclick="newEq()">+ Novo ativo</button>`.
  - Linha de filtros (`.flt`, gap 10px, flex-wrap wrap, margin-bottom 16px)
    com 3 `<label class="sm mu">` (Marca / Tipo / Status), cada um
    contendo um `<select>`:
    - Marca: Todas, Stihl, Husqvarna, Davis.
    - Tipo: Todos, Máquina, Ferramenta, Estação IoT.
    - Status: Todos, Em uso, Disponível, Inoperante.
  - Tabela (`.card.tw`, padding 6px) com colunas:
    `Ativo | Marca | Tipo | Localização | Horímetro / Sinal | Status`.
  - 6 linhas (mock idêntico):
    - Roçadeira FS 450 / Stihl / Máquina / "Alocado ao Setor Parque do Mirim" /
      "1.240 h" / "Em uso" → pill `g`
    - Motosserra 372 XP / Husqvarna / Máquina / "Depósito Central" /
      "860 h" / "Disponível" → pill `b`
    - Roçadeira #102 / Stihl / Máquina / "Alocado ao Setor Parque das Frutas" /
      "2.310 h" / "Inoperante" → pill `r`
    - Soprador BR 600 / Stihl / Ferramenta / "Depósito Central" /
      "410 h" / "Disponível" → pill `b`
    - Estação Parque do Mirim / Davis / Estação IoT /
      "Alocado ao Setor Parque do Mirim" / "🟢 Online · há 2 min" / "Online" → pill `g`
    - Estação Av. Palmeiras / Davis / Estação IoT /
      "Alocado ao Setor Parque da Criança" / "🔴 Offline · há 2 h" / "Offline" → pill `r`
  - Regra da cor do pill: `r` se status = "Inoperante" ou "Offline";
    `b` se "Disponível"; senão `g`.

### RF-08 — View `/alertas` (Alertas) replica o HTML

- **Dado** o usuário autenticado em `/alertas`
- **Quando** a rota é renderizada
- **Então** a view exibe:
  - `<div class="hd">` com `<h1>Alertas</h1>`.
  - `.grid` (sem coluna definida, gap 16px) com 3 cards de alerta. Cada
    card (`.card` com flex, gap 16px, align center, justify between, wrap):
    - Lado esquerdo: emoji 24px + `<div>` com `<span class="pill {cor}">{título}</span>`
      e `<p style="margin-top:6px;max-width:60ch">{descrição}</p>`.
    - Lado direito: `<button class="btn" onclick="{handler}">{ação}</button>`.
  - 3 alertas (idênticos):
    1. cor `b`, 🌧️, "Ajuste climático", "Chuva intensa prevista para amanhã.
       Reagendar 2 serviços de roçagem?", botão "Reagendar" → abre modal
       `reag()`.
    2. cor `r`, 🛠️, "Equipamento inoperante", "Roçadeira #102 parou na
       Parque das Frutas. Há 1 roçadeira livre no Depósito Central.",
       botão "Realocar" → abre modal `real()`.
    3. cor `y`, ⏰, "Prazo de manutenção", "Parque do Mirim está 4 dias
       atrasado para roçagem.", botão "Emitir ordem" → abre drawer
       `newOS('Parque do Mirim','Roçagem')`.

### RF-09 — View `/perfil` (Meu perfil) replica o HTML

- **Dado** o usuário autenticado em `/perfil`
- **Quando** a rota é renderizada
- **Então** a view exibe:
  - `<div class="hd">` com `<h1>Meu perfil</h1>`.
  - Grid 2 colunas (`.grid.g2`) com 2 cards: - **Card 1 — Dados da conta:** - `<h2>Dados da conta</h2>` - `<p style="margin-top:12px"><b>Marina Souza</b><br><span class="mu">marina.souza@prefeitura.gov.br</span></p>` - `<p style="margin-top:8px"><span class="pill g">{role atual}</span></p>` - **Card 2 — Preferências:** - `<h2>Preferências</h2>` - Linha `<div class="tg"><span>Tema escuro</span><button class="tog"
aria-label="Alternar tema escuro" aria-pressed="{theme==='dark'}"
onclick="theme()"></button></div>` - Linha `<div class="tg"><span>Notificações de alertas</span><button
class="tog" aria-label="Notificações" aria-pressed="true"
onclick="this.setAttribute('aria-pressed', this.getAttribute('aria-pressed')!=='true')"></button></div>` - `<button class="btn o" style="margin-top:18px;color:var(--r);border-color:var(--r)" onclick="logout()">Sair</button>`
  - `theme()` deve alternar `data-theme` no `document.documentElement`
    entre `"light"` e `"dark"` (ver RF-15).

### RF-10 — View `/app-campo` (App de campo) replica o HTML

- **Dado** o usuário autenticado em `/app-campo`
- **Quando** a rota é renderizada
- **Então** a view exibe:
  - `<div class="hd">` com `<div><h1>App de campo</h1><span class="mu">Visão
do operador no celular</span></div>`.
  - Mockup de celular: `<div class="phone">` (width 340px, max-width 100%,
    border 8px solid `var(--tx)`, border-radius 36px, background `var(--bg)`,
    padding 20px 16px, flex column, gap 14px, position relative, overflow
    hidden).
  - Dentro do phone, nesta ordem: - `<div class="card" style="padding:16px">` com:
    `<span class="pill r">🔴 Alta · vence em 2d</span>`,
    `<h2 style="margin-top:8px">OS-1042 · Roçagem</h2>`,
    `<span class="mu sm">Parque do Mirim · Entrada pela Av. Brasil</span>`. - Grid 2 colunas (`<div class="grid g2" style="gap:10px">`) com 2
    `<div class="up">📷<br>Foto antes</div>` e `<div class="up">📷<br>Foto
depois</div>` (placeholders de upload). - `<label>Duração do serviço<input value="3 h 30 min"></label>`. - 2 steppers (`<div class="stp">`): - "Operadores" — valor 4 — botões `−` e `+` com `aria-label` "Diminuir"
    e "Aumentar". - "Equipamentos" — valor 2 — mesma estrutura. - `<button class="btn o w" onclick="abrirSheet()">Reportar ocorrência</button>`. - `<button class="btn w" onclick="toast('Serviço finalizado')">Finalizar
serviço</button>`.
  - Bottom sheet `#sheet` montado no fim (ver RF-13).

### RF-11 — Drawer de detalhes da OS (componente `OsDetailsDrawer`)

- **Dado** o usuário clica em "Ver detalhes" em uma linha da tabela `/os`
- **Quando** o React abre o drawer
- **Então** o componente `<aside className="drawer on">` é renderizado
  contendo, **idêntico** ao HTML:
  - Header com `<h2>{OS.id} · {OS.servico}</h2>`, `<span class="mu">{OS.setor}</span>`
    e botão `✕` que fecha o drawer (remove classe `on`).
  - Grid 2 colunas com 2 `<div class="ph">Foto antes</div>` e
    `<div class="ph">Foto depois</div>`.
  - Bloco `<div><h2>Recursos utilizados</h2><p class="mu">{OS.recursos}</p></div>`.
  - Bloco `<div><h2>Histórico de ocorrências</h2>` com 2 cards
    `<div class="occ" style="margin-top:8px">`:
    - "⚠️ Roçadeira #102 inoperante · 09/10"
    - "Chuva interrompeu o serviço por 1 h · 07/10"
  - Drawer: position fixed, top 0, right 0, bottom 0, width 440px,
    max-width 100%, background `var(--sf)`, border-left 1px `var(--ln)`,
    padding 24px, overflow auto, transform `translateX(100%)`, transition
    `transform 0.25s`, z-index 5; ao abrir, `transform: none`.
  - `prefers-reduced-motion: reduce` desabilita a transição do drawer.

### RF-12 — Drawer "Nova ordem de serviço" (componente `NewOsDrawer`)

- **Dado** o usuário clica em "+ Nova ordem" em `/os` ou em
  "+ Emitir Ordem de Serviço" no popup de um setor em `/mapa`, ou no
  botão "Emitir ordem" do alerta "Prazo de manutenção" em `/alertas`
- **Quando** o React abre o drawer
- **Então** o componente renderiza, **idêntico** ao HTML:
  - Header: `<h2>Nova ordem de serviço</h2>` + botão `✕` que fecha.
  - Form `.fm` (display grid, gap 16px): - `<label>Setor<select>` com placeholder "Selecione o setor" +
    4 opções: Parque do Mirim, Parque das Frutas, Praça da Liberdade,
    Parque da Criança. Pré-selecionado quando o drawer é aberto a
    partir do mapa/alerta. - `<label>Tipo de serviço<select>` com placeholder "Selecione o tipo" - 4 opções: Roçagem, Poda, Limpeza, Irrigação. Pré-selecionado
    quando aberto do alerta (Roçagem). - `<label>Data prevista<input type="date" value="2026-10-12"></label>`. - Bloco de prioridade:
    `<span style="font-weight:500">Prioridade</span>` + `<div class="row"
style="margin-top:4px">` com 3 chips: 🔴 Alta (default `aria-pressed="true"`),
    🟡 Média, 🟢 Baixa. Clicar em um chip torna-o `aria-pressed="true"`
    e os outros `aria-pressed="false"` (exclusivo). - Stepper "Operadores" com valor inicial 3 e botões `−` / `+`. - Bloco de equipamentos: `<span style="font-weight:500">Equipamentos</span>` - `<div class="row" style="margin-top:4px">` com 4 chips multi-seleção
    (Stihl FS 450, Stihl FS 55, Husqvarna 372 XP, Stihl BR 600); clicar
    alterna `aria-pressed` de cada chip independentemente. - `<label>Instruções<textarea placeholder="Ex.: começar pela área da
entrada principal"></textarea></label>`. - `<button class="btn w" onclick="...">Confirmar e Emitir OS</button>`:
    ao clicar, fecha o drawer e mostra toast `"Ordem de serviço emitida"`.
  - Reaproveita o mesmo `<aside className="drawer">` do RF-11 (apenas com
    conteúdo diferente).

### RF-13 — Bottom sheet "Reportar ocorrência" (componente `OccurrenceSheet`)

- **Dado** o usuário clica em "Reportar ocorrência" em `/app-campo`
- **Quando** o React abre o sheet
- **Então** o componente renderiza dentro do `.phone`:
  - `<div class="sheet on" id="sheet" role="dialog"
aria-label="Reportar ocorrência">` com: - Header `<div style="display:flex;justify-content:space-between;align-items:center">`
    com `<h2>O que aconteceu?</h2>` e botão `✕` (com
    `style="padding:4px 12px"`) que fecha o sheet. - Grid 2 colunas (`.grid.g2`, gap 10px) com 4 botões `.rc` (cada um
    com `aria-pressed`): 🛠️ "Equipamento quebrado" (default true),
    🌧️ "Chuva", 👥 "Falta de pessoal", 🚧 "Obstrução". Clicar em um
    torna-o `aria-pressed="true"` e os outros `false`. - `<div class="up" style="aspect-ratio:3/1">📷 Adicionar foto</div>`
    (placeholder de upload). - `<button class="btn w" onclick="...">Enviar relato</button>`: ao
    clicar, fecha o sheet e mostra toast `"Relato enviado"`.
  - `<div class="sbd" onclick="fecharSheet()"></div>` (overlay escuro
    sobre o `.phone`) exibido enquanto o sheet está aberto.
  - Estilo: position absolute, left/right 0, bottom 0, background
    `var(--sf)`, border-radius 20px 20px 0 0, padding 16px, flex column,
    gap 12px, z-index 2, transform `translateY(105%)`, transition
    `transform 0.25s`. Ao abrir, `transform: none`.
  - `prefers-reduced-motion: reduce` desabilita a transição do sheet.

### RF-14 — Modal central (componente `Modal`)

- **Dado** o usuário abre qualquer modal (Novo ativo, Reagendar por chuva,
  Substituir equipamento)
- **Quando** o React exibe o modal
- **Então** o componente `<Modal>` renderiza:
  - Overlay `<div class="mo on" onclick="closeIfOverlay(e)">` (position
    fixed, inset 0, background `rgba(0,0,0,0.5)`, display grid,
    place-items center, z-index 8, padding 16px).
  - Caixa `<div class="mb" role="dialog" aria-modal="true">` (background
    `var(--sf)`, border 1px `var(--ln)`, border-radius 14px, padding 24px,
    width 480px, max-width 100%, max-height 90vh, overflow auto).
  - Clicar no overlay (fora da caixa) fecha o modal; ESC também fecha.
  - Três modais específicos do HTML (devem ser variações do mesmo
    `<Modal>`):
  1. **`<NewEquipmentModal>`** — aberto por `newEq()`:
     - Header com `<h2>Novo ativo</h2>` + botão `✕` que fecha.
     - Form `.fm`:
       - `<label>Nome do ativo<input placeholder="Ex.: Roçadeira FS 450"></label>`.
       - Bloco de tipo: `<span style="font-weight:500">Tipo</span>` +
         `<div class="seg" style="margin-top:4px">` com 2 chips:
         "Máquina / Ferramenta" (default `aria-pressed="true"`) e
         "Estação IoT" (default `aria-pressed="false"`).
       - `<label>Marca / modelo<input placeholder="Ex.: Stihl FS 450"></label>`.
       - `<label>Propriedade<select>` com 2 opções:
         "Próprio (Prefeitura)" e "Terceirizado (Corpus)". Trocar a
         opção troca o campo seguinte (ver abaixo).
       - Bloco `#pf` que renderiza:
         - Se "Próprio (Prefeitura)":
           `<label>Nº de patrimônio<input id="eqp" placeholder="Ex.: 004512"></label>`.
         - Se "Terceirizado (Corpus)":
           `<label>ID de frota / contrato<input id="eqp" placeholder="Ex.: CORP-2026-018"></label>`.
       - `<label>Número de série<input placeholder="Ex.: 98234710"></label>`.
       - `<label>Localização inicial<select>` com "Depósito Central" +
         "Setor Parque do Mirim" / "Setor Parque das Frutas" /
         "Setor Praça da Liberdade" / "Setor Parque da Criança".
       - `<button class="btn w" onclick="...">Salvar ativo</button>`: ao
         clicar, fecha o modal, mostra toast `"Ativo salvo"` e (se o
         usuário estiver em `/equipamentos`) insere o novo ativo no topo
         da tabela com nome digitado, primeira palavra da marca, tipo
         "Máquina", localização "Depósito Central", horímetro "0 h" e
         status "Disponível".

  2. **`<RescheduleModal>`** — aberto por `reag()`:
     - Header com `<h2>Reagendar por chuva</h2>`,
       `<span class="sm mu">Chuva intensa prevista amanhã. Escolha novas datas.</span>`
       e botão `✕`.
     - Form `.fm` com 2 cards `<div class="occ">`:
       - "OS-1042 · Roçagem" · "Parque do Mirim" ·
         `<label style="margin-top:8px">Nova data<input type="date" value="2026-10-14"></label>`.
       - "OS-1043 · Poda de árvores" · "Parque das Frutas" ·
         `<label style="margin-top:8px">Nova data<input type="date" value="2026-10-16"></label>`.
     - `<button class="btn w" onclick="...">Confirmar novas datas</button>`:
       ao clicar, fecha o modal e mostra toast `"2 ordens reagendadas"`.

  3. **`<ReallocateModal>`** — aberto por `real()`: - Header com `<h2>Substituir Roçadeira #102</h2>`,
     `<span class="sm mu">Disponíveis no Depósito Central</span>` e
     botão `✕`. - Form `.fm` com `<div class="grid" style="gap:8px">` listando 3
     chips (estilo `<button class="chip" style="border-radius:10px;
text-align:left; padding:12px">`): - "Roçadeira FS 55 · Stihl · 640 h" (default `aria-pressed="true"`) - "Motosserra 372 XP · Husqvarna · 860 h" - "Soprador BR 600 · Stihl · 410 h" - `<button class="btn w" onclick="...">Confirmar substituição</button>`:
     ao clicar, fecha o modal e mostra toast
     `"Equipamento realocado para Parque das Frutas"`.

### RF-15 — Tema claro/escuro (claro/escuro automático + manual)

- **Dado** o app em qualquer estado
- **Quando** o usuário abre o app pela primeira vez **ou** clica no toggle
  "Tema escuro" em `/perfil`
- **Então** o tema deve:
  - Detectar automaticamente `prefers-color-scheme: dark` na primeira
    visita e aplicar `data-theme="dark"` em `document.documentElement`.
  - Persistir a escolha manual sobrescrevendo o auto-detect: ao clicar
    no toggle, alterna `data-theme` entre `"light"` e `"dark"`.
  - Aplicar a **mesma** tabela de variáveis do HTML:

    | Var     | Light                           | Dark      |
    | ------- | ------------------------------- | --------- |
    | `--bg`  | `#f4f6f3`                       | `#0c100e` |
    | `--sf`  | `#fff`                          | `#151b18` |
    | `--sf2` | `#eef1ec`                       | `#1c2420` |
    | `--tx`  | `#14201a`                       | `#e8eeea` |
    | `--mu`  | `#5e6b63`                       | `#8a988f` |
    | `--ln`  | `#dde3dc`                       | `#26302b` |
    | `--gd`  | `#0a8f63`                       | `#34d399` |
    | `--sh`  | `0 1px 2px rgba(20,32,26,0.06)` | `none`    |

    As demais variáveis (`--g`, `--r`, `--y`, `--b`) **não** mudam entre
    temas (ficam idênticas em ambos).

### RF-16 — Toast de feedback

- **Dado** o usuário executa uma ação que dispara toast (entrar, simular
  chuva, salvar ativo, emitir OS, finalizar serviço, enviar relato,
  reagendar, realocar)
- **Quando** o toast é disparado
- **Então** um `<div class="toast" id="toast" role="status">` aparece
  com `display: block` por 2200 ms, contendo a mensagem exata do HTML
  (ex.: "Chuva simulada em todas as estações", "Ordem de serviço emitida",
  "Ativo salvo", "2 ordens reagendadas",
  "Equipamento realocado para Parque das Frutas", "Serviço finalizado",
  "Relato enviado") e some depois.

### RF-17 — Logout retorna para a tela de login

- **Dado** o usuário autenticado em qualquer rota
- **Quando** clica em "Sair" (na sidebar ou no card de Perfil)
- **Então** o React volta para a tela de login (`/`), esvazia o estado
  de view/setor, fecha o drawer, e reseta a role para "Gestor Municipal".

### RF-18 — Sparkline SVG

- **Dado** um array de números (sempre 6 elementos, no protótipo)
- **Quando** o componente `<Sparkline data={array} color={cor} />` é
  renderizado
- **Então** ele gera um `<svg width="{(N-1)*14}" height="30" aria-hidden="true">`
  com um `<polyline>` cuja sequência de pontos segue a fórmula do HTML:
  `points = arr.map((v,i) => `${i*14},${28 - ((v-min)/(max-min||1))\*24}`)`
  e propriedades `fill="none" stroke={color} stroke-width="2"
stroke-linecap="round"`. `min` e `max` são calculados sobre o array.

## 3. Casos de borda e erros esperados

- **Estação offline** (`online=0`): botão "Simular chuva" do card fica
  `disabled` com `opacity: .5`; pill de status vira `r` com 🔴; sparkline
  fica cinza (`var(--mu)`); temperatura aparece como `—`.
- **Sparkline com todos os valores iguais** (`max === min`): o divisor
  usa `|| 1` para evitar NaN/Infinity (a polyline fica reta em `y=28`).
- **Polígono sem seleção**: popup do mapa fica `display: none` (sem
  classe `on`).
- **Click fora do modal**: clique no overlay (não na caixa) fecha o
  modal; clique dentro da caixa não fecha.
- **ESC fecha modal**: o `<Modal>` escuta `keydown` e fecha ao receber
  `"Escape"`.
- **Toggle de tema**: ao alternar de light→dark, o toggle em `/perfil`
  passa para `aria-pressed="true"`; vice-versa.
- **Toggle de notificações**: estado inicial `aria-pressed="true"`.
  Clicar alterna para `"false"` e de volta; não persiste (igual ao HTML).
- **Stepper não permite negativo**: o handler `st(b, d)` faz
  `Math.max(0, +atual + d)`. Se o usuário clicar `−` quando o valor
  é 0, fica em 0.
- **Stepper de Operadores do "Nova OS"**: valor inicial 3 (e não 4 como
  no card do App de campo).
- **Formulário de login com campos pré-preenchidos**: o HTML já vem com
  e-mail e senha preenchidos; o React deve espelhar esse comportamento
  (não apagar ao montar).
- **Chips multi vs. exclusivo**: "Prioridade" no `NewOsDrawer` é
  exclusivo (um só pressionado). "Equipamentos" no `NewOsDrawer`,
  "Tipo" no `NewEquipmentModal` (chip de Máquina/Estação) e "rc" do
  sheet também são exclusivos. **Apenas** os chips de "Equipamentos" do
  `NewOsDrawer` permitem multi-seleção.
- **Botão "Simular chuva" da estação offline**: clicável só se `online=1`;
  o toast `"Chuva simulada: {nome}"` exibe o nome da estação.
- **Responsividade**: ao cruzar `900px`, a sidebar vira barra horizontal
  scrollável e a arte do login some; ao cruzar `560px`, todos os grids
  viram 1 coluna.
- **Mudança de role**: o estado `role` fica em um `useState` no
  `<AppShell>` (ou Context); ao logar, o papel selecionado no login é
  mantido; o pill em `/perfil` reflete o papel atual.

## 4. Decisões técnicas

> As seções 1–3 não citam tecnologia. Aqui documentamos a abordagem
> escolhida, alternativas descartadas e trade-offs.

**Backend**

- Nenhuma alteração no backend nesta feature. O frontend é 100% mock.

**Frontend**

- **Roteamento:** React Router 7 (já presente em `frontend/package.json`)
  com `createBrowserRouter` e `<Outlet>` em `App.jsx`. Todas as 7 rotas
  internas + `/` (login) são registradas em
  `frontend/src/routes/AppRoutes.jsx` (arquivo novo, ver §5).
  - `/` → `<LoginPage>` (sem sidebar, sem app shell).
  - `/clima` → `<ClimaPage>` (dentro de `<RequireAuth>` + `<AppShell>`).
  - `/mapa` → `<MapaPage>`.
  - `/os` → `<OsPage>`.
  - `/equipamentos` → `<EquipamentosPage>`.
  - `/alertas` → `<AlertasPage>`.
  - `/app-campo` → `<AppCampoPage>`.
  - `/perfil` → `<PerfilPage>`.
  - `*` → redirect para `/` (catch-all).
- **Autenticação mock:** um Context `AuthContext` (em
  `frontend/src/context/AuthContext.jsx`) guarda `{ isAuthenticated, role,
theme, login(), logout(), toggleTheme() }`. Persistência **não**
  requerida (igual ao HTML — recarregar a página volta para o login).
  `RequireAuth` é um wrapper que redireciona para `/` se
  `!isAuthenticated`.
- **Estado de UI:** `useState` local em cada página. Para o estado
  compartilhado (drawer aberto, sheet aberto, modal aberto, setor
  selecionado no mapa, OS selecionada no drawer, etc.) usar Context
  leve: `UiContext` em `frontend/src/context/UiContext.jsx`. Para
  listas mutáveis (equipamentos, OS) que são alteradas por modais,
  também `useState` no `UiContext` — assim "Salvar ativo" e "Emitir
  OS" se refletem imediatamente na tabela.
- **Componentes extraídos** (ver §5 para lista completa):
  - `AppShell` (sidebar + `<Outlet>`).
  - `Sidebar` (lista de botões, marca "Sair").
  - `KpiCard`, `StationCard` (Clima).
  - `MapView` (SVG dos polígonos) e `SectorPopup` (popup lateral).
  - `DataTable` (wrapper genérico de `.card.tw > table`).
  - `Pill` (variantes `r|y|g|b|default`), `Button` (variantes
    `default|o|wide`), `Stepper`, `Toggle` (`.tog`), `Chip`,
    `Segmented` (`.seg`), `Toast` (singleton via Context), `Modal`,
    `Drawer`, `Sheet`, `OccurrenceSheet` (especialização dentro do
    `.phone`).
- **CSS:**
  - **Sugestão da IA:** centralizar todo o CSS do protótipo em um único
    arquivo `frontend/src/styles/global.css` importado por `main.jsx`,
    espelhando 1-para-1 o bloco `<style>` do `SmartWeather.html`. As
    variáveis CSS ficam em `:root` (light) e em `:root[data-theme="dark"]`
    (override). O `@media (prefers-color-scheme: dark)` original vira
    um fallback caso `data-theme` não esteja setado.
  - **Sugestão da IA:** cada componente pode ter um `Component.module.css`
    **apenas** se a separação ajudar leitura; caso contrário, manter
    classes globais idênticas ao HTML (`.card`, `.btn.o`, `.pill.r`, etc.).
    **Decisão final:** manter classes globais idênticas ao HTML para
    preservar paridade visual exata. Componentes não usam CSS Modules.
  - Fontes: mover o `@import` do Google Fonts para
    `frontend/index.html` (`<link>` no `<head>`).
- **`<title>` e `<html lang>`:** alterar `frontend/index.html` para
  `<title>SmartWeather</title>` e `<html lang="pt-BR">`.
- **Dados mock:** extrair os arrays `ST`, `OS`, `EQ`, `SEC` do JS do HTML
  para `frontend/src/mocks/`:
  - `frontend/src/mocks/stations.js` → exporta `STATIONS`.
  - `frontend/src/mocks/serviceOrders.js` → exporta `SERVICE_ORDERS`.
  - `frontend/src/mocks/equipment.js` → exporta `EQUIPMENT`.
  - `frontend/src/mocks/sectors.js` → exporta `SECTORS` (com os
    polígonos SVG `d` e labels).
- **Ícones/emoji:** usar exatamente os mesmos caracteres do HTML (🔴, 🟢,
  🟡, 🔵, ●, 🛠️, 🌧️, 👥, 🚧, ⏰, 📷, ✕). Sem biblioteca de ícones.
- **Acessibilidade:** todo botão tem `aria-label` quando aplicável;
  inputs têm `<label>` associado; modais têm `role="dialog"`
  `aria-modal="true"`; sheet tem `role="dialog" aria-label="Reportar
ocorrência"`; mapa tem `role="img" aria-label="Mapa dos setores"`.
  Foco visível preservado (`:focus-visible { outline: 2px solid var(--g);
outline-offset: 2px; }`).

**Contrato (OpenAPI)**

- Esta feature **não altera `specs/openapi.yaml`**. É puramente UI mock.

## 5. Modelo de dados e arquivos a criar

### 5.1 Modelo de dados (mocks)

#### `Station` (mock `STATIONS`)

| Campo       | Tipo                 | Origem no HTML |
| ----------- | -------------------- | -------------- | ------ |
| nome        | `string`             | `s[0]`         |
| temperatura | `string`             | `s[1]`         |
| status      | `string`             | `s[2]`         |
| sparkData   | `number[]` (6 itens) | `s[3]`         |
| online      | `0                   | 1`             | `s[4]` |

#### `ServiceOrder` (mock `SERVICE_ORDERS`)

| Campo      | Tipo                       | Origem no HTML |
| ---------- | -------------------------- | -------------- |
| id         | `string`                   | `o[0]`         |
| setor      | `string`                   | `o[1]`         |
| servico    | `string`                   | `o[2]`         |
| status     | `string`                   | `o[3]`         |
| recursos   | `string`                   | `o[4]`         |
| cor        | `'r' \| 'y' \| 'g' \| 'b'` | `o[5]`         |
| prioridade | `string`                   | `o[6]`         |
| data       | `string` (DD/MM/AAAA)      | `o[7]`         |

#### `Equipment` (mock `EQUIPMENT`)

| Campo       | Tipo                                                                |
| ----------- | ------------------------------------------------------------------- |
| nome        | `string`                                                            |
| marca       | `string`                                                            |
| tipo        | `'Máquina' \| 'Ferramenta' \| 'Estação IoT'`                        |
| localizacao | `string`                                                            |
| horimetro   | `string`                                                            |
| status      | `'Em uso' \| 'Disponível' \| 'Inoperante' \| 'Online' \| 'Offline'` |

#### `Sector` (mock `SECTORS`)

| Campo      | Tipo                |
| ---------- | ------------------- |
| id         | `'a' \| 'b' \| 'c'` |
| nome       | `string`            |
| cor        | `'r' \| 'y' \| 'g'` |
| statusPill | `string` (texto)    |
| metricas   | `string` (texto)    |
| ocorrencia | `string` (texto)    |
| path       | `string` (SVG `d`)  |
| labelPos   | `[number, number]`  |

### 5.2 Arquivos a criar

```
frontend/
  index.html                          (alterar: title, lang, adicionar <link> da fonte)
  src/
    main.jsx                          (alterar: registrar <AuthProvider> e <UiProvider>, importar global.css)
    App.jsx                           (manter como wrapper de <Outlet/>)
    routes/
      AppRoutes.jsx                   (NOVO: define as rotas e <RequireAuth>)
      Home.jsx                        (REMOVER ou redirecionar para /clima)
    context/
      AuthContext.jsx                 (NOVO: isAuthenticated, role, theme, login/logout/toggleTheme)
      UiContext.jsx                   (NOVO: drawer/sheet/modal abertos, setorSelecionado, OSs e equipamentos mutáveis)
    components/
      AppShell.jsx                    (NOVO: grid #app + <Sidebar/> + <Outlet/>)
      Sidebar.jsx                     (NOVO: nav com botões e badge de Alertas)
      Pill.jsx                        (NOVO: aceita variant r/y/g/b/default)
      Button.jsx                      (NOVO: aceita variant default/o/disabled/wide)
      Toast.jsx                       (NOVO: render condicional baseado em UiContext)
      Modal.jsx                       (NOVO: overlay + caixa .mb, ESC + click-outside)
      Drawer.jsx                      (NOVO: <aside className="drawer on">)
      Stepper.jsx                     (NOVO: label + valor + botões +/−)
      Toggle.jsx                      (NOVO: <button className="tog" aria-pressed>)
      Segmented.jsx                   (NOVO: 2 botões .seg exclusivos)
      Chip.jsx                        (NOVO: <button className="chip">)
      DataTable.jsx                   (NOVO: wrapper .card.tw > table)
      KpiCard.jsx                     (NOVO: span.mu + b + span.sm.mu)
      StationCard.jsx                 (NOVO: card da estação com Sparkline)
      Sparkline.jsx                   (NOVO: SVG polilinha)
      MapView.jsx                     (NOVO: SVG com polígonos e marcador)
      SectorPopup.jsx                 (NOVO: .pop do mapa)
      PhoneMockup.jsx                 (NOVO: <div className="phone">)
      OccurrenceSheet.jsx             (NOVO: .sheet dentro do .phone)
    pages/
      LoginPage.jsx                   (NOVO: tela de login inteira)
      ClimaPage.jsx                   (NOVO)
      MapaPage.jsx                    (NOVO)
      OsPage.jsx                      (NOVO)
      EquipamentosPage.jsx            (NOVO)
      AlertasPage.jsx                 (NOVO)
      AppCampoPage.jsx                (NOVO)
      PerfilPage.jsx                  (NOVO)
    modals/
      NewEquipmentModal.jsx           (NOVO)
      RescheduleModal.jsx             (NOVO)
      ReallocateModal.jsx             (NOVO)
    drawers/
      OsDetailsDrawer.jsx             (NOVO)
      NewOsDrawer.jsx                 (NOVO)
    mocks/
      stations.js                     (NOVO: STATIONS)
      serviceOrders.js                (NOVO: SERVICE_ORDERS)
      equipment.js                    (NOVO: EQUIPMENT)
      sectors.js                      (NOVO: SECTORS)
    styles/
      global.css                      (NOVO: TODO o CSS do <style> do HTML)
```

### 5.3 Arquivos a alterar

- `frontend/index.html` — `<title>`, `<html lang>`, `<link>` da fonte
  `Instrument Sans`, `<meta viewport>` com `viewport-fit=cover`.
- `frontend/src/main.jsx` — registrar providers, importar `global.css`,
  registrar `<RouterProvider>` apontando para `<AppRoutes/>`.
- `frontend/src/App.jsx` — manter mínimo (apenas `<Outlet/>`).

### 5.4 Arquivos a remover

- `frontend/src/routes/Home.jsx` — substituído por `LoginPage`. Pode
  ser removido se não for mais referenciado, ou redirecionar para `/`.

## 6. Contrato

Esta feature **não altera `specs/openapi.yaml`**. Nenhuma rota de API é
adicionada ou modificada. Todo o tráfego entre UI e "dados" é local
(useState/Context). Próximas features (login real, CRUD de OS, CRUD de
equipamentos, etc.) definirão os endpoints correspondentes.

## 7. Fases de execução

### Fase 1 — Esqueleto, rotas e tema

- **Objetivo:** Ter o `index.html` correto, o `global.css` com todas as
  variáveis e regras do HTML, o roteador com todas as 8 rotas registradas
  e os providers (Auth, UI) instalados, com páginas placeholder.
- **Requisitos cobertos:** RF-15 (parcial: variáveis CSS e toggle de tema).
- **Tarefas:**
  - [ ] **T1** — Atualizar `frontend/index.html`: `lang="pt-BR"`,
        `<title>SmartWeather</title>`, `<link>` da fonte Instrument Sans
        (mesmos pesos 400/500/600/700), `<meta name="viewport"
content="width=device-width, initial-scale=1, viewport-fit=cover">`.
  - [ ] **T2** — Criar `frontend/src/styles/global.css` com o bloco
        `<style>` do `SmartWeather.html` **idêntico** (mesmas variáveis,
        mesmos seletores, mesma ordem, incluindo media queries de
        `prefers-color-scheme`, `prefers-reduced-motion`, 900px e 560px).
  - [ ] **T3** — Importar `global.css` em `main.jsx`.
  - [ ] **T4** — Criar `frontend/src/context/AuthContext.jsx` com
        `{ isAuthenticated, role, theme, login(role), logout(), toggleTheme() }`.
        Inicializa `theme` lendo `prefers-color-scheme` se `data-theme`
        não estiver em `document.documentElement`.
  - [ ] **T5** — Criar `frontend/src/context/UiContext.jsx` com
        `{ isDrawerOpen, drawerContent, openDrawer(node), closeDrawer(),
isSheetOpen, openSheet(), closeSheet(),
isModalOpen, modalContent, openModal(node), closeModal(),
selectedSectorId, setSelectedSectorId,
serviceOrders, setServiceOrders,
equipment, setEquipment,
showToast(msg) }`.
  - [ ] **T6** — Criar `frontend/src/routes/AppRoutes.jsx` registrando
        as 8 rotas (com `RequireAuth` envolvendo as internas) e
        `path="*"` redirect para `/`.
  - [ ] **T7** — Criar páginas placeholder (somente `<h1>{nome}</h1>`)
        para todas as 7 páginas internas e o `LoginPage` mínimo.
  - [ ] **T8** — Atualizar `main.jsx` para usar `<AppRoutes/>`,
        envolver em `<AuthProvider>` e `<UiProvider>`.
  - [ ] **T9** — `npm run lint` verde; `npm run build` verde;
        `npm run dev` mostra a página de login em `/`.
- **Dependências:** nenhuma.
- **Pronto quando:** navegação entre `/`, `/clima`, `/mapa`, etc. funciona
  (mesmo que as páginas mostrem só um título) e a sidebar aparece
  corretamente nas rotas autenticadas.

### Fase 2 — Componentes primitivos

- **Objetivo:** Construir todos os componentes reutilizáveis de UI
  (`Pill`, `Button`, `Toast`, `Modal`, `Drawer`, `Stepper`, `Toggle`,
  `Segmented`, `Chip`, `DataTable`, `Sparkline`).
- **Requisitos cobertos:** RF-11, RF-12, RF-14, RF-16, RF-18.
- **Tarefas:**
  - [ ] **T1** — `Pill` (variants default/r/y/g/b, conteúdo children).
  - [ ] **T2** — `Button` (variants default/o/disabled/wide).
  - [ ] **T3** — `Toast` (singleton lendo `UiContext.toast`; auto-hide
        em 2200 ms; estilo `.toast`).
  - [ ] **T4** — `Modal` (overlay + `.mb`, ESC fecha, click-outside
        fecha, `role="dialog" aria-modal="true"`).
  - [ ] **T5** — `Drawer` (componente genérico; aceita children;
        respeita `prefers-reduced-motion`).
  - [ ] **T6** — `Stepper` (label + valor + botões `−`/`+` com
        `aria-label`; valor mínimo 0).
  - [ ] **T7** — `Toggle` (`.tog` com `aria-pressed`).
  - [ ] **T8** — `Segmented` (2 botões `.seg` com seleção exclusiva).
  - [ ] **T9** — `Chip` (`.chip` com `aria-pressed`, callback `onToggle`).
  - [ ] **T10** — `DataTable` (wrapper `.card.tw > table`; aceita
        `columns` e `rows`).
  - [ ] **T11** — `Sparkline` (fórmula do HTML; aceita `data` e
        `color`; `aria-hidden`).
- **Dependências:** Fase 1.
- **Pronto quando:** cada componente é usado em uma página de "playground"
  temporária (ou numa página placeholder) e renderiza idêntico ao HTML
  de referência. `npm run lint` verde.

### Fase 3 — Login + App shell

- **Objetivo:** Tela de login funcional e sidebar completa; transição
  login → app.
- **Requisitos cobertos:** RF-01, RF-02, RF-03, RF-17.
- **Tarefas:**
  - [ ] **T1** — `LoginPage.jsx` com layout 2 colunas idêntico ao HTML
        (incluindo arte, formulário, seletor de papel, e-mail/senha
        pré-preenchidos, responsividade em 900px).
  - [ ] **T2** — `Sidebar.jsx` com logo, 7 botões de navegação (Alertas
        com `<Pill variant="r">3</Pill>`), botão Sair, e item ativo com
        `className="on"`. Botões usam `<NavLink>` do React Router.
  - [ ] **T3** — `AppShell.jsx` com grid `232px 1fr`, sticky sidebar
        (com `prefers-reduced-motion` desabilitando a transição do drawer
        — não se aplica ao shell, manter).
  - [ ] **T4** — `RequireAuth` wrapper: redireciona para `/` se
        `!isAuthenticated`.
  - [ ] **T5** — Submit do form chama `login(role)` e `navigate("/clima")`.
  - [ ] **T6** — Botão "Sair" (sidebar e perfil) chama `logout()` e
        `navigate("/")`.
- **Dependências:** Fase 1, Fase 2 (para `<Button>`, `<Pill>`).
- **Pronto quando:** login navega para `/clima`; logout volta para
  `/`; sidebar marca o item ativo conforme a rota.

### Fase 4 — Páginas: Clima, Mapa, OS, Equipamentos, Alertas

- **Objetivo:** Implementar as 5 primeiras páginas com seus dados mock.
- **Requisitos cobertos:** RF-04, RF-05, RF-06, RF-07, RF-08.
- **Tarefas:**
  - [ ] **T1** — `mocks/stations.js` com `STATIONS` (4 entradas).
  - [ ] **T2** — `ClimaPage.jsx` com header + 4 `KpiCard` + grid de 4
        `StationCard` (cada um com `Sparkline`).
  - [ ] **T3** — `mocks/sectors.js` com `SECTORS` (3 entradas, `d` SVG,
        labelPos).
  - [ ] **T4** — `MapaPage.jsx` com `MapView` (SVG, polígonos, marcador
        Estação Av. Palmeiras) e `SectorPopup` (aparece quando
        `selectedSectorId` é setado). Click em polígono → seta
        `selectedSectorId`. Click em "+ Emitir Ordem de Serviço" do popup →
        `openDrawer(<NewOsDrawer setor=.../>)`.
  - [ ] **T5** — `mocks/serviceOrders.js` com `SERVICE_ORDERS` (4
        entradas).
  - [ ] **T6** — `OsPage.jsx` com header + `DataTable` (4 linhas).
        Botão "+ Nova ordem" → `openDrawer(<NewOsDrawer/>)`. Botão
        "Ver detalhes" → `openDrawer(<OsDetailsDrawer os=.../>)`.
  - [ ] **T7** — `mocks/equipment.js` com `EQUIPMENT` (6 entradas).
  - [ ] **T8** — `EquipamentosPage.jsx` com header + 3 selects de
        filtro + `DataTable` (6 linhas). Botão "+ Novo ativo" →
        `openModal(<NewEquipmentModal/>)`.
  - [ ] **T9** — `AlertasPage.jsx` com 3 cards de alerta. Botões
        disparam `openModal`/`openDrawer` conforme RF-08.
- **Dependências:** Fase 3, Fase 2 (`DataTable`, `KpiCard`, `StationCard`,
  `Sparkline`, `MapView`, `SectorPopup`).
- **Pronto quando:** cada uma das 5 páginas renderiza **pixel-equivalente**
  ao HTML de referência e os botões disparam os modais/drawers
  (ainda sem conteúdo — entram na Fase 5).

### Fase 5 — Páginas: App de campo + Perfil + Modais/Drawers

- **Objetivo:** Implementar o mockup mobile de campo, a página de perfil
  com toggle de tema, e todos os modais/drawers (newOS, openOS, newEq,
  reag, real, sheet).
- **Requisitos cobertos:** RF-09, RF-10, RF-11, RF-12, RF-13, RF-14.
- **Tarefas:**
  - [ ] **T1** — `AppCampoPage.jsx` com `PhoneMockup` contendo: card
        de status da OS, grid 2 colunas de upload, input de duração, 2
        `Stepper`, botão "Reportar ocorrência" (abre `OccurrenceSheet`),
        botão "Finalizar serviço" (toast).
  - [ ] **T2** — `OccurrenceSheet.jsx` dentro do `PhoneMockup`: grid 2x2
        de `Chip` exclusivos + upload + botão "Enviar relato" (toast).
        Overlay `.sbd` aparece enquanto aberto.
  - [ ] **T3** — `PerfilPage.jsx` com 2 cards: dados da conta (nome,
        e-mail, pill da role) e preferências (Toggle "Tema escuro"
        conectado a `AuthContext.toggleTheme()`, Toggle "Notificações de
        alertas" local com `aria-pressed="true"` inicial, botão Sair).
  - [ ] **T4** — `OsDetailsDrawer.jsx` (RF-11) com header (id+serviço,
        setor, ✕), grid 2 de placeholders, recursos, histórico.
  - [ ] **T5** — `NewOsDrawer.jsx` (RF-12) com form completo:
        selects, data, prioridade (chips exclusivos), stepper Operadores,
        equipamentos (chips multi), textarea, botão "Confirmar e Emitir
        OS" (toast).
  - [ ] **T6** — `NewEquipmentModal.jsx` (RF-14.1) com form completo:
        nome, tipo (Segmented), marca, propriedade (Select com troca
        condicional do campo entre patrimônio e ID de frota), número de
        série, localização, botão "Salvar ativo" (fecha, toast, e
        `setEquipment([novo, ...equipment])` se a view for `/equipamentos`).
  - [ ] **T7** — `RescheduleModal.jsx` (RF-14.2) com 2 cards de data
        e botão "Confirmar novas datas" (fecha, toast `"2 ordens reagendadas"`).
  - [ ] **T8** — `ReallocateModal.jsx` (RF-14.3) com lista de
        equipamentos e botão "Confirmar substituição" (fecha, toast
        `"Equipamento realocado para Parque das Frutas"`).
- **Dependências:** Fase 4.
- **Pronto quando:** todas as 8 páginas renderizam; todos os 5
  modais/drawers/sheet abrem e fecham; todos os toasts disparam com
  as mensagens corretas; o toggle de tema em `/perfil` alterna entre
  light e dark com a tabela de variáveis correta.

### Fase 6 — Fechamento e validação de paridade

- **Objetivo:** Garantir CI verde, paridade visual com o HTML e cobertura
  dos requisitos.
- **Requisitos cobertos:** todos (verificação).
- **Tarefas:**
  - [ ] **T1** — `npm run lint` e `npm run build` verdes.
  - [ ] **T2** — Diff visual lado-a-lado entre `SmartWeather.html`
        aberto no navegador e cada página React: tema claro, tema escuro,
        viewport desktop (1280px), tablet (900px) e mobile (375px). Todas
        as diferenças devem ser investigadas e corrigidas até zerar.
  - [ ] **T3** — Verificar todos os 18 RFs da §2 com casos práticos
        (clicar, navegar, abrir modais, alternar tema, etc.).
  - [ ] **T4** — Atualizar `report.md` da feature com checklist de
        fases, evidências (prints, comandos) e seção de encerramento.
- **Dependências:** Fases 1–5.
- **Pronto quando:** a UI React é **indistinguível** do HTML
  `SmartWeather.html` em qualquer viewport, em ambos os temas, e todos
  os fluxos funcionam como no protótipo.

## 8. Riscos e perguntas em aberto

- **Comportamento de `data-theme` no primeiro carregamento:** o HTML
  detecta `prefers-color-scheme` na primeira visita. Decidido: o React
  lê `prefers-color-scheme` no `useEffect` inicial do `AuthContext` e
  seta `data-theme` em `document.documentElement` se nenhum valor
  estiver presente. **Sem persistência em `localStorage`** (igual ao
  HTML).
- **CSS global vs. CSS Modules:** a decisão foi manter classes globais
  para preservar paridade visual exata. Se o time decidir migrar
  futuramente para CSS Modules, será em feature separada.
- **`<html lang="en">` atual no `index.html`:** precisa virar `pt-BR`
  para casar com a tela de login em português. Decidido nesta feature.
- **`<title>frontend</title>` atual:** precisa virar `SmartWeather`.
  Decidido nesta feature.
- **Possível reescrita futura para TypeScript:** o `package.json` já
  tem `@types/react` instalado, mas o código continua em JSX puro. Esta
  feature mantém o padrão existente (sem TypeScript) por consistência
  com a feature 001.
- **Acessibilidade do mapa SVG:** o HTML original usa `tabindex="0"`
  em cada `<path>` e trata Enter. Manter esse comportamento.
- **Sheet dentro do `.phone`:** o sheet tem `position: absolute`
  dentro do `.phone` (que tem `overflow: hidden`). O overlay `.sbd`
  também. Garantir que a hierarquia de z-index fica dentro do
  `.phone` e não conflita com o drawer/modal (que estão fora).
- **Toast singleton:** apenas um toast por vez. Se um novo toast for
  disparado enquanto o anterior está visível, o texto é substituído e
  o timer reinicia. Decidido (igual ao HTML).
- **Drawer reabrindo com conteúdo errado:** ao fechar o drawer via
  React, o estado `drawerContent` precisa voltar a `null` para que
  a próxima abertura pegue o conteúdo novo. Decidido usar padrão
  `openDrawer(<Node/>)` que sempre substitui o nó.
