# Iran city point dataset

The project ships a city point layer at `public/maps/iran/cities.json`. It is designed for SVG labels, search, tooltips and point overlays without claiming city boundary polygons.

## Coverage

- Official 1404 hierarchy records: **1481**
- Geolocated records: **1480**
- SVG-label-enabled city records: **1458**
- Province-capital labels on the Iran-wide map: **31**
- Derived urban-zone records retained but not labelled: **22**
- Independent cities still needing coordinate review: **1**

The unresolved queue is committed as `public/maps/iran/city-coordinate-review.json`.

## SVG behaviour

The map projects WGS84 city coordinates through the same D3 projection as the SVG boundaries. Iran view shows province-capital labels; province view shows all label-enabled cities in that province. The **نام شهرها** control toggles the SVG label group.

## Matching policy

The generator uses the official 1404 hierarchy as membership, then province-aware OpenStreetMap points, the ODbL countries/states/cities dataset, a validated MIT fallback, conservative promoted-settlement and spelling matches, and finally record-level curated references. Derived urban zones are kept in the raw hierarchy but are not rendered as independent labels.

Google Maps is **not** used as a bulk data source. See `DATA_SOURCES.md` for provenance and license terms.
