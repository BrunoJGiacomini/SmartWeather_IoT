function Stepper({ label, value, onChange, min = 0, step = 1 }) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(value + step);

  return (
    <div className="stp">
      <span>{label}</span>
      <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div className="increase" aria-label="Diminuir" onClick={dec}>
          −
        </div>
        <b>{value}</b>
        <div className="decrease" aria-label="Aumentar" onClick={inc}>
          +
        </div>
      </span>
    </div>
  );
}

export default Stepper;
