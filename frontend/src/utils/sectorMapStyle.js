export const SECTOR_COLORS = {
  r: "#e5484d",
  y: "#e9a100",
  g: "#10b981",
  b: "#2f7de1",
};

const FILL_OPACITY = {
  normal: 0.18,
  hovered: 0.38,
  selected: 0.5,
};

const WEIGHT = {
  normal: 2,
  hovered: 2,
  selected: 3,
};

export function resolveSectorStyle({
  sector,
  isSelected = false,
  isHovered = false,
} = {}) {
  const color = SECTOR_COLORS[sector?.cor] ?? SECTOR_COLORS.g;
  const state = isSelected ? "selected" : isHovered ? "hovered" : "normal";

  return {
    fillColor: color,
    color,
    fillOpacity: FILL_OPACITY[state],
    weight: WEIGHT[state],
  };
}
