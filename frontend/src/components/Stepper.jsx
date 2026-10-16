function Stepper({ label, value, onChange, min = 0, step = 1 }) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(value + step);

  return (
    <div className="stp">
      <span>{label}</span>
      <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button type="button" aria-label="Diminuir" onClick={dec}>
          −
        </button>
        <b>{value}</b>
        <button type="button" aria-label="Aumentar" onClick={inc}>
          +
        </button>
      </span>
    </div>
  );
}

export default Stepper;