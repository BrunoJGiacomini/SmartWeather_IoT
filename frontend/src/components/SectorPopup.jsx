import Pill from "./Pill.jsx";

function SectorPopup({ sector, onEmitOs }) {
  if (!sector) return null;
  return (
    <div className="pop on">
      <div>
        <h2>{sector.nome}</h2>
        <div style={{ margin: "8px 0" }}>
          <Pill variant={sector.cor}>{sector.statusPill}</Pill>
        </div>
        <span className="sm mu">{sector.metricas}</span>
      </div>
      <div className="occ">{sector.ocorrencia}</div>
      <button className="btn w" onClick={() => onEmitOs(sector.nome)}>
        + Emitir Ordem de Serviço
      </button>
    </div>
  );
}

export default SectorPopup;