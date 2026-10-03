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

## Readable routes and stable identifiers

The companion data catalog exposes a human-readable `slug` for public URLs and keeps `id`/`code` for joins, imports, and asset loading. URLs are for people; codes are for data. For example, the demo route is `/map/province/kermanshah`, while the matching stable province code remains `IR-05`.

```ts
import { fetchIranMapRegions, findIranMapRegion, iranMapRegionUrl } from 'iran-vector-maps-data'

const regions = await fetchIranMapRegions()
const kermanshah = findIranMapRegion(regions, 'kermanshah', 'province')
if (kermanshah) {
  console.log(kermanshah.code) // IR-05
  console.log(iranMapRegionUrl(kermanshah, regions)) // /map/province/kermanshah
}
```

## Publishing

Maintainers publish this package together with `iran-vector-maps` by pushing a matching `vX.Y.Z` tag. The repository release workflow uses npm trusted publishing, rather than a long-lived npm token; see the root [release policy](../../docs/RELEASE_POLICY.md).

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

## Load one county

County geometry remains verified and versioned with its province topology; this avoids publishing hundreds of tiny packages with duplicated metadata. Use the stable county ID from the map manifest to resolve only the feature your screen needs:

```ts
import { fetchIranCountyFeature } from 'iran-vector-maps-data/province'

const county = await fetchIranCountyFeature('IR-05', 'IR-05-county-...')
```

The interactive demo copies the precise province or county snippet for any selected region.

## Coverage

- Provinces: 31/31, polygon geometry.
- Counties: 478 current polygon features, loaded one province at a time.
- Cities: 1,481 named records; 1,154 sourced point markers across 31 province assets.
- Districts, rural districts, and settlements: metadata only; no geometry is claimed.
