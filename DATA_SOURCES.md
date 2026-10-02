# Geographic data sources

This file records the provenance of geographic and administrative inputs. The MIT license in the repository applies to this project’s source code, not to upstream geographic data. When redistributing generated assets, retain the applicable upstream attribution and license obligations below.

The companion `iran-vector-maps-data` package exposes versioned URLs for these generated assets; it does not alter the upstream license obligations.

## OSM province boundaries

- **Name:** Iran GeoJSON province boundaries
- **URL:** https://github.com/ssepehrnoush/Iran-geojson-map-boundaries
- **License:** Open Database License 1.0 (attribution required: © OpenStreetMap contributors)
- **Administrative level:** 31 province polygons
- **Retrieval date:** 2026-10-01
- **Original format:** GeoJSON / WGS84
- **Processing:** IDs and normalised Persian names are added, then features are converted to TopoJSON.
- **Known limitations:** The upstream geometry is a Mapzen-era OSM extract and must be refreshed from OSM for boundary recency.

## OSM county boundaries

- **Name:** iran-geojson
- **URL:** https://github.com/hosseinhabibi2004/iran-geojson
- **License:** Open Database License 1.0 (see upstream LICENSE; © OpenStreetMap contributors)
- **Administrative level:** County polygons, split by province
- **Retrieval date:** 2026-10-01
- **Original format:** GeoJSON / WGS84
- **Processing:** Uses the upstream `.all.min.geojson` assets; geometry is validated by the build script, metadata is normalised, then output is one cached TopoJSON per province.
- **Known limitations:** OSM coverage and hierarchy tags vary. District, rural-district, city-boundary, and settlement geometry are intentionally not claimed as available.

## Administrative metadata

- **Name:** Iran Administrative Divisions
- **URL:** https://github.com/open-admin-data/iran-administrative-divisions
- **License:** CC-BY-4.0
- **Administrative level:** 31 provinces and 429 counties, Persian/English names and coordinates
- **Retrieval date:** 2026-10-01
- **Original format:** JSON
- **Processing:** Used only to supply stable internal county IDs and bilingual metadata where province/name matching succeeds.
- **Known limitations:** This source does not supply geometry. Names are matched conservatively after Persian normalisation; unmatched OSM counties retain stable source-derived IDs.

## Official administrative hierarchy metadata

- **Name:** list-of-cities-in-Iran, v3.1.2
- **URL:** https://github.com/sajaddp/list-of-cities-in-Iran
- **License:** GPL-3.0 (the distributed map-data output must retain GPL-compatible licensing and attribution)
- **Administrative level:** 31 provinces, 484 counties, 1,193 districts and 1,481 cities
- **Retrieval date:** 2026-10-01
- **Original format:** JSON generated from a stated official administrative-divisions source through year 1404
- **Processing:** Province/county parent IDs are used to create authoritative child counts and to match SVG county files to the correct province.
- **Known limitations:** It provides administrative metadata and relationships, not boundary polygons. City/district detail is displayed as metadata until independently verifiable geometry is added.


## City point layer (1404 hierarchy + open coordinates)

- **Canonical membership:** `sajaddp/list-of-cities-in-Iran`, `cities-filtered.json`
- **Canonical record count:** 1,481
- **License:** GPL-3.0 for the canonical administrative hierarchy.
- **Primary coordinates:** OpenStreetMap-derived settlement points from `HamidYaraliOfficial/Iran-National-Organization-Public-Facilities-Mapper`; OSM-derived geographic data remain subject to ODbL attribution requirements.
- **Secondary coordinates:** `dr5hn/countries-states-cities-database` (ODbL-1.0).
- **Fallback coordinates:** `arnpacc/iran-city-coordinates` (MIT), used only after geographic validation.
- **Curated overrides:** Recent promotions and spelling changes use record-level public/open references; every curated record stores its source URL in `cities.json`.
- **Build date:** 2026-10-02.
- **CRS:** WGS84 / EPSG:4326.
- **Processing:** Persian Unicode normalization, province-aware exact matching, duplicate-name disambiguation with official county centers, conservative aliases, promotion-aware matching and curated review.
- **Derived urban-zone records:** 22 hierarchy records are retained for fidelity but marked `recordKind: "derived-zone"` and `labelEnabled: false`.
- **Coordinate coverage:** 1,480/1,481 records have accepted coordinates. The remaining independent city is listed in `city-coordinate-review.json`.
- **Google Maps:** Google Maps was not used as a bulk dataset. Open and redistributable sources are used intentionally.

The repository's MIT license covers project code, not these upstream geographic databases. Keep source-specific attribution and license obligations when redistributing generated assets.
