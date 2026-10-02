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

## Coverage

- Provinces: 31/31, polygon geometry.
- Counties: 466 in the current verified dataset, loaded one province at a time.
- Districts, cities, rural districts, and settlements: metadata only; no geometry is claimed.
