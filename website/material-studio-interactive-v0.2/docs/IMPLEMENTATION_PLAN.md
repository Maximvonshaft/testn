# Material Studio v0.2 Implementation Plan

## Product decision

The homepage is a visitor-facing material composer, not a 3D editor and not an e-commerce product grid.

The homepage exposes only decisions that materially change the customer's space:

1. choose scene
2. choose surface
3. choose pattern
4. choose profile
5. choose tone and finish
6. choose optional aroma
7. choose dimension
8. save, request sample, download specification, or ask for quote

Developer-facing controls such as Add Layer, hide/show layer, reorder layer and real-time-render switches are explicitly excluded.

## First-screen composition

- fixed brand/navigation header
- hotel-suite scene as the visual canvas
- left-side brand statement and current scheme summary
- top experience-mode control
- right-side surface selector
- central surface regions that appear only on hover/selection
- bottom parameter instrument
- conversion bar

## Technical implementation

The current prototype uses 2.5D image composition:

- base scene image
- catalog-derived textures
- CSS clipped surface overlays
- SVG profile icons
- SVG aroma layers
- CSS install/layer sequences
- JavaScript configuration state
- localStorage scheme persistence
- client-side specification export
- optional Web Audio ambient tone

## Upgrade path

### v0.2
Static interactive frontend and asset pipeline.

### v0.3
Replace approximate masks with production masks and final hero photography/render.

### v0.4
Add multiple true scene bases: hotel suite, bathroom, residential, retail and outdoor.

### v0.5
Connect sample/quote forms to SourcePilot Cloud.

### v1.0
CMS-driven product matrix, multilingual pages, accessibility QA, performance budgets and production deployment.
