import { useUi } from "../context/useUi.js";

function OsDetailsModal({ os }) {
  const { closeModal } = useUi();

  if (!os) return null;

  return (
    <>
      <div
        className="hd"
        style={{ marginBottom: 12, alignItems: "flex-start" }}
      >
        <div>
          <h2>
            {os.id} · {os.servico}
          </h2>
          <span className="mu">{os.setor}</span>
        </div>
        <button className="btn o" aria-label="Fechar" onClick={closeModal}>
          ✕
        </button>
      </div>
      <div className="grid g2" style={{ gap: 10 }}>
        <div className="ph">Foto antes</div>
        <div className="ph">Foto depois</div>
      </div>
      <div style={{ marginTop: 18 }}>
        <h2>Recursos utilizados</h2>
        <p className="mu">{os.recursos}</p>
      </div>
      <div style={{ marginTop: 18 }}>
        <h2>Histórico de ocorrências</h2>
        <div className="occ" style={{ marginTop: 8 }}>
          ⚠️ Roçadeira #102 inoperante · 09/10
        </div>
        <div className="occ" style={{ marginTop: 8 }}>
          Chuva interrompeu o serviço por 1 h · 07/10
        </div>
      </div>
    </>
  );
}

export default OsDetailsModal;
