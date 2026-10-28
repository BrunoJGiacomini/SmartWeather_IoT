import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { resolveSectorStyle } from "../utils/sectorMapStyle.js";

export function useSectorMap({ sectors, selectedId, onSelect }) {
  const [hoveredId, setHoveredId] = useState(null);

  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const style = useCallback(
    (feature) => {
      const id = feature?.properties?.id;
      const sector = sectors[id];
      if (!sector) return {};

      return resolveSectorStyle({
        sector,
        isSelected: id === selectedId,
        isHovered: id === hoveredId,
      });
    },
    [sectors, selectedId, hoveredId],
  );

  const onEachFeature = useCallback((feature, layer) => {
    const id = feature?.properties?.id;

    layer.on("click", () => onSelectRef.current(id));
    layer.on("mouseover", () => setHoveredId(id));
    layer.on("mouseout", () =>
      setHoveredId((current) => (current === id ? null : current)),
    );
  }, []);

  const featureCollection = useMemo(
    () => ({
      type: "FeatureCollection",
      features: Object.values(sectors).map((sector) => sector.geojson),
    }),
    [sectors],
  );

  return { style, onEachFeature, featureCollection, hoveredId };
}
