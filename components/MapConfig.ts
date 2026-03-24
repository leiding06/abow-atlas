// ── Basemaps ──────────────────────────────────────────────────
export const BASEMAPS = {
    light: {
        label: "Light",
        url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
    },
    dark: {
        label: "Dark",
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
    },
    satellite: {
        label: "Satellite",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
        subdomains: "abc",
        maxZoom: 19,
    },
    ocean: {
        label: "Ocean",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
        subdomains: "abc",
        maxZoom: 13,
    },
    street: {
        label: "Street",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
        subdomains: "abc",
        maxZoom: 19,
    },
} as const;

export type BasemapKey = keyof typeof BASEMAPS;

// ── Data Layers ───────────────────────────────────────────────
export const LAYERS = {
    surfaceWater: {
        label: "Global Surface Water",
        url: "https://storage.googleapis.com/global-surface-water/maptiles/occurrence/{z}/{x}/{y}.png",
        opacity: 0.5,
        color: "#80deea",
    },
} as const;

export type LayerKey = keyof typeof LAYERS;