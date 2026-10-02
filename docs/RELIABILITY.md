# Reliability and coverage

## Current coverage

| Level | Geometry | Coverage | Validation |
| --- | --- | --- | --- |
| Provinces | Polygon/MultiPolygon | 31 of 31 | Stable IDs, geometry, and parent `IR` checked in CI |
| Counties | Polygon/MultiPolygon | 466 current features | Stable IDs, geometry, correct province parent, and duplicate checks in CI |
| Cities | Reference points only | 1,481 names; 1,154 placed points across 31 provinces and 484 counties | Stable city and parent IDs, per-record coordinate status, and duplicate checks in CI |
| Districts, rural districts, settlements | Not shipped | No geometry claim | Metadata must not be displayed as a boundary |

`public/maps/iran/manifest.json` is the live machine-readable record of the dataset version and geometry coverage. The demo must show it alongside imported data provenance.

## Acceptance rules

1. A boundary update requires an upstream source, license, retrieval date, and scope recorded in `DATA_SOURCES.md`.
2. Every map feature must have a unique stable ID, a Persian display name, valid Polygon/MultiPolygon coordinates, and the expected parent relationship.
3. A discrepancy is fixed only after it is reproducible and backed by a verifiable source; visual similarity alone is insufficient.
4. A city point must be labelled as a point, retain its coordinate status and provenance, and must never be presented as a city boundary.
5. A missing lower-level geometry is reported as unavailable, never approximated.

Use the **Boundary or data report** issue template for corrections.
