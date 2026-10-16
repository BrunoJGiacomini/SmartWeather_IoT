import { useState } from "react";
import { useUi } from "../context/useUi.js";
import Chip from "../components/Chip.jsx";
import Stepper from "../components/Stepper.jsx";

const SETORES = [
  "Parque Central",
  "Praça das Flores",
  "Jardim Botânico",
  "Av. das Palmeiras",
];

const TIPOS_SERVICO = ["Roçagem", "Poda", "Limpeza", "Irrigação"];

const PRIORIDADES = [
  { key: "Alta", icon: "🔴" },
  { key: "Média", icon: "🟡" },
  { key: "Baixa", icon: "🟢" },
];

const EQUIPAMENTOS_OPCOES = [
  "Roçadeira FS 450 · Stihl",
  "Roçadeira FS 55 · Stihl",
  "Motosserra 372 XP · Husqvarna",
  "Soprador BR 600 · Stihl",
];

function NewOsDrawer({ initialSetor = "", initialServico = "" }) {
  const { closeDrawer, showToast } = useUi();
  const [setor, setSetor] = useState(initialSetor);
  const [tipoServico, setTipoServico] = useState(initialServico);
  const [prioridade, setPrioridade] = useState("Alta");
  const [operadores, setOperadores] = useState(3);
  const [equipamentos, setEquipamentos] = useState({});

  const toggleEquipamento = (label) => {
    setEquipamentos((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleConfirm = () => {
    closeDrawer();
    showToast("Ordem de serviço emitida");
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Nova ordem de serviço</h2>
        <button
          className="btn o"
          aria-label="Fechar"
          onClick={closeDrawer}
        >
          ✕
        </button>
      </div>
      <div className="fm">
        <label>
          Setor
          <select value={setor} onChange={(e) => setSetor(e.target.value)}>
            <option value="">Selecione o setor</option>
            {SETORES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Tipo de serviço
          <select
            value={tipoServico}
            onChange={(e) => setTipoServico(e.target.value)}
          >
            <option value="">Selecione o tipo</option>
            {TIPOS_SERVICO.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Data prevista
          <input type="date" defaultValue="2026-10-12" />
        </label>
        <div>
          <span style={{ fontWeight: 500 }}>Prioridade</span>
          <div className="row" style={{ marginTop: 4 }}>
            {PRIORIDADES.map((p) => (
              <Chip
                key={p.key}
                pressed={prioridade === p.key}
                onClick={() => setPrioridade(p.key)}
              >
                {p.icon} {p.key}
              </Chip>
            ))}
          </div>
        </div>
        <Stepper
          label="Operadores"
          value={operadores}
          onChange={setOperadores}
        />
        <div>
          <span style={{ fontWeight: 500 }}>Equipamentos</span>
          <div className="row" style={{ marginTop: 4 }}>
            {EQUIPAMENTOS_OPCOES.map((e) => (
              <Chip
                key={e}
                pressed={!!equipamentos[e]}
                onClick={() => toggleEquipamento(e)}
              >
                {e}
              </Chip>
            ))}
          </div>
        </div>
        <label>
          Instruções
          <textarea placeholder="Ex.: começar pela área da entrada principal" />
        </label>
        <button className="btn w" onClick={handleConfirm}>
          Confirmar e Emitir OS
        </button>
      </div>
    </>
  );
}

export default NewOsDrawer;