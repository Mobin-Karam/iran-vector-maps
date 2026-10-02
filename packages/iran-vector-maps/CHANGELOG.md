# Changelog

This changelog follows the package version in `package.json`. Unreleased changes belong under a future version heading and are not advertised as published until `npm publish` succeeds.

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
