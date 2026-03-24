"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { BASEMAPS, LAYERS } from "./MapConfig";
import type { BasemapKey, LayerKey } from "./MapConfig";

// Only Map.tsx has Leaflet — safe to dynamic import
const Map = dynamic(() => import("./Map"), { ssr: false });

export default function MapWrapper() {
  const [basemap, setBasemap] = useState<BasemapKey>("light");
  const [activeLayers, setActiveLayers] = useState<LayerKey[]>([]);

  const toggleLayer = (key: LayerKey) => {
    setActiveLayers((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="relative w-full h-full">
      <Map basemap={basemap} activeLayers={activeLayers} />

      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">

        <div className="panel-card">
          <p className="panel-label mb-2">Base Map</p>
          {(Object.keys(BASEMAPS) as BasemapKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setBasemap(key)}
              className={`layer-btn ${basemap === key ? "layer-btn--active" : ""}`}
            >
              <span
                className="layer-dot"
                style={{
                  background: basemap === key ? "var(--sand)" : "transparent",
                  borderColor: "var(--sand)",
                }}
              />
              {BASEMAPS[key].label}
            </button>
          ))}
        </div>

        <div className="panel-card">
          <p className="panel-label mb-2">Data Layers</p>
          {(Object.keys(LAYERS) as LayerKey[]).map((key) => {
            const active = activeLayers.includes(key);
            const color = LAYERS[key].color;
            return (
              <button
                key={key}
                onClick={() => toggleLayer(key)}
                className={`layer-btn ${active ? "layer-btn--active" : ""}`}
              >
                <span
                  className="layer-dot"
                  style={{
                    background: active ? color : "transparent",
                    borderColor: color,
                  }}
                />
                {LAYERS[key].label}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}