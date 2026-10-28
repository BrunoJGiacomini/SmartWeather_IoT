import { useState } from "react";
import Stepper from "./Stepper.jsx";
import OccurrenceSheet from "./OccurrenceSheet.jsx";
import { useUi } from "../context/useUi.js";

function PhoneMockup() {
  const { showToast } = useUi();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [operadores, setOperadores] = useState(4);
  const [equipamentos, setEquipamentos] = useState(2);

  return (
    <div className="phone">
      <div className="card" style={{ padding: 16 }}>
        <span className="pill r">🔴 Alta · vence em 2d</span>
        <h2 style={{ marginTop: 8 }}>OS-1042 · Roçagem</h2>
        <span className="mu sm">Parque do Mirim · Entrada pela Av. Brasil</span>
      </div>
      <div className="grid g2" style={{ gap: 10 }}>
        <div className="up">
          📷
          <br />
          Foto antes
        </div>
        <div className="up">
          📷
          <br />
          Foto depois
        </div>
      </div>
      <label>
        Duração do serviço
        <input defaultValue="3 h 30 min" />
      </label>
      <Stepper label="Operadores" value={operadores} onChange={setOperadores} />
      <Stepper
        label="Equipamentos"
        value={equipamentos}
        onChange={setEquipamentos}
      />
      <button className="btn o w" onClick={() => setSheetOpen(true)}>
        Reportar ocorrência
      </button>
      <button className="btn w" onClick={() => showToast("Serviço finalizado")}>
        Finalizar serviço
      </button>
      <OccurrenceSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  );
}

export default PhoneMockup;
