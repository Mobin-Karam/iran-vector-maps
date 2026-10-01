# Customizing the map

`GeoMap` is data-driven and can be reused with any GeoJSON/TopoJSON loader that returns the project's `MapCollection` type. It never requires hand-authored SVG paths.

```tsx
<GeoMap
  data={features}
  selectedId={selectedId}
  onSelect={setSelectedId}
  onOpen={openRegion}
  onHover={setHoveredRegion}
  ariaLabel="Regional coverage map"
  appearance={{
    regionFill: '#e0e7ff',
    regionHoverFill: '#a5b4fc',
    regionSelectedFill: '#4338ca',
    borderColor: '#ffffff',
    waterColor: '#075985',
    showWaterLabels: false,
  }}
/>
```

Use the loader layer to substitute a different country, topology storage location, or metadata source. Keep feature IDs stable, put display names in properties, and implement `onOpen` in the host app to decide how drill-down routes work.

For data visualizations, attach verified values to the metadata, derive an appearance from a deterministic scale, and preserve the selected stroke and keyboard/focus behavior. Do not encode unverified population or administrative claims.

## Scope and performance

The reusable package deliberately has no GPS, tile layer, browser viewport controls, or network calls. This makes the component predictable to embed, fast to render, and safe to use with host-managed privacy and permissions. If a product needs location tracking or a basemap, add it in the host application and pass only the selected geography or verified values to this renderer.
