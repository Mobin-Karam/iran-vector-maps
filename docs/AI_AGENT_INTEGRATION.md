# AI and application integration

This project provides the reusable `iran-vector-maps` React package at `packages/iran-vector-maps`. It renders only the geometry and values supplied by its host app. That boundary is intentional: the host owns permissions, provenance, caching, analytics, and any sensitive data. The package makes no network requests and has no GPS or router dependency.

## Safe data contract

Pass a GeoJSON-compatible `FeatureCollection` whose `properties` include a stable `id` and a Persian name. Use stable IDs such as `IR-05`, not display names, for metric keys.

```json
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "properties": { "id": "IR-05", "nameFa": "کرمانشاه", "nameEn": "Kermanshah", "level": "province" },
    "geometry": { "type": "Polygon", "coordinates": [[[46.1, 34.1], [46.2, 34.1], [46.2, 34.2], [46.1, 34.1]]] }
  }]
}
```

Provide values separately:

```ts
const values = { 'IR-05': 12840 }
```

## Instructions for AI agents

1. Read the project manifest or a verified GeoJSON source before assigning values.
2. Match by `properties.id`; normalize a user-supplied name only to find a candidate and ask for confirmation when it is ambiguous.
3. Reject or report records with unknown region IDs. Do not silently attach them to a nearby province.
4. Keep the metric unit, source date, provenance, and missing-value semantics outside the color value. For example, show `null` as “no data”, not zero.
5. Use `onRegionClick` to let the host navigate or load a lower administrative layer. The package does not assume a router.
6. Do not send personal or location data to the map component; it is purely a local renderer.

## Example: controlled selection and custom color scale

```tsx
<IranAdminSvgMap
  data={counties}
  values={serviceCoverage}
  selectedId={selectedCountyId}
  onRegionClick={(region) => setSelectedCountyId(region.id)}
  getFill={(_region, value, maximum) => {
    if (value === undefined) return '#e5e7eb'
    return value / maximum > 0.8 ? '#166534' : '#86efac'
  }}
/>
```

## Validate before display

Check that every feature has a unique ID, valid polygon geometry, and a known parent. Check imported metric IDs against the loaded layer. The demo application includes a JSON sample and a data workspace, while the package remains backend-agnostic and safe to embed in any React application.
