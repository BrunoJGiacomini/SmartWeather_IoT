import Pill from "../components/Pill.jsx";
import { useUi } from "../context/useUi.js";
import RescheduleModal from "../modals/RescheduleModal.jsx";
import ReallocateModal from "../modals/ReallocateModal.jsx";
import NewOsDrawer from "../drawers/NewOsDrawer.jsx";

const ALERTAS = [
  {
    cor: "b",
    icon: "🌧️",
    title: "Ajuste climático",
    description:
      "Chuva intensa prevista para amanhã. Reagendar 2 serviços de roçagem?",
    buttonLabel: "Reagendar",
    action: "reschedule",
  },
  {
    cor: "r",
    icon: "🛠️",
    title: "Equipamento inoperante",
    description:
      "Roçadeira #102 parou na Praça das Flores. Há 1 roçadeira livre no Depósito Central.",
    buttonLabel: "Realocar",
    action: "reallocate",
  },
  {
    cor: "y",
    icon: "⏰",
    title: "Prazo de manutenção",
    description: "Parque Central está 4 dias atrasado para roçagem.",
    buttonLabel: "Emitir ordem",
    action: "newOs",
  },
];

function AlertasPage() {
  const { openModal, openDrawer } = useUi();

  const handleAction = (action) => {
    if (action === "reschedule") openModal(<RescheduleModal />);
    else if (action === "reallocate") openModal(<ReallocateModal />);
    else if (action === "newOs")
      openDrawer(
        <NewOsDrawer initialSetor="Parque Central" initialServico="Roçagem" />,
      );
  };

  return (
    <>
      <div className="hd">
        <h1>Alertas</h1>
      </div>
      <div className="grid">
        {ALERTAS.map((a) => (
          <div
            key={a.title}
            className="card"
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: 14 }}>
              <span style={{ fontSize: "24px" }}>{a.icon}</span>
              <div>
                <Pill variant={a.cor}>{a.title}</Pill>
                <p style={{ marginTop: 6, maxWidth: "60ch" }}>
                  {a.description}
                </p>
              </div>
            </div>
            <button className="btn" onClick={() => handleAction(a.action)}>
              {a.buttonLabel}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default AlertasPage;