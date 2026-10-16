import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useUi } from "../context/useUi.js";

const TIPOS = ["Máquina / Ferramenta", "Estação IoT"];

const PROPRIEDADES = ["Próprio (Prefeitura)", "Terceirizado (Corpus)"];

const LOCALIZACOES = [
  "Depósito Central",
  "Setor Parque Central",
  "Setor Praça das Flores",
  "Setor Jardim Botânico",
  "Setor Av. das Palmeiras",
];

function NewEquipmentModal() {
  const { closeModal, showToast, setEquipment } = useUi();
  const location = useLocation();
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState(TIPOS[0]);
  const [marca, setMarca] = useState("");
  const [propriedade, setPropriedade] = useState(PROPRIEDADES[0]);
  const [serie, setSerie] = useState("");
  const [localizacao, setLocalizacao] = useState(LOCALIZACOES[0]);

  const handleSave = () => {
    const novo = {
      nome: nome.trim() || "Novo ativo",
      marca: (marca.trim().split(" ")[0]) || "—",
      tipo: "Máquina",
      localizacao: "Depósito Central",
      horimetro: "0 h",
      status: "Disponível",
    };
    if (location.pathname === "/equipamentos") {
      setEquipment((prev) => [novo, ...prev]);
    }
    closeModal();
    showToast("Ativo salvo");
  };

  return (
    <>
      <div className="hd" style={{ marginBottom: 12 }}>
        <h2>Novo ativo</h2>
        <button className="btn o" aria-label="Fechar" onClick={closeModal}>
          ✕
        </button>
      </div>
      <div className="fm">
        <label>
          Nome do ativo
          <input
            placeholder="Ex.: Roçadeira FS 450"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </label>
        <div>
          <span style={{ fontWeight: 500 }}>Tipo</span>
          <div className="seg" style={{ marginTop: 4 }}>
            {TIPOS.map((t) => (
              <button
                key={t}
                type="button"
                className="chip"
                aria-pressed={tipo === t ? "true" : "false"}
                onClick={() => setTipo(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <label>
          Marca / modelo
          <input
            placeholder="Ex.: Stihl FS 450"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
          />
        </label>
        <label>
          Propriedade
          <select
            value={propriedade}
            onChange={(e) => setPropriedade(e.target.value)}
          >
            {PROPRIEDADES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <div>
          {propriedade === "Próprio (Prefeitura)" ? (
            <label>
              Nº de patrimônio
              <input id="eqp" placeholder="Ex.: 004512" />
            </label>
          ) : (
            <label>
              ID de frota / contrato
              <input id="eqp" placeholder="Ex.: CORP-2026-018" />
            </label>
          )}
        </div>
        <label>
          Número de série
          <input
            placeholder="Ex.: 98234710"
            value={serie}
            onChange={(e) => setSerie(e.target.value)}
          />
        </label>
        <label>
          Localização inicial
          <select
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
          >
            {LOCALIZACOES.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </label>
        <button className="btn w" onClick={handleSave}>
          Salvar ativo
        </button>
      </div>
    </>
  );
}

export default NewEquipmentModal;