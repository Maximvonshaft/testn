# Golden Wall Composer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deterministic wall-only material composer whose overlay cannot affect any pixel outside the approved feature-wall plane.

**Architecture:** Generate scene-aligned alpha overlays offline for each material/profile variant. At runtime, stack the immutable scene and two same-size overlay images and cross-fade. Keep state generation separate from DOM code.

**Tech Stack:** Python 3, Pillow, OpenCV, NumPy, vanilla HTML/CSS, ES modules, Node test runner, Python unittest.

## Global Constraints

- No runtime segmentation or mask generation.
- No full 3D engine.
- The scene and every overlay must have identical pixel dimensions.
- The stage must preserve the scene aspect ratio at every viewport size.
- Demo product codes must be labelled as demonstration codes.
- No completion claim without fresh test output.

---

### Task 1: Define asset invariants with failing tests

**Files:**
- Create: `tests/test_asset_pipeline.py`

**Interfaces:**
- Consumes: generated files under `assets/scene` and `assets/wall/overlays`.
- Produces: regression checks for wall alpha boundaries and outside-scene preservation.

- [ ] Write tests that require the base scene, mask, catalog and 24 overlays.
- [ ] Run `python -m unittest tests/test_asset_pipeline.py -v` and confirm failure because assets do not exist.
- [ ] Commit the test definition.

### Task 2: Implement deterministic asset builder

**Files:**
- Create: `tools/build_assets.py`
- Create: `data/catalog.json`
- Generate: `assets/scene/base.webp`
- Generate: `assets/wall/mask.png`
- Generate: `assets/wall/lightmap.webp`
- Generate: `assets/wall/overlays/*.webp`
- Generate: `assets/wall/thumbs/*.webp`
- Generate: `docs/wall-mask-audit.png`
- Generate: `docs/wall-variants-contact-sheet.jpg`

**Interfaces:**
- Produces scene-aligned overlays named `<material>-<profile>.webp`.

- [ ] Implement source-material cropping and mirrored edge-safe tiles.
- [ ] Implement wall rectification and low-frequency lightmap.
- [ ] Implement Flat, Slat, Fluted and Wide Rib profile shading.
- [ ] Warp each rectified result to the approved wall quadrilateral.
- [ ] Export alpha overlays and catalog metadata.
- [ ] Run the builder.
- [ ] Run the asset tests and confirm all pass.

### Task 3: Define state behavior with failing Node tests

**Files:**
- Create: `tests/state.test.mjs`
- Create: `assets/state.mjs`

**Interfaces:**
- Produces: `variantPath`, `buildConfigurationCode`, `normalizeState`.

- [ ] Write tests before implementation.
- [ ] Run `node --test tests/state.test.mjs` and confirm expected failure.
- [ ] Implement the minimal state functions.
- [ ] Re-run tests and confirm pass.

### Task 4: Build the focused runtime

**Files:**
- Create: `index.html`
- Create: `assets/styles.css`
- Create: `assets/app.mjs`

**Interfaces:**
- Consumes: `catalog.json`, `state.mjs`, base scene and generated overlays.

- [ ] Add loading and error states.
- [ ] Add fixed-aspect scene stack with base and double-buffered overlays.
- [ ] Add material and profile selectors.
- [ ] Add finish, dimension, before/after and configuration actions.
- [ ] Implement decode-before-crossfade so failed loads never blank the wall.
- [ ] Add mobile UI layout without changing scene geometry.

### Task 5: Add local server and integration checks

**Files:**
- Create: `server.py`
- Create: `START_WINDOWS.bat`
- Create: `START_MAC_LINUX.sh`
- Create: `tools/validate_demo.py`

- [ ] Serve static files and accept `/api/leads` submissions into `data/leads.jsonl`.
- [ ] Validate all catalog paths and exact dimensions.
- [ ] Validate JavaScript syntax.
- [ ] Start the server and fetch the page, catalog, scene and representative overlays.

### Task 6: Verification and packaging

- [ ] Run `python -m unittest tests/test_asset_pipeline.py -v`.
- [ ] Run `node --test tests/state.test.mjs`.
- [ ] Run `node --check assets/app.mjs assets/state.mjs`.
- [ ] Run `python tools/validate_demo.py`.
- [ ] Start the server and run HTTP smoke checks.
- [ ] Re-read the design success criteria and document any remaining gaps.
- [ ] Package `material_studio_demo_v0_5_superpowers.zip`.
