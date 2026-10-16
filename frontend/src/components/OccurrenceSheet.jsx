import { useState } from "react";
import { useUi } from "../context/useUi.js";

const OPCOES = [
  { icon: "🛠️", label: "Equipamento quebrado" },
  { icon: "🌧️", label: "Chuva" },
  { icon: "👥", label: "Falta de pessoal" },
  { icon: "🚧", label: "Obstrução" },
];

function OccurrenceSheet({ open, onClose }) {
  const { showToast } = useUi();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const handleSend = () => {
    onClose();
    showToast("Relato enviado");
  };

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <div
        className={`sheet${open ? " on" : ""}`}
        role="dialog"
        aria-label="Reportar ocorrência"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>O que aconteceu?</h2>
          <button
            type="button"
            className="stp"
            style={{ padding: "4px 12px" }}
            aria-label="Fechar"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="grid g2" style={{ gap: 10 }}>
          {OPCOES.map((opt, idx) => (
            <button
              key={opt.label}
              type="button"
              className="rc"
              aria-pressed={selectedIdx === idx ? "true" : "false"}
              onClick={() => setSelectedIdx(idx)}
            >
              <div style={{ fontSize: 24 }}>{opt.icon}</div>
              {opt.label}
            </button>
          ))}
        </div>
        <div className="up" style={{ aspectRatio: "3/1" }}>
          📷 Adicionar foto
        </div>
        <button className="btn w" onClick={handleSend}>
          Enviar relato
        </button>
      </div>
      <div className="sbd" onClick={handleOverlay}></div>
    </>
  );
}

export default OccurrenceSheet;