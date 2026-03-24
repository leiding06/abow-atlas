"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BASEMAPS, LAYERS } from "./MapConfig";
import type { BasemapKey, LayerKey } from "./MapConfig";

interface MapProps {
  basemap: BasemapKey;
  activeLayers: LayerKey[];
}

export default function Map({ basemap, activeLayers }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const basemapRef = useRef<L.TileLayer | null>(null);
  const layerRefs = useRef<Partial<Record<LayerKey, L.Layer>>>({});
  const basemapKeyRef = useRef<BasemapKey>(basemap);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [20, 0],
      zoom: 3,
      zoomControl: false,
    });

    const bm = BASEMAPS[basemapKeyRef.current];
    basemapRef.current = L.tileLayer(bm.url, {
      attribution: bm.attribution,
      subdomains: bm.subdomains,
      maxZoom: bm.maxZoom,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      basemapRef.current = null;
    };
  }, []);

  // Swap basemap
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const bm = BASEMAPS[basemap];
    if (!bm) return;
    if (basemapRef.current) map.removeLayer(basemapRef.current);
    basemapRef.current = L.tileLayer(bm.url, {
      attribution: bm.attribution,
      subdomains: bm.subdomains,
      maxZoom: bm.maxZoom,
    });
    basemapRef.current.setZIndex(0);
    basemapRef.current.addTo(map);
    basemapKeyRef.current = basemap;
  }, [basemap]);

  // Sync data layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    (Object.keys(LAYERS) as LayerKey[]).forEach((key) => {
      const def = LAYERS[key];
      const isActive = activeLayers.includes(key);
      const existing = layerRefs.current[key];

      if (isActive && !existing) {
        const layer = L.tileLayer(def.url, { opacity: def.opacity });
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