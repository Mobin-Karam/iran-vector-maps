# Changelog

This changelog follows the package version in `package.json`. Unreleased changes belong under a future version heading and are not advertised as published until `npm publish` succeeds.

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
