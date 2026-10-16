function Sparkline({ data, color = "var(--g)" }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map(
      (v, i) =>
        `${i * 14},${28 - ((v - min) / range) * 24}`,
    )
    .join(" ");
  const width = (data.length - 1) * 14;
  return (
    <svg
      width={width}
      height="30"
      aria-hidden="true"
      viewBox={`0 0 ${width} 30`}
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Sparkline;