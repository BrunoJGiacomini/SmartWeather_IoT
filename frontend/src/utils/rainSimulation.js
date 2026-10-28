import { parseBrDate } from "./serviceOrders.js";

export const RAIN_RESCHEDULE_DAYS = 4;
export const RAIN_AFFECTED_STATUS = "Agendada";
export const RAIN_AFFECTED_SERVICE = "Roçagem";

const BR_DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;

export function shiftBrDate(brDate, days = 0) {
  const match = BR_DATE_PATTERN.exec(String(brDate ?? "").trim());
  if (!match) return brDate;

  const [, day, month, year] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  const dataInexistente =
    date.getUTCDate() !== Number(day) ||
    date.getUTCMonth() !== Number(month) - 1 ||
    date.getUTCFullYear() !== Number(year);
  if (dataInexistente) return brDate;

  date.setUTCDate(date.getUTCDate() + Number(days || 0));

  const dd = String(date.getUTCDate()).padStart(2, "0");
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${date.getUTCFullYear()}`;
}

export function isRainAffectedOrder(order) {
  if (!order) return false;
  return (
    order.status === RAIN_AFFECTED_STATUS &&
    order.servico === RAIN_AFFECTED_SERVICE
  );
}

export function findStationOrder(serviceOrders = [], station) {
  if (!station) return null;

  const osId = station.simulacao?.os;
  const byId = osId
    ? serviceOrders.find((order) => order.id === osId)
    : undefined;
  if (byId) return byId;

  return serviceOrders.find((order) => order.setor === station.setor) ?? null;
}

export function applyRainSimulation(serviceOrders = [], station) {
  const order = findStationOrder(serviceOrders, station);
  const previousDate = order?.data ?? null;

  if (!isRainAffectedOrder(order)) {
    return {
      serviceOrders,
      order,
      changed: false,
      previousDate,
      newDate: previousDate,
    };
  }

  const newDate = shiftBrDate(order.data, -RAIN_RESCHEDULE_DAYS);

  return {
    serviceOrders: serviceOrders.map((current) =>
      current.id === order.id
        ? { ...current, data: newDate, dataIso: parseBrDate(newDate) }
        : current,
    ),
    order,
    changed: true,
    previousDate,
    newDate,
  };
}

export function resolveSimulation(station, serviceOrders = []) {
  const base = station?.simulacao ?? null;
  if (!base) return null;

  const order = findStationOrder(serviceOrders, station);
  if (!order) return base;

  return {
    ...base,
    os: order.id,
    servico: order.servico,
    statusOs: order.status,
    prazo: order.data,
  };
}

export function isStationSimulated(station, simulatedNames = []) {
  if (!station) return false;
  return simulatedNames.includes(station.nome);
}
