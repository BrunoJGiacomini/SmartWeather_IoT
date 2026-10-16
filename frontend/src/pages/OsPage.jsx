import Pill from "../components/Pill.jsx";
import DataTable from "../components/DataTable.jsx";
import { useUi } from "../context/useUi.js";
import NewOsDrawer from "../drawers/NewOsDrawer.jsx";
import OsDetailsDrawer from "../drawers/OsDetailsDrawer.jsx";

const PRIORITY_ICON = { r: "🔴", y: "🟡", g: "🟢", b: "🔵" };

function buildRow(os, idx, onOpenDetails) {
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
    <button className="btn o" onClick={() => onOpenDetails(idx)}>
      Ver detalhes
    </button>,
  ];
}

function OsPage() {
  const { serviceOrders, openDrawer } = useUi();

  const handleNew = () => openDrawer(<NewOsDrawer />);
  const handleOpenDetails = (idx) => {
    openDrawer(<OsDetailsDrawer os={serviceOrders[idx]} />);
  };

  const rows = serviceOrders.map((os, idx) =>
    buildRow(os, idx, handleOpenDetails),
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