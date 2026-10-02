# Iran Vector Maps

[![npm](https://img.shields.io/npm/v/iran-vector-maps?label=iran-vector-maps)](https://www.npmjs.com/package/iran-vector-maps) [![GitHub release](https://img.shields.io/github/v/release/Mobin-Karam/iran-vector-maps)](https://github.com/Mobin-Karam/iran-vector-maps/releases) [![License](https://img.shields.io/badge/license-MIT-0b6b3a)](LICENSE)

![Iran Vector Maps cover](docs/assets/iran-vector-maps-cover.png)

Fast, accessible, data-driven SVG maps for React, with a complete Iran province and county explorer. The project includes a reusable package, a bilingual demo website, and a reproducible pipeline for verified geographic assets.

## Live demo

After GitHub Pages is enabled, visit **https://mobin-karam.github.io/iran-vector-maps/**. The demo supports Persian RTL and English LTR, province-to-county drill-down, hover labels, search, JSON/CSV data overlays, custom colors, and SVG/PNG export.

## Install the React package

```bash
npm install iran-vector-maps
npm install iran-vector-maps-data # optional verified Iran asset helpers
```

```tsx
import { IranAdminSvgMap } from 'iran-vector-maps'
import 'iran-vector-maps/styles.css'

<IranAdminSvgMap
  data={provinces}
  values={{ 'IR-05': 12840 }}
  onRegionClick={(region) => openDetails(region.id)}
/>
```

The component is fully controlled: your application supplies GeoJSON-compatible boundaries, values, selected state, labels, colors, and click/hover handling. It uses no map tiles, remote APIs, router, GPS, iframe, or canvas.

## Install one province on demand

The data companion lets an application request only the province it is rendering. This keeps country-wide data out of the initial bundle while retaining stable administrative identifiers.

```ts
import { fetchIranProvinceAsset, iranProvinceAssets, type IranProvinceId } from 'iran-vector-maps-data/province'

const province: IranProvinceId = 'IR-05'
const urls = iranProvinceAssets(province)
const counties = await fetchIranProvinceAsset(province, 'counties.topo.json')
const cities = await fetchIranProvinceAsset(province, 'cities.json')
```

All 31 IDs are available through `iranProvinceIds`. Province city assets are point records with their source status; they are not city-boundary polygons.

## Load one county on demand

Counties are addressed by their stable IDs inside the verified province topology. The data package returns one GeoJSON feature, so an application can keep its own route and bundle scoped to that county without creating hundreds of unrelated npm packages.

```ts
import { fetchIranCountyFeature } from 'iran-vector-maps-data/province'

const kermanshah = await fetchIranCountyFeature('IR-05', 'IR-05-county-...')
```

In the demo, select a province or county and use **«کپی دستور استفاده»** to copy the exact, valid command for the selected region. The download menu exports the current full-Iran, province, or county SVG/PNG with the colors selected by the user.

## Run the demo locally

```bash
npm install
npm run maps:build
npm run dev
```

Run release checks with:

```bash
npm test
npm run lint
npm run build
npm run package:build
```

Static hosts need an SPA fallback to `index.html` for deep map URLs. The included GitHub Pages workflow builds the app with the correct repository base path and publishes `404.html` as that fallback, so shared province and county URLs continue to work after refresh.

## What is included

- Native, keyboard-accessible SVG rendering for `Polygon` and `MultiPolygon` geometry.
- 31 province maps and county layers loaded on demand from static TopoJSON, plus 1,481 city records with 1,154 sourced point markers.
- The `iran-vector-maps-data/province` entry point for installing the data companion once and loading any one province on demand.
- Stable region IDs, Persian/English names, tooltips, search, and province-to-county navigation.
- JSON and CSV metric import with validation, merge/replace behavior, local persistence, active-metric selection, color scales, value labels, legend, and unknown-ID reporting.
- Host-controlled theme, colors, selection, details, and SVG export; the demo also offers PNG export.
- A compact package suitable for dashboards, reporting, public services, research, health, education, logistics, sales territories, and any regional dataset.

## Data and boundaries

Raw source material is intentionally kept outside version control under `data-source/`. The deployable map assets live in `public/maps/iran/` and are rebuilt with `npm run maps:build`.

Sources, attribution, scope, and known limits are documented in [DATA_SOURCES.md](DATA_SOURCES.md). Province and county polygons are derived from OpenStreetMap-based datasets; hierarchy metadata is used to match regions conservatively. Do not infer or publish a boundary that has not been verified.

## Documentation

- [Package API and release notes](packages/iran-vector-maps/README.md)
- [Data-overlay import contract](docs/ADDING_DATA_OVERLAYS.md)
- [Customization guide](docs/CUSTOMIZING_THE_MAP.md)
- [AI and application integration](docs/AI_AGENT_INTEGRATION.md)
- [Map-data update workflow](docs/UPDATING_MAP_DATA.md)
- [Province-level asset loading](docs/PROVINCE_ASSETS.md)
- [Implemented and planned package features](docs/PACKAGE_FEATURES.md)
- [Reliability, coverage, and correction policy](docs/RELIABILITY.md)
- [Release and versioning policy](docs/RELEASE_POLICY.md)
- [Migration guide](docs/MIGRATION.md)
- [Contributor guide](CONTRIBUTING.md)
- [Runnable Vite, Next.js, and Remix examples](examples/README.md)
- [Use cases and metric-data contracts](docs/USE_CASES.md)

## License

The application and package source code are available under the [MIT License](LICENSE). Geographic data retains the licenses and attribution obligations stated in [DATA_SOURCES.md](DATA_SOURCES.md); those terms can be more restrictive than the source-code license.

## Releases

Every Git tag matching `v*` runs the release workflow. It validates the reusable package, creates the installable `iran-vector-maps-<version>.tgz` artifact, and attaches it to the corresponding GitHub Release. Install a release artifact directly when npm is not part of your delivery flow:

```bash
npm install https://github.com/Mobin-Karam/iran-vector-maps/releases/download/v0.5.0/iran-vector-maps-0.5.0.tgz
```
