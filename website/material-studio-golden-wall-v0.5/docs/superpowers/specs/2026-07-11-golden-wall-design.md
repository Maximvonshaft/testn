# Material Studio Golden Wall Composer — Design Specification

## Problem

The v0.4 demo does not perform a credible material replacement. Its wall mask includes furniture, ceiling and floor; the scene and mask use different transforms; the material has no reliable planar perspective; and the runtime compositor attempts too many surfaces before one surface is correct.

## Goal

Build one production-shaped interaction that is visibly correct: selecting a wall material replaces only the dedicated feature wall, preserves the rest of the room pixel-for-pixel, maintains natural lighting and perspective, and transitions without visible drift on desktop or mobile.

## Scope

### Included

- One high-end hotel-suite scene generated for the project.
- One isolated editable feature-wall plane on the right side of the scene.
- Six materials: Smoked Walnut, Soft Oak, Warm Grey Stone, White Marble, Gold Vein Marble and Ivory Panel.
- Four wall profiles: Flat, Slat, Fluted and Wide Rib.
- Three finish treatments applied only to the wall overlay: Matte, Satin and Soft Gloss.
- Three specification heights: 2400, 2800 and 3000 mm; height changes configuration data only and is not represented as room-scale geometry.
- Before/after comparison.
- Cross-fade material transitions.
- Scheme code, save scheme, download specification and lead dialog.
- Responsive layout without cropping or independent scene transforms.

### Excluded

- Floor, ceiling, trim and door-wall replacement.
- Free camera movement.
- Runtime segmentation.
- Runtime perspective solving.
- Full 3D or Three.js.
- Claims about certified performance or aroma duration.

These exclusions are deliberate. The single-wall golden path must pass before the same pipeline is extended to additional planes.

## Approaches considered

### A. Repair the existing runtime mask compositor

Keep canvas compositing, manually improve every mask and continue runtime warping.

**Rejected:** It preserves the architecture that already failed. It has too many coordinate systems and makes every browser size a new alignment risk.

### B. Pre-render transparent, scene-aligned wall overlays

Generate every material/profile wall state offline against one fixed scene coordinate system. The browser stacks the selected overlay over the immutable base scene and cross-fades between overlays.

**Selected:** It is deterministic, easy to test, simple to understand and eliminates runtime mask drift. It follows YAGNI and complexity reduction.

### C. Rebuild the room as full 3D

Create a true geometry scene and map PBR materials.

**Rejected for this iteration:** Correct but disproportionate. It introduces modelling, lighting, performance and interaction work before validating the commercial experience.

## Architecture

### Asset build pipeline

`tools/build_assets.py` owns all geometry and image processing:

1. Load the clean scene master.
2. Define the feature-wall quadrilateral in source pixels.
3. Crop six material sources from the generated material board.
4. Convert each crop into an edge-safe repeated tile.
5. Rectify the original wall and derive a low-frequency luminance map.
6. Render each material/profile combination into the rectified wall plane.
7. Apply the luminance map and panel profile shading.
8. Warp the result into the scene quadrilateral.
9. Export an alpha WebP overlay aligned to the scene master.
10. Export thumbnails, mask audit and contact sheets.

### Runtime

The browser never computes a mask or perspective transform.

- `scene/base.webp` is immutable.
- Two `<img>` overlay layers occupy the exact same box and aspect ratio as the base scene.
- Material/profile changes load the next pre-rendered overlay into the inactive layer and cross-fade.
- Finish is a CSS filter applied only to the active overlay.
- The stage always uses the original scene aspect ratio; mobile changes the UI layout, not the image coordinate system.

### Pure state module

`assets/state.mjs` contains deterministic, testable functions:

- `variantPath(materialId, profileId)`
- `buildConfigurationCode(state)`
- `normalizeState(state, catalog)`

`assets/app.mjs` owns DOM binding and transitions only.

## Data contract

`data/catalog.json` defines materials, profiles, finishes, dimensions and generated overlay paths. Product codes are explicitly marked as demonstration codes until replaced by factory-authoritative identifiers.

## Error handling

- Initial loading state blocks interactions until the base scene, catalog and initial overlay are decoded.
- A failed overlay load keeps the current overlay visible and reports a non-destructive error banner.
- Fatal base-scene or catalog failures show a retry state.
- Local storage is parsed defensively and discarded if incompatible.

## Testing

### Asset invariants

- Overlay alpha is zero outside the wall polygon.
- Overlay alpha covers the expected wall interior.
- Compositing an overlay cannot alter pixels outside the wall mask.
- All 24 material/profile variants exist and have the same dimensions as the scene.

### State tests

- Variant paths are stable.
- Configuration codes use material/profile/finish/dimension identifiers.
- Invalid saved state normalizes to supported defaults.

### Manual acceptance

1. Open the demo at desktop and mobile widths.
2. Select every material.
3. Confirm only the right feature wall changes.
4. Confirm bed, floor, ceiling, cabinet and lighting stay fixed.
5. Switch every profile and inspect the profile relief.
6. Toggle Before to expose the original marble wall.
7. Resize the browser and confirm no wall drift.

## Success criteria

The iteration passes only when automated tests prove that outside-wall pixels are untouched and the user can visually see a natural wall-only replacement.
