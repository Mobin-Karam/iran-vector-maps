# Iran Map Studio Audit and Integration Plan

## 1) Objective

This document audits the external repository `Mobin-Karam/iran-map-studio-forked` and maps its strongest features into the current project, which already contains a reusable map renderer, route-based Iran explorer, and verified geographic data flow.

The goal is to create a complete, production-grade geographic data product that combines:

- the current reusable map package and data layer,
- the editor-style workflows from the forked studio,
- the modern app/route patterns already used in this codebase,
- a clear deployment strategy for GitHub/Vercel/Cloudflare Pages.

---

## 2) Audit of the external project: Iran Map Studio

### Summary

The external project is a browser-first, client-side Iran choropleth map editor. It is focused on quickly turning administrative data into exportable map visuals without server-side dependency.

### Core strengths

1. Data editing workflow
   - manual value entry,
   - file upload for CSV/JSON/Excel-like data,
   - region matching and suggestions,
   - per-region direct edits.

2. Styling and customization
   - palette selection,
   - custom palette configuration,
   - label visibility toggles,
   - title and subtitle controls,
   - font uploads and font selection,
   - legend positioning and scale controls.

3. Output workflow
   - PNG export with transparency,
   - JPG export,
   - configurable quality levels,
   - export-ready preview.

4. Map UX
   - province/county drill-down,
   - value editing by clicking on a region,
   - tooltip behavior,
   - bilingual Persian/English UI with RTL/LTR support.

5. Client-side approach
   - no backend required,
   - useful for notebooks, quick reporting, and shareable generated maps,
   - deployable as static site on Vercel/Cloudflare/GitHub Pages.

### Main feature inventory from the app

- Province and county view switching
- Region value assignment by manual entry
- CSV and JSON import
- Matching logic for regional names
- Editable values while hovering or clicking
- Palette presets and custom palettes
- Legend controls and no-data color selection
- Scale classification modes (linear, quantile, log)
- Title/subtitle/font configuration
- Font upload support for TTF/OTF/WOFF/WOFF2
- Export to transparent PNG and JPG
- Browser-only processing without sending data to a server

### Why this matters for the current project

This repo does not yet have a polished export/editor workflow. The Studio repo fills the gap by adding productize-ready user controls and formatting tools.

---

## 3) Audit of the current project

### Current project strengths

The current repo already has:

- a reusable map renderer package,
- a verified data/geometry layer,
- multi-route project/demo app,
- real geographic assets and admin hierarchy,
- a strong package publishing story,
- integration examples for Vite, Next.js, and Remix.

### Relevant project areas

- Core package: `packages/iran-vector-maps`
- Data companion: `packages/iran-vector-maps-data`
- App shell and routes: `src/app/router.tsx`
- Data loading: `src/features/iran-map/data/loaders.ts`
- Interactive app map: `src/features/iran-map/components/IranMap.tsx`
- Data entry modal: `src/features/iran-map/components/DataWorkspace.tsx`
- Package showcase: `src/pages/PackagePage.tsx`

### Current strengths relative to the Studio repo

The current project already wins on:

- real data trust and validation,
- modular package architecture,
- route-based map exploration,
- maintainable data loading and metadata handling,
- package integration for external apps.

### Main gap

The current project lacks a polished “studio” UX layer: quick data import, editing, dynamic palette controls, export workflow, and a visually guided editing flow.

---

## 4) Feature mapping: Studio repo → current project

| Studio feature | Current project fit | Recommended action |
|---|---|---|
| Manual map value entry | Strong fit | Reuse the data-entry and metric model already in `DataWorkspace.tsx` |
| CSV / JSON import | Strong fit | Add a richer import workflow with validation and unknown-ID reporting |
| Province/county drill-down | Strong fit | Reuse current route logic in `IranMap.tsx` |
| Custom palette selection | Strong fit | Add palette controls to the app shell |
| Label visibility controls | Strong fit | Add per-view toggle UI |
| Font upload | Strong fit | Add optional custom font styling via CSS and app config |
| PNG/JPG export | Strong fit | Connect with existing SVG export helpers and browser export tooling |
| Tooltip and direct edit on click | Strong fit | Use existing interactive map callbacks |
| Bilingual interface | Strong fit | Keep current Persian English patterns |
| Static deployment | Strong fit | Support Vercel/Cloudflare/GitHub Pages with clean routes |

---

## 5) Recommended integration architecture

### Phase 1 — keep the reusable package as the foundation

Do not replace the package. Instead:

- keep `iran-vector-maps` as the renderer,
- keep `iran-vector-maps-data` as the verified asset source,
- build the Studio UX on top of this API.

This gives the project both stability and product polish.

### Phase 2 — add a Studio layer

Create a new app feature area, for example:

- `src/features/iran-map/studio/`
- `src/features/iran-map/studio/controls/`
- `src/features/iran-map/studio/export/`
- `src/features/iran-map/studio/import/`

This is cleaner than mixing Studio features directly into the route component.

### Phase 3 — unify data models

Use the existing metric model and add:

- active metric label,
- source metadata,
- unit,
- import mode (merge/replace),
- match result summary,
- per-region values.

### Phase 4 — unify export and styling

Use the current map package plus Studio export logic:

- `serializeMapSvg`, `downloadMapSvg` when available,
- canvas conversion with `canvg`,
- quality presets,
- transparent PNG and JPG output,
- CSS customizations for title, subtitle, region labels, and legends.

### Phase 5 — create a product-ready public app

The ideal final state is:

- a public product demo site,
- a map editor workflow for non-technical users,
- a route-based admin map exploration view,
- a package README and install path for developers.

---

## 6) Best practical feature set to adopt first

The highest-value features from the Studio repo to prioritize are:

1. CSV/JSON import workflow
2. Direct region editing by click
3. Palette + custom palette controls
4. Export to PNG/JPG
5. Bilingual UI refinements
6. Font customization and title styling
7. Matching report for unresolved names

These features solve real product pain points and add value immediately.

---

## 7) Recommended implementation sequence

### Step 1: stabilize current map route and data contracts

- keep the verified admin hierarchy,
- preserve region IDs,
- continue using JSON validation,
- keep the same route patterns for provinces and counties.

### Step 2: integrate the Studio editor layer

- create a Studio workspace panel,
- import data files,
- show summary and mismatches,
- allow direct editing of values,
- allow selected region details view.

### Step 3: add design controls

- palette presets,
- legend toggle,
- label visibility,
- title/subtitle,
- font options.

### Step 4: add export layer

- export the current SVG,
- convert to PNG/JPG,
- keep transparent background support,
- allow quality selection.

### Step 5: harden for static hosting

- verify that route fallback works,
- ensure no backend is required,
- confirm Vercel/Cloudflare/GitHub Pages compatibility.

---

## 8) Risk and quality considerations

### Data quality rules

- never trust a display name as the primary identifier,
- always validate region IDs before importing,
- keep unknown region detection visible to the user,
- require user review before replacing data.

### UX rules

- prefer direct visual editing over complex forms,
- keep Persian/English translation in sync,
- maintain keyboard accessibility,
- support mobile and desktop layouts.

### Deployment rules

- prefer static hosting for generated visuals,
- keep import/export browser-side,
- use code-splitting if the application grows.

---

## 9) Deployment and branch flow

### Local branch flow

1. Create a dedicated feature branch for the integration work.
2. Implement docs, feature layer, and code changes there.
3. Run the build and relevant validation checks.
4. Merge to `main` only after verification.
5. Push the branch to GitHub if credentials are available.
6. Deploy through Vercel or another static host.

### Deployment targets

This repo is already well-suited for:

- Vercel (best for a React app)
- Cloudflare Pages (best for static hosting)
- GitHub Pages (works for demo and docs builds)

For a map-editor product that does not require a server, static hosting is the most practical route.

---

## 10) Recommended final platform direction

The strongest final product is not only a renderer or a studio. It should be a combined platform:

- map package for developers,
- map editor for business users,
- data import and validation workflow,
- export-ready visual output,
- route-based exploration for region analysis,
- bilingual and static deployment-friendly experience.

This represents the best long-term direction for the current project.

---

## 11) Conclusion

The external project is a valuable feature source for user-facing editing and export workflows, while the current repo is the stronger technical foundation for verified geography and reusable package architecture.

The best integration is to keep the current map system as the engine and add the Studio repo’s UX, import, styling, and export features as a top-layer product experience.

This will create a more complete, more usable, and more deployable map platform without sacrificing stability or maintainability.
