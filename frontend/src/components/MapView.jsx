function MapView({ sectors, selectedId, onSelect }) {
  return (
    <svg
      viewBox="0 0 620 380"
      role="img"
      aria-label="Mapa dos setores"
      style={{ display: "block", width: "100%", height: "auto" }}
    >
      {Object.entries(sectors).map(([id, s]) => {
        const isSelected = id === selectedId;
        return (
          <g key={id}>
            <path
              className={`poly ${s.cor}${isSelected ? " sel" : ""}`}
              d={s.path}
              tabIndex="0"
              onClick={() => onSelect(id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSelect(id);
              }}
            />
            <text
              className="lbl"
              x={s.labelPos[0]}
              y={s.labelPos[1]}
              textAnchor="middle"
            >
              {s.nome}
            </text>
          </g>
        );
      })}
      <circle cx="520" cy="300" r="6" fill="var(--b)" />
      <text className="lbl" x="530" y="304">
        Estação Av. Palmeiras
      </text>
    </svg>
  );
}

export default MapView;