import { useUi } from "../context/useUi.js";

function OsDetailsDrawer({ os }) {
  const { closeDrawer } = useUi();

  if (!os) return null;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h2>
            {os.id} · {os.servico}
          </h2>
          <span className="mu">{os.setor}</span>
        </div>
        <button className="btn o" aria-label="Fechar" onClick={closeDrawer}>
          ✕
        </button>
      </div>
      <div className="grid g2" style={{ gap: 10 }}>
        <div>
          <div className="ph">Foto antes</div>
        </div>
        <div>
          <div className="ph">Foto depois</div>
        </div>
      </div>
      <div>
        <h2>Recursos utilizados</h2>
        <p className="mu">{os.recursos}</p>
      </div>
      <div>
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

export default OsDetailsDrawer;