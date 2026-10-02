# Province assets

`iran-vector-maps-data` keeps geographic data separate from the generic React renderer. Install the package once, then request exactly the province your view needs.

```bash
npm install iran-vector-maps iran-vector-maps-data
```

```ts
import {
  fetchIranProvinceAsset,
  iranProvinceAssets,
  iranProvinceIds,
  type IranProvinceId,
} from 'iran-vector-maps-data/province'

const provinceId: IranProvinceId = 'IR-05'
const urls = iranProvinceAssets(provinceId)

const countiesTopology = await fetchIranProvinceAsset(provinceId, 'counties.topo.json')
const cityLocations = await fetchIranProvinceAsset(provinceId, 'cities.json')
```

`iranProvinceIds` contains all 31 province identifiers. The companion returns static, versioned project URLs for county topology and city locations. Cache fetched files according to your deployment policy.

## Data semantics

- `counties.topo.json` supplies county `Polygon` or `MultiPolygon` geometry.
- `cities.json` contains city names, county parents, coordinate sources, and coordinate status.
- A city record is a reference point only. Do not draw it as an administrative boundary.
- A record with `coordinateStatus: "unresolved"` should not be placed on a map.

See [DATA_SOURCES.md](../DATA_SOURCES.md) and [RELIABILITY.md](RELIABILITY.md) for attribution and coverage limits.

## One county feature

Use `fetchIranCountyFeature` when the host needs a standalone GeoJSON feature. It downloads the containing verified province topology, selects the requested county by its stable ID, and returns that feature. This is deliberately a logical per-county install API, rather than hundreds of npm packages with duplicated package metadata and release overhead.

```ts
import { fetchIranCountyFeature } from 'iran-vector-maps-data/province'

const county = await fetchIranCountyFeature('IR-05', 'IR-05-county-...')
```

The map details panel provides this exact code for any selected province or county through **«کپی دستور استفاده»**.
