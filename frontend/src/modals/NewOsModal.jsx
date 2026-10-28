import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUi } from "../context/useUi.js";
import Chip from "../components/Chip.jsx";
import Stepper from "../components/Stepper.jsx";
import {
  EQUIPMENT_OPTIONS,
  SECTOR_OPTIONS,
  SERVICE_TYPE_OPTIONS,
  addServiceOrder,
  buildServiceOrder,
  orderToForm,
  updateServiceOrder,
} from "../utils/serviceOrders.js";

const PRIORIDADES = [
  { key: "Alta", icon: "🔴" },
  { key: "Média", icon: "🟡" },
  { key: "Baixa", icon: "🟢" },
];

const NOVA_OS = {
  setor: "",
  tipoServico: "",
  data: "2026-10-12",
  prioridade: "Alta",
  operadores: 3,
  equipamentos: [],
  instrucoes: "",
};

function NewOsModal({ initialSetor = "", initialServico = "", os = null }) {
  const { closeModal, showToast, setServiceOrders } = useUi();
  const navigate = useNavigate();
  const isEdit = Boolean(os);

  const [form, setForm] = useState(() =>
    os
      ? orderToForm(os)
      : { ...NOVA_OS, setor: initialSetor, tipoServico: initialServico },
  );

  const setCampo = (campo, valor) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  // Mantém visível o valor atual da OS mesmo quando ele não está na lista de
  // opções, para que a edição não apague silenciosamente o dado.
  const setorOptions = [...new Set([...SECTOR_OPTIONS, form.setor])].filter(
    Boolean,
  );
  const tipoOptions = [
    ...new Set([...SERVICE_TYPE_OPTIONS, form.tipoServico]),
  ].filter(Boolean);

  const toggleEquipamento = (label) => {
    setForm((prev) => ({
      ...prev,
      equipamentos: prev.equipamentos.includes(label)
        ? prev.equipamentos.filter((item) => item !== label)
        : [...prev.equipamentos, label],
    }));
  };

  const handleConfirm = () => {
    if (os) {
      setServiceOrders((prev) => updateServiceOrder(prev, os.id, form));
      closeModal();
      showToast(`${os.id} atualizada`);
      return;
    }

    setServiceOrders((prev) =>
      addServiceOrder(
        prev,
        buildServiceOrder({
          ...form,
          serviceOrders: prev,
        }),
      ),
    );
    closeModal();
    navigate("/os");
    showToast("Ordem de serviço emitida");
  };

  return (
    <>
      <div className="hd" style={{ marginBottom: 12 }}>
        <div>
          <h2>{isEdit ? `Editar ${os.id}` : "Nova ordem de serviço"}</h2>
          {isEdit && (
            <span className="sm mu">
              {os.setor} · {os.servico}
            </span>
          )}
        </div>
        <button className="btn o" aria-label="Fechar" onClick={closeModal}>
          ✕
        </button>
      </div>
      <div className="fm">
        <label>
          Setor
          <select
            value={form.setor}
            onChange={(e) => setCampo("setor", e.target.value)}
          >
            <option value="">Selecione o setor</option>
            {setorOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Tipo de serviço
          <select
            value={form.tipoServico}
            onChange={(e) => setCampo("tipoServico", e.target.value)}
          >
            <option value="">Selecione o tipo</option>
            {tipoOptions.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Data prevista
          <input
            type="date"
            value={form.data}
            onChange={(e) => setCampo("data", e.target.value)}
          />
        </label>
        <div>
          <span style={{ fontWeight: 500 }}>Prioridade</span>
          <div className="row" style={{ marginTop: 4 }}>
            {PRIORIDADES.map((p) => (
              <Chip
                key={p.key}
                pressed={form.prioridade === p.key}
                onClick={() => setCampo("prioridade", p.key)}
              >
                {p.icon} {p.key}
              </Chip>
            ))}
          </div>
        </div>
        <Stepper
          label="Operadores"
          value={form.operadores}
          onChange={(valor) => setCampo("operadores", valor)}
        />
        <div>
          <span style={{ fontWeight: 500 }}>Equipamentos</span>
          <div className="row" style={{ marginTop: 4 }}>
            {EQUIPMENT_OPTIONS.map((option) => (
              <Chip
                key={option.label}
                pressed={form.equipamentos.includes(option.label)}
                onClick={() => toggleEquipamento(option.label)}
              >
                {option.label}
              </Chip>
            ))}
          </div>
        </div>
        <label>
          Instruções
          <textarea
            className="instructions"
            placeholder="Ex.: começar pela área da entrada principal"
            value={form.instrucoes}
            onChange={(e) => setCampo("instrucoes", e.target.value)}
          />
        </label>
        <button className="btn w" onClick={handleConfirm}>
          {isEdit ? "Salvar alterações" : "Confirmar e Emitir OS"}
        </button>
      </div>
    </>
  );
}

export default NewOsModal;
