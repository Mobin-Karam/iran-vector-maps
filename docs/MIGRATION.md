# Migration guide

## 0.2.x to 0.3.x

Existing `IranAdminSvgMap` integrations remain compatible. Version 0.3 adds optional capabilities only:

```tsx
import { createMapColorScale, mapValuesFromRecords } from 'iran-vector-maps'

const values = mapValuesFromRecords(query.data ?? [])
const scale = createMapColorScale(Object.values(values), {
  classification: 'quantile',
  colors: ['#dbeafe', '#60a5fa', '#1d4ed8'],
})
```

Pass `colorScale` for built-in classification, `labelMinArea` to suppress unreadable labels, and `markers` for facilities or event locations. The renderer remains independent from React Query, SWR, routers, tiles, GPS, and remote map providers.

## Separating Iran data

If an application previously copied project assets directly, add the optional data helper:

```bash
npm install iran-vector-maps-data
```

Use `fetchIranMapAsset('provinces.topo.json')` or a province county URL, then convert the returned TopoJSON in your application. Keep attribution from `DATA_SOURCES.md` with redistributed map output.
