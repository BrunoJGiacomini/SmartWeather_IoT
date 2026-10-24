/**
 * Service order domain helpers.
 *
 * Kept free of React so the rules can be unit tested without a DOM.
 */

/** Pill color for each priority, matching the chips in the "Nova OS" modal. */
export const PRIORITY_COLORS = {
  Alta: "r",
  Média: "y",
  Baixa: "g",
};

/** Sectors offered by the modal. */
export const SECTOR_OPTIONS = [
  "Parque Central",
  "Praça das Flores",
  "Jardim Botânico",
  "Av. das Palmeiras",
];

/** Service types offered by the modal. */
export const SERVICE_TYPE_OPTIONS = ["Roçagem", "Poda", "Limpeza", "Irrigação"];

/** Equipment offered by the modal, with the wording used in the table. */
export const EQUIPMENT_OPTIONS = [
  { label: "Roçadeira FS 450 · Stihl", tipo: "roçadeira", marca: "Stihl" },
  { label: "Roçadeira FS 55 · Stihl", tipo: "roçadeira", marca: "Stihl" },
  {
    label: "Motosserra 372 XP · Husqvarna",
    tipo: "motosserra",
    marca: "Husqvarna",
  },
  { label: "Soprador BR 600 · Stihl", tipo: "soprador", marca: "Stihl" },
];

const EQUIPMENT_BY_LABEL = new Map(
  EQUIPMENT_OPTIONS.map((option) => [option.label, option]),
);

/**
 * Converts an ISO date (YYYY-MM-DD) into the Brazilian format (DD/MM/AAAA).
 *
 * @param {string} isoDate
 * @returns {string}
 */
export function formatBrDate(isoDate) {
  if (!isoDate) return "—";

  const parts = String(isoDate).split("-");
  if (parts.length !== 3) return String(isoDate);

  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

/**
 * Reverse of `formatBrDate`: turns the date shown in the table back into the
 * ISO format expected by the date input of the form.
 *
 * @param {string} brDate
 * @returns {string} ISO date (YYYY-MM-DD) or an empty string
 */
export function parseBrDate(brDate) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(brDate || "").trim());
  if (!match) return "";

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

/**
 * Extracts the priority key from the text shown in the table, dropping the
 * deadline suffix (e.g. "Alta · vence em 2d" becomes "Alta").
 *
 * @param {string} priority
 * @returns {string}
 */
export function parsePriorityKey(priority) {
  return String(priority || "")
    .split("·")[0]
    .trim();
}

/**
 * Normalizes a plural equipment type to its singular form.
 *
 * @param {string} word
 * @returns {string}
 */
function singularize(word) {
  const text = String(word || "")
    .trim()
    .toLowerCase();
  if (text.length > 2 && text.endsWith("s") && !text.endsWith("ss")) {
    return text.slice(0, -1);
  }
  return text;
}

/**
 * Picks the equipment labels matching a type and a brand.
 *
 * @param {string} tipo
 * @param {string} marca
 * @param {number} quantity
 * @returns {string[]}
 */
function equipmentLabelsFor(tipo, marca, quantity) {
  const brand = String(marca || "")
    .trim()
    .toLowerCase();
  const byBrand = EQUIPMENT_OPTIONS.filter(
    (option) => option.tipo === tipo && option.marca.toLowerCase() === brand,
  );
  const candidates = byBrand.length
    ? byBrand
    : EQUIPMENT_OPTIONS.filter((option) => option.tipo === tipo);

  return candidates.slice(0, quantity).map((option) => option.label);
}

/**
 * Reverse of `buildResources`: recovers the operator count and the equipment
 * labels from the text shown in the table.
 *
 * @param {string} resources
 * @returns {{ operadores: number, equipamentos: string[] }}
 */
export function parseResources(resources) {
  const parts = String(resources || "")
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);

  let operadores = 0;
  const equipamentos = [];

  for (const part of parts) {
    const tokens = part.split(/\s+/);
    const quantity = Number(tokens[0]);
    if (!Number.isFinite(quantity)) continue;

    if (tokens.length === 2 && /^operador(es)?$/i.test(tokens[1])) {
      operadores = quantity;
      continue;
    }

    const tipo = singularize(tokens[1]);
    if (!tipo) continue;

    const marca = tokens.slice(2).join(" ");
    equipamentos.push(...equipmentLabelsFor(tipo, marca, quantity));
  }

  return { operadores, equipamentos };
}

/**
 * Builds the identifier of the next order from the highest one in the list.
 *
 * @param {Array<{ id: string }>} serviceOrders
 * @returns {string}
 */
export function nextServiceOrderId(serviceOrders = []) {
  const numbers = serviceOrders
    .map((order) => Number(String(order.id).replace(/\D/g, "")))
    .filter((number) => Number.isFinite(number) && number > 0);

  const next = numbers.length ? Math.max(...numbers) + 1 : 1;
  return `OS-${next}`;
}

/**
 * Describes the allocated resources in the same wording used by the table,
 * e.g. "3 operadores · 2 roçadeiras Stihl".
 *
 * @param {number} operators
 * @param {string[]} equipmentLabels
 * @returns {string}
 */
export function buildResources(operators = 0, equipmentLabels = []) {
  const parts = [`${operators} operador${operators === 1 ? "" : "es"}`];
  const groups = new Map();

  for (const label of equipmentLabels) {
    const option = EQUIPMENT_BY_LABEL.get(label);
    const tipo = option ? option.tipo : String(label).toLowerCase();
    const marca = option ? option.marca : "";
    const key = `${tipo}|${marca}`;
    groups.set(key, (groups.get(key) || 0) + 1);
  }

  for (const [key, quantity] of groups) {
    const [tipo, marca] = key.split("|");
    const noun = `${quantity} ${tipo}${quantity > 1 ? "s" : ""}`;
    parts.push(marca ? `${noun} ${marca}` : noun);
  }

  return parts.join(" · ");
}

/**
 * Builds the order created by the "Nova ordem de serviço" modal.
 *
 * The order keeps both the text shown in the table (`data`, `recursos`) and
 * the structured values behind it, so the form can be reopened with the same
 * content later on.
 *
 * @param {object} form
 * @param {string} form.setor
 * @param {string} form.tipoServico
 * @param {string} form.data ISO date (YYYY-MM-DD)
 * @param {string} form.prioridade
 * @param {number} form.operadores
 * @param {string[]} form.equipamentos
 * @param {string} form.instrucoes
 * @param {Array<{ id: string }>} form.serviceOrders
 * @returns {object}
 */
export function buildServiceOrder({
  setor = "",
  tipoServico = "",
  data = "",
  prioridade = "Alta",
  operadores = 0,
  equipamentos = [],
  instrucoes = "",
  serviceOrders = [],
} = {}) {
  return {
    id: nextServiceOrderId(serviceOrders),
    setor: String(setor).trim() || "—",
    servico: String(tipoServico).trim() || "—",
    status: "Agendada",
    recursos: buildResources(operadores, equipamentos),
    cor: PRIORITY_COLORS[prioridade] || "r",
    prioridade,
    prioridadeKey: prioridade,
    data: formatBrDate(data),
    dataIso: data,
    operadores,
    equipamentos: [...equipamentos],
    instrucoes: String(instrucoes).trim(),
  };
}

/**
 * Recovers the form state of an order.
 *
 * Orders created by the app carry the structured fields; orders coming from
 * the mock data are recovered from the text shown in the table.
 *
 * @param {object} order
 * @returns {{ setor: string, tipoServico: string, data: string, prioridade: string, operadores: number, equipamentos: string[], instrucoes: string }}
 */
export function orderToForm(order = {}) {
  const recursos = parseResources(order.recursos);
  const operadores = Number.isFinite(order.operadores)
    ? order.operadores
    : recursos.operadores;
  const equipamentos = Array.isArray(order.equipamentos)
    ? order.equipamentos
    : recursos.equipamentos;

  return {
    setor: order.setor ?? "",
    tipoServico: order.servico ?? "",
    data: order.dataIso || parseBrDate(order.data),
    prioridade: order.prioridadeKey || parsePriorityKey(order.prioridade),
    operadores,
    equipamentos,
    instrucoes: order.instrucoes ?? "",
  };
}

/**
 * Applies the changes of the edit form to a single order, keeping its
 * position, id and status in the list.
 *
 * @param {Array<object>} serviceOrders
 * @param {string} id
 * @param {object} changes form values
 * @returns {Array<object>}
 */
export function updateServiceOrder(serviceOrders = [], id, changes = {}) {
  return serviceOrders.map((order) => {
    if (order.id !== id) return order;

    const prioridadeAtual =
      order.prioridadeKey || parsePriorityKey(order.prioridade);
    const prioridadeNova = changes.prioridade ?? prioridadeAtual;
    const prioridadeMudou = prioridadeNova !== prioridadeAtual;

    const recursosAtual = parseResources(order.recursos);

    let totalOperadores = recursosAtual.operadores;
    if (Number.isFinite(changes.operadores)) {
      totalOperadores = changes.operadores;
    } else if (Number.isFinite(order.operadores)) {
      totalOperadores = order.operadores;
    }

    let listaEquipamentos = recursosAtual.equipamentos;
    if (Array.isArray(changes.equipamentos)) {
      listaEquipamentos = changes.equipamentos;
    } else if (Array.isArray(order.equipamentos)) {
      listaEquipamentos = order.equipamentos;
    }

    const dataIso = changes.data ?? order.dataIso ?? parseBrDate(order.data);
    const setor = changes.setor ?? order.setor;
    const servico = changes.tipoServico ?? order.servico;
    const instrucoes = changes.instrucoes ?? order.instrucoes ?? "";

    return {
      ...order,
      setor: String(setor).trim() || "—",
      servico: String(servico).trim() || "—",
      recursos: buildResources(totalOperadores, listaEquipamentos),
      prioridade: prioridadeMudou
        ? prioridadeNova
        : (order.prioridade ?? prioridadeNova),
      prioridadeKey: prioridadeNova,
      cor: prioridadeMudou
        ? PRIORITY_COLORS[prioridadeNova] || "r"
        : order.cor || PRIORITY_COLORS[prioridadeNova] || "r",
      data: formatBrDate(dataIso),
      dataIso,
      operadores: totalOperadores,
      equipamentos: [...listaEquipamentos],
      instrucoes: String(instrucoes).trim(),
    };
  });
}

/**
 * Returns a new list with the order added on top, keeping the previous ones.
 *
 * @param {Array<object>} serviceOrders
 * @param {object} order
 * @returns {Array<object>}
 */
export function addServiceOrder(serviceOrders = [], order) {
  return [order, ...serviceOrders];
}
