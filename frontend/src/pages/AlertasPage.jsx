import Pill from "../components/Pill.jsx";
import { useUi } from "../context/useUi.js";
import RescheduleModal from "../modals/RescheduleModal.jsx";
import ReallocateModal from "../modals/ReallocateModal.jsx";
import NewOsModal from "../modals/NewOsModal.jsx";
import OsDetailsModal from "../modals/OsDetailsModal.jsx";

function AlertasPage() {
  const { alerts, openModal, serviceOrders } = useUi();

  const handleAction = (alert) => {
    if (alert.action === "reschedule") openModal(<RescheduleModal />);
    else if (alert.action === "reallocate") openModal(<ReallocateModal />);
    else if (alert.action === "newOs")
      openModal(
        <NewOsModal initialSetor="Parque do Mirim" initialServico="Roçagem" />,
      );
    else if (alert.action === "viewOs") {
      const os = serviceOrders.find((o) => o.id === alert.osId);
      if (os) openModal(<OsDetailsModal os={os} />);
    }
  };

  return (
    <>
      <div className="hd">
        <h1>Alertas</h1>
      </div>
      <div className="grid">
        {alerts.map((a) => (
          <div
            key={a.id}
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
                {a.registradoEm && (
                  <span className="sm mu">Registrado em {a.registradoEm}</span>
                )}
              </div>
            </div>
            <button className="btn" onClick={() => handleAction(a)}>
              {a.buttonLabel}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default AlertasPage;
