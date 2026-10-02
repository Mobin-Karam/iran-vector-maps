# iran-vector-maps-data

Versioned static-asset helpers for the Iran layers used by `iran-vector-maps`. It intentionally keeps the generic renderer separate from Iran-specific boundaries and administrative metadata.

```bash
npm install iran-vector-maps iran-vector-maps-data
```

```ts
import { fetchIranMapAsset, iranMapDataset } from 'iran-vector-maps-data'

const provincesTopology = await fetchIranMapAsset('provinces.topo.json')
console.log(iranMapDataset.provinces) // 31
```

The assets are served from the project’s GitHub Pages deployment. Pin a package version when reproducibility matters and retain attribution from the repository’s `DATA_SOURCES.md`.

## Load exactly one province

The data companion exposes every province individually, so an application downloads only the county geometry and city points it needs. It does not invent or bundle lower-level boundaries.

```ts
import { fetchIranProvinceAsset, iranProvinceAssets, type IranProvinceId } from 'iran-vector-maps-data/province'

const provinceId: IranProvinceId = 'IR-05' // Kermanshah
const { counties, cities } = iranProvinceAssets(provinceId)
const countyTopology = await fetchIranProvinceAsset(provinceId, 'counties.topo.json')
const cityPoints = await fetchIranProvinceAsset(provinceId, 'cities.json')
```

`iranProvinceIds` lists all 31 installable province IDs. Each individual city asset retains city name, county relationship, coordinate status, and coordinate sources. Use city points as reference markers, never as city-boundary geometry.

## Coverage

- Provinces: 31/31, polygon geometry.
- Counties: 466 in the current verified dataset, loaded one province at a time.
- Cities: 1,481 named records; 1,154 sourced point markers across 31 province assets.
- Districts, rural districts, and settlements: metadata only; no geometry is claimed.
