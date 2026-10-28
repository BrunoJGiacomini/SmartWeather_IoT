import Pill from "./Pill.jsx";
import Sparkline from "./Sparkline.jsx";

function StationCard({ station, onSimulate, simulated = false }) {
  const { nome, temperatura, status, sparkData, online } = station;
  const pillVariant = online ? "g" : "r";
  const icon = online ? "🟢" : "🔴";
  const sparkColor = online ? "var(--g)" : "var(--mu)";

  // The rain can be simulated only once per area: the button is disabled for
  // an offline station (pre-existing rule) and for an already simulated one.
  const disabled = !online || simulated;
  const disabledTitle = !online
    ? "Estação offline"
    : "Chuva já simulada para esta área";

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
        disabled={disabled}
        title={disabled ? disabledTitle : undefined}
        style={disabled ? { opacity: 0.5 } : undefined}
        onClick={() => onSimulate && onSimulate(station)}
      >
        Simular chuva
      </button>
    </div>
  );
}

export default StationCard;
