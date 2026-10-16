function KpiCard({ label, value, sublabel }) {
  return (
    <div className="card kpi">
      <span className="mu">{label}</span>
      <b>{value}</b>
      <span className="sm mu">{sublabel}</span>
    </div>
  );
}

export default KpiCard;