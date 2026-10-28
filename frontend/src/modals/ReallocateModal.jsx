import { useState } from "react";
import { useUi } from "../context/useUi.js";

const OPCOES = [
  "Roçadeira FS 55 · Stihl · 640 h",
  "Motosserra 372 XP · Husqvarna · 860 h",
  "Soprador BR 600 · Stihl · 410 h",
];

function ReallocateModal() {
  const { closeModal, showToast } = useUi();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const handleConfirm = () => {
    closeModal();
    showToast("Equipamento realocado para Parque das Frutas");
  };

  return (
    <>
      <div className="hd" style={{ marginBottom: 12 }}>
        <div>
          <h2>Substituir Roçadeira #102</h2>
          <span className="sm mu">Disponíveis no Depósito Central</span>
        </div>
        <button className="btn o" aria-label="Fechar" onClick={closeModal}>
          ✕
        </button>
      </div>
      <div className="fm">
        <div className="grid" style={{ gap: 8 }}>
          {OPCOES.map((opt, idx) => (
            <button
              key={opt}
              type="button"
              className="chip"
              style={{
                borderRadius: 10,
                textAlign: "left",
                padding: 12,
              }}
              aria-pressed={selectedIdx === idx ? "true" : "false"}
              onClick={() => setSelectedIdx(idx)}
            >
              {opt}
            </button>
          ))}
        </div>
        <button className="btn w" onClick={handleConfirm}>
          Confirmar substituição
        </button>
      </div>
    </>
  );
}

export default ReallocateModal;
