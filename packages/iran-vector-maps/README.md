# iran-vector-maps

![Iran Vector Maps cover](https://raw.githubusercontent.com/Mobin-Karam/iran-vector-maps/main/docs/assets/iran-vector-maps-cover.png)

An accessible, native-SVG administrative map component for React. It accepts your own GeoJSON-compatible boundaries and metric values, so it can be used for births, population, sales territories, service coverage, elections, or AI-generated analyses without a map provider, iframe, canvas, or API key.

See the interactive Persian/English demo and integration guides at https://mobin-karam.github.io/iran-vector-maps/.

## Install

Install the renderer and, when you need the maintained Iran layer URLs, the optional data companion:

```bash
npm install iran-vector-maps
npm install iran-vector-maps-data # optional Iran geographic assets
```

## Basic use

```tsx
import { IranAdminSvgMap, IranMapLegend, parseMapValuesCsv, validateMapFeatureCollection } from 'iran-vector-maps'
import 'iran-vector-maps/styles.css'
import provinces from './iran-provinces.geo.json'

const births = { 'IR-05': 12840, 'IR-07': 43990 }

export function BirthMap() {
  const validation = validateMapFeatureCollection(provinces)
  if (!validation.valid) return <pre>{JSON.stringify(validation.issues)}</pre>
  return <IranAdminSvgMap
    data={provinces}
    values={births}
    selectedId="IR-05"
    onRegionClick={(province) => console.log(province.id, province.nameFa)}
    onRegionHover={(province) => console.log(province?.nameFa)}
  />
}
```

## CSV and tooltip helpers

`parseMapValuesCsv` accepts `regionId,value` columns, including Persian/Arabic digits and thousands separators. Use `findUnknownRegionIds` before merging imported values into a layer. `IranMapTooltip` is an optional presentational component; receive pointer coordinates through the second argument of `onRegionHover` and render it in your app shell.

Each feature must have `properties.id` and `properties.nameFa`. `nameEn`, `level`, `parentId`, and any additional metadata are preserved and returned by callbacks.

## Query-library adapter

`mapValuesFromRecords` accepts immutable output from React Query, SWR, Remix loaders, or your own cache—without making this package depend on any of them.

```ts
const values = mapValuesFromRecords(query.data ?? [])
// query.data: readonly { regionId: string; value: number }[]
```

## Features

- Native, responsive SVG generated from your polygons or multipolygons.
- Keyboard selection with Enter and Space, visible focus state, and aria labels.
- Controlled selection, hover callback, per-region values, Persian number formatting, and default choropleth colors.
- Continuous, threshold, and equal-interval scales with custom palettes and explicit break values.
- Quantile classification, optional small-region label suppression, and marker/annotation points for facilities or events.
- `labelMinArea` to hide values where the available polygon space is too small.
- `IranMapLegend` for metric explanation, and configurable no-data / color-scale hues.
- CSV metric parsing with Persian/Arabic digit support and unknown-region detection.
- Optional pointer-positioned `IranMapTooltip` for host-controlled hover UI.
- `validateMapFeatureCollection` for agent and import validation, including duplicate IDs and invalid geometry.
- `serializeMapSvg` and `downloadMapSvg` for host-controlled SVG export.
- Custom `getFill`, `valueFormatter`, padding, styles, dimensions, CSS classes, empty state, and accessibility label.
- No GPS, no tile dependency, and no viewport controls; this keeps embeds fast and predictable.

## AI agent instructions

An agent can use the component safely by supplying verified GeoJSON and a value map. It should never invent an administrative boundary or use a display name as the identifier. The repository’s `docs/AI_AGENT_INTEGRATION.md` defines the required JSON contract and validation workflow.

## Build and package

```bash
npm run build
npm pack
```

`npm pack` creates the same tarball users install. Review its file list before publishing.

To release publicly, run `npm publish --access public` from this directory. Publishing is intentionally not performed by this repository.

## Examples and framework support

Copy-paste examples for Vite, Next.js App Router, Remix, JSON/CSV data imports, RTL, and dashboard maps live in the repository’s [`examples/`](../../examples) directory. The component is SSR-safe to import: it accesses browser APIs only when rendering or exporting SVG in the browser.

## License and data

Package source code is MIT licensed. The package does not bundle Iran boundaries: applications provide their own GeoJSON-compatible data. If you use the companion demo data, follow the provenance and attribution notes in the repository’s `DATA_SOURCES.md`.
