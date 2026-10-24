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
      "Roçadeira #102 parou na Praça das Flores. Há 1 roçadeira livre no Depósito Central.",
    buttonLabel: "Realocar",
    action: "reallocate",
  },
  {
    id: "prazo",
    cor: "y",
    icon: "⏰",
    title: "Prazo de manutenção",
    description: "Parque Central está 4 dias atrasado para roçagem.",
    buttonLabel: "Emitir ordem",
    action: "newOs",
  },
];

/**
 * Builds the runtime alert for a rain simulation on a given station.
 * All data comes from the mocked `simulacao` block of the station.
 */
export function buildRainAlert(station) {
  const { setor, simulacao } = station;

  return {
    cor: "b",
    icon: "🌧️",
    title: "Chuva simulada",
    description: `A área ${setor} precisa de mais tempo para ser finalizada: ${simulacao.os} · ${simulacao.servico} — novo prazo ${simulacao.prazo}.`,
    buttonLabel: "Ver OS",
    action: "viewOs",
    osId: simulacao.os,
    origem: "simulacao",
    registradoEm: simulacao.registradoEm,
  };
}
