// Alertas mockados da aplicação.
//
// BASE_ALERTS reproduz os 3 alertas do protótipo (idênticos em texto, cor,
// ícone e ação). Alertas gerados em runtime — como o de simulação de chuva —
// são acrescentados pelo `UiContext` via `addAlert`.
export const BASE_ALERTS = [
  {
    id: "climatico",
    cor: "b",
    icon: "🌧️",
    title: "Ajuste climático",
    description:
      "Chuva intensa prevista para amanhã. Reagendar 2 serviços de roçagem?",
    buttonLabel: "Reagendar",
    action: "reschedule",
  },
  {
    id: "equipamento",
    cor: "r",
    icon: "🛠️",
    title: "Equipamento inoperante",
    description:
      "Roçadeira #102 parou na Parque das Frutas. Há 1 roçadeira livre no Depósito Central.",
    buttonLabel: "Realocar",
    action: "reallocate",
  },
  {
    id: "prazo",
    cor: "y",
    icon: "⏰",
    title: "Prazo de manutenção",
    description: "Parque do Mirim está 4 dias atrasado para roçagem.",
    buttonLabel: "Emitir ordem",
    action: "newOs",
  },
];

export function buildRainAlert(station, simulacao = station?.simulacao) {
  const { setor } = station;

  const prazo = simulacao?.dataAnterior
    ? `${simulacao.prazo} (reagendada de ${simulacao.dataAnterior})`
    : simulacao?.prazo;

  return {
    cor: "b",
    icon: "🌧️",
    title: "Chuva simulada",
    description: `A área ${setor} precisa de mais tempo para ser finalizada: ${simulacao.os} · ${simulacao.servico} — novo prazo ${prazo}.`,
    buttonLabel: "Ver ordem de serviço",
    action: "viewOs",
    osId: simulacao.os,
    origem: "simulacao",
    registradoEm: simulacao.registradoEm,
  };
}
