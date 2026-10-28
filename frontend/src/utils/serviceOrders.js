import { SECTORS } from "../mocks/sectors.js";

export const PRIORITY_COLORS = {
  Alta: "r",
  Média: "y",
  Baixa: "g",
};

export const SECTOR_OPTIONS = Object.values(SECTORS).map(
  (sector) => sector.nome,
);

export const SERVICE_TYPE_OPTIONS = ["Roçagem", "Poda", "Limpeza", "Irrigação"];

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

export function formatBrDate(isoDate) {
  if (!isoDate) return "—";

  const parts = String(isoDate).split("-");
  if (parts.length !== 3) return String(isoDate);

  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

export function parseBrDate(brDate) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(brDate || "").trim());
  if (!match) return "";

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

export function parsePriorityKey(priority) {
  return String(priority || "")
    .split("·")[0]
    .trim();
}

function singularize(word) {
  const text = String(word || "")
    .trim()
    .toLowerCase();
  if (text.length > 2 && text.endsWith("s") && !text.endsWith("ss")) {
    return text.slice(0, -1);
  }
  return text;
}

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

export function nextServiceOrderId(serviceOrders = []) {
  const numbers = serviceOrders
    .map((order) => Number(String(order.id).replace(/\D/g, "")))
    .filter((number) => Number.isFinite(number) && number > 0);

  const next = numbers.length ? Math.max(...numbers) + 1 : 1;
  return `OS-${next}`;
}

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

export function addServiceOrder(serviceOrders = [], order) {
  return [order, ...serviceOrders];
}
