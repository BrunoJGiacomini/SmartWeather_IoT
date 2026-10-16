import KpiCard from "../components/KpiCard.jsx";
import StationCard from "../components/StationCard.jsx";
import { useUi } from "../context/useUi.js";
import { STATIONS } from "../mocks/stations.js";

const KPIS = [
  { label: "Temperatura média", value: "24,5 °C", sublabel: "↑ 1,2° vs. ontem" },
  { label: "Umidade relativa", value: "68%", sublabel: "Estável" },
  { label: "Chuva acumulada", value: "12,4 mm", sublabel: "Últimas 24 h" },
  { label: "Vento", value: "14 km/h", sublabel: "Rajadas de 22 km/h" },
];

function ClimaPage() {
  const { showToast } = useUi();

  const handleSimulateAll = () => {
    showToast("Chuva simulada em todas as estações");
  };

  const handleSimulateStation = (nome) => {
    showToast(`Chuva simulada: ${nome}`);
  };

  return (
    <>
      <div className="hd">
        <div>
          <h1>Clima</h1>
          <span className="mu">Atualizado há 1 minuto · 4 estações</span>
        </div>
        <button className="btn o" onClick={handleSimulateAll}>
          Simular chuva
        </button>
      </div>
      <div className="grid g4" style={{ marginBottom: 16 }}>
        {KPIS.map((k) => (
          <KpiCard
            key={k.label}
            label={k.label}
            value={k.value}
            sublabel={k.sublabel}
          />
        ))}
      </div>
      <div className="grid g2">
        {STATIONS.map((s) => (
          <StationCard
            key={s.nome}
            station={s}
            onSimulate={handleSimulateStation}
          />
        ))}
      </div>
    </>
  );
}

export default ClimaPage;