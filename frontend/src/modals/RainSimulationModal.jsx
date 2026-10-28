import { useNavigate } from "react-router-dom";
import { useUi } from "../context/useUi.js";
import Pill from "../components/Pill.jsx";

function RainSimulationModal({ areas = [] }) {
  const { closeModal, showToast } = useUi();
  const navigate = useNavigate();

  const handleAck = () => {
    closeModal();
    showToast(
      areas.length === 1
        ? `Alerta salvo na área de alertas: ${areas[0].setor}`
        : `${areas.length} alertas salvos na área de alertas`,
    );
  };

  const handleViewAlerts = () => {
    closeModal();
    navigate("/alertas");
  };

  return (
    <>
      <div className="hd" style={{ marginBottom: 12 }}>
        <div>
          <h2>Chuva simulada</h2>
          <span className="sm mu">
            {areas.length === 1
              ? "1 área afetada pela simulação"
              : `${areas.length} áreas afetadas pela simulação`}
          </span>
        </div>
        <button className="btn o" aria-label="Fechar" onClick={closeModal}>
          ✕
        </button>
      </div>

      <div className="fm">
        {areas.map((area) => (
          <div className="occ" key={area.nome}>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: "20px" }}>🌧️</span>
              <Pill variant="b">Chuva simulada</Pill>
            </div>
            <p>
              A área <b>{area.setor}</b> precisa de mais tempo para ser
              finalizada.
            </p>
            <p className="sm mu" style={{ marginTop: 6 }}>
              {area.simulacao.os} · {area.simulacao.servico} ·{" "}
              {area.simulacao.statusOs}
            </p>
            <p className="sm mu" style={{ marginTop: 4 }}>
              Novo prazo: {area.simulacao.prazo} (+{area.simulacao.tempoExtra})
            </p>
            {area.simulacao.dataAnterior && (
              <p className="sm mu" style={{ marginTop: 2 }}>
                Reagendada de {area.simulacao.dataAnterior} para{" "}
                {area.simulacao.prazo}
              </p>
            )}
          </div>
        ))}
      </div>

      <div
        className="row"
        style={{ marginTop: 16, justifyContent: "flex-end", gap: 10 }}
      >
        <button className="btn o" onClick={handleAck}>
          Fechar
        </button>
        <button className="btn" onClick={handleViewAlerts}>
          Ver áreas de alertas
        </button>
      </div>
    </>
  );
}

export default RainSimulationModal;
