import Pill from "../components/Pill.jsx";
import DataTable from "../components/DataTable.jsx";
import { useUi } from "../context/useUi.js";
import NewOsModal from "../modals/NewOsModal.jsx";
import OsDetailsModal from "../modals/OsDetailsModal.jsx";

const PRIORITY_ICON = { r: "🔴", y: "🟡", g: "🟢", b: "🔵" };

function EditIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function buildRow(os, idx, onOpenDetails, onEdit) {
  return [
    <>
      <b>{os.id}</b>
      <br />
      <span className="sm mu">{os.setor}</span>
    </>,
    os.servico,
    <Pill>{os.status}</Pill>,
    os.recursos,
    <Pill variant={os.cor}>
      {PRIORITY_ICON[os.cor]} {os.prioridade}
    </Pill>,
    os.data,
    <div className="actions">
      <button
        type="button"
        className="btn o ic"
        aria-label={`Editar ${os.id}`}
        title="Editar OS"
        onClick={() => onEdit(idx)}
      >
        <EditIcon />
      </button>
      <button
        type="button"
        className="btn o"
        onClick={() => onOpenDetails(idx)}
      >
        Ver detalhes
      </button>
    </div>,
  ];
}

function OsPage() {
  const { serviceOrders, openModal } = useUi();

  const handleNew = () => openModal(<NewOsModal />);
  const handleOpenDetails = (idx) => {
    openModal(<OsDetailsModal os={serviceOrders[idx]} />);
  };
  const handleEdit = (idx) => {
    const os = serviceOrders[idx];
    if (!os) return;
    openModal(<NewOsModal key={`editar-${os.id}`} os={os} />);
  };

  const rows = serviceOrders.map((os, idx) =>
    buildRow(os, idx, handleOpenDetails, handleEdit),
  );

  return (
    <>
      <div className="hd">
        <h1>Ordens de serviço</h1>
        <button className="btn" onClick={handleNew}>
          + Nova ordem
        </button>
      </div>
      <DataTable
        columns={[
          "ID / Setor",
          "Serviço",
          "Status",
          "Recursos alocados",
          "Prioridade",
          "Agendada",
          "",
        ]}
        rows={rows}
      />
    </>
  );
}

export default OsPage;
