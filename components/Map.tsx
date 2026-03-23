"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LAYERS = {
  // GloFAS — 100-year flood hazard zones (static, global)
  floodHazard: {
    label: "Flood Hazard 100yr (GloFAS)",
    url: "/api/wms",
    params: {
      source: "floodHazard",
      SERVICE: "WMS",
      REQUEST: "GetMap",
      LAYERS: "FloodHazard100y",
      STYLES: "",
      FORMAT: "image/png",
      TRANSPARENT: "true",
      VERSION: "1.3.0",
    },
    opacity: 0.6,
    color: "#4fc3f7",
  },

  // NASA SEDAC — Low Elevation Coastal Zone
  lecz: {
    label: "Low Elevation Coastal Zone",
    url: "/api/wms",
    params: {
      source: "lecz",
      SERVICE: "WMS",
      REQUEST: "GetMap",
      LAYERS: "lecz:lecz-urban-rural-population-land-area-estimates-v3",
      STYLES: "",
      FORMAT: "image/png",
      TRANSPARENT: "true",
      VERSION: "1.1.1",
    },
    opacity: 0.45,
    color: "#ef9a9a",
  },

  // JRC Global Surface Water — no CORS issues, tile layer
  surfaceWater: {
    label: "Global Surface Water (JRC)",
    url: "https://storage.googleapis.com/global-surface-water/maptiles/occurrence/{z}/{x}/{y}.png",
    isTile: true,
    opacity: 0.5,
    color: "#80deea",
  },
} as const;

type LayerKey = keyof typeof LAYERS;

interface MapProps {
  activeLayers: LayerKey[];
}

export default function Map({ activeLayers }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRefs = useRef<Partial<Record<LayerKey, L.Layer>>>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [20, 0],
      zoom: 3,
      zoomControl: false,
    });

    L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 18,
      }
    ).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    (Object.keys(LAYERS) as LayerKey[]).forEach((key) => {
      const def = LAYERS[key];
      const isActive = activeLayers.includes(key);
      const existing = layerRefs.current[key];

      if (isActive && !existing) {
        let layer: L.Layer;

        if ("isTile" in def && def.isTile) {
          layer = L.tileLayer(def.url as string, { opacity: def.opacity });
        } else {
          const d = def as {
            url: string;
            params: Record<string, string>;
            opacity: number;
          };
          layer = L.tileLayer.wms(d.url, {
            ...d.params,
            opacity: d.opacity,
          } as L.WMSOptions);
        }

        layer.addTo(map);
        layerRefs.current[key] = layer;
      } else if (!isActive && existing) {
        map.removeLayer(existing);
        delete layerRefs.current[key];
      }
    });
  }, [activeLayers]);

  return <div ref={containerRef} className="w-full h-full" />;
}

export { LAYERS };
export type { LayerKey };