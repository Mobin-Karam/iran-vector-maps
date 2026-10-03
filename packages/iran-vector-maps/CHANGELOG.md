# Changelog

This changelog follows the package version in `package.json`. Unreleased changes belong under a future version heading and are not advertised as published until `npm publish` succeeds.

## 0.6.0 — 2026-10-03

- Added readable, canonical province and county routes to the demo while preserving stable IDs and codes for imported metrics.
- Added a public region catalog contract with `slug`, `code`, Persian name, and English name fields.
- Reworked the map route into the focused Studio workbench interface, retaining data import, drill-down, customization, and export workflows.

## 0.5.4 — 2026-10-03

- Made exported SVG files self-contained by writing explicit, portable region fill and border attributes.
- Ensured PNG and JPG exports start from a cleared canvas, with an intentional white JPG background.
- Added browser coverage for exported map paint data and documented trusted GitHub Actions publishing.
- Corrected the trusted-publishing workflow so each package publishes from its own directory.

## 0.5.2 — 2026-10-02

- Preserved active imported metrics across asynchronous map-layer mounting, including slow browser and CI starts.

## 0.5.1 — 2026-10-02

- Made imported metrics publish synchronously to the active SVG layer, fixing parallel browser test and slow-render timing.

## 0.5.0 — 2026-10-02

- Added the responsive global site header and dedicated map workbench toolbar.
- Added exact copyable province and county data-loading snippets in the map details panel.
- Scoped custom color and SVG/PNG export to the active Iran, province, or county map.
- Improved the local JSON/CSV workspace with merge/replace importing, localized number input, upsert behavior, active metrics, validation feedback, and accessible modal lifecycle.

## 0.3.2 — 2026-10-02

- Added immutable value adapters for React Query, SWR, and loader results.

## 0.3.1 — 2026-10-02

- Added quantile classification and map marker/annotation points.
- Extended browser coverage to JSON import and SVG export.
- Added real-world data contracts and use-case guidance.

## 0.3.0 — 2026-10-02

- Added threshold and equal-interval choropleth classification through `createMapColorScale`.
- Added palette, explicit breaks, and minimum/maximum controls to `MapColorScale`.
- Added `labelMinArea` so hosts can avoid illegible labels on small regions.
- Added package examples, reliability documentation, and a separate Iran-data companion package.

## 0.2.0 — 2026-10-01

- Added CSV metric parsing with Persian and Arabic digit support.
- Added reusable tooltip and legend components.
- Added GeoJSON validation and unknown-region detection helpers.

## 0.1.0 — 2026-10-01

- First public release of the native SVG React map renderer.
- Added controlled selection, keyboard access, color scales, and SVG export.
# 0.4.1 — 2026-10-02

- Corrected browser verification to target the interactive city-point control itself.

# 0.4.0 — 2026-10-02

- Published companion-data province helpers for on-demand county and city-point assets.
- Improved demo navigation, page metadata, and regional reference-map workflow.
