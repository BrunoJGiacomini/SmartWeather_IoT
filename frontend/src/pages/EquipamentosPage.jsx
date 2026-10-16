import { useMemo, useState } from "react";
import Pill from "../components/Pill.jsx";
import DataTable from "../components/DataTable.jsx";
import { useUi } from "../context/useUi.js";
import NewEquipmentModal from "../modals/NewEquipmentModal.jsx";

const FILTERS = [
  { label: "Marca", options: ["Todas", "Stihl", "Husqvarna", "Davis"] },
  { label: "Tipo", options: ["Todos", "Máquina", "Ferramenta", "Estação IoT"] },
  { label: "Status", options: ["Todos", "Em uso", "Disponível", "Inoperante"] },
];

function statusToPillVariant(status) {
  if (status === "Inoperante" || status === "Offline") return "r";
  if (status === "Disponível") return "b";
  return "g";
}

function EquipamentosPage() {
  const { equipment, openModal } = useUi();
  const [marca, setMarca] = useState(FILTERS[0].options[0]);
  const [tipo, setTipo] = useState(FILTERS[1].options[0]);
  const [status, setStatus] = useState(FILTERS[2].options[0]);

  const filtered = useMemo(() => {
    return equipment.filter((e) => {
      if (marca !== "Todas" && e.marca !== marca) return false;
      if (tipo !== "Todos" && e.tipo !== tipo) return false;
      if (status !== "Todos" && e.status !== status) return false;
      return true;
    });
  }, [equipment, marca, tipo, status]);

  const rows = filtered.map((eq) => [
    <b>{eq.nome}</b>,
    eq.marca,
    eq.tipo,
    eq.localizacao,
    eq.horimetro,
    <Pill variant={statusToPillVariant(eq.status)}>{eq.status}</Pill>,
  ]);

  const handleNew = () => openModal(<NewEquipmentModal />);

  return (
    <>
      <div className="hd">
        <h1>Equipamentos e ativos</h1>
        <button className="btn" onClick={handleNew}>
          + Novo ativo
        </button>
      </div>
      <div className="flt">
        <label className="sm mu">
          Marca
          <select value={marca} onChange={(e) => setMarca(e.target.value)}>
            {FILTERS[0].options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className="sm mu">
          Tipo
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {FILTERS[1].options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className="sm mu">
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {FILTERS[2].options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
      </div>
      <DataTable
        columns={[
          "Ativo",
          "Marca",
          "Tipo",
          "Localização",
          "Horímetro / Sinal",
          "Status",
        ]}
        rows={rows}
      />
    </>
  );
}

export default EquipamentosPage;