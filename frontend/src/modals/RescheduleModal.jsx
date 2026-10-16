import { useUi } from "../context/useUi.js";

const REAGENDAR = [
  {
    titulo: "OS-1042 · Roçagem",
    setor: "Parque Central",
    data: "2026-10-14",
  },
  {
    titulo: "OS-1043 · Poda de árvores",
    setor: "Praça das Flores",
    data: "2026-10-16",
  },
];

function RescheduleModal() {
  const { closeModal, showToast } = useUi();

  const handleConfirm = () => {
    closeModal();
    showToast("2 ordens reagendadas");
  };

  return (
    <>
      <div className="hd" style={{ marginBottom: 12 }}>
        <div>
          <h2>Reagendar por chuva</h2>
          <span className="sm mu">
            Chuva intensa prevista amanhã. Escolha novas datas.
          </span>
        </div>
        <button className="btn o" aria-label="Fechar" onClick={closeModal}>
          ✕
        </button>
      </div>
      <div className="fm">
        {REAGENDAR.map((r) => (
          <div className="occ" key={r.titulo}>
            <b>{r.titulo}</b>
            <br />
            <span className="sm mu">{r.setor}</span>
            <label style={{ marginTop: 8 }}>
              Nova data
              <input type="date" defaultValue={r.data} />
            </label>
          </div>
        ))}
        <button className="btn w" onClick={handleConfirm}>
          Confirmar novas datas
        </button>
      </div>
    </>
  );
}

export default RescheduleModal;