"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { LayerKey } from "./Map";

// Critical: dynamic import with ssr:false to avoid Leaflet SSR crash
const Map = dynamic(() => import("./Map"), { ssr: false });

// Re-export LAYERS for use in the panel — fetched lazily
const LAYER_META: Record<LayerKey, { label: string; color: string }> = {
  floodExtent: { label: "Flood Extent (GloFAS)", color: "#4fc3f7" },
  lecz: { label: "Low Elevation Coastal Zone", color: "#ef9a9a" },
  surfaceWater: { label: "Surface Water (JRC)", color: "#80deea" },
};

export default function MapWrapper() {
  const [activeLayers, setActiveLayers] = useState<LayerKey[]>(["surfaceWater"]);

  const toggle = (key: LayerKey) => {
    setActiveLayers((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="relative w-full h-full">
      <Map activeLayers={activeLayers} />

      {/* Layer control panel */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
        <div className="panel-card">
          <p className="panel-label mb-2">Data Layers</p>
          {(Object.keys(LAYER_META) as LayerKey[]).map((key) => {
            const { label, color } = LAYER_META[key];
            const active = activeLayers.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggle(key)}
                className={`layer-btn ${active ? "layer-btn--active" : ""}`}
              >
                <span
                  className="layer-dot"
                  style={{ background: active ? color : "transparent", borderColor: color }}
                />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
