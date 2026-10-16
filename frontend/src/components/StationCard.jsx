import Pill from "./Pill.jsx";
import Sparkline from "./Sparkline.jsx";

function StationCard({ station, onSimulate }) {
  const { nome, temperatura, status, sparkData, online } = station;
  const pillVariant = online ? "g" : "r";
  const icon = online ? "🟢" : "🔴";
  const sparkColor = online ? "var(--g)" : "var(--mu)";

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>{nome}</h2>
        <Pill variant={pillVariant}>
          {icon} {status}
        </Pill>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          margin: "16px 0",
        }}
      >
        <b style={{ fontSize: "26px" }}>{temperatura}</b>
        <Sparkline data={sparkData} color={sparkColor} />
      </div>
      <button
        className="btn o"
        disabled={!online}
        style={!online ? { opacity: 0.5 } : undefined}
        onClick={() => onSimulate && onSimulate(nome)}
      >
        Simular chuva
      </button>
    </div>
  );
}

export default StationCard;