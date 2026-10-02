# Reusable package features

The npm package is `iran-vector-maps`. It is designed for React applications and AI-assisted projects that need trusted, local SVG rendering.

## Implemented

- Native SVG Polygon and MultiPolygon rendering from GeoJSON-compatible data.
- Stable ID-driven data overlay, controlled selection, click and hover callbacks.
- Keyboard support, focus states, ARIA labels, RTL/Persian-friendly defaults, light/dark styles.
- Configurable color scale, custom fill logic, metric labels, legend, tooltip, and empty-data state.
- Data-contract validation for duplicate IDs, required names, geometry kind, and invalid coordinates.
- SVG serialization/download utility for reports and product exports.
- CSV metrics adapter with quoted-cell parsing, localized digit support, duplicate-row reporting, and unknown-region checks.
- Explicitly no tracking, GPS, remote tiles, iframe, canvas, or router dependency.
- Immutable record adapters for React Query, SWR, loaders, and other host-owned data caches without taking a query-library dependency.

## Deliberately host-owned

- Route changes and loading lower-level layers.
- Authentication, authorization, auditing, and data persistence.
- Data provenance, units, date ranges, missing-value policy, and accessibility language.
- PNG/PDF conversion: keep it on the host or server where its dependencies are controlled.

## Optional next features

| Priority | Feature | Why it matters | Status |
| --- | --- | --- | --- |
| High | Server-side PNG/PDF export adapter | Produces reports without relying on the visitor browser | Planned; host-specific runtime required |
| High | Automated visual regression tests | Detects broken geometry, labels, and colors before release | Planned |
| Medium | Next.js and Remix examples | Reduces integration work in the most common React frameworks | Planned |
| Medium | More verified boundary layers | Adds districts and cities only when their geometry is sourced and validated | Data-pipeline work |

## Compatibility

The package supports React 18 and newer and is distributed as ESM with TypeScript declarations. It expects a browser DOM for SVG rendering. Keep map data and business data in the host application; the package does not upload, store, or inspect either.

## Application integration

The demo application now installs the package locally through `file:packages/iran-vector-maps` and runs `validateMapFeatureCollection` every time a province or county layer is loaded. This is a deliberate dogfooding check: invalid downloaded topology shows a clear loading error instead of rendering misleading boundaries.
