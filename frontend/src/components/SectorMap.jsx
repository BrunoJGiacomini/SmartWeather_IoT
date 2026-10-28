import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GeoJSON,
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { useSectorMap } from "../hooks/useSectorMap.js";

const MAP_CENTER = [-23.083, -47.221];
const MAP_ZOOM = 14;

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event) => setReduced(event.matches);

    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

function ScrollWheelZoomToggle({ enabled }) {
  const map = useMap();

  useEffect(() => {
    if (enabled) {
      map.scrollWheelZoom.enable();
    } else {
      map.scrollWheelZoom.disable();
    }
  }, [map, enabled]);

  return null;
}

function MapResizer() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    const invalidate = () => {
      window.requestAnimationFrame(() => map.invalidateSize());
    };

    const observer = new ResizeObserver(invalidate);
    observer.observe(container);
    invalidate();

    return () => observer.disconnect();
  }, [map]);

  return null;
}

function MapActivation({ onActivate }) {
  const handlers = useMemo(
    () => ({ click: onActivate, focus: onActivate }),
    [onActivate],
  );

  useMapEvents(handlers);

  return null;
}

function SectorMap({ sectors, selectedId, onSelect }) {
  const { style, onEachFeature, featureCollection } = useSectorMap({
    sectors,
    selectedId,
    onSelect,
  });
  const [scrollWheelZoom, setScrollWheelZoom] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const activate = useCallback(() => setScrollWheelZoom(true), []);

  return (
    <div className="leaflet-map">
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        scrollWheelZoom={false}
        zoomAnimation={!reducedMotion}
        fadeAnimation={!reducedMotion}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        <GeoJSON
          key="setores-v1"
          data={featureCollection}
          style={style}
          onEachFeature={onEachFeature}
        />
        <ScrollWheelZoomToggle enabled={scrollWheelZoom} />
        <MapActivation onActivate={activate} />
        <MapResizer />
      </MapContainer>
    </div>
  );
}

export default SectorMap;
