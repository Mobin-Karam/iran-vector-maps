# Iran Map Studio UI/UX Integration Plan

## Objective

Use the map-editor experience from the studio reference repo as a design target while keeping this project’s existing global app shell and product identity intact.

This repo already has a stronger technical foundation for:
- reusable map packages
- structured data loading
- province/county geometry handling
- browser-side export and styling

The design goal is to layer the studio workflow on top of this engine without replacing the current project structure.

---

## Design direction

### 1. Keep the project global header

The current app shell in [src/components/SiteChrome.tsx](../src/components/SiteChrome.tsx) and [src/components/site-chrome.css](../src/components/site-chrome.css) should remain the project-wide chrome.

That means:
- brand and navigation remain at the top
- map page sits inside the same dashboard shell
- only the inner workspace area adopts the studio composition

### 2. Reuse the studio workflow pattern

The studio repo’s screen is organized as a workflow:
- data input
- styling
- export

The map page should follow that mental model while using the current project’s map engine.

Recommended layout:
- top project header remains
- large map canvas in the center
- left-side or right-side control panel for workflow steps
- compact preview and export controls beneath the map

### 3. Match the studio interactions

The following interactions from the target repo should be prioritized:
- manual metric entry
- Excel/CSV/JSON import
- region matching and review
- palette selection
- custom palette editing
- label visibility toggles
- export PNG/JPG with quality presets
- compact panel-based editor

---

## UI/UX structure to implement

### Workspace shell

- global header from the project
- map editor canvas with clean card border and soft panel styling
- side workflow panel with a structured visual rhythm

### Workflow steps

1. Data
   - manual region/value entry
   - file upload
   - summary and validation

2. Style
   - palette list
   - custom colour controls
   - legend toggle and label settings

3. Export
   - PNG/JPG actions
   - dimension presets
   - ready-to-export summary

### Visual language

- light neutral background
- soft green / blue accent system
- rounded cards and small control chips
- clean keyboard-accessible controls
- desktop-first map editing experience

---

## Implementation priorities in this repo

### Phase 1: layout and workspace composition
- keep global header
- refine map canvas proportions
- introduce studio-like editing panels

### Phase 2: data workflow
- keep CSV/Excel/JSON import logic
- expose matching and validation more cleanly
- show import status and summary in the side panel

### Phase 3: styling and export
- keep palette presets and label controls
- add export quality choices and PNG/JPG actions
- align visual spacing with the studio screen

### Phase 4: polish and consistency
- improve Russian/English language parity if needed
- adjust panel spacing and typography
- validate across breakpoints

---

## Recommended repository mapping

- current app shell: [src/components/SiteChrome.tsx](../src/components/SiteChrome.tsx)
- map editor screen: [src/features/iran-map/components/IranMap.tsx](../src/features/iran-map/components/IranMap.tsx)
- data workflow: [src/features/iran-map/components/DataWorkspace.tsx](../src/features/iran-map/components/DataWorkspace.tsx)
- export and styling: [src/features/iran-map/components/MapStyleExport.tsx](../src/features/iran-map/components/MapStyleExport.tsx)
- appearance model: [src/features/iran-map/model/customization.ts](../src/features/iran-map/model/customization.ts)

---

## Expected result

The final page should feel like a productized version of the studio repo, but still belong to this project:
- same project branding and navigation
- same map engine and data model
- studio workflow for map creation and export
- browser-first experience for data storytelling and map export
