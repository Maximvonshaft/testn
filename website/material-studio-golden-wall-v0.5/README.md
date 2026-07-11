# Material Studio Golden Wall Composer v0.5

This iteration replaces the failed broad runtime-mask compositor with one deterministic, scene-aligned wall system.

## What is different

The browser no longer tries to invent or scale a wall mask at runtime. Every material/profile state is generated offline as a transparent overlay with the **exact same 1672×941 coordinate system** as the source scene.

Runtime stack:

```text
immutable hotel-suite scene
+ scene-aligned transparent wall overlay
+ wall-only finish treatment
+ interface
```

Changing a material therefore cannot change the bed, floor, ceiling, cabinet or lighting outside the approved wall plane. The regression test enforces that invariant.

## Run

### Windows

Double-click:

```text
START_WINDOWS.bat
```

### macOS / Linux

```bash
chmod +x START_MAC_LINUX.sh
./START_MAC_LINUX.sh
```

Then open:

```text
http://127.0.0.1:8080
```

Do not open `index.html` directly because the catalog and lead API require an HTTP server.

## Demo interactions

- Six wall materials
- Four profiles: Flat, Slat, Fluted and Wide Rib
- Matte, Satin and Soft Gloss finishes
- 2400 / 2800 / 3000 mm specification selection
- Original/configured wall comparison
- Cross-faded material replacement
- Scheme save, code copy and JSON specification download
- Local sample/quote request persistence

Lead submissions are appended to:

```text
data/leads.jsonl
```

## Superpowers workflow evidence

The iteration follows the `obra/superpowers` workflow:

- root-cause analysis before fixes
- narrow design specification
- implementation plan
- failing regression tests first
- minimal deterministic architecture
- fresh verification before completion

Documents:

```text
docs/superpowers/specs/2026-07-11-golden-wall-design.md
docs/superpowers/plans/2026-07-11-golden-wall-implementation.md
```

## Verification

Run:

```bash
python tools/build_assets.py
python -m unittest tests/test_asset_pipeline.py tests/test_server.py -v
node --test tests/state.test.mjs
node --check assets/state.mjs
node --check assets/app.mjs
python tools/validate_demo.py
```

## Important boundary

This is a validated golden-path demo for one feature wall. Floor, ceiling, trim and door-wall replacement are intentionally excluded until this wall pipeline is approved.

Material and profile identifiers are demonstration codes pending factory confirmation.

## GitHub binary boundary

The GitHub connector records the source code, tests, specification and implementation plan. The generated WebP overlays, PNG masks, material thumbnails and source images are delivered separately in `material_studio_demo_v0_5_superpowers.zip` and require direct Git, Git LFS, a release asset or object storage before this directory is independently runnable from the repository.
